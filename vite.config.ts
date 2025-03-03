import path from 'path';
import react from '@vitejs/plugin-react';
import { ServerOptions, defineConfig } from 'vite';
import assert from 'assert';
import clientMetadata from './client-metadata';
import { IncomingMessage, ServerResponse } from 'http';

const { HOST, PORT } = process.env;

assert(HOST, 'HOST is not defined');

export default defineConfig({
  base: '/oauth-playground/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    allowedHosts: true,
    port: PORT ? parseInt(PORT): 3001,
    proxy: {
      // Serve dynamic OAuth client metadata from local dev environment
      '/client-metadata.json': {
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
  },
});
