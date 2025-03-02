import { schemaDict } from '@atproto/api/dist/client/lexicons';
import { ZodOptional, ZodType, z } from 'zod';
import { metaMixin } from './utils';

export type LexiconSchemaKey = keyof typeof schemaDict;
export type ZodSchemaWrapper = {
  meta: () => { [key: string]: any };
};
export type WrappedZodType<T extends ZodType> = ZodSchemaWrapper & T;
export type WrappedZodOptional<T extends ZodType> = ZodOptional<WrappedZodType<T>>;

export const UnwrappedSavedFeedSchema = z.object({
  id: metaMixin(z.string(), { label: 'id' }),
  type: metaMixin(z.string(), { label: 'type' }),
  value: metaMixin(z.string(), { label: 'value' }),
  pinned: metaMixin(z.boolean(), { label: 'pinned' }),
});

export const SavedFeedSchema = metaMixin(
  z.object({
    id: metaMixin(z.string(), { label: 'id' }),
    type: metaMixin(z.string(), { label: 'type' }),
    value: metaMixin(z.string(), { label: 'value' }),
    pinned: metaMixin(z.boolean(), { label: 'pinned' }),
  })
);

export const UriSchema = metaMixin(z.string(), { label: 'uri' });
export const CidSchema = metaMixin(z.string(), { label: 'cid' });
export const DidSchema = metaMixin(z.string(), { label: 'did' });
export const ActorSchema = metaMixin(z.string(), { label: 'actor' });
export const MutedWordSchema = z.object({
  id: z.string(),
  value: z.string().describe('The muted word itself'),
  targets: z.array(z.string()).describe('The intended targets of the muted word'),
  actorTarget: z
    .string()
    .describe('Groups of users to apply the muted word to. If undefined, applies to all users.'),
  expiresAt: metaMixin(z.string(), { fieldType: 'date' }),
});
export const NuxSchema = z.object({
  id: z.string(),
  completed: z.boolean(),
  data: z.string().max(300).optional(),
  expiresAt: z.string().optional(),
});
