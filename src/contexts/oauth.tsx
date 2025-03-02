import OAuthClient from '@/services/OAuthClient';
import React, { createContext, useEffect, useState } from 'react';

export type OAuthClientMetadata = {
  client: OAuthClient | null;
  isLoading: boolean;
  isLoadingError: boolean;
}

export const OAuthClientContext = createContext<OAuthClientMetadata>({client: null, isLoading: true, isLoadingError: false});
export default function OAuthClientProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<null | OAuthClient>(null)
  const [initFailed, setInitFailed] = useState(false)
  const initClient = async () => {
    try {
      const newClient = new OAuthClient()

      await newClient.init()

      newClient.events.on('SIGN_OUT', () => {
        initClient()
      })

      setClient(newClient)
    } catch (err) {
      console.log(err)
      setInitFailed(true)
    }
  }

  useEffect(() => {
    initClient();
  }, [])

  return (
    <OAuthClientContext.Provider value={{client, isLoading: !!!client, isLoadingError: initFailed}}>
      {children}
    </OAuthClientContext.Provider>
  );
};