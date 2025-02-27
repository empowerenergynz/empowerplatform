import { createRoot } from 'react-dom/client';
import React from 'react';
import { ChakraProvider, GlobalStyle } from '@chakra-ui/react';
import { Global } from '@emotion/react';
import globalStyles from 'src/styles';
import theme from 'src/Theme';
import { InertiaProgress } from '@inertiajs/progress';
import { createInertiaApp } from '@inertiajs/inertia-react';
import Loading from 'src/Pages/Loading';
import Layout from 'src/Layouts/Layout';
import { createStandaloneToast } from '@chakra-ui/toast';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import * as process from 'process';

if (
  process.env.MIX_APP_ENV &&
  ['test', 'stage', 'production'].includes(process.env.MIX_APP_ENV)
) {
  Sentry.init({
    dsn: process.env.MIX_SENTRY_LARAVEL_DSN,
    integrations: [new Integrations.BrowserTracing()],

    // We recommend adjusting this value in production, or using tracesSampler for finer control
    tracesSampleRate: parseFloat(
      process.env.MIX_SENTRY_TRACES_SAMPLE_RATE || '0.05'
    ),

    release: `empower-energy-${process.env.MIX_COMMIT_HASH}`,
  });
}

const { ToastContainer } = createStandaloneToast();

const layout = (page: JSX.Element) => <Layout>{page}</Layout>;

InertiaProgress.init();

createInertiaApp({
  resolve: (name) =>
    import(`./Pages/${name}`).then((module) => {
      const page = module.default;
      page.layout = page.layout || layout;
      return page;
    }),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  setup({ el, App, props }) {
    const root = createRoot(el);
    root.render(
      <ChakraProvider theme={theme}>
        <Global styles={globalStyles} />
        <GlobalStyle />
        <App
          {...props}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          initialComponent={Loading as any}
          initialPage={JSON.parse(el?.dataset.page || '')}
        />
        <ToastContainer />
      </ChakraProvider>
    );
  },
});
