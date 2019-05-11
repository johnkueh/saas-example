import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import Link from 'next/link';
import Button from '../button';
import Alert from '../alert-messages';

const ResetPassword = ({ token, messages, onSubmit }) => {
  if (token)
    return (
      <Formik initialValues={{ token, password: '', repeatPassword: '' }} onSubmit={onSubmit}>
        {({ isSubmitting }) => (
          <Form className="mt-3">
            <Alert messages={messages} />
            <p className="mb-3">Set a new password for your account</p>
            <Field
              autoFocus
              name="password"
              className="form-control mb-3"
              type="password"
              placeholder="New password"
            />
            <Field
              name="repeatPassword"
              className="form-control mb-3"
              type="password"
              placeholder="Re-enter new password"
            />
            <Field data-testid="reset-password-token" name="token" type="hidden" />
            <div className="mt-4">
              <Button loading={isSubmitting} className="btn btn-block btn-primary" type="submit">
                Reset password
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    );

  return (
    <form>
      <Alert messages={messages} />
      <Link href="/login">
        <a href="/login" className="btn btn-block btn-primary">
          Go to login
        </a>
      </Link>
    </form>
  );
};

export default ResetPassword;

ResetPassword.propTypes = {
  token: PropTypes.string,
  messages: PropTypes.objectOf(PropTypes.object),
  onSubmit: PropTypes.func.isRequired
};

ResetPassword.defaultProps = {
  token: '',
  messages: null
};
