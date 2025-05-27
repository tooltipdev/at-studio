export function ensureSingleLeadingSlash(input: string): string {
  return `/${input.replace(/^\/+/, '')}`;
}

export function ensureSingleTrailingSlash(input: string): string {
  return `${input.replace(/\/+$/, '')}/`;
}
