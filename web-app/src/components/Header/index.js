import React from 'react';
import PropTypes from 'prop-types';
import './Header.scss';
import logo from './logo.png';
import { Link } from 'react-router-dom';
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
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
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
              { isLogged ? (
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
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                      Mi cuenta
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>
                        <Link to="/my-account">Mi cuenta</Link>
                      </DropdownItem>
                      <DropdownItem>
                        <Link to="/logout">Cerrar sesión</Link>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <NavItem>
                    <Link to="/login">Iniciar sesión</Link>
                  </NavItem>
                  <NavItem>
                    <Link to="/signup">Crear cuenta</Link>
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