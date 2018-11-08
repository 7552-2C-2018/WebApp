import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Layout from './../Layout';
import Table from './../Table';
import Select from './../Select';
import restclient from '../../utils/restclient';
import isLoggedIn from '../../utils/isLoggedIn';
import fetch from 'node-fetch';
import shipmentStatusOptions from './shipmentStatusOptions';

const columns = [
  {
    Header: "Id",
    id: 'id',
    accessor: d => d.id
  },
  {
    Header: 'Moneda',
    id: 'Cost__currency',
    accessor: d => d.Cost.currency,
    requiredAtCreation: true,
  },
  {
    Header: 'Monto',
    id: 'Cost__value',
    accessor: d => d.Cost.value,
    requiredAtCreation: true,
  },
  {
    Header: 'Desde',
    id: 'Start__address__street',
    accessor: d => d.Start.address.street,
    requiredAtCreation: true,
  },
  {
    Header: 'Latitud inicial',
    id: 'Start__address__location__lat',
    accessor: d => d.Start.address.location.lat,
    requiredAtCreation: true,
  },
  {
    Header: 'Longitud inicial',
    id: 'Start__address__location__lon',
    accessor: d => d.Start.address.location.lon,
    requiredAtCreation: true,
  },
  {
    Header: 'Hasta',
    id: 'End__address__street',
    accessor: d => d.End.address.street,
    requiredAtCreation: true,
  },
  {
    Header: 'Latitud final',
    id: 'End__address__location__lat',
    accessor: d => d.End.address.location.lat,
    requiredAtCreation: true,
  },
  {
    Header: 'Longitud final',
    id: 'End__address__location__lon',
    accessor: d => d.End.address.location.lon,
    requiredAtCreation: true,
  },
  {
    Header: "Distancia",
    id: 'distance',
    accessor: d => d.distance,
    requiredAtCreation: true,
  },
  {
    Header: 'Estado',
    id: 'State',
    accessor: d => ({
      state: d.State,
      id: d.id,
    }),
    Cell: row => (
      <Select
        currentValue={shipmentStatusOptions[row.value.state]}
        options={shipmentStatusOptions}
        onChange={(newState) => requestPut(row.value.id, newState)}
      />
    ),
  },
  {
    Header: "Owner Id",
    id: 'ownerid',
    accessor: d => d.ownerid,
    requiredAtCreation: true,
  },
];

const requestGet = (pageSize, page, sorted, filtered) => (
  restclient().get('/api/tracking')
    .then(response => {
      console.log("RESPONSE", response);
      return {
        rows: response.data.data.map(element => element.trips),
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
  restclient().delete(`/api/tracking/${id}`)
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

const requestPut = (id, newStatus) => (
  restclient().put(`/api/tracking/${id}`, {
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
  return restclient().post('/api/tracking', {
    cost: {
      currency: data.Cost__currency,
      value: data.Cost__value,
    },
    start: {
      address: {
        location: {
          lat: data.Start__address__location__lat,
          lon: data.Start__address__location__lon,
        },
        street: data.Start__address__street,
      },
      timestamp: null,
    },
    end: {
      address: {
        location: {
          lat: data.End__address__location__lat,
          lon: data.End__address__location__lon,
        },
        street: data.End__address__street,
      },
      timestamp: null,
    },
    ownerid: data.ownerid,
    distance: data.distance,
    route: [],
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

const Shipments = () => {
  if (!isLoggedIn()) {
    return <Redirect to="/login" />;
  }
  return (
    <Layout title="Envíos">
      <Table keyField="id" requestGet={requestGet} requestDelete={requestDelete} requestPost={requestPost} columns={columns} />
    </Layout>
  );
};

export default Shipments;