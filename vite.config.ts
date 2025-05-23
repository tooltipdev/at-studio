import path from 'path';
import react from '@vitejs/plugin-react';
import { ServerOptions, defineConfig } from 'vite';
import assert from 'assert';
import clientMetadata from './client-metadata';
import { IncomingMessage, ServerResponse } from 'http';
import type { OAuthClientServiceOptions } from './src/services/OAuthClient';

const {
  DEV_PORT,
  DEV_BASE_PATH,
  OAUTH_LOCALES,
  OAUTH_PDS_ENTRYWAY,
  OAUTH_CLIENT_METADATA_CLIENT_NAME,
  OAUTH_CLIENT_METADATA_CLIENT_URI,
  NODE_ENV,
} = process.env;

if (NODE_ENV === 'development') {
  assert(DEV_PORT, 'DEV_PORT is not defined');
  assert(DEV_BASE_PATH, 'DEV_BASE_PATH is not defined');

  // Metadata checks needed by dev server to serve client metadata (preview servers serve /dist)
  assert(OAUTH_CLIENT_METADATA_CLIENT_NAME, 'OAUTH_CLIENT_METADATA_CLIENT_NAME not defined');
  assert(OAUTH_CLIENT_METADATA_CLIENT_URI, 'OAUTH_CLIENT_METADATA_CLIENT_URI not defined');
}

const oAuthConfig: OAuthClientServiceOptions = {};

if (OAUTH_LOCALES) oAuthConfig.locales = OAUTH_LOCALES;
if (OAUTH_PDS_ENTRYWAY) oAuthConfig.entryway = OAUTH_PDS_ENTRYWAY;

export default defineConfig({
  // required for dev server and preview server
  base: `${DEV_BASE_PATH}/`,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    allowedHosts: true,
    // required for dev server (preview server runs on 4173)
    port: DEV_PORT ? parseInt(DEV_PORT) : 3001,
    // required for dev server to serve oauth client metadata
    proxy: {
      [`${DEV_BASE_PATH}/client-metadata.json`]: {
        target: '', // mock target shouldn't be hit
        bypass: (_req: IncomingMessage, res: ServerResponse) => {
          res?.writeHead(200, { 'Content-Type': 'application/json' });
          res?.end(JSON.stringify(clientMetadata));
          return false; // prevent outbound `target` request
        },
      },
    },
  } as unknown as ServerOptions,
  define: {
    __OAUTH_CLIENT_METADATA__: clientMetadata,
    __OAUTH_CONFIG__: oAuthConfig,
  },
});
