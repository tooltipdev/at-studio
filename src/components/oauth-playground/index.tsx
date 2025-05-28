import { OAuthClientContext } from '@/contexts/oauth';
import { useContext, useEffect, useState } from 'react';
import Logo from '../shadcn/logo';
import AuthButton from './auth-button';
import SDKDashboard from './sdk-dashboard';
import { Agent } from '@atproto/api';
import Header from './header';

const { VITE_APP_VERSION } = import.meta.env;

function Playground() {
  const { client } = useContext(OAuthClientContext);
  const [profile, setProfile] = useState<null | Awaited<
    ReturnType<typeof Agent.prototype.getProfile>
  >>(null);

  useEffect(() => {
    if (client?.isAuthenticated) {
      (async () => {
        const agent = new Agent(await client!.refresh());
        const userProfile = await agent.getProfile({ actor: client!.sub });

        if (!userProfile) return;

        setProfile(userProfile);
      })();
    } else {
      setProfile(null);
    }
  }, [client]);

  return (
    <div className="h-screen flex flex-col items-center">
      {client && (
        <>
          <Header version={VITE_APP_VERSION} client={client} profile={profile} />
          <div className="flex-1 flex flex-col items-center justify-center">
            {client.isAuthenticated ? <SDKDashboard /> : <Logo size="lg"></Logo>}
            {!client.isAuthenticated && (
              <div className="text-center p-4">
                <AuthButton client={client}></AuthButton>
              </div>
            )}
          </div>
          <div className="h-auto p-2 text-center">
            Maintained by{' '}
            <a
              className="font-mono underline"
              target="_blank"
              href="https://bsky.app/profile/tooltip.bsky.social"
            >
              @tooltip.bsky.social
            </a>
          </div>
        </>
      )}
    </div>
  );
}

export default Playground;
