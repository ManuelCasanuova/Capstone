import React from 'react';
import { Navbar, Nav, Form, FormControl, Button, Dropdown, Image, Container } from 'react-bootstrap';

const Header = () => {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm py-3">
      <Container>
        {/* Logo / Nome */}
        <Navbar.Brand href="#" className="text-primary fw-bold fs-4">
          Cartella Clinica
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Barra di ricerca (centrata su desktop) */}
          <Form className="d-flex mx-auto my-2 my-lg-0 w-50">
            <FormControl
              type="search"
              placeholder="Cerca paziente o referto..."
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-primary">Cerca</Button>
          </Form>

          {/* Notifiche e Profilo */}
          <Nav className="ms-auto d-flex align-items-center">
            {/* Icona notifiche */}
            <Button variant="link" className="position-relative me-3 p-0">
              <i className="bi bi-bell fs-5 text-secondary"></i>
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
            </Button>

            {/* Avatar + Dropdown */}
            <Dropdown align="end">
              <Dropdown.Toggle variant="light" id="dropdown-basic" className="d-flex align-items-center border-0">
                <Image
                  src="https://via.placeholder.com/40"
                  roundedCircle
                  width="40"
                  height="40"
                />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/profilo">Profilo</Dropdown.Item>
                <Dropdown.Item href="#/logout">Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;