import { Did } from '@atproto/api';
import {
  BrowserOAuthClient,
  OAuthClientMetadataInput,
  OAuthSession,
} from '@atproto/oauth-client-browser';

export type OAuthClientServiceOptions = {
  entryway?: string;
  locales?: string;
};

export default class OAuthClient {
  browserOAuthClient: BrowserOAuthClient;
  authenticatedUserSub: Did | undefined;
  options: OAuthClientServiceOptions;
  handleResolver: string;
  events = {
    handlers: {} as { [key: string]: Array<() => void | Promise<void>> },
    on(t: string, cb: () => void | Promise<void>) {
      if (!this.handlers[t]) this.handlers[t] = [];

      this.handlers[t].push(cb);
    },
    emit(t: string) {
      if (this.handlers[t]?.length) this.handlers[t].forEach((h) => h());
    },
  };

  constructor(clientMetadata: OAuthClientMetadataInput, options: OAuthClientServiceOptions = {}) {
    const handleResolver = OAuthClient.parseHandleResolver(options);

    if (!handleResolver) throw new Error('No handleResolver found');

    this.options = options;
    this.handleResolver = handleResolver;
    this.browserOAuthClient = new BrowserOAuthClient({
      clientMetadata,
      handleResolver: this.handleResolver,
    });
  }

  static parseHandleResolver(options: OAuthClientServiceOptions) {
    let handleResolver: string | undefined;

    if (options.entryway) {
      handleResolver = options.entryway;
    }

    return handleResolver;
  }

  async init() {
    let result;

    try {
      result = await this.browserOAuthClient.init();
    } catch (err) {
      console.error(err);

      // allow unauthenticated client to return
      if (err instanceof Error && err.message === 'Refresh token exceeded inactivity timeout') {
        this.authenticatedUserSub = undefined;
      } else {
        throw err;
      }
    }

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
    return this.browserOAuthClient.signIn(this.handleResolver, {
      state: `${Date.now()}`,
      ...(this.options.locales ? { ui_locales: this.options.locales } : {}),
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
