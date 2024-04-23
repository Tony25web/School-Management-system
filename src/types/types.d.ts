type ModelMethods<T> = {
  [K in keyof T]: T[K] extends (arg:any) => any ? T[K] : never;
};