import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '../../shadcn/button';
import { Plus } from 'lucide-react';
import ObjectFormField from './object-form-field';
import InputFormField from './input-form-field';
import { FormDescription, FormItem, FormLabel } from '../../shadcn/form';
import { Separator } from '@radix-ui/react-separator';
import { Badge } from '../../shadcn/badge';
import UnionFormField from './union-form-field';

function ArrayFormField({
  schema,
  form,
  path,
  depth = 0,
}: {
  schema: { [key: string]: any };
  form: UseFormReturn;
  path: string;
  depth?: number;
}) {
  const [index, setIndex] = useState(-1);

  function deeper(schema: any) {
    if (schema._def.innerType) return deeper(schema._def.innerType);

    return schema;
  }

  const itemSchema = schema._def?.innerType?._def.type || schema._def?.type || schema.type;
  const nestedSchema = deeper(itemSchema);
  const nestedType = nestedSchema._def.typeName;
  const nestedSchemaMeta = schema.meta ? schema.meta() : {}
  const nestedLabel = nestedSchemaMeta.label || path;

  let isOptional = schema.isOptional;

  if (typeof isOptional === 'function') isOptional = isOptional();

  return (
    <FormItem>
      <FormLabel>
        {nestedLabel}
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
      <div className={`p-${2 * depth} ${depth % 2 ? 'bg-slate-50' : 'bg-white'}`}>
        {index === -1 ? <p className="font-mono">No {nestedLabel} provided</p> : <></>}
        {(() => {
          const items = [];

          for (let i = 0; i <= index; i++) {
            let field;

            const nestedPath = `${path}.${i}`;

            switch (nestedType) {
              case 'ZodObject':
                field = (
                  <ObjectFormField
                    depth={depth}
                    schema={nestedSchema}
                    form={form}
                    path={nestedPath}
                  />
                );
                break;
              case 'ZodArray':
                field = (
                  <ArrayFormField
                    depth={depth}
                    schema={nestedSchema}
                    form={form}
                    path={nestedPath}
                  />
                );
                break;
              case 'ZodUnion':
                return (
                  <UnionFormField
                    schema={nestedSchema}
                    form={form}
                    path={nestedPath}
                    depth={depth + 1}
                  />
                );
              case 'ZodOptional':
                break;
              default:
                field = (
                  <InputFormField
                    schema={nestedSchema}
                    form={form}
                    path={nestedPath}
                    options={{
                      label: `${nestedLabel}.${i}`,
                    }}
                  />
                );
            }
            items[i] = (
              <>
                {i ? <br /> : <></>}
                {field}
              </>
            );
          }

          return items;
        })()}
      </div>
      <Separator />
      <Button
        type="button"
        className=""
        onClick={() => {
          setIndex(index + 1);
        }}
      >
        <Plus />
        Add more `{nestedLabel}`
      </Button>
    </FormItem>
  );
}

export default ArrayFormField;
