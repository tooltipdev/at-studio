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
    virtualPath?: string;
  };
}) {
  let defaultValue =
    schema._def?.defaultValue || schema._def?.innerType?._def?.defaultValue || schema.defaultValue;

  let isOptional = schema.isOptional;

  if (typeof isOptional === 'function') isOptional = isOptional();

  const schemaMetadata = schema.meta ? schema.meta() : {};

  return (
    <FormField
      control={form.control}
      key={path}
      name={path}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>
              {schemaMetadata.label || options.virtualPath || path}
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
