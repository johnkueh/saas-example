import React from 'react';
import Link from 'next/link';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';
import Layout from '../layouts/logged-in';
import Forms from '../components/forms';

export const FORMS = gql`
  query {
    forms {
      id
      name
    }
  }
`;

const FormsPage = () => {
  const {
    data: { forms },
    loading
  } = useQuery(FORMS);

  return (
    <Layout>
      <h2>Welcome to BriefGenius</h2>
      {loading ? <div>Loading...</div> : <Forms forms={forms} />}
      <Link href="/forms/new">
        <a href="/forms/new" className="mt-3 btn btn-primary">
          Create a form
        </a>
      </Link>
    </Layout>
  );
};

export default FormsPage;
