import React, { useState } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Link from 'next/link';
import { Formik, Form, Field } from 'formik';
import { useQuery, useMutation } from 'react-apollo-hooks';
import { withRouter } from 'next/router';
import { FORMS } from '../forms';
import { parseError } from '../../lib/parse-error';
import Button from '../../components/button';
import FormLogos from '../../components/form-logos';
import Alert from '../../components/alert-messages';
import Layout from '../../layouts/logged-in';

const FormEdit = ({
  router: {
    push,
    query: { id }
  }
}) => {
  const [deleting, setDeleting] = useState(false);
  const [messages, setMessages] = useState(null);
  const updateForm = useMutation(UPDATE_FORM);
  const deleteForm = useMutation(DELETE_FORM);
  const {
    data: { form = {} }
  } = useQuery(FORM, { variables: { id } });

  if (!form.id) return <Layout />;

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12">
          <div className="mb-3">
            <div>
              <Link href="/forms">
                <a href="/forms">Back to all forms</a>
              </Link>
            </div>
            <Button
              data-testid="delete-form"
              loading={deleting}
              loadingText="Deleting..."
              className="btn btn-link p-0"
              type="button"
              onClick={async () => {
                const { loading: deletingState } = await deleteForm({
                  variables: { id },
                  refetchQueries: [{ query: FORMS }]
                });
                setDeleting(deletingState);
                push('/forms');
              }}
            >
              Delete this form
            </Button>
          </div>
          <h2 className="my-3">Edit form</h2>
          <Formik
            initialValues={{ id: form.id, name: form.name }}
            onSubmit={async (currentValues, { setSubmitting }) => {
              setMessages(null);
              try {
                await updateForm({
                  variables: {
                    input: currentValues
                  }
                });
                push(`/form?id=${form.id}`);
              } catch (error) {
                setMessages({
                  warning: parseError(error)
                });
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="mb-3">
                <Alert messages={messages} />
                <label htmlFor="nameInput">Name</label>
                <Field
                  id="nameInput"
                  data-testid="form-input-name"
                  name="name"
                  className="form-control mb-3"
                  type="text"
                />
                <div className="mt-3">
                  <Button
                    data-testid="save-form"
                    loading={isSubmitting}
                    loadingText="Updating..."
                    className="btn btn-primary"
                    type="submit"
                  >
                    Save
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
          <FormLogos />
        </div>
      </div>
    </Layout>
  );
};

export const FORM = gql`
  query($id: String!) {
    form(id: $id) {
      id
      name
      logos {
        assetId
      }
    }
  }
`;

export const UPDATE_FORM = gql`
  mutation($input: UpdateFormInput!) {
    updateForm(input: $input) {
      id
      name
      logos {
        assetId
      }
    }
  }
`;

export const DELETE_FORM = gql`
  mutation($id: String!) {
    deleteForm(id: $id) {
      id
      name
      logos {
        assetId
      }
    }
  }
`;

export const DELETE_LOGO = gql`
  mutation($assetId: String!) {
    deleteLogo(assetId: $assetId) {
      id
      assetId
    }
  }
`;

export default withRouter(FormEdit);

FormEdit.propTypes = {
  router: PropTypes.objectOf(PropTypes.any).isRequired
};
