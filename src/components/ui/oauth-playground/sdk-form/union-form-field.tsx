import { ZodAny, ZodArray, ZodOptional, ZodUnion } from 'zod';
import { UseFormReturn } from 'react-hook-form';
import ArrayFormField from './array-form-field';
import InputFormField from './input-form-field';
import { FormDescription, FormItem, FormLabel } from '../../shadcn/form';
import ObjectFormField from './object-form-field';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/shadcn/tabs';
import { Badge } from '../../shadcn/badge';

function UnionFormField({
  form,
  schema,
  path,
  depth = 0,
  options = {},
}: {
  form: UseFormReturn;
  schema: ZodUnion<any> | ZodOptional<ZodUnion<any>>;
  path: string;
  depth?: number;
  options?: {
    label?: string;
    virtualPath?: string;
  };
}) {
  const unionOptions: Array<{ [key: string]: any }> =
    (schema as any).options ||
    (schema as ZodUnion<any>)._def.options ||
    (schema as ZodOptional<ZodUnion<any>>)._def.innerType._def.options;

  let isOptional: boolean | Function = schema.isOptional;

  if (typeof isOptional === 'function') isOptional = isOptional();

  const schemaMetadata = (schema as { [key: string]: any }).meta
    ? (schema as { [key: string]: any }).meta()
    : {};
  const virtualPath = schemaMetadata.virtualPath || options.virtualPath;
  const label = schemaMetadata.label || options.label || virtualPath || path;

  return (
    <FormItem className="">
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
      <Tabs
        // onValueChange={(value) => {
        // console.log(form.getValues().embed)
        // form.getValues()?.embed && Object.keys(form.getValues().embed).forEach((key) => {
        //   form.setValue(`${path}.${key}`, undefined)
        // })
        // }}
        className={``}
      >
        <TabsList className={``}>
          {unionOptions.map((o, i) => {
            const optionsSchema = o._def?.innerType || o;

            return (
              <TabsTrigger onClick={() => {}} value={`${i}`}>
                {(optionsSchema.meta && optionsSchema.meta().key) || `Variant ${i + 1}`}
              </TabsTrigger>
            );
          })}
        </TabsList>
        {unionOptions.map((optionSchema, i) => {
          return (
            <TabsContent
              value={`${i}`}
              className={`p-${2 * depth} ${depth % 2 ? 'bg-slate-50' : 'bg-white'}`}
            >
              {(() => {
                const optionSchemaType =
                  optionSchema._def?.innerType?._def?.typeName || optionSchema._def.typeName;

                const optionsSchema = optionSchema._def?.innerType || optionSchema;

                switch (optionSchemaType) {
                  case 'ZodObject':
                    return (
                      <ObjectFormField
                        schema={optionsSchema}
                        form={form}
                        path={path}
                        depth={depth}
                      />
                    );
                  case 'ZodArray':
                    return (
                      <ArrayFormField
                        schema={optionSchema as ZodOptional<ZodAny> | ZodArray<ZodAny>}
                        form={form}
                        path={path}
                        depth={depth}
                      />
                    );
                  case 'ZodUnion':
                    return (
                      <UnionFormField
                        schema={optionSchema as ZodUnion<any> | ZodOptional<ZodUnion<any>>}
                        form={form}
                        path={path}
                        depth={depth}
                      />
                    );
                  default:
                    return <InputFormField form={form} schema={optionSchema} path={path} />;
                }
              })()}
            </TabsContent>
          );
        })}
      </Tabs>
      {/* {Object.keys(schemaShape).map((fieldName, fieldIdx) => {
          const fieldSchema = schemaShape[fieldName];
          const fieldType =
            fieldSchema._def?.innerType?._def?.typeName || fieldSchema._def?.typeName;
          const fieldPath = `${path ? `${path}.` : ''}${fieldName}` as string;

          return (
            <>
              {fieldIdx ? <br /> : <></>}
              {(() => {
                switch (fieldType) {
                  case 'ZodObject':
                    return (
                      <ObjectFormField
                        schema={schemaShape[fieldName]}
                        form={form}
                        path={fieldPath}
                        depth={depth + 1}
                      />
                    );
                  case 'ZodArray':
                    return (
                      <ArrayFormField
                        schema={schemaShape[fieldName]}
                        form={form}
                        path={fieldPath}
                        depth={depth + 1}
                      />
                    );
                  // case 'ZodUnion':
                  //   input = (
                  //     <UnionFormField
                  //       schema={schemaShape[fieldName]}
                  //       form={form}
                  //       path={fieldPath}
                  //       depth={depth + 1}
                  //     />
                  //   );
                  default:
                    return <InputFormField form={form} schema={fieldSchema} path={fieldPath} />;
                }
              })()}
            </>
          );
        })} */}
    </FormItem>
  );
}

export default UnionFormField;
