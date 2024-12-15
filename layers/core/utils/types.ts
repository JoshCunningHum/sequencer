export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredBy<T, K extends keyof T> = Partial<T> &
    Required<Pick<T, K>>;
export type OptionalBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type ArrayCallback<T, R = void> = (
    item: T,
    index: number,
    array: T[],
) => R;
export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
type AnyFn = (...args: unknown[]) => unknown;

//#region Nested Keys
export type NestedKeyOf<T> = T extends object
    ? {
          [K in keyof T]: K extends string
              ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
              : never;
      }[keyof T]
    : never;

// Dynamic
type DynamicPart = `${number}` | `${string}`;

type DynamicKey<T extends string> = T extends `${infer P}[${infer _}]${infer S}`
    ? `${P}${DynamicPart}${DynamicKey<S>}`
    : T;

export type DynamicNestedKeyOf<T> = T extends object
    ? {
          [K in keyof T]: K extends string
              ?
                    | DynamicKey<K>
                    | `${DynamicKey<K>}${NestedKeyOf<T[K]> extends string
                          ? `.${NestedKeyOf<T[K]>}`
                          : ""}`
              : never;
      }[keyof T]
    : never;

//#region Acquire Class Properties
export type ClassProperties<C> = {
    [K in keyof C as C[K] extends AnyFn ? never : K]: C[K];
};
