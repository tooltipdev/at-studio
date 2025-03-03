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

function DateFormField({
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
              {schemaMetadata.label || options.virtualPath ||  path}
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
                type="datetime-local"
                defaultValue={defaultValue ? defaultValue() : undefined}
                className="bg-white"
                key={field.name}
                placeholder=""
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  form.setValue(field.name, date.toISOString());
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

export default DateFormField;
