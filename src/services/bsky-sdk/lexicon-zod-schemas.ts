import { schemaDict as lexiconSchemas } from '@atproto/api/dist/client/lexicons';
import { ZodOptional, ZodSchema, ZodType, z } from 'zod';
import { metaMixin } from './utils';
import {
  ActorSchema,
  CidSchema,
  DidSchema,
  LexiconSchemaKey,
  MutedWordSchema,
  NuxSchema,
  SavedFeedSchema,
  UnwrappedSavedFeedSchema,
  UriSchema,
  WrappedZodOptional,
  WrappedZodType,
} from './types';

const targetLexiconSchemaKeys: Array<LexiconSchemaKey> = [
  // getTimeline
  'AppBskyFeedGetTimeline',
  // getAuthorFeed
  'AppBskyFeedGetAuthorFeed',
  // getActorLikes
  'AppBskyFeedGetActorLikes',
  // getPostThread
  'AppBskyFeedGetPostThread',
  // getPost
  'ComAtprotoRepoGetRecord',
  // getPosts
  'AppBskyFeedGetPosts',
  // getLikes
  'AppBskyFeedGetLikes',
  // getRepostedBy
  'AppBskyFeedGetRepostedBy',
  // getFollows
  'AppBskyGraphGetFollows',
  // getFollowers
  'AppBskyGraphGetFollowers',
  // getProfile
  'AppBskyActorGetProfile',
  // getProfiles
  'AppBskyActorGetProfiles',
  // getSuggestions
  'AppBskyActorGetSuggestions',
  // searchActors
  'AppBskyActorSearchActors',
  // searchActorsTypeahead
  'AppBskyActorSearchActorsTypeahead',
  // listNotifications
  'AppBskyNotificationListNotifications',
  // countUnreadNotifications
  'AppBskyNotificationGetUnreadCount',
  // getLabelers
  'AppBskyLabelerGetServices',
  // post
  'AppBskyFeedPost',
  // uploadBlob
  'ComAtprotoRepoUploadBlob',
  // getSuggestedFeeds
  'AppBskyFeedGetSuggestedFeeds',
  // getFeed
  'AppBskyFeedGetFeed',
  // muteActor
  'AppBskyGraphMuteActor',
  // unmuteActor
  'AppBskyGraphUnmuteActor',
];

function argsToArgSchema(
  argSet: Array<WrappedZodType<ZodType> | ZodType>,
  objMeta: { [key: string]: any } = {}
) {
  const argMap = argSet.reduce(
    (acc, wrappedZodSchema, i) => {
      acc[`$${i}`] = wrappedZodSchema;

      return acc;
    },
    {} as { [key: string]: any }
  );

  return metaMixin(
    z.object({
      __args__: metaMixin(z.object(argMap), { noLabel: true, noDepth: true }),
    }),
    objMeta
  );
}

