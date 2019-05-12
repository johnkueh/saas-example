import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Link from 'next/link';
import { useQuery } from 'react-apollo-hooks';
import { withRouter } from 'next/router';
import FormLogos from '../components/form-logos';
import Layout from '../layouts/logged-in';

const FormPage = ({
  router: {
    push,
    query: { id }
  }
}) => {
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
            <Link href={`/form/edit?id=${form.id}`}>
              <a data-testid="edit-form-link" href={`/form/edit?id=${form.id}`}>
                Edit this form
              </a>
            </Link>
          </div>
          <h2 data-testid="form-name" className="my-3">
            {form.name}
          </h2>
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

export default withRouter(FormPage);

FormPage.propTypes = {
  router: PropTypes.objectOf(PropTypes.any).isRequired
};
