import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Layout from './../Layout';
import Table from './../Table';
import Select from './../Select';
import restclient from '../../utils/restclient';
import isLoggedIn from '../../utils/isLoggedIn';
import fetch from 'node-fetch';
import paymentStatusOptions from './paymentStatusOptions';

const columns = [
  {
    Header: "Transaction Id",
    accessor: 'transaction_id'
  },
  {
    Header: 'Moneda',
    accessor: 'currency',
    requiredAtCreation: true,
  },
  {
    Header: 'Monto',
    accessor: 'value',
    requiredAtCreation: true,
  },
  {
    Header: 'Método de pago',
    accessor: 'type',
    requiredAtCreation: true,
  },
  {
    Header: 'Número de tarjeta',
    accessor: 'number',
    requiredAtCreation: true,
  },
  {
    Header: 'Mes de Vencimiento',
    accessor: 'expiration_month',
    requiredAtCreation: true,
  },
  {
    Header: 'Año de Vencimiento',
    accessor: 'expiration_year',
    requiredAtCreation: true,
  },
  {
    Header: 'Estado',
    accessor: 'state', 
    Cell: row => (
      <Select
        currentValue={paymentStatusOptions[row.original.state]}
        options={paymentStatusOptions}
        onChange={(newState) => requestPut(row.original.transaction_id, newState)}
      />
    ),
  }
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

const requestPut = (transactionId, newStatus) => (
  restclient().put(`/api/payments/${transactionId}`, {
    newState: newStatus,
  })
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

const requestPost = data => {
  console.log(data);
  return restclient().post('/api/payments', data)
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
};

const Payments = () => {
  if (!isLoggedIn()) {
    return <Redirect to="/login" />;
  }
  return (
    <Layout title="Pagos">
      <Table keyField="transaction_id" requestGet={requestGet} requestDelete={requestDelete} requestPost={requestPost} columns={columns} />
    </Layout>
  );
};

export default Payments;