const additionalZodSchemaMap = {
  deletePost: argsToArgSchema([UriSchema]),
  like: argsToArgSchema([UriSchema, CidSchema]),
  deleteLike: argsToArgSchema([UriSchema]),
  repost: argsToArgSchema([UriSchema, CidSchema]),
  deleteRepost: argsToArgSchema([UriSchema]),
  follow: argsToArgSchema([DidSchema]),
  deleteFollow: argsToArgSchema([UriSchema]),
  mute: argsToArgSchema([ActorSchema]),
  unmute: argsToArgSchema([ActorSchema]),
  muteModList: argsToArgSchema([UriSchema]),
  unmuteModList: argsToArgSchema([UriSchema]),
  blockModList: argsToArgSchema([UriSchema]),
  unblockModList: argsToArgSchema([UriSchema]),
  updateSeenNotifications: argsToArgSchema([
    metaMixin(z.string(), { fieldType: 'date', label: 'seenAt' }),
  ]),
  addLabeler: argsToArgSchema([metaMixin(z.string(), { label: 'did' })]),
  removeLabeler: argsToArgSchema([metaMixin(z.string(), { label: 'did' })]),
  setPersonalDetals: metaMixin(
    z.object({
      birthDate: metaMixin(z.string(), { fieldType: 'date' }),
    })
  ),
  hidePost: argsToArgSchema([metaMixin(z.string(), { label: 'postUri' })]),
  unhidePost: argsToArgSchema([metaMixin(z.string(), { label: 'postUri' })]),
  getPreferences: argsToArgSchema([
    metaMixin(z.string().optional(), { hidden: true, noDescription: true, noLabel: true }),
  ]),
  overwriteSavedFeeds: argsToArgSchema([
    metaMixin(z.array(SavedFeedSchema), { label: 'savedFeeds' }),
  ]),
  updateSavedFeeds: argsToArgSchema([metaMixin(z.array(SavedFeedSchema), { label: 'savedFeeds' })]),
  addSavedFeed: argsToArgSchema([metaMixin(UnwrappedSavedFeedSchema, { noLabel: true })]),
  removeSavedFeeds: argsToArgSchema([
    metaMixin(z.array(metaMixin(z.string())), { label: 'savedFeeds' }),
  ]),
  setAdultContentEnabled: argsToArgSchema([
    metaMixin(z.coerce.boolean(), { label: 'adult content enabled' }),
  ]),
  setContentLabelPref: argsToArgSchema([
    metaMixin(z.string(), { label: 'key' }),
    metaMixin(z.string(), { label: 'value' }),
    metaMixin(z.string().optional(), { label: 'labelerDid' }),
  ]),
  setPersonalDetails: metaMixin(
    z.object({
      birthDate: metaMixin(z.string().optional(), { label: 'birthDate' }),
    })
  ),
  setFeedViewPrefs: argsToArgSchema([
    metaMixin(z.string(), { label: 'feed' }),
    metaMixin(
      z.object({
        hideReplies: metaMixin(z.boolean(), { label: 'hideReplies' }),
        hideRepliesByUnfollowed: metaMixin(z.boolean(), { label: 'hideRepliesByUnfollowed' }),
        hideRepliesByLikeCount: metaMixin(z.coerce.number(), { label: 'hideRepliesByLikeCount' }),
        hideReposts: metaMixin(z.boolean(), { label: 'hideReposts' }),
        hideQuotePosts: metaMixin(z.boolean(), { label: 'hideQuotePosts' }),
      })
    ),
  ]),
  setThreadViewPrefs: metaMixin(
    z.object({
      sort: metaMixin(z.string(), { label: 'sort' }),
      prioritizeFollowedUsers: metaMixin(z.boolean(), { label: 'prioritizeFollowedUsers' }),
    })
  ),
  setInterestsPref: metaMixin(
    z.object({
      tags: metaMixin(z.string(), { label: 'tags' }),
    })
  ),
  addMutedWord: argsToArgSchema([metaMixin(MutedWordSchema, { noLabel: true, noDepth: true })]),
  addMutedWords: argsToArgSchema([z.array(MutedWordSchema)]),
  updateMutedWord: argsToArgSchema([metaMixin(MutedWordSchema, { noLabel: true, noDepth: true })]),
  removeMutedWord: argsToArgSchema([metaMixin(MutedWordSchema, { noLabel: true, noDepth: true })]),
  removeMutedWords: argsToArgSchema([z.array(MutedWordSchema)]),
  bskyAppQueueNudges: metaMixin(z.array(metaMixin(z.string())), { label: 'nudges' }),
  bskyAppDismissNudges: metaMixin(z.array(metaMixin(z.string())), { label: 'nudges' }),
  bskyAppSetActiveProgressGuide: z.object({
    guide: z.string().optional(),
  }),
  bskyAppUpsertNux: metaMixin(NuxSchema),
  bskyAppRemoveNuxs:argsToArgSchema([metaMixin(z.array(metaMixin(z.string())), { label: 'ids' })]),
};

/**
 * Infer a Lexicon field key from a Lexicon `ref` field
 * @param ref Lexicon reference
 * @returns string
 */
function lexiconRefToRefDefKey(ref: string) {
  return ref.split('#')[1] || 'main';
}

/**
 * Infer a LexiconSchemaKey schema key from a Lexicon `ref` field
 * @param ref Lexicon reference
 * @returns LexiconSchemaKey
 */
function lexiconRefToLexiconSchemaKey(ref: string): LexiconSchemaKey {
  return ref
    .replace('lex:', '')
    .split('#')[0]
    .split('.')
    .map((r) => r.charAt(0).toUpperCase() + r.slice(1))
    .join('') as LexiconSchemaKey;
}

