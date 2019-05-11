import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Router from 'next/router';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';
import { AuthContext } from '../contexts/authentication';
import PageLoading from '../components/page-loading';
import MainLayout from './main';

const ME = gql`
  query {
    me {
      name
      email
    }
  }
`;

const LoggedInLayout = ({ children }) => {
  const {
    isLoggedIn,
    user: { email }
  } = useContext(AuthContext);
  const { error, loading } = useQuery(ME);

  useEffect(() => {
    if (!isLoggedIn || error) {
      Router.push('/login');
    }
  });

  if (!loading && isLoggedIn) {
    return (
      <MainLayout>
        <Link href="/">
          <a href="/">
            <h3>briefgenius</h3>
          </a>
        </Link>
        <div className="my-5">{children}</div>
        <Link href="/logout">
          <a href="/logout">Logout</a>
        </Link>
        &nbsp;
        <span>
          &#40;
          {email}
          &#41;
        </span>
      </MainLayout>
    );
  }

  if (loading) {
    return <PageLoading />;
  }

  return null;
};

export default LoggedInLayout;

LoggedInLayout.propTypes = {
  children: PropTypes.node.isRequired
};
