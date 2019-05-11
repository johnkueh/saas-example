import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo-hooks';
import Router from 'next/router';
import Link from 'next/link';
import { FORMS } from '../forms';
import { parseError } from '../../lib/parse-error';
import Alert from '../../components/alert-messages';
import Layout from '../../layouts/logged-in';

export const CREATE_FORM = gql`
  mutation($input: CreateFormInput!) {
    createForm(input: $input) {
      id
      name
    }
  }
`;

const NewForm = () => {
  const [name, setName] = useState('');
  const [messages, setMessages] = useState(null);
  const create = useMutation(CREATE_FORM);

  return (
    <Layout>
      <div className="row">
        <div className="col-md-8">
          <div className="mb-3">
            <Link href="/forms">
              <a href="/forms">Back to all forms</a>
            </Link>
          </div>
          <h2 className="mb-3">Add a new form</h2>
          <Alert messages={messages} />
          <p className="text-muted">What should we call this form?</p>
          <form
            onSubmit={async e => {
              e.preventDefault();
              try {
                await create({
                  variables: {
                    input: {
                      name
                    }
                  },
                  refetchQueries: [{ query: FORMS }]
                });
                Router.push('/forms');
              } catch (error) {
                setMessages({
                  warning: parseError(error)
                });
              }
            }}
          >
            <input
              data-testid="new-form-input-name"
              value={name}
              onChange={e => setName(e.target.value)}
              type="text"
              className="form-control mb-3"
            />
            <button data-testid="new-form-submit" type="submit" className="mt-3 btn btn-primary">
              Create form
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NewForm;
