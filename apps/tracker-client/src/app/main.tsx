import { NetworkErrorNotifier } from './components/network-error-notifier';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Providers } from './providers';
import { FetchInterceptors } from './components/fetch-interceptors';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <NetworkErrorNotifier />
      <FetchInterceptors>
        <RouterProvider router={router} />
      </FetchInterceptors>
    </Providers>
  </StrictMode>,
);
