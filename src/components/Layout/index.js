import React from 'react';
import PropTypes from 'prop-types';
import Header from './../Header';

const Layout = (props) => {
  const { title, children } = props;
  return (
    <div className="app">
      <Header />
      <div className="container">
        <div className="section-header">
          <h1>{title}</h1>
        </div>
        {props.children}
      </div>
    </div>
  );
};

export default Layout;