function lexiconSchemaDefinitionToZodSchemaDefinition(
  lexiconSchemaDefinition: {
    [key: string]: any;
  },
  path: string,
  options?: { isRequired?: boolean }
): ZodSchema | null {
  const fieldOverride = lexiconFieldSchemaOverrideMap[path];
  const additionalPathMetadata = additionalZodSchemaFieldMetadataMap[path] || {};

  if (fieldOverride !== undefined) {
    if (fieldOverride === null) return null;

    return metaMixin(fieldOverride, additionalPathMetadata);
  }

  let zodSchema;
  let zodSchemaDescription = lexiconSchemaDefinition.description || '';

  switch (lexiconSchemaDefinition.type) {
    case 'integer':
      zodSchema = z.coerce.number();
      break;
    case 'boolean':
      zodSchema = z.boolean();
      break;
    case 'array':
      zodSchema = z.array(
        // Cannot override array definitions; will throw
        lexiconSchemaDefinitionToZodSchemaDefinition(
          lexiconSchemaDefinition.items,
          `${path}.__array__`
        )!
      );
      break;
    case 'object':
      {
        const nestedZodSchemaMap: { [key: string]: any } = {};

        Object.entries(lexiconSchemaDefinition.properties).forEach(
          ([lexiconFieldKey, nestedLexiconSchema]) => {
            const nestedPath = `${path}.${lexiconFieldKey}`;
            const nestedSchema = lexiconSchemaDefinitionToZodSchemaDefinition(
              nestedLexiconSchema as { [key: string]: any },
              nestedPath,
              {
                isRequired: lexiconSchemaDefinition.required?.includes(lexiconFieldKey),
              }
            );

            if (nestedSchema) nestedZodSchemaMap[lexiconFieldKey] = nestedSchema;
          }
        );

        zodSchema = z.object(
          Object.assign(nestedZodSchemaMap, additionalZodSchemaFieldMap[path] || {})
        );
      }
      break;
    case 'ref':
      {
        const lexicon = lexiconSchemas[lexiconRefToLexiconSchemaKey(lexiconSchemaDefinition.ref)];
        const lexiconDefKey = lexiconRefToRefDefKey(
          lexiconSchemaDefinition.ref
        ) as keyof typeof lexicon.defs;

        zodSchema = lexiconSchemaDefinitionToZodSchemaDefinition(
          lexicon.defs[lexiconDefKey],
          path,
          options
        );
      }
      break;
    case 'union':
      zodSchema = z.union(
        lexiconSchemaDefinition.refs.reduce((acc: Array<ZodSchema>, ref: string, i: number) => {
          const lexicon = lexiconSchemas[lexiconRefToLexiconSchemaKey(ref)];
          const lexiconDefKey = lexiconRefToRefDefKey(ref);
          const optionPath = `${path}.__union__.${i}`;
          const optionSchema = lexiconSchemaDefinitionToZodSchemaDefinition(
            lexicon.defs[lexiconDefKey as keyof typeof lexicon.defs],
            optionPath
          );

          if (optionSchema) acc.push(optionSchema);

          return acc;
        }, [])
      );
      break;
    case 'blob':
      zodSchema = metaMixin(
        z.object({
          $type: metaMixin(z.string().default('blob'), { readOnly: true }),
          mimeType: metaMixin(z.string()),
          size: metaMixin(z.coerce.number()),
          ref: metaMixin(
            z.object({
              $link: metaMixin(z.string()),
            })
          ),
        })
      );
      zodSchemaDescription = 'blob reference pointing to file upload';
      break;
    case 'string':
    default:
      zodSchema = z.string();
  }

  if (zodSchema) {
    /**
     * calling default or optional will redefine the schema, so we
     * will need to re mixin anything that may have the meta mixin
     */
    const currentMeta = (zodSchema as WrappedZodType<ZodType>).meta
      ? (zodSchema as WrappedZodType<ZodType>).meta()
      : {};

    zodSchema = zodSchema.describe(zodSchemaDescription);

    if (lexiconSchemaDefinition.default)
      zodSchema = zodSchema.default(lexiconSchemaDefinition.default);

    if (options?.isRequired !== true) zodSchema = zodSchema.optional();

    zodSchema = metaMixin(zodSchema, Object.assign({}, currentMeta, additionalPathMetadata));
  }

  return zodSchema;
}

/**
 * Infer a Zod schema from a Lexicon's JSON definition
 * @param lexiconSchema Lexicon JSON definition
 * @returns ZodSchema
 */
