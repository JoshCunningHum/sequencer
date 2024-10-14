import { set } from "@vueuse/core";
import { acceptHMRUpdate, defineStore } from "pinia";
import { generate_sequence } from "~/constants/prompt";
import { PlantUMLConverter } from "~/logic/sequence/converter.plant";
import { PlantUMLParser } from "~/logic/sequence/parser.plant";
import {
  validateSequence,
  ValidationErrorType,
} from "~/logic/sequence/validator.plant";
import { ClassDiagramData } from "~/models/ClassDiagramData";
import { SequenceDiagramData } from "~/models/SequenceDiagramData";
import { UseCaseDiagramData } from "~/models/UseCaseDiagramData";
import type { Project } from "~/server/database/project";

export enum GenerationStatus {
  Idle,
  GeneratingPrompt,
  PendingResult,
  ValidatingResult,
  Success,
}

export interface GeneratedResult {
  id: string;
  xml: string;
  warnings: Warning[];
  errors: Error[];
  prompt: string;
}

export interface Warning {
  title: string;
  description: string;
  page: string;
  code: string;
}

export interface Error {
  title: string;
  description: string;
}

export const useGenerationStore = defineStore("generation", () => {
  const drawio = useDrawioStore();

  //#region Config
  const strictMode = ref(true);
  const generationLimit = ref(100);

  const projectStore = useProjectsStore();
  const { project, update: updateCurrent } = useProject();

  const prompts = ref({
    class: "",
    usecase: "",
    sequence: "",
    llm: "",
  });

  // Initialize on setup
  const init = (p: Project) => {
    const strict = strictMode.value;
    const result: typeof prompts.value = {
      class: "",
      llm: "",
      sequence: "",
      usecase: "",
    };

    const [errclass] = safeTry(() => {
      const cd = new ClassDiagramData(p.class);
      cd.toJSON();
      cd.process();
      result.class = cd.toPrompt();
    });

    const [errusecase] = safeTry(() => {
      const ud = new UseCaseDiagramData(p.usecase);
      ud.toJSON();
      ud.process();
      result.usecase = ud.toPrompt();
    });

    if (errclass) console.error(`Error loading class`, errclass);
    if (errusecase) console.error(`Error loading usecase`, errusecase);

    const llm = generate_sequence(result.class, result.usecase, { strict });
    result.llm = llm;
    result.sequence = llm;

    set(prompts, result);
  };

  onMounted(() => project.value && init(project.value));

  //#region Updating
  const update = async () => {
    if (!project.value) return;
    return await updateCurrent(project.value);
  };

  //#region Generation

  const is_generating = ref(false);
  const status = ref<GenerationStatus>(GenerationStatus.Idle);
  const results = ref<GeneratedResult[]>([]);
  const forced_stop = ref(false);
  const has_applied = ref(false);

  const add_result = ({
    xml,
    errors,
    warnings,
    prompt,
    id,
  }: {
    id: string;
    xml: string;
    errors?: Error[];
    warnings?: Warning[];
    prompt?: string;
  }) => {
    const result: GeneratedResult = {
      id: uuid(20),
      xml,
      errors: errors || [],
      warnings: warnings || [],
      prompt: prompt || xml,
    };
    // Only add result when on the same generation session
    if (generation_id.value === id) results.value.push(result);
  };

  const generation_id = ref("");
  const generate = async () => {
    const id = uuid(20);
    generation_id.value = id;

    results.value.splice(0);
    set(is_generating, true);
    set(forced_stop, false);
    set(viewing, undefined);

    // TODO: Add a check for class and usecase validity
    const prompt = prompts.value.llm;

    let validation_dummy_counter = generationLimit.value || 5;
    let valid = false;

    do {
      if (forced_stop.value || generation_id.value !== id) return;

      validation_dummy_counter--;
      valid = validation_dummy_counter <= 0;

      set(status, GenerationStatus.GeneratingPrompt);
      const model = await useGenAi("gemini-1.5-flash-002");

      set(status, GenerationStatus.PendingResult);
      const [err, result] = await safeAwait(model.generateContent(prompt));
      if (err) {
        add_result({
          id,
          xml: prompt,
          errors: [
            {
              title: err.message,
              description: err.message,
            },
          ],
        });
        set(status, GenerationStatus.GeneratingPrompt);
        continue;
      }

      const txt = result.response.text();

      set(status, GenerationStatus.ValidatingResult);
      const [parse_err, parse_data] = safeTry(() => PlantUMLParser.Parse(txt));
      if (parse_err) {
        add_result({
          id,
          xml: txt,
          errors: [
            {
              title: "Parsing Error",
              description: parse_err.message,
            },
          ],
        });
        set(status, GenerationStatus.GeneratingPrompt);
        continue;
      }

      const [convert_err, convert_data] = safeTry(() =>
        PlantUMLConverter.Convert({ data: parse_data }),
      );
      if (convert_err) {
        add_result({
          id,
          xml: txt,
          errors: [
            {
              title: "Conversion Error",
              description: convert_err.message,
            },
          ],
        });
        set(status, GenerationStatus.GeneratingPrompt);
        continue;
      }

      const warnings: GeneratedResult["warnings"] = [];

      // validate
      if (strictMode.value) {
        const cd = new ClassDiagramData(project.value!.class);
        safeTry(() => {
          cd.toJSON();
          cd.process();
        });

        const conflicts = validateSequence(parse_data, cd.pages, txt);
        conflicts.forEach((c) => {
          warnings.push({
            title: ValidationErrorType[c.type],
            description: c.description,
            page: c.page,
            code: c.code_reference,
          });
        });
      }

      // Success
      add_result({ xml: convert_data, prompt: txt, warnings, id });

      if (!strictMode.value || warnings.length === 0) break;
    } while (!valid);

    set(status, GenerationStatus.Success);
  };

  // View the selected generated result (only accessible when strict mode is true)
  const viewing = ref<GeneratedResult>();
  const view = (result: GeneratedResult) => {
    set(viewing, result);
  };
  watchImmediate(viewing, (value) => (drawio.xml = value?.xml));

  // Choose the selected generated result and delete all records of generated results
  const is_applying = ref(false);
  const choose = (result: GeneratedResult) => {
    set(has_applied, true);
    if (!project.value) return;
    set(is_applying, true);
    projectStore
      .update({ ...project.value, sequence: result.xml })
      .then(stop)
      .then(() => {
        set(is_applying, false);
        set(results, []);
      });
  };

  const { ask } = useQuery();

  const stop = async () => {
    if (
      !has_applied.value &&
      results.value.some((r) => !r.errors.length && !r.warnings.length)
    ) {
      // Trying to close the generation without applying any sucessful results
      const confirmation = !!(await confirm_close());
      if (!confirmation) return;
    }

    // stop generation
    set(forced_stop, true);
    set(is_generating, false);
    set(viewing, undefined);
    results.value.splice(0);
  };

  const confirm_close = async () => {
    return await ask({
      title: "Are you sure you want to continue?",
      description:
        "There are successful results but you haven't applied anything yet",
      approveText: "Confirm",
    });
  };

  whenever(
    project,
    (p) => {
      stop();
      init(p);
    },
    { immediate: true, deep: true },
  );

  return {
    strictMode,
    generationLimit,
    project,
    prompts,
    update,

    is_generating,
    is_applying,
    viewing,
    status,
    results,
    generate,
    view,
    choose,
    stop,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGenerationStore, import.meta.hot));
}
