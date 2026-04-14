import { Navbar, Nav, Container } from "react-bootstrap";
import "../styles/NavBar.css";

export default function Header() {
  return (
    <Navbar collapseOnSelect expand="lg" className="custom-navbar" sticky="top">
      <Container fluid>
        <Navbar.Brand href="">Scraps</Navbar.Brand>

        {/* Hamburger menu for mobile view */}
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        {/* Collapsible area for navigation links */}
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            {/* Page with list of niehgborhood */}
            <Nav.Link href="" className="nav-link">
              ← Your Neighborhoods
            </Nav.Link>
            <Nav.Link href="" className="nav-link">
              Logout
            </Nav.Link>
            <Nav.Link href="" className="nav-link">
              About Us
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
