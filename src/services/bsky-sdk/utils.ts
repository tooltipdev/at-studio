import { ZodType } from "zod";
import { WrappedZodType } from "./types";

export function metaMixin(z: { [key: string]: any }, metadata: { [key: string]: any } = {}) {
    function getSchema(schema: typeof z) {
      if (schema._def.innerType?.type) return getSchema(schema._def.innerType?.type);
      if (schema._def.innerType) return getSchema(schema._def.innerType);
  
      return schema;
    }
  
    const targetSchema = getSchema(z);
  
    if (!targetSchema.meta) targetSchema.meta = () => metadata;
  
    return z as WrappedZodType<ZodType>;
  }