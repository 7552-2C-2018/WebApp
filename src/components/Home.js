import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Loader } from 'semantic-ui-react';
import axios from 'axios';
import Layout from './Layout';
import Table from './Table';
import restclient from '../utils/restclient';
import isLoggedIn from '../utils/isLoggedIn';
import fetch from 'node-fetch';
import { setLastStatusAsConnected, setLastStatusAsDisconnected, getLastStatus } from '../utils/appServers';

const columns = [
  {
    Header: "Id",
    accessor: 'id'
  },
  {
    Header: 'Name',
    accessor: 'name',
    isEditable: true,
    requiredAtCreation: true,
  },
  {
    Header: "Url",
    accessor: 'url',
    isEditable: true,
    requiredAtCreation: true,
  },
  /*{
    Header: 'Rev',
    accessor: 'rev'
  },*/
  {
    Header: 'Last status',
    id: 'last_status',
    accessor: appServer => getLastStatus(appServer.id),
  },
  {
    Header: 'Created by',
    accessor: 'createdby'
  },
  {
    Header: 'Created time',
    accessor: 'createdtime'
  },
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

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: false,
      modal: false,
      isWorking: false,
      currentAppServerId: null,
    };
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  requestState(appServer) {
    this.setState({
      currentAppServerId: appServer.id,
      showLoading: true,
    });
    axios.get(`${appServer.url}/ping`)
      .then(response => {
        console.log("RESPONSE", response);
        this.setState({
          isWorking: true,
          showLoading: false,
        });
        setLastStatusAsConnected(appServer.id);
        this.toggleModal();
      })
      .catch(error => {
        console.log("ERROR", error);
        this.setState({
          isWorking: false,
          showLoading: false,
        });
        setLastStatusAsDisconnected(appServer.id)
        this.toggleModal();
      })
  }

  render() {
    if (!isLoggedIn()) {
      return <Redirect to="/login" />;
    }
    const currentStateButton = row => (
      <Button color="primary" onClick={() => this.requestState(row.original)}>Consultar estado</Button>
    );
    return (
      <Layout title="Application Servers">
        <Table
          requestGet={requestGet}
          requestPut={requestPut}
          requestDelete={requestDelete}
          requestPost={requestPost}
          columns={columns}
          subcomponentGenerator={currentStateButton}
        />
        <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Estado del application server #{this.state.currentAppServerId}</ModalHeader>
          <ModalBody>
            {this.state.isWorking ? 'Está prendido' : 'Está apagado'}
          </ModalBody>
        </Modal>
        <Loader active={this.state.showLoading} size="massive" />
      </Layout>
    );
  }
};

export default Home;