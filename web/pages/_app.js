import App, { Container } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import ReactGA from 'react-ga';
import { CloudinaryContext } from 'cloudinary-react';
import withApolloClient from '../lib/with-apollo-client';
import AuthProvider from '../contexts/authentication';
import '../styles/index.scss';

class MyApp extends App {
  componentDidMount() {
    // ReactGA.initialize('UA-137555254-1');
    // ReactGA.pageview(window.location.pathname + window.location.search);
  }

  render() {
    const { Component, pageProps, apolloClient } = this.props;
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
          <ApolloProvider client={apolloClient}>
            <ApolloHooksProvider client={apolloClient}>
              <CloudinaryContext cloudName={process.env.CLOUDINARY_CLOUD_NAME}>
                <Component {...pageProps} />
              </CloudinaryContext>
            </ApolloHooksProvider>
          </ApolloProvider>
        </Container>
      </AuthProvider>
    );
  }
}

export default withApolloClient(MyApp);
