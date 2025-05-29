## Installation

- Clone the repository
- Navigate to the project directory
- Run `nvm use` to activate the required Node.js version
- Install dependencies using `npm i`

## Configuration

- Copy `.env.sample` to a new file named `.env`
- Populate the `.env` file with appropriate values
- Refer to the _Environment Variables_ section for details, including required variables

## Local Development

- Create a local tunnel and note the resulting public URI
  - Point the tunnel to the port specified by `LOCAL_DEV_PORT` (default: `3001`)
- Set the `LOCAL_DEV_PORT` variable, or allow it to default to `3001`
- Set the `LOCAL_BASE_PATH` variable
- Set the `OAUTH_CLIENT_METADATA_CLIENT_URI` variable
  - Format: `${your local tunnel URI}${LOCAL_BASE_PATH}/`
- Start the local development server
  - Run `npm run dev`
- Access the app via the value of `OAUTH_CLIENT_METADATA_CLIENT_URI`

## Local Preview

- Create a local tunnel and note the resulting public URI
  - Point the tunnel to port `4173`
- Set the `LOCAL_BASE_PATH` variable
- Set the `OAUTH_CLIENT_METADATA_CLIENT_URI` variable
  - Format: `${your local tunnel URI}${LOCAL_BASE_PATH}/`
- Run the preview command
  - Execute `npm run preview`
  - Internally runs `npm run build:dev`
  - Launches the Vite preview server
  - Runs on port `4173`
- Access the app via the value of `OAUTH_CLIENT_METADATA_CLIENT_URI`

## Manual Build

- Set the `OAUTH_CLIENT_METADATA_CLIENT_URI` variable
- Run the build command
  - With `.env`: Execute `npm run build:dev`
  - With exported env vars (prod): `npm run build`
  - Generates output JavaScript
  - Produces the `client-metadata.json` file
- Build output is saved to the `/dist` directory

## Manual Deployment

- Set the required environment variables
- Run the build command
- Deploy the contents of the `/dist` directory to your hosting destination

## GitHub Action Deployment

- Create a branch named `gh-pages`
- Configure GitHub Pages to use the `gh-pages` branch
- Set environment variables in the GitHub Actions workflow, environment settings, or secrets
- Manually trigger the deployment action via the GitHub Actions dashboard

# Environment Variables

Refer to `.env.sample` for a template.

## Required Env Vars

### `OAUTH_CLIENT_METADATA_CLIENT_URI`

- The `client_uri` value from the ATProto OAuth `client-metadata.json`
- Required for build, local server, and preview server

### `LOCAL_BASE_PATH`

- Base path used by the local and preview servers (e.g., `/bsky-oauth-playground/`)
- Required for local and preview servers

## Optional Env Vars

### `LOCAL_DEV_PORT`

- Port used by the local development server
- defaults to `3001`

### `OAUTH_CLIENT_METADATA_CLIENT_NAME`

- The `client_name` value from the ATProto OAuth `client-metadata.json`

### `OAUTH_CLIENT_METADATA_LOGO_URI`

- The `logo_uri` value from the ATProto OAuth `client-metadata.json`

### `OAUTH_CLIENT_METADATA_GRANT_TYPES_CSV`

- Comma-separated list of `grant_types` for the ATProto OAuth `client-metadata.json`
- Defaults to `authorization_code, refresh_token`

### `OAUTH_CLIENT_METADATA_SCOPES`

- The `scopes` value from the ATProto OAuth `client-metadata.json`
- Defaults to `atproto transition:generic`

### `OAUTH_CLIENT_METADATA_REDIRECT_URIS_CSV`

- Comma-separated list of `redirect_uris` for the ATProto OAuth `client-metadata.json`
- Defaults to the value of `OAUTH_CLIENT_METADATA_CLIENT_URI`

### `OAUTH_LOCALES`

- Locales configuration for the `@atproto/oauth-client-browser` client
- Defaults to the SDK’s built-in locales

### `OAUTH_PDS_ENTRYWAY`

- `handleResolver` value for the `@atproto/oauth-client-browser` client
- Defaults to `https://bsky.social`

### `VITE_APP_VERSION`

- Semantic version string of the application
- Displayed in the UI

### `VITE_GITHUB_LINK`

- URL pointing to project GitHub repository
- Linked in the UI

# Contribution

Feel free to fork and contribute. PRs will be reviewed.
