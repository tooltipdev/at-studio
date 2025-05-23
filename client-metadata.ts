const { HOST, BASE_PATH, OAUTH_CLIENT_METADATA_CLIENT_NAME } = process.env;
const host = HOST!.replace(/\/+$/, '');
const uri = `${host}${BASE_PATH}/`;

export default {
  client_name: OAUTH_CLIENT_METADATA_CLIENT_NAME || 'bsky-oauth-playground',
  client_id: `${uri}client-metadata.json`,
  client_uri: uri,
  logo_uri: 'https://avatars.githubusercontent.com/u/192393975',
  redirect_uris: [uri],
  scope: 'atproto transition:generic',
  grant_types: ['authorization_code', 'refresh_token'],
  response_types: ['code'],
  token_endpoint_auth_method: 'none',
  application_type: 'web',
  dpop_bound_access_tokens: true,
};
