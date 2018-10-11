import React from 'react';
import PropTypes from 'prop-types';
import './Header.scss';
import logo from './logo.png';
import { Link } from 'react-router-dom';
import store from 'store';
import isLoggedIn from '../../utils/isLoggedIn';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

export default class Header extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  handleLogout() {
    store.remove('expiredAt');
    store.remove('token');
  }

  render() {
    const { isLogged } = this.props;
    return (
      <div>
        <Navbar light expand="md">
          <NavbarBrand href="/">
            <img src={logo} />
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              { isLoggedIn() ? (
                <React.Fragment>
                  <NavItem>
                    <Link to="/shipping">Envíos</Link>
                  </NavItem>
                  <NavItem>
                    <Link to="/payments">Pagos</Link>
                  </NavItem>
                  <NavItem>
                    <Link to="/application-servers">Application Servers</Link>
                  </NavItem>
                  <NavItem>
                    <Link to="/reports">Reportes</Link>
                  </NavItem>
                  <NavItem>
                    <a href="#" onClick={this.handleLogout}>Cerrar sesión</a>
                  </NavItem>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <NavItem>
                    <Link to="/login">Iniciar sesión</Link>
                  </NavItem>
                </React.Fragment>    
              ) 
              }
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

Header.propTypes = {
  isLogged: PropTypes.bool.isRequired,
};