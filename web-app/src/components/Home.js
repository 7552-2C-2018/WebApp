import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Layout from './Layout';
import Table from './Table';
import restclient from '../utils/restclient';
import isLoggedIn from '../utils/isLoggedIn';
import fetch from 'node-fetch';

const columns = [
  {
    Header: "Id",
    accessor: 'id'
  },
  {
    Header: 'Name',
    accessor: 'name',
    isEditable: true,
  },
  {
    Header: "Url",
    accessor: 'url',
    isEditable: true,
  },
  {
    Header: 'Rev',
    accessor: 'rev'
  },
  {
    Header: 'Last connection',
    accessor: 'lastconnection'
  },
  {
    Header: 'Created by',
    accessor: 'createdby'
  },
  {
    Header: 'Created time',
    accessor: 'createdtime'
  }
];

const requestGet = (pageSize, page, sorted, filtered) => (
  restclient().get('/api/servers')
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

const requestPut = (newElement) => (
  restclient().put(`/api/servers/${newElement.id}`, {
    name: newElement.name,
    url: newElement.url,
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


const requestDelete = (id) => (
  restclient().delete(`/api/servers/${id}`)
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

const requestPost = (data) => (
  restclient().post('/api/servers', data)
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

const Home = () => {
  if (!isLoggedIn()) {
    return <Redirect to="/login" />;
  }
  return (
    <Layout title="Home">
      <Table requestGet={requestGet} requestPut={requestPut} requestDelete={requestDelete} requestPost={requestPost} columns={columns} />
    </Layout>
  );
};

export default Home;