import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/card';
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
        {client.isAuthenticated && (
          <Card className="max-w-[1140px]">
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
