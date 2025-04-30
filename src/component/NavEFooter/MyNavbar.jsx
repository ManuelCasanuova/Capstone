import React from 'react';
import { Navbar, Nav, Button, Dropdown, Image, Container } from 'react-bootstrap';
import { Link, NavLink } from 'react-router';

const MyNavbar = () => {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm py-3">
      <Container>
        {/* Logo / Nome */}
        <Navbar.Brand href="#" className="text-primary fw-bold fs-4">
          Cartella Clinica
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">


          

         

         
          <Nav className="me-auto d-flex align-items-center"> 
          <NavLink to="/" className={`text-center nav-link ${location.pathname === "/" ? "navActive" : ""}`}>
            <p>Dashboard</p>
          </NavLink>
          <NavLink to="/pazienti" className={`text-center nav-link ${location.pathname === "/" ? "navActive" : ""}`}>
            <p>Pazienti</p>
          </NavLink>
          
            
          </Nav>
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
                <Dropdown.Item as={Link} to= "/profilo">Profilo</Dropdown.Item>
                <Dropdown.Item href="#/logout">Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;