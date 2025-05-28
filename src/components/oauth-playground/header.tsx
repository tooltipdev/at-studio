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
} from '@/components/shadcn/dialog';
import { Button } from '../shadcn/button';
import { Badge } from '../shadcn/badge';
import { Agent } from '@atproto/api';
import OAuthClient from '@/services/OAuthClient';

function Header({
  profile,
  client,
  version = 'vX.X.X',
}: {
  profile: Awaited<ReturnType<typeof Agent.prototype.getProfile>> | null;
  client: OAuthClient;
  version: string;
}) {
  return (
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
                  browser client SDK implementation
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
        <Badge className="ml-2">v{version}</Badge>
        <div className="flex-1"></div>
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
    </>
  );
}

export default Header;
