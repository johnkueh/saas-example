import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import PageLoading from '../components/page-loading';
import { AuthContext } from '../contexts/authentication';

const Logout = ({ apolloClient }) => {
  const { setUser, setJwt, setIsLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    setUser(null);
    setJwt(null);
    setIsLoggedIn(false);
    apolloClient.resetStore();

    Router.push('/login');
  });

  return <PageLoading title="Logging out..." />;
};

export default Logout;

Logout.propTypes = {
  apolloClient: PropTypes.objectOf(PropTypes.any).isRequired
};
