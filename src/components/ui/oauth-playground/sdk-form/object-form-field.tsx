import { ZodObject } from 'zod';
import { UseFormReturn } from 'react-hook-form';
import ArrayFormField from './array-form-field';
import InputFormField from './input-form-field';
import { FormDescription, FormItem, FormLabel } from '../../shadcn/form';
import FileFormField from './file-form-field';
import { Checkbox } from '../../shadcn/checkbox';
import { useState } from 'react';
import { Badge } from '../../shadcn/badge';
import DateFormField from './date-form-field';
import BooleanFormField from './boolean-form-field';
import { WrappedZodOptional, WrappedZodType } from '@/services/bsky-sdk/types';
import UnionFormField from './union-form-field';

function getFieldSchema(schema: any, meta?: { [key: string]: any }) {
  let isOptional = schema.isOptional;

  if (typeof isOptional === 'function') isOptional = isOptional();

  if (schema._def?.innerType)
    return getFieldSchema(schema._def.innerType, {
      isOptional: meta?.isOptional || isOptional,
      defaultValue: meta?.defaultValue || schema._def?.defaultValue || schema.defaultValue,
    });

  return Object.assign(schema, {
    ...(meta?.isOptional ? { isOptional: meta.isOptional } : {}),
    ...(meta?.defaultValue ? { defaultValue: meta.defaultValue } : {}),
  });
}

function getFieldType(fieldSchema: any) {
  return (
    fieldSchema._def?.innerType?._def?.typeName ||
    fieldSchema._def?.typeName ||
    fieldSchema.typeName
  );
}

type WrappedZodObject = WrappedZodType<ZodObject<any>>;

function ObjectFormField({
  form,
  schema: rawSchema,
  path,
  depth = 0,
  options = {},
}: {
  form: UseFormReturn;
  schema: WrappedZodObject | WrappedZodOptional<WrappedZodObject>;
  path: string;
  depth?: number;
  options?: {
    label?: string;
    virtualPath?: string;
  };
}) {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const schema =
    (rawSchema as WrappedZodOptional<WrappedZodObject>)._def?.innerType ||
    (rawSchema as WrappedZodObject);

  const schemaShape = typeof schema.shape === 'function' ? schema.shape() : schema.shape;
  const schemaMetadata = schema.meta ? schema.meta() : {};
  const isOptional: boolean =
    typeof rawSchema.isOptional === 'function'
      ? rawSchema.isOptional()
      : (rawSchema.isOptional as unknown as boolean);

  const isFieldEnabled = isEnabled || !!!depth;
  const isFieldOptional = isOptional && !!depth;
  const uiDepth = schemaMetadata.noDepth === true ? 0 : depth;
  const virtualPath = schemaMetadata.virtualPath || options.virtualPath;
  const label = schemaMetadata.label || options.label || virtualPath || path;

  return (
    <FormItem>
      {schemaMetadata.noLabel !== true && (
        <FormLabel>
          {label}
          {isOptional && (
            <>
              &nbsp;&nbsp;
              <Badge className="opacity-80" variant="secondary">
                Optional
              </Badge>
            </>
          )}
        </FormLabel>
      )}
      {schemaMetadata.noDescription !== true && schema.description && (
        <FormDescription>{schema.description}</FormDescription>
      )}

      {isFieldOptional && !isFieldEnabled && (
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox onClick={() => setIsEnabled(!isEnabled)} />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Enable <span className="font-mono">{path}</span>
          </label>
        </div>
      )}

      {(!isOptional || !!!depth || isEnabled) && (
        <div className={`p-${2 * uiDepth} ${uiDepth % 2 ? 'bg-slate-50' : 'bg-white'}`}>
          {Object.keys(schemaShape).map((fieldName, fieldIdx) => {
            let fieldSchema = getFieldSchema(schemaShape[fieldName]);
            let fieldType =
              (fieldSchema.meta && fieldSchema.meta().fieldType) || getFieldType(fieldSchema);

            const fieldPath = `${path ? `${path}.` : ''}${fieldName}` as string;
            const childDepth = schemaMetadata.noDepth ? 0 : depth + 1;

            return (
              <>
                {fieldIdx ? <br /> : <></>}
                {(() => {
                  switch (fieldType) {
                    case 'ZodObject':
                      return (
                        <ObjectFormField
                          schema={fieldSchema}
                          form={form}
                          path={fieldPath}
                          depth={childDepth}
                        />
                      );
                    case 'ZodArray':
                      return (
                        <ArrayFormField
                          schema={fieldSchema}
                          form={form}
                          path={fieldPath}
                          depth={childDepth}
                        />
                      );
                    case 'ZodUnion':
                      return (
                        <UnionFormField
                          schema={fieldSchema}
                          form={form}
                          path={fieldPath}
                          depth={childDepth}
                        />
                      );
                    case 'ZodBoolean':
                      return <BooleanFormField schema={fieldSchema} form={form} path={fieldPath} />;
                    case 'file':
                      return <FileFormField schema={fieldSchema} form={form} path={fieldPath} />;
                    case 'date':
                      return <DateFormField schema={fieldSchema} form={form} path={fieldPath} />;
                    default:
                      return <InputFormField form={form} schema={fieldSchema} path={fieldPath} />;
                  }
                })()}
              </>
            );
          })}
        </div>
      )}
    </FormItem>
  );
}

export default ObjectFormField;
