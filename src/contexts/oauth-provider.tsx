import OAuthClient, { OAuthClientServiceOptions } from '@/services/OAuthClient';
import React, { useEffect, useState } from 'react';
import { OAuthClientContext } from './oauth';

export default function OAuthClientProvider({ children }: { children: React.ReactNode }) {
    const [client, setClient] = useState<null | OAuthClient>(null);
    const [initFailed, setInitFailed] = useState(false);
  
    const initClient = async () => {
      try {
        const options: OAuthClientServiceOptions = {
          entryway: __OAUTH_CONFIG__.entryway,
          locales: __OAUTH_CONFIG__.locales,
        };
  
        const newClient = new OAuthClient(__OAUTH_CLIENT_METADATA__, options);
  
        await newClient.init();
  
        newClient.events.on('SIGN_OUT', () => {
          initClient();
        });
  
        setClient(newClient);
      } catch (err) {
        console.log(err);
        setInitFailed(true);
      }
    };
  
    useEffect(() => {
      initClient();
    }, []);
  
    return (
      <OAuthClientContext.Provider
        value={{ client, isLoading: client ? false : true, isLoadingError: initFailed }}
      >
        {children}
      </OAuthClientContext.Provider>
    );
  }
  