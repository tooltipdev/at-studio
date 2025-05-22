const { HOST } = process.env;

export default {
  client_name: 'bsky Labs: OAuth2 Playground',
  client_id: `${HOST}client-metadata.json`,
  client_uri: HOST,
  logo_uri: 'https://avatars.githubusercontent.com/u/192393975',
  redirect_uris: [HOST],
  scope: 'atproto transition:generic',
  grant_types: ['authorization_code', 'refresh_token'],
  response_types: ['code'],
  token_endpoint_auth_method: 'none',
  application_type: 'web',
  dpop_bound_access_tokens: true,
};
