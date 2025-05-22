const { HOST, BASE_PATH, CLIENT_METADATA_CLIENT_NAME } = process.env;
const host = HOST!.replace(/\/+$/, '');

export default {
  client_name: CLIENT_METADATA_CLIENT_NAME,
  client_id: `${host}/${BASE_PATH}/client-metadata.json`,
  client_uri: host,
  logo_uri: 'https://avatars.githubusercontent.com/u/192393975',
  redirect_uris: [host],
  scope: 'atproto transition:generic',
  grant_types: ['authorization_code', 'refresh_token'],
  response_types: ['code'],
  token_endpoint_auth_method: 'none',
  application_type: 'web',
  dpop_bound_access_tokens: true,
};
