import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import Router from 'next/router';
import PageLoading from '../components/page-loading';
import { AuthContext } from '../contexts/authentication';

const Logout = ({ client }) => {
  const { setUser, setJwt, setIsLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    setUser(null);
    setJwt(null);
    setIsLoggedIn(false);
    client.resetStore();

    Router.push('/login');
  });

  return <PageLoading title="Logging out..." />;
};

export default withApollo(Logout);

Logout.propTypes = {
  client: PropTypes.objectOf(PropTypes.any).isRequired
};
