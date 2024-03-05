// pages/_app.tsx
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { FC } from 'react'; // Import FC (FunctionComponent) type
import store from '../store';

import '../styles/globals.css';

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default MyApp;
