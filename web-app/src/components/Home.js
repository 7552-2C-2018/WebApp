import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Layout from './Layout';
import Table from './Table';
import { requestData } from '../utils/mockData';
import isLoggedIn from '../utils/isLoggedIn';

const columns = [
  {
    Header: "First Name",
    accessor: "firstName"
  },
  {
    Header: "Last Name",
    id: "lastName",
    accessor: d => d.lastName
  },
  {
    Header: "Age",
    accessor: "age"
  }
];

const Home = () => {
  if (!isLoggedIn()) {
    return <Redirect to="/login" />;
  }
  return (
    <Layout title="Home">
      <Table requestData={requestData} columns={columns} />
    </Layout>
  );
};

export default Home;