import React from 'react';
import Router from 'next/router';
import 'styles/globals.css';
import type { AppProps } from 'next/app';
import Loading from '@/components/Loading';

function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    // Get loading element.
    let loadingEl: HTMLDivElement | null =
      document.querySelector(`#loadingComp`);
    // Hide loading element when the first load have finished.
    if (loadingEl) loadingEl.style.display = 'none';
    // Show loading element.
    const start = () => {
      setLoading(true);
      if (!loadingEl) loadingEl = document.querySelector(`#loadingComp`);
      if (loadingEl) loadingEl.style.display = 'flex';
    };
    // Hide loading element.
    const end = () => {
      setLoading(false);
      if (loadingEl) loadingEl.style.display = 'none';
    };
    // Add listener every time router change.
    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', end);
    Router.events.on('routeChangeError', end);
    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', end);
      Router.events.off('routeChangeError', end);
    };
  }, []);
  return (
    <>
      {!loading && <Component {...pageProps} />}
      <Loading />
    </>
  );
}

export default MyApp;
