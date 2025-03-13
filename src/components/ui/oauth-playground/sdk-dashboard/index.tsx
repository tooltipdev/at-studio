import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card';
import { useContext, useState } from 'react';
import MethodSelect from './method-select';
import schemaMap from '@/services/bsky-sdk/lexicon-zod-schemas';
import SDKForm from '../sdk-form';
import { OAuthClientContext } from '@/contexts/oauth';

function SDKDashboard() {
  const { client } = useContext(OAuthClientContext);
  const [method, setMethod] = useState<null | keyof typeof schemaMap>(null);

  return (
    client && (
      <>
        <h1 className="text-center text-lg pb-2.5 font-normal">bsky OAuth Playground</h1>
        {client.isAuthenticated && (
          <Card className="max-w-[80vw]">
            <CardHeader>
              {method && <CardTitle className="text-center">{method}</CardTitle>}
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              {method ? (
                <SDKForm onCancel={() => setMethod(null)} method={method} client={client!} />
              ) : (
                <MethodSelect onSelect={(s: string) => setMethod(s as keyof typeof schemaMap)} />
              )}
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        )}
      </>
    )
  );
}

export default SDKDashboard;
