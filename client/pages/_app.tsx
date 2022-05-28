import '../styles/extend.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useState } from 'react';

import AppHead from '../components/head';
import Header from '../components/header';

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
		<QueryClientProvider client={queryClient}>
			<div id="main-app-container" style={{ minHeight: '100vh' }}>
				<AppHead />
				<Header />
				<Component {...pageProps} />
				<ReactQueryDevtools initialIsOpen={false} />
			</div>
		</QueryClientProvider>
  );
}

export default MyApp;
