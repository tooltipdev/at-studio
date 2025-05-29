import { Avatar, AvatarFallback, AvatarImage } from '../shadcn/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../shadcn/dropdown-menu';
import { Button } from '../shadcn/button';
import { Badge } from '../shadcn/badge';
import { Agent } from '@atproto/api';
import OAuthClient from '@/services/OAuthClient';
import AboutDialog from './about-dialog';

function ProfileDropdown({
  profile,
  client,
}: {
  profile: Awaited<ReturnType<typeof Agent.prototype.getProfile>>;
  client: OAuthClient;
}) {
  return (
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
  );
}

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
        <AboutDialog />
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
        {profile && <ProfileDropdown profile={profile} client={client} />}
      </div>
    </>
  );
}

export default Header;
