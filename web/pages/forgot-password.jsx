import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo-hooks';
import { parseError } from '../lib/parse-error';
import Layout from '../layouts/auth';
import ForgotPassword from '../components/forgot-password';

export const FORGOT_PASSWORD = gql`
  mutation($input: ForgotPasswordInput!) {
    forgotPassword(input: $input) {
      message
    }
  }
`;

const ForgotPasswordPage = () => {
  const [messages, setMessages] = useState(null);
  const forgotPassword = useMutation(FORGOT_PASSWORD);

  return (
    <Layout>
      <ForgotPassword
        messages={messages}
        onSubmit={async (currentValues, { setSubmitting }) => {
          const { email } = currentValues;

          try {
            const {
              data: {
                forgotPassword: { message }
              }
            } = await forgotPassword({
              variables: {
                input: { email }
              }
            });

            setMessages({
              success: {
                email: message
              }
            });

            setSubmitting(false);
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

export default ForgotPasswordPage;
