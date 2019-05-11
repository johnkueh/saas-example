import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import Link from 'next/link';
import Button from '../button';
import Alert from '../alert-messages';

const LogIn = ({ messages, onSubmit }) => (
  <Formik initialValues={{ email: '', password: '' }} onSubmit={onSubmit}>
    {({ isSubmitting }) => (
      <Form className="mt-3">
        <Alert messages={messages} />
        <Field
          autoFocus
          name="email"
          className="form-control mb-3"
          type="email"
          placeholder="Email address"
        />
        <Field
          name="password"
          className="form-control mb-3"
          type="password"
          placeholder="Password"
        />
        <div className="mt-4">
          <Button
            loading={isSubmitting}
            loadingText="Logging in..."
            className="btn btn-block btn-primary"
            type="submit"
          >
            Log in
          </Button>
        </div>
        <div className="mt-3">
          <div>
            Dont have an account?&nbsp;
            <Link href="/signup">
              <a href="/signup">Sign up</a>
            </Link>
          </div>
          <div className="mt-1">
            <Link href="/forgot-password">
              <a href="/forgot-password">Forgot your password?</a>
            </Link>
          </div>
        </div>
      </Form>
    )}
  </Formik>
);

export default LogIn;

LogIn.propTypes = {
  messages: PropTypes.objectOf(PropTypes.object),
  onSubmit: PropTypes.func.isRequired
};

LogIn.defaultProps = {
  messages: null
};
