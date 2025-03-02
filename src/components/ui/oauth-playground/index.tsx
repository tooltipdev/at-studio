import { OAuthClientContext } from '@/contexts/oauth';
import { useContext, useEffect, useState } from 'react';
import Logo from '../shadcn/logo';
import AuthButton from './auth-button';
import SDKDashboard from './sdk-dashboard';
import { Agent } from '@atproto/api';
import { Avatar, AvatarFallback, AvatarImage } from '../shadcn/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../shadcn/dropdown-menu';

function Playground(props: { [key: string]: string }) {
  const { client } = useContext(OAuthClientContext);
  const [profile, setProfile] = useState<null | Awaited<
    ReturnType<typeof Agent.prototype.getProfile>
  >>(null);

  useEffect(() => {
    if (client && client.isAuthenticated && !profile) {
      (async () => {
        const agent = new Agent(await client!.refresh());
        const userProfile = await agent.getProfile({ actor: client!.sub });

        if (!userProfile) return;

        setProfile(userProfile);
      })();
    }else {
      setProfile(null)
    }
  }, [client?.isAuthenticated]);

  return (
    <div {...props}>
      {client && (
        <>
          {profile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="fixed top-4 right-4">
                  <AvatarImage src={profile.data.avatar} /> <AvatarFallback>...</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>@{profile.data.handle}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    client.signOut();
                  }}
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {client.isAuthenticated ? <SDKDashboard /> : <Logo size="lg"></Logo>}
          {!client.isAuthenticated && (
            <div className="text-center p-4">
              <AuthButton client={client}></AuthButton>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Playground;
