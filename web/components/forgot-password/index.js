import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import Link from 'next/link';
import Button from '../button';
import Alert from '../alert-messages';

const ForgotPassword = ({ messages, onSubmit }) => (
  <Formik initialValues={{ email: '' }} onSubmit={onSubmit}>
    {({ isSubmitting }) => (
      <Form className="mt-3">
        <Alert messages={messages} />
        <p className="mb-3">Enter your email address to request for a password reset</p>
        <Field
          id="email"
          name="email"
          autoFocus
          className="form-control mb-3"
          type="email"
          placeholder="Email address"
        />
        <div className="mt-4">
          <Button loading={isSubmitting} className="btn btn-block btn-primary" type="submit">
            Submit
          </Button>
        </div>
        <div className="mt-3">
          Dont have an account?&nbsp;
          <Link href="/signup">
            <a href="/signup">Sign up</a>
          </Link>
        </div>
      </Form>
    )}
  </Formik>
);

export default ForgotPassword;

ForgotPassword.propTypes = {
  messages: PropTypes.objectOf(PropTypes.object),
  onSubmit: PropTypes.func.isRequired
};

ForgotPassword.defaultProps = {
  messages: null
};
