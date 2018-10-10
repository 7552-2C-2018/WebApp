import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Layout from './Layout';
import Table from './Table';
import restclient from '../utils/restclient';
import isLoggedIn from '../utils/isLoggedIn';
import fetch from 'node-fetch';

const columns = [
  {
    Header: "Transaction Id",
    accessor: 'transaction_id'
  },
  {
    Header: 'Monto',
    id: 'amount',
    accessor: d => `${d.currency} ${d.value}`,
  },
];

const requestGet = (pageSize, page, sorted, filtered) => (
  restclient().get('/api/payments')
    .then(response => {
      console.log("RESPONSE", response);
      return {
        rows: response.data.data,
        pages: 1,
      }
    })
    .catch(error => {
      console.log("ERROR", error);
      return {
        rows: [],
        pages: 1
      }
    })
);

const requestDelete = (id) => (
  restclient().delete(`/api/payments/${id}`)
    .then(response => {
      console.log("RESPONSE", response);
      return {
        status: 200
      }
    })
    .catch(error => {
      console.log("ERROR", error);
      return {
        status: 500
      }
    })
);

const Payments = () => {
  if (!isLoggedIn()) {
    return <Redirect to="/login" />;
  }
  return (
    <Layout title="Pagos">
      <Table keyField="transaction_id" requestGet={requestGet} requestDelete={requestDelete} columns={columns} />
    </Layout>
  );
};

export default Payments;