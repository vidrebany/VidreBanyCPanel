import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavbarReact from 'react-bootstrap/Navbar';


const Navbar = () => {
    
  return (
    <div>
      
      <NavbarReact bg="light" expand="lg">
      <Container>
        <NavbarReact.Brand href="#/">VidreBany</NavbarReact.Brand>
        <NavbarReact.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#/">Inici</Nav.Link>
            <Nav.Link href="#/processes">Processos</Nav.Link>
            <Nav.Link href="#/users">Usuaris</Nav.Link>
            <Nav.Link href="#/edit">Ordres</Nav.Link>
            <Nav.Link href="#/transport">Transports</Nav.Link>
            <Nav.Link href="#/incidencies">Inconformitats</Nav.Link>
            <Nav.Link href="#/admins">Administradors</Nav.Link>
          </Nav>
        </NavbarReact.Collapse>
            <NavbarReact.Toggle aria-controls="basic-navbar-nav" />
      </Container>
    </NavbarReact>
</div>
  );
};

export default Navbar;