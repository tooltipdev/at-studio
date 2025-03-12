import { Did } from '@atproto/api';
import {
  BrowserOAuthClient,
  OAuthClientMetadataInput,
  OAuthSession,
} from '@atproto/oauth-client-browser';

export const OAUTH_CLIENT_METADATA = __OAUTH_CLIENT_METADATA__ as OAuthClientMetadataInput;
export const BSKY_PDS_ENTRYWAY = 'https://bsky.social';
export default class OAuthClient {
  browserOAuthClient: BrowserOAuthClient;
  authenticatedUserSub: Did | undefined;
  events = {
    handlers: {} as { [key: string]: Array<() => void | Promise<void>> },
    on(t: string, cb: () => void | Promise<void>) {
      !this.handlers[t] && (this.handlers[t] = []);
      this.handlers[t].push(cb);
    },
    emit(t: string) {
      this.handlers[t]?.length && this.handlers[t].forEach((h) => h());
    },
  };

  constructor() {
    this.browserOAuthClient = new BrowserOAuthClient({
      clientMetadata: OAUTH_CLIENT_METADATA,
      handleResolver: BSKY_PDS_ENTRYWAY,
    });
  }

  async init() {
    const result = await this.browserOAuthClient.init();

    if (result) {
      const { session, state } = result as { session: OAuthSession; state?: string };

      if (state != null) {
        console.log(`${session.sub} was successfully authenticated (state: ${state})`);
      } else {
        console.log(`${session.sub} was restored (last active session)`);
      }

      this.authenticatedUserSub = session.did;
    }
  }

  async signIn() {
    return this.browserOAuthClient.signIn(BSKY_PDS_ENTRYWAY, {
      state: `${Date.now()}`,
      ui_locales: 'fr-CA fr en',
    });
  }

  get isAuthenticated(): boolean {
    return !!this.authenticatedUserSub;
  }

  get sub(): Did {
    if (!this.authenticatedUserSub) throw new Error('OAuthClient has no user');

    return this.authenticatedUserSub;
  }

  async signOut() {
    await this.browserOAuthClient.revoke(this.sub);
    this.authenticatedUserSub = undefined;
    this.events.emit('SIGN_OUT');
  }

  async refresh(): Promise<OAuthSession> {
    return this.browserOAuthClient.restore(this.sub);
  }
}
