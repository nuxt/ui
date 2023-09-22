export type Strategy = 'merge' | 'override';

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType]: ObjectType[Key] extends object
  ? NestedKeyOf<ObjectType[Key]>
  : Key;
}[keyof ObjectType];

export type DeepPartial<T> = Partial<{
  [P in keyof T]: DeepPartial<T[P]> | { [key: string]: string };
}>;
