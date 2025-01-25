// pages/_app.tsx
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme/theme';
import store from '../redux/store';
import Layout from '../layouts/Layout';
import ErrorBoundary from '../components/ErrorBoundary';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary fallback={<p>We&apos;re currently experiencing a problem with our servers.</p>}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  );
};

export default MyApp;
