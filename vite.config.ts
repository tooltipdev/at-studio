import path from 'path';
import react from '@vitejs/plugin-react';
import { ServerOptions, defineConfig } from 'vite';
import assert from 'assert';
import clientMetadata from './client-metadata';
import { IncomingMessage, ServerResponse } from 'http';

const { HOST, PORT, BASE_PATH, OAUTH_CLIENT_METADATA_CLIENT_NAME, OAUTH_LOCALES } = process.env;

assert(HOST, 'HOST is not defined');
assert(PORT, 'PORT is not defined');
assert(BASE_PATH, 'BASE_PATH is not defined');
assert(OAUTH_CLIENT_METADATA_CLIENT_NAME, 'OAUTH_CLIENT_METADATA_CLIENT_NAME is not defined');

export default defineConfig({
  base: `${BASE_PATH}/`,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    allowedHosts: true,
    port: PORT ? parseInt(PORT) : 3001,
    proxy: {
      [`${BASE_PATH}/client-metadata.json`]: {
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
    // Attach dynamic OAuth client metadata to vite runtime
    __OAUTH_CLIENT_METADATA__: clientMetadata,
    __OAUTH_CONFIG__: {
      ...(OAUTH_LOCALES ? { locales: OAUTH_LOCALES } : {}),
    },
  },
});
