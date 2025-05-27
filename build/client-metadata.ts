import assert from "assert";

const {
  OAUTH_CLIENT_METADATA_CLIENT_NAME,
  OAUTH_CLIENT_METADATA_LOGO_URI,
  OAUTH_CLIENT_METADATA_GRANT_TYPES_CSV,
  OAUTH_CLIENT_METADATA_SCOPES,
  OAUTH_CLIENT_METADATA_REDIRECT_URIS_CSV,
  OAUTH_CLIENT_METADATA_CLIENT_URI
} = process.env;

assert(OAUTH_CLIENT_METADATA_CLIENT_URI, 'OAUTH_CLIENT_METADATA_CLIENT_URI not defined');

const grantTypes = OAUTH_CLIENT_METADATA_GRANT_TYPES_CSV
  ? OAUTH_CLIENT_METADATA_GRANT_TYPES_CSV.split(',').map((type) => type.trim())
  : ['authorization_code', 'refresh_token'];
const redirectUris = OAUTH_CLIENT_METADATA_REDIRECT_URIS_CSV
  ? OAUTH_CLIENT_METADATA_REDIRECT_URIS_CSV.split(',').map((uri) => uri.trim())
  : [OAUTH_CLIENT_METADATA_CLIENT_URI];

export default {
  client_name: OAUTH_CLIENT_METADATA_CLIENT_NAME || 'OAuth Playground: Local Development Server',
  client_id: `${OAUTH_CLIENT_METADATA_CLIENT_URI}client-metadata.json`,
  client_uri: OAUTH_CLIENT_METADATA_CLIENT_URI,
  logo_uri: OAUTH_CLIENT_METADATA_LOGO_URI || '',
  redirect_uris: redirectUris,
  scope: OAUTH_CLIENT_METADATA_SCOPES || 'atproto transition:generic',
  grant_types: grantTypes,
  response_types: ['code'],
  token_endpoint_auth_method: 'none',
  application_type: 'web',
  dpop_bound_access_tokens: true,
};
