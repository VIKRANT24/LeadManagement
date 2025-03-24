import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  InputGroup,
  InputGroupText,
  Input,
} from "reactstrap";

import routes from "../../routes.jsx";
import AuthContext from "../../store/auth/auth-context";

function Header(props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [color, setColor] = React.useState("transparent");
  const sidebarToggle = React.useRef();
  const location = useLocation();
  const userdata = useContext(AuthContext);
  const navigate = useNavigate();

  // Toggle navbar color on collapse
  const toggle = () => {
    if (isOpen) {
      setColor("transparent");
    } else {
      setColor("dark");
    }
    setIsOpen(!isOpen);
  };

  const dropdownToggle = (e) => {
    setDropdownOpen(!dropdownOpen);
  };

  // Dynamically get brand name from the route
  const getBrand = () => {
    let brandName = "Default Brand";
    routes.forEach((prop) => {
      if (window.location.href.indexOf(prop.layout + prop.path) !== -1) {
        brandName = prop.name;
      }
      // Check for child routes
      if (prop.children) {
        prop.children.forEach((child) => {
          if (window.location.href.indexOf(prop.layout + child.path) !== -1) {
            brandName = child.name;
          }
        });
      }
    });
    return brandName;
  };

  // Handle sidebar toggle
  const openSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    sidebarToggle.current.classList.toggle("toggled");
  };

  // Update navbar color on resize
  const updateColor = () => {
    if (window.innerWidth < 993 && isOpen) {
      setColor("dark");
    } else {
      setColor("transparent");
    }
  };

  React.useEffect(() => {
    window.addEventListener("resize", updateColor.bind(this));
    return () => window.removeEventListener("resize", updateColor);
  });

  React.useEffect(() => {
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      sidebarToggle.current.classList.toggle("toggled");
    }
  }, [location]);

  const handleUserLogout = () => {
    userdata.logout();
    navigate("/login");
  };

  const fullName = `${localStorage.getItem("firstName") || ""} ${
    localStorage.getItem("lastName") || ""
  }`; // Construct Full Name
  const firstChar = localStorage.getItem("firstName")
    ? localStorage.getItem("firstName").charAt(0)
    : ""; // Get First Character

  return (
    <Navbar
      color={
        location.pathname.indexOf("full-screen-maps") !== -1 ? "dark" : color
      }
      expand="lg"
      className={
        location.pathname.indexOf("full-screen-maps") !== -1
          ? "navbar-absolute fixed-top"
          : "navbar-absolute fixed-top " +
            (color === "transparent" ? "navbar-transparent " : "")
      }
    >
      <Container fluid className="d-flex justify-content-between w-100">
        <div className="navbar-wrapper d-flex justify-content-between align-items-center w-100">
          <div className="navbar-toggle">
            <button
              type="button"
              ref={sidebarToggle}
              className="navbar-toggler"
              onClick={() => openSidebar()}
            >
              <span className="navbar-toggler-bar bar1" />
              <span className="navbar-toggler-bar bar2" />
              <span className="navbar-toggler-bar bar3" />
            </button>
          </div>
          {/* Dynamically render brand name */}
          <NavbarBrand href="/">{getBrand()}</NavbarBrand>
          <NavbarToggler onClick={toggle}>
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
          </NavbarToggler>
        </div>
        <Collapse isOpen={isOpen} navbar className="justify-content-end w-100">
          <form>
            <InputGroup className="no-border">
              <Input placeholder="Search..." />
              <InputGroupText>
                <i className="nc-icon nc-zoom-split" />
              </InputGroupText>
            </InputGroup>
          </form>
          <Nav navbar>
            <NavItem>
              <Link to="#pablo" className="nav-link btn-magnify">
                <i className="nc-icon nc-layout-11" />
                <p>
                  <span className="d-lg-none d-md-block">Stats</span>
                </p>
              </Link>
            </NavItem>
            <Link to="#pablo" className="nav-link btn-rotate">
              <i className="nc-icon nc-bell-55" />
              <p>
                <span className="d-lg-none d-md-block">Some Actions</span>
              </p>
            </Link>

            <Dropdown nav isOpen={dropdownOpen} toggle={dropdownToggle}>
              <DropdownToggle caret nav>
                {/* <i className="nc-icon nc-settings-gear-65" /> */}
                <span className="userIcon">{firstChar}</span>

                <p>
                  <span className="d-lg-none d-md-block">Account</span>
                </p>
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem>{fullName}</DropdownItem>
                {/* <DropdownItem tag="a">Another Action</DropdownItem> */}
                <DropdownItem tag="a" onClick={handleUserLogout}>
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <NavItem></NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
