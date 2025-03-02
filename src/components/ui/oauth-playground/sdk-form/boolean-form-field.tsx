import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../shadcn/form';

import { UseFormReturn } from 'react-hook-form';
import { Badge } from '../../shadcn/badge';
import { RadioGroup, RadioGroupItem } from '../../shadcn/radio-group';
import { Label } from '../../shadcn/label';

function BooleanFormField({
  schema,
  form,
  path,
}: {
  schema: { [key: string]: any };
  form: UseFormReturn;
  path: string;
}) {
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
              {schemaMetadata.label || path}
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
              <RadioGroup onValueChange={(val: string) => {
                form.setValue(field.name, Boolean(val))
              }}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="r2" />
                  <Label htmlFor="r2">true</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="r3" />
                  <Label htmlFor="r3">false</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export default BooleanFormField;
