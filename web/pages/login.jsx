import React, { useContext, useState } from 'react';
import Router from 'next/router';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo-hooks';
import { AuthContext } from '../contexts/authentication';
import { parseError } from '../lib/parse-error';
import Layout from '../layouts/auth';
import Login from '../components/log-in';

const LOGIN = gql`
  mutation($input: LoginInput!) {
    login(input: $input) {
      jwt
      user {
        name
        email
      }
    }
  }
`;

const LoginPage = () => {
  const [messages, setMessages] = useState(null);
  const login = useMutation(LOGIN);
  const { setUser, setJwt, setIsLoggedIn } = useContext(AuthContext);

  return (
    <Layout>
      <Login
        messages={messages}
        onSubmit={async ({ email, password }, { setSubmitting }) => {
          try {
            const {
              data: {
                login: { jwt, user }
              }
            } = await login({
              variables: {
                input: { email, password }
              }
            });

            setJwt(jwt);
            setUser(user);
            setIsLoggedIn(true);

            Router.push('/forms');
          } catch (error) {
            setMessages({
              warning: parseError(error)
            });
            setSubmitting(false);
          }
        }}
      />
    </Layout>
  );
};

export default LoginPage;
