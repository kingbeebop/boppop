// pages/_app.tsx
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '../redux/store';
import Layout from '../components/Layout';
import ErrorBoundary from '../components/ErrorBoundary'; // Import the ErrorBoundary component
import '../styles/globals.css';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <ErrorBoundary fallback={<p>We&apos;re currently experiencing a problem with our servers.</p>}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ErrorBoundary>
    </Provider>
  );
};

export default MyApp;
