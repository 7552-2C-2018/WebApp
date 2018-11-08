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
    id: 'currency',
    accessor: d => d.currency,
    requiredAtCreation: true,
  },
  {
    Header: 'Monto',
    id: 'value',
    accessor: d => d.value,
    requiredAtCreation: true,
  },
  {
    Header: 'Método de pago',
    id: 'paymentMethod__type',
    accessor: d => d.paymentmethod && d.paymentmethod.type,
    requiredAtCreation: true,
  },
  {
    Header: 'Número de tarjeta',
    id: 'paymentMethod__number',
    accessor: d => d.paymentmethod && d.paymentmethod.number,
    requiredAtCreation: true,
  },
  {
    Header: 'Mes de Vencimiento',
    id: 'paymentMethod__expiration_month',
    accessor: d => d.paymentmethod && d.paymentmethod.expiration_month,
    requiredAtCreation: true,
  },
  {
    Header: 'Año de Vencimiento',
    id: 'paymentMethod__expiration_year',
    accessor: d => d.paymentmethod && d.paymentmethod.expiration_year,
    requiredAtCreation: true,
  },
  {
    Header: 'Estado',
    id: 'state',
    accessor: d => ({
      state: d.paymentmethod && d.paymentmethod.state,
      id: d.transaction_id,
    }), 
    Cell: row => (
      <Select
        currentValue={paymentStatusOptions[row.value.state]}
        options={paymentStatusOptions}
        onChange={(newState) => requestPut(row.value.id, newState)}
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

const requestPost = (data) => {
  console.log(data);
  return restclient().post('/api/payments', {
    currency: data.currency,
    value: data.value,
    paymentMethod: {
      expiration_month: data.paymentMethod__expiration_month,
      expiration_year: data.paymentMethod__expiration_year,
      number: data.paymentMethod__number,
      type: data.paymentMethod__type,
    },
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