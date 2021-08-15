import React from "react";
import { Navbar, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
const Navigation = () => {
  return (
    <div>
      <Navbar className="navigation-menu px-5">
        <Container fluid>
          <Navbar.Brand href="/">
            {" "}
            <FontAwesomeIcon icon={faChartLine} />
            <span className="font-bold ms-2">UPB</span> Knowledge Graph for
            Socio-technical Risk Management
          </Navbar.Brand>
        </Container>
      </Navbar>
    </div>
  );
};

export default Navigation;
