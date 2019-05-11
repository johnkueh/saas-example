import { getItem } from './local-storage';
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import introspectionQueryResultData from './fragment-types.json';
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
});

// From https://raw.githubusercontent.com/zeit/next.js/master/examples/with-apollo/lib/init-apollo.js
import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost';
import { ApolloLink, concat } from 'apollo-link';
import fetch from 'isomorphic-unfetch';

let apolloClient = null;

const httpLink = new HttpLink({
  uri: '/api/graphql' // Server URL (must be absolute)
});

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  if (process.browser) {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${getItem('jwt')}`
      }
    });
  }

  return forward(operation);
});

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch;
}

function create(initialState) {
  console.log('httpLink', httpLink);
  console.log('httpLink.uri', httpLink.uri);
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: concat(authMiddleware, httpLink),
    cache: new InMemoryCache({ fragmentMatcher }).restore(initialState || {})
  });
}

export default function initApollo(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
}
