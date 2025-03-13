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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../shadcn/button';
import { Badge } from '../shadcn/badge';

function Playground() {
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
    } else {
      setProfile(null);
    }
  }, [client?.isAuthenticated]);

  return (
    <div className="h-screen flex flex-col items-center">
      {client && (
        <>
          <div className="h-auto p-2 w-screen max-w-[960px] flex items-center">
            <Dialog>
              <DialogTrigger>
                <Button variant="ghost">About</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>About this app</DialogTitle>
                  <br />
                  <br />
                  <DialogDescription>
                    This web app lets you easily experiment with the{' '}
                    <a className="underline" href="https://atproto.com/">
                      @ATProtocol
                    </a>{' '}
                    via the{' '}
                    <a
                      className="underline"
                      href="https://www.npmjs.com/package/@atproto/oauth-client-browser"
                    >
                      browser client implementation
                    </a>
                    .
                    <br />
                    <br />
                    Currently, only{' '}
                    <a className="underline" href="https://bsky.social">
                      bsky.social
                    </a>{' '}
                    instances are supported, but other PDS's and entryways will be supported in the
                    future.
                    <br />
                    <br />
                    Sign in with you{' '}
                    <a className="underline" href="https://bsky.app/">
                      bsky.app
                    </a>{' '}
                    account to interact with the protocol.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              onClick={() =>
                window.open('https://github.com/tooltipdev/bsky-oauth-playground', '_blank')
              }
            >
              GitHub
            </Button>
            <Badge className="ml-2">v.0.0.0-mvp</Badge>
            <div className='flex-1'></div>
            {profile && (
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar>
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
              </div>
            )}
          </div>
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
