import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo-hooks';
import { parseError } from '../lib/parse-error';
import Layout from '../layouts/auth';
import ResetPassword from '../components/reset-password';

export const RESET_PASSWORD = gql`
  mutation($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      message
    }
  }
`;

const ResetPasswordPage = ({
  router: {
    query: { token: queryToken }
  }
}) => {
  const [messages, setMessages] = useState(null);
  const [token, setToken] = useState('');
  const resetPassword = useMutation(RESET_PASSWORD);

  useEffect(() => {
    setToken(queryToken);
  }, [queryToken]);

  return (
    <Layout>
      <ResetPassword
        token={token}
        messages={messages}
        onSubmit={async (currentValues, { setSubmitting }) => {
          const { password, repeatPassword, token: tokenValue } = currentValues;

          try {
            const {
              data: {
                ResetPassword: { message }
              }
            } = await resetPassword({
              variables: {
                input: { password, repeatPassword, tokenValue }
              }
            });

            setMessages({
              success: {
                password: message
              }
            });

            setToken('');

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

export default withRouter(ResetPasswordPage);

ResetPasswordPage.propTypes = {
  router: PropTypes.objectOf(PropTypes.object).isRequired
};
