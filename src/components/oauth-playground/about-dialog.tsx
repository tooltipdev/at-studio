import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn/dialog';
import { Button } from '../shadcn/button';

function AboutDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="ghost">About</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>About ATStudio</DialogTitle>
          <br />
          <br />
          <DialogDescription>
            This web app lets you easily experiment with the
            <a className="underline" href="https://atproto.com/">
              @ATProtocol
            </a>
            via the
            <a
              className="underline"
              href="https://www.npmjs.com/package/@atproto/oauth-client-browser"
            >
              browser client SDK implementation
            </a>
            .
            <br />
            <br />
            Currently, only
            <a className="underline" href="https://bsky.social">
              bsky.social
            </a>
            instances are supported, but other PDS's and entryways will be supported in the future.
            <br />
            <br />
            Sign in with you
            <a className="underline" href="https://bsky.app/">
              bsky.app
            </a>
            account to interact with the protocol.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default AboutDialog;
