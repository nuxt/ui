import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { Struct } from 'superstruct';
import type { FormSchema, ValidateReturnSchema } from '../types/form';
export declare function isSuperStructSchema(schema: any): schema is Struct<any, any>;
export declare function isStandardSchema(schema: any): schema is StandardSchemaV1;
export declare function validateStandardSchema(state: any, schema: StandardSchemaV1): Promise<ValidateReturnSchema<typeof state>>;
export declare function validateSchema<T extends object>(state: T, schema: FormSchema<T>): Promise<ValidateReturnSchema<typeof state>>;
export declare function getAtPath<T extends object>(data: T, path?: string): any;
export declare function setAtPath<T extends object>(data: T, path: string, value: any): T;
