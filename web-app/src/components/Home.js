import React from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import Table from './Table';
import { requestData } from '../utils/mockData';

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
  return (
    <Layout title="Home">
      <p>Hello World of React and Webpack! Hot reloaded</p>
      <Table requestData={requestData} columns={columns} />
    </Layout>
  );
};

export default Home;