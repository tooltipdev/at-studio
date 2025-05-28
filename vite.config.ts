import path from 'path';
import react from '@vitejs/plugin-react';
import { ServerOptions, defineConfig } from 'vite';
import assert from 'assert';
import clientMetadata from './build/client-metadata';
import { IncomingMessage, ServerResponse } from 'http';
import type { OAuthClientServiceOptions } from './src/services/OAuthClient';
import { ensureSingleLeadingSlash, ensureSingleTrailingSlash } from './build/utils';

const { LOCAL_DEV_PORT, LOCAL_BASE_PATH, OAUTH_LOCALES, OAUTH_PDS_ENTRYWAY, NODE_ENV } =
  process.env;

let basePath = '';

if (NODE_ENV === 'development' || NODE_ENV === 'preview') {
  assert(LOCAL_BASE_PATH, 'LOCAL_BASE_PATH is not defined');

  basePath = ensureSingleLeadingSlash(LOCAL_BASE_PATH);
  basePath = ensureSingleTrailingSlash(LOCAL_BASE_PATH);
}

const oAuthConfig: OAuthClientServiceOptions = {};

if (OAUTH_LOCALES) oAuthConfig.locales = OAUTH_LOCALES;
if (OAUTH_PDS_ENTRYWAY) oAuthConfig.entryway = OAUTH_PDS_ENTRYWAY;

export default defineConfig({
  // required for dev server and preview server
  base: basePath,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
  server: {
    allowedHosts: true,
    // required for dev server (preview server runs on 4173)
    port: LOCAL_DEV_PORT ? parseInt(LOCAL_DEV_PORT) : 3001,
    // required for dev server to serve oauth client metadata
    proxy: {
      [`${basePath}client-metadata.json`]: {
        target: '', // mock target shouldn't be hit
        bypass: (_req: IncomingMessage, res: ServerResponse) => {
          res?.writeHead(200, { 'Content-Type': 'application/json' });
          res?.end(JSON.stringify(clientMetadata));
          return false; // prevent outbound `target` request
        },
      },
    },
  } as ServerOptions,
  // Export configuration objects for local/preview servers and /dist build process
  define: {
    __OAUTH_CLIENT_METADATA__: clientMetadata,
    __OAUTH_CONFIG__: oAuthConfig,
  },
});
