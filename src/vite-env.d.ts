/// <reference types="vite/client" />

import type { OAuthClientMetadataInput } from '@atproto/oauth-client-browser';
import type { OAuthClientServiceOptions } from './services/OAuthClient';

declare global {
  // @atproto/oauth-client-browser BrowserOAuthClient clientMetadata
  declare const __OAUTH_CLIENT_METADATA__: OAuthClientMetadataInput;

  // @atproto/oauth-client-browser configuration
  declare const __OAUTH_CONFIG__: OAuthClientServiceOptions;
}