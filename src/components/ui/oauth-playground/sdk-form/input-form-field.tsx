import { ZodDefault, ZodOptional, ZodString } from 'zod';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../shadcn/form';

import { Input } from '../../shadcn/input';
import { UseFormReturn } from 'react-hook-form';
import { Badge } from '../../shadcn/badge';
import { WrappedZodType } from '@/services/bsky-sdk/types';

type WrappedString = WrappedZodType<ZodString>;

function InputFormField({
  schema,
  form,
  path,
  options = {},
}: {
  schema:
    | WrappedString
    | ZodDefault<WrappedString>
    | ZodOptional<WrappedString>
    | ZodOptional<ZodDefault<WrappedString>>
    | { [key: string]: any };
  form: UseFormReturn;
  path: string;
  options?: {
    label?: string;
    virtualPath?: string;
  };
}) {
  let defaultValue =
    (schema as ZodDefault<WrappedZodType<ZodString>>)._def?.defaultValue ||
    (schema as ZodOptional<ZodDefault<WrappedString>>)._def?.innerType?._def?.defaultValue ||
    (schema as { [key: string]: any }).defaultValue;

  let isOptional: boolean | (() => boolean) = schema.isOptional;

  if (typeof isOptional === 'function') isOptional = isOptional();

  const schemaMetadata = (schema as { [key: string]: any }).meta
    ? (schema as { [key: string]: any }).meta()
    : {};

  const label = schemaMetadata.label || options.label || options.virtualPath || path;

  return (
    <FormField
      control={form.control}
      key={path}
      name={path}
      render={({ field }) => {
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
            {schemaMetadata.noDescription !== true && (
              <FormDescription>{schema.description}</FormDescription>
            )}
            <FormControl>
              <Input
                disabled={schemaMetadata.readOnly ? true : false}
                defaultValue={defaultValue ? defaultValue() : undefined}
                className={`bg-white ${schemaMetadata.hidden === true ? 'hidden' : ''}`}
                key={field.name}
                placeholder=""
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export default InputFormField;
