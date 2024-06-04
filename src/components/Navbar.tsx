import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavbarReact from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavbarContext } from './NavbarContext'; // Importar el contexto de la barra de navegación

const Navbar = () => {
  const { isNavbarVisible } = useContext(NavbarContext); // Obtener el estado de visibilidad de la barra de navegación del contexto

  if (!isNavbarVisible) {
    return null; // Si la barra de navegación no debe mostrarse, retornar null para renderizar nada
  }

  return (
    <div>
      <NavbarReact bg="light" expand="lg">
        <Container>
          <NavbarReact.Brand href="#/" style={{ 'fontSize': '2rem' }}>VidreBany</NavbarReact.Brand>
          <NavbarReact.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#/">Inici</Nav.Link>
              <Nav.Link href="#/users">Usuaris</Nav.Link>
              <NavDropdown title="Fabricació" id="basic-nav-dropdown">
                <Nav.Link href="#/processes">Processos</Nav.Link>
                <Nav.Link href="#/edit">Ordres</Nav.Link>
                <Nav.Link href="#/standby">Ordres en standby</Nav.Link>
              </NavDropdown>
              <Nav.Link href="#/transport">Transports</Nav.Link>
              <Nav.Link href="#/incidencies">No conformitats</Nav.Link>
              <Nav.Link href="#/control-horari">Control horari</Nav.Link>
              <Nav.Link href="#/admins">Administradors</Nav.Link>
              <Nav.Link href="#/tecnic">Servei Tècnic</Nav.Link>
            </Nav>
          </NavbarReact.Collapse>
          <NavbarReact.Toggle aria-controls="basic-navbar-nav" />
        </Container>
      </NavbarReact>
    </div>
  );
};

export default Navbar;
