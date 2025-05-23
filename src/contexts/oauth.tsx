import OAuthClient from '@/services/OAuthClient';
import { createContext } from 'react';

export type OAuthClientMetadata = {
  client: OAuthClient | null;
  isLoading: boolean;
  isLoadingError: boolean;
};

export const OAuthClientContext = createContext<OAuthClientMetadata>({
  client: null,
  isLoading: true,
  isLoadingError: false,
});
