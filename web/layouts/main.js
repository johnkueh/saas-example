import React from 'react';
import PropTypes from 'prop-types';

const MainLayout = ({ children }) => <div className="container py-5">{children}</div>;

export default MainLayout;

MainLayout.propTypes = {
  children: PropTypes.node.isRequired
};
