import path from 'path';
import react from '@vitejs/plugin-react';
import { ServerOptions, defineConfig } from 'vite';
import assert from 'assert';
import clientMetadata from './client-metadata';
import { IncomingMessage, ServerResponse } from 'http';
import type { OAuthClientServiceOptions } from './src/services/OAuthClient';

const {
  DEV_HOST,
  DEV_PORT,
  DEV_BASE_PATH,
  OAUTH_LOCALES,
  OAUTH_PDS_ENTRYWAY,
} = process.env;

assert(DEV_HOST, 'DEV_HOST is not defined');
assert(DEV_PORT, 'DEV_PORT is not defined');
assert(DEV_BASE_PATH, 'DEV_BASE_PATH is not defined');

const oAuthConfig: OAuthClientServiceOptions = {};

if (OAUTH_LOCALES) oAuthConfig.locales = OAUTH_LOCALES;
if (OAUTH_PDS_ENTRYWAY) oAuthConfig.entryway = OAUTH_PDS_ENTRYWAY;

export default defineConfig({
  base: `${DEV_BASE_PATH}/`,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    allowedHosts: true,
    port: DEV_PORT ? parseInt(DEV_PORT) : 3001,
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
