import React, { useState, useContext } from 'react';
import Router from 'next/router';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo-hooks';
import { AuthContext } from '../contexts/authentication';
import { parseError } from '../lib/parse-error';
import Layout from '../layouts/auth';
import Signup from '../components/sign-up';

const SIGNUP = gql`
  mutation($input: SignupInput!) {
    signup(input: $input) {
      jwt
      user {
        name
        email
      }
    }
  }
`;

const SignupPage = () => {
  const [messages, setMessages] = useState(null);
  const signUp = useMutation(SIGNUP);
  const { setUser, setJwt, setIsLoggedIn } = useContext(AuthContext);

  return (
    <Layout>
      <Signup
        messages={messages}
        onSubmit={async ({ email, name, password }, { setSubmitting }) => {
          try {
            const {
              data: {
                signup: { jwt, user }
              }
            } = await signUp({
              variables: {
                input: { email, name, password }
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

export default SignupPage;
