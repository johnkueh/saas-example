import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
import { ApolloProvider } from 'react-apollo-hooks';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { CloudinaryContext } from 'cloudinary-react';
import fetch from 'isomorphic-unfetch';
import config from '../app.config';
import { getItem } from '../lib/local-storage';
import AuthProvider from '../contexts/authentication';
import '../styles/index.scss';

if (!process.browser) {
  global.fetch = fetch;
}

const httpLink = createHttpLink({
  uri: config.API_URL
});

const authLink = setContext((_, { headers }) => {
  const token = getItem('jwt');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <AuthProvider>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <script src="https://widget.cloudinary.com/v2.0/global/all.js" type="text/javascript" />
          <script
            defer
            src="https://pro.fontawesome.com/releases/v5.8.1/js/all.js"
            integrity="sha384-GBwm0s/0wYcqnK/JmrCoRqWYIWzFiGEucsfFqkB76Ouii5+d4R31vWHPQtfhv55b"
            crossOrigin="anonymous"
          />
        </Head>
        <Container>
          <ApolloProvider client={client}>
            <CloudinaryContext cloudName={config.CLOUDINARY_CLOUD_NAME}>
              <Component {...pageProps} apolloClient={client} />
            </CloudinaryContext>
          </ApolloProvider>
        </Container>
      </AuthProvider>
    );
  }
}

export default MyApp;
