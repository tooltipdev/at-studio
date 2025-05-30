import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/card';
import { useContext, useState } from 'react';
import MethodSelect from './method-select';
import schemaMap from '@/services/bsky-sdk/lexicon-zod-schemas';
import SDKForm from '../sdk-form';
import { OAuthClientContext } from '@/contexts/oauth';
import BulletList from '../bullet-list';

function SDKDashboard() {
  const { client } = useContext(OAuthClientContext);
  const [method, setMethod] = useState<null | keyof typeof schemaMap>(null);

  return (
    client && (
      <>
        {client.isAuthenticated && (
          <Card className='max-w-[100vw]'>
            <CardHeader>
              <CardTitle className="text-center">
                {method ? method : 'Select an SDK Method'}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-col">
              {!method && (
                <BulletList>
                  <li>Select an ATProtocol SDK method</li>
                  <li>Fill out the provided form</li>
                  <li>Submit form to execute SDK method</li>
                </BulletList>
              )}

              {method && (
                <SDKForm onCancel={() => setMethod(null)} method={method} client={client!} />
              )}
            </CardContent>
            <CardFooter className="flex-col">
              {!method && (
                <MethodSelect onSelect={(s: string) => setMethod(s as keyof typeof schemaMap)} />
              )}
            </CardFooter>
          </Card>
        )}
      </>
    )
  );
}

export default SDKDashboard;
