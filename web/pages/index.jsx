import React from 'react';
import Link from 'next/link';
import Layout from '../layouts/main';

const Home = () => {
  return (
    <Layout>
      <div className="container">
        <Link href="/">
          <h5 className="mb-3">saasexample.com</h5>
        </Link>
        <div>
          <Link href="/signup">
            <a href="/signup">Sign up</a>
          </Link>
        </div>
        <div>
          <Link href="/login">
            <a href="/login">Log in</a>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
