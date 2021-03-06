import React from 'react';
import { Grid, Form, Header, Message } from 'semantic-ui-react';
import store from 'store';
import styles from './Login.scss';
import Layout from '../Layout/index';
import isLoggedIn from '../../utils/isLoggedIn';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      error: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    const { username, password } = this.state;
    const { history } = this.props;
    this.setState({ error: false });

    if (!(username === 'admin' && password === 'admin')) {
      return this.setState({ error: true });
    }
    axios.post('https://shared-server-25.herokuapp.com/api/auth/token', { id: 7 })
      .then(response => {
        console.log("RESPONSE", response);
        store.set('token', response.data.token);
        store.set('expiresAt', response.data.expiresAt);
        history.push('/');
      })
      .catch(error => {
        console.log("ERROR", error);
        this.setState({
          error: true,
        });
      })
  }

  handleChange(e, { name, value }) {
    this.setState({ [name]: value });
  }

  render() {
    const { error } = this.state;
    if (isLoggedIn()) {
      return <Redirect to="/" />
    }
    return (
      <Layout title="Login">
        <Form className={styles.loginForm} error={error} onSubmit={this.onSubmit}>
          {error && <Message
            error={error}
            content="Los datos son incorrectos. Intentalo nuevamente!"
          />}
          <Form.Input
            inline
            label="Username"
            name="username"
            onChange={this.handleChange}
          />
          <Form.Input
            inline
            label="Password"
            type="password"
            name="password"
            onChange={this.handleChange}
          />
          <Form.Button type="submit">Go!</Form.Button>
        </Form>
      </Layout>
    );
  }
}

export default Login;