function lexiconSchemaToZodSchema(lexiconSchema: { [key: string]: any }): ZodSchema {
  const lexiconSchemaDefinition =
    lexiconSchema.defs?.main?.parameters ||
    lexiconSchema.defs?.main?.input?.schema ||
    (lexiconSchema.defs?.main?.type === 'record' && lexiconSchema.defs?.main.record);

  const sdkMethodKey = lexiconSchema.id.split('.').at(-1) as LexiconSchemaKey;

  if (
    lexiconFieldSchemaOverrideMap[sdkMethodKey] &&
    lexiconFieldSchemaOverrideMap[sdkMethodKey] !== null
  )
    return lexiconFieldSchemaOverrideMap[sdkMethodKey]!;

  let lexiconFieldZodSchemaMap: { [key: string]: any } = {};

  if (lexiconSchemaDefinition) {
    const lexiconSchemaFields: Array<[string, { [key: string]: any }]> = Object.entries(
      lexiconSchemaDefinition.properties || lexiconSchemaDefinition
    );

    for (const [lexiconFieldSchemaKey, lexiconFieldSchema] of lexiconSchemaFields) {
      const fieldPath = `${sdkMethodKey}.${lexiconFieldSchemaKey}`;

      let lexiconFieldZodSchema;

      lexiconFieldZodSchema = lexiconSchemaDefinitionToZodSchemaDefinition(
        lexiconFieldSchema,
        fieldPath,
        {
          isRequired: lexiconSchemaDefinition.required?.includes(lexiconFieldSchemaKey),
        }
      );

      if (lexiconFieldZodSchema !== null)
        lexiconFieldZodSchemaMap[lexiconFieldSchemaKey] = lexiconFieldZodSchema;
    }
  } else {
    const additionalFieldMap = additionalZodSchemaFieldMap[sdkMethodKey];

    if (additionalFieldMap) lexiconFieldZodSchemaMap = additionalFieldMap;
  }

  return metaMixin(
    z.object(lexiconFieldZodSchemaMap),
    additionalZodSchemaFieldMetadataMap[sdkMethodKey] || {}
  );
}

/**
 * Override the inferred Zod schema for a Lexicon field.
 * Useful for when a Lexicon schema cannot be inferred
 * is incomplete, or is lacking fields required by the SDK.
 *
 * Providing `null` will omit the field from the inferred Zod schema.
 */
const lexiconFieldSchemaOverrideMap: {
  [key: string]:
    | null
    | ZodType
    | ZodOptional<ZodType>
    | WrappedZodOptional<ZodType>
    | WrappedZodType<ZodType>;
} = {
  'post.entities': null,
  'post.createdAt': null,
  uploadBlob: metaMixin(
    z.object({
      __file__: metaMixin(z.any(), { fieldType: 'file', label: 'file upload' }),
    })
  ),
};

/**
 * Override the SDK method key inferred from a Lexicon's ref key.
 * Useful for when an inferred key doesn't align with provided SDK method keys.
 */
const sdkMethodKeyOverrideMap: { [key: string]: any } = {
  getServices: 'getLabelers',
};

const additionalZodSchemaFieldMap: { [key: string]: any } = {
  'post.embed.__union__.0': {
    $type: metaMixin(z.string().default('app.bsky.embed.images'), { readOnly: true }),
  },
  'post.embed.__union__.1': {
    $type: metaMixin(z.string().default('app.bsky.embed.video'), { readOnly: true }),
  },
  'post.embed.__union__.2': {
    $type: metaMixin(z.string().default('app.bsky.embed.external'), { readOnly: true }),
  },
  'post.embed.__union__.3': {
    $type: metaMixin(z.string().default('app.bsky.embed.record'), { readOnly: true }),
  },
  'post.embed.__union__.4': {
    $type: metaMixin(z.string().default('app.bsky.embed.recordWithMedia'), { readOnly: true }),
  },
};

const additionalZodSchemaFieldMetadataMap: { [key: string]: any } = {
  'post.embed.__union__.0': { key: 'Image' },
  'post.embed.__union__.1': { key: 'Video' },
  'post.embed.__union__.2': { key: 'External' },
  'post.embed.__union__.3': { key: 'Record' },
  'post.embed.__union__.4': { key: 'Record+Media' },
  'post.facets.__array__.features.__array__.__union__.0': { key: 'did' },
  'post.facets.__array__.features.__array__.__union__.1': { key: 'uri' },
  'post.facets.__array__.features.__array__.__union__.2': { key: 'tag' },
};

const zodSchemaMap: { [key: string]: any } = additionalZodSchemaMap;

/**
 * Iterate through Lexicon schema keys we want represented in
 * the UI as SDK actions and add their Zod schemas to zodSchemaMap.
 */
for (const lexiconSchemaKey of targetLexiconSchemaKeys) {
  const schema: { [key: string]: any } = lexiconSchemas[lexiconSchemaKey];
  const sdkMethodKey = schema.id.split('.').at(-1) as LexiconSchemaKey;

  zodSchemaMap[sdkMethodKeyOverrideMap[sdkMethodKey] || sdkMethodKey] =
    lexiconSchemaToZodSchema(schema);
}

// unsupported SDK methods: upsertProfile, setPostInteractionSettings
export default zodSchemaMap;
