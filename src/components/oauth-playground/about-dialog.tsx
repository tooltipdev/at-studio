import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn/dialog';
import { Button } from '../shadcn/button';
import BulletList from './bullet-list';

function AboutDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="ghost">About</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>About @ATStudio</DialogTitle>
          <br/>
          <p>
            @ATStudio provides easy to use interfaces for quickly interacting with the{' '}
            <a className="underline" href="https://atproto.com/">
              @ATProtocol
            </a>
            .
          </p>
          <br />
          <BulletList>
            <li>
              Connect your{' '}
              <a className="underline" href="https://bsky.social">
                bsky.social
              </a>{' '}
              account
            </li>
            <li>
              Execute{' '}
              <a
                className="underline"
                href="https://www.npmjs.com/package/@atproto/oauth-client-browser"
              >
                @ATProtocol SDK
              </a>{' '}
              methods
            </li>
            <li>Learn about the @ATProtocol</li>
            <li>Test/debug @ATProtocol code paths</li>
          </BulletList>
          <br/>
          <h1 className="scroll-m-20 font-semibold tracking-tight">Limitations</h1>
          <p>
            Currently, only the{' '}
            <a className="underline" href="https://docs.bsky.app/docs/advanced-guides/entryway">
              bsky.social PDS Entryway
            </a>{' '}
            is supported, but self custodial PDSes will be supported in the near future.
          </p>
          <br/>
          <h1 className="scroll-m-20 font-semibold tracking-tight">Disclaimer</h1>
          <p>This is an experimental application. Use at your own risk.</p>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default AboutDialog;
