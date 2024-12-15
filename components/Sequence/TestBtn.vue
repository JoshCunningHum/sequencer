<script setup lang="ts">
import { test4 as mockLlm } from "~/constants/mock.llm";
import { PlantUMLConverter } from "~/logic/sequence/converter.plant";
import { tokenize } from "~/logic/sequence/lexer.plant";
import { PlantUMLParser } from "~/logic/sequence/parser.plant";

// drawio view
const drawioStore = useDrawioStore();
const { xml } = storeToRefs(drawioStore);

const showLogs = ref(false);

const testTokenizer = () => {
    const [err, res] = safeTry(() => tokenize(mockLlm, showLogs.value));
    console.log(err, res);
};

const testParser = () => {
    const [err, res] = safeTry(() => PlantUMLParser.Parse(mockLlm, showLogs.value));
    console.log(err, res);
};

const testConverter = () => {
    const [err, data] = safeTry(() => {
        const parsed = PlantUMLParser.Parse(mockLlm, showLogs.value);
        const xml = PlantUMLConverter.Convert({ data: parsed });
        return xml;
    });
    console.log(err, data);
    if (data) xml.value = data;
};
</script>

<template>
    <div class="flex items-center my-2">
        <Checkbox v-model="showLogs" binary input-id="test-showlogs" />
        <label for="test-showlogs" class="ml-2 cursor-pointer">Show Logs</label>
    </div>
    <ButtonGroup class="mb-2">
        <Button @click="testTokenizer" label="Test Tokenizer" />
        <Button @click="testParser" label="Test Parser" />
        <Button @click="testConverter" label="Test Converter" />
    </ButtonGroup>
</template>

<style lang="scss" scoped></style>
