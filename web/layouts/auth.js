import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const AuthLayout = ({ children }) => (
  <div className="container p-5">
    <div className="row">
      <div className="col-md-4 offset-md-4">
        <div className="card border-0 p-4 bg-light">
          <div className="my-3 text-center">
            <Link href="/">
              <a href="/">
                <h3>briefgenius</h3>
              </a>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  </div>
);

export default AuthLayout;

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired
};
