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

function FileFormField({
  schema,
  form,
  path,
  options = {},
}: {
  schema: { [key: string]: any };
  form: UseFormReturn;
  path: string;
  options?: {
    label?: string;
    virtualPath?: string;
  };
}) {
  let defaultValue =
    schema._def?.defaultValue || schema._def?.innerType?._def?.defaultValue || schema.defaultValue;

  let isOptional = schema.isOptional;

  if (typeof isOptional === 'function') isOptional = isOptional();

  const schemaMetadata = schema.meta ? schema.meta() : {};
  const virtualPath = schemaMetadata.virtualPath || options.virtualPath;
  const label = schemaMetadata.label || options.label || virtualPath || path;

  return (
    <FormField
      control={form.control}
      key={path}
      name={path}
      render={({ field }) => {
        return (
          <FormItem>
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
            <FormDescription>{schema.description}</FormDescription>
            <FormControl>
              <Input
                id="kitty"
                type="file"
                defaultValue={defaultValue ? defaultValue() : undefined}
                className="bg-white"
                key={field.name}
                placeholder=""
                onChange={() => {
                  const file = (document.getElementById('kitty') as HTMLInputElement)!.files![0]!;
                  const blob = new Blob([file], { type: file.type });

                  form.setValue('__file__', { blob, type: file.type });
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export default FileFormField;
