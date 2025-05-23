const {
  HOST,
  BASE_PATH,
  OAUTH_CLIENT_METADATA_CLIENT_NAME,
  OAUTH_CLIENT_METADATA_AVATAR_URI,
  OAUTH_CLIENT_METADATA_GRANT_TYPES_CSV,
  OAUTH_CLIENT_METADATA_SCOPES,
} = process.env;

const host = HOST!.replace(/\/+$/, '');
const uri = `${host}${BASE_PATH}/`;
const grantTypes = OAUTH_CLIENT_METADATA_GRANT_TYPES_CSV
  ? OAUTH_CLIENT_METADATA_GRANT_TYPES_CSV.split(',').map((type) => type.trim())
  : ['authorization_code', 'refresh_token'];

export default {
  client_name: OAUTH_CLIENT_METADATA_CLIENT_NAME || 'bsky-oauth-playground',
  client_id: `${uri}client-metadata.json`,
  client_uri: uri,
  logo_uri: OAUTH_CLIENT_METADATA_AVATAR_URI || '',
  redirect_uris: [uri],
  scope: OAUTH_CLIENT_METADATA_SCOPES || 'atproto transition:generic',
  grant_types: grantTypes,
  response_types: ['code'],
  token_endpoint_auth_method: 'none',
  application_type: 'web',
  dpop_bound_access_tokens: true,
};
