import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ZodObject, ZodType } from 'zod';
import { Button } from '@/components/shadcn/button';
import { Form } from '@/components/shadcn/form';
import schemaMap from '@/services/bsky-sdk/lexicon-zod-schemas';
import OAuthClient from '@/services/OAuthClient';
import { Agent } from '@atproto/api';
import { useState } from 'react';
import DataTable from '../data-table';
import { Separator } from '../../shadcn/separator';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { ScrollBar } from '../../shadcn/scroll-area';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs';

import ObjectFormField from './object-form-field';
import SDKMethodProxy from '@/services/bsky-sdk/method-proxy';
import { WrappedZodType } from '@/services/bsky-sdk/types';

function SDKFormResponse({ res, err }: { res?: any; err?: Error | string | any }) {
  return (
    <>
      {err && !res && (
        <ScrollArea className="w-full max-h-[50vh] overflow-auto bg-slate-100 p-5 rounded-md">
          <pre>{typeof err === 'string' ? err : err.message || JSON.stringify(err)}</pre>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
      {!err && res && (
        <Tabs defaultValue="table" className="max-w-[1140px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>
          <TabsContent value="table">
            <DataTable data={res} />
          </TabsContent>
          <TabsContent value="json">
            <ScrollArea className="w-full max-h-[50vh] overflow-auto bg-slate-100 p-5 rounded-md">
              <pre>{JSON.stringify(res, null, 2)}</pre>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      )}
    </>
  );
}

function SDKForm({
  method,
  onCancel = () => {},
  client,
}: {
  method: keyof typeof schemaMap;
  onCancel: () => void;
  client: OAuthClient;
}) {
  const schema = schemaMap[method] as { [key: string]: any };
  const [response, setResponse] = useState<null | { [key: string]: any }>(null);
  const [responseError, setResponseError] = useState<null | Error | string | any>(null);

  const form = useForm({
    resolver: zodResolver(schema as ZodType<any>),
  });

  async function onSubmit(input: any) {
    const agent = new Agent(await client.refresh());
    const agentMethodProxy = SDKMethodProxy(agent);
    const proxyMethod = agentMethodProxy[
      method as keyof typeof agentMethodProxy
    ] as unknown as Function;

    let formSubmit = async () => proxyMethod(input);

    if ((input as { [key: string]: any }).__file__) {
      formSubmit = async () =>
        proxyMethod(input.__file__.blob, { headers: { 'Content-Type': input.__file__.type } });
    }

    if ((input as { [key: string]: any }).__args__) {
      const args = Object.keys(input.__args__)
        .sort((a, b) => parseInt(a.replace('$', '')) - parseInt(b.replace('$', '')))
        .reduce((acc, i) => {
          acc[parseInt(i.replace('$', ''))] = input.__args__[i];
          return acc;
        }, [] as Array<any>);

      formSubmit = async () => await proxyMethod.apply(agent, args);
    }

    try {
      const res = await formSubmit();

      setResponseError(null);
      setResponse(res);
    } catch (err) {
      console.error(err);
      setResponse(null);
      setResponseError(err);
    }
  }

  return (
    <Form {...form}>
      <form
        onKeyDown={(event) => {
          event.key === 'Enter' && event.preventDefault();
        }}
        onSubmit={form.handleSubmit(onSubmit, console.log)}
        className="space-y-8"
      >
        <div className="max-w-[500px]">
          <ObjectFormField form={form} schema={schema as WrappedZodType<ZodObject<any>>} path="" />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Back
          </Button>
          <Button variant="outline" type="submit">
            Submit
          </Button>
        </div>
        {(response || responseError) && (
          <>
            <Separator />
            <h2 className="text-center font-bold">
              {method} : {response ? 'Response' : 'Error'}
            </h2>
            <SDKFormResponse res={(response && response.data) || response} err={responseError} />
          </>
        )}
      </form>
    </Form>
  );
}

export default SDKForm;
