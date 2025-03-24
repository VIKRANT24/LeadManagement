import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Nav } from "reactstrap";
import PerfectScrollbar from "perfect-scrollbar";

import logo from "../../assets/img/logo.svg";

let ps;

function Sidebar(props) {
  const location = useLocation();
  const sidebar = React.useRef(null);

  // State to track which menu is expanded
  const [openMenus, setOpenMenus] = useState({});
  const [activeTab, setActiveTab] = useState(null); // Track active main tab
  const [activeSubTab, setActiveSubTab] = useState(null); // Track active sub tab

  // Toggle submenu visibility
  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu], // Toggle the menu state (open/close)
    }));
  };

  const activeRoute = (routeName) => {
    return location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };

  const handleMainTabClick = (routeName) => {
    // Set the clicked main menu as active and close other menus
    setActiveTab(routeName);
    setActiveSubTab(null); // Reset active sub-tab when a new main tab is clicked
  };

  const handleSubTabClick = (routeName) => {
    // Set the clicked sub-menu as active
    setActiveSubTab(routeName);
  };

  // Initialize PerfectScrollbar
  useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1 && sidebar.current) {
      ps = new PerfectScrollbar(sidebar.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
    return () => {
      if (ps) {
        ps.destroy();
        ps = null;
      }
    };
  }, []);

  return (
    <div
      className="sidebar"
      data-color={props.bgColor}
      data-active-color={props.activeColor}
    >
      <div className="logo">
        <a
          href="https://www.creative-tim.com"
          className="simple-text logo-mini"
        >
          <div className="logo-img">
            <img src={logo} alt="react-logo" />
          </div>
        </a>
        <a
          href="https://www.creative-tim.com"
          className="simple-text logo-normal center"
        >
          Lead Management <br />
          System
        </a>
      </div>
      <div className="sidebar-wrapper" ref={sidebar}>
        <Nav>
          {props.routes.map((prop, key) => {
            const hasChildren = prop.children && prop.children.length > 0;

            return (
              <li
                className={
                  activeRoute(prop.path) +
                  (prop.pro ? " active-pro" : "") +
                  (activeTab === prop.path ? " active" : "")
                }
                key={key}
              >
                {/* Parent NavLink */}
                <NavLink
                  to={prop.layout + prop.path}
                  className="nav-NavLink"
                  onClick={() => {
                    handleMainTabClick(prop.path); // Mark the parent as active
                    if (hasChildren) toggleMenu(prop.path); // Toggle submenu visibility
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <i className={prop.icon} />
                    <p style={{ marginLeft: "5px", flexGrow: 1 }}>
                      {prop.name}
                    </p>

                    {/* Dropdown icon */}
                    {hasChildren && (
                      <i
                        className={`fa ${
                          openMenus[prop.path] ? "fa-caret-up" : "fa-caret-down"
                        }`}
                        style={{ marginLeft: "auto" }} // Align to the right
                      />
                    )}
                  </div>
                </NavLink>

                {/* Submenu if the route has children */}
                {hasChildren && (
                  <div
                    className={`submenu-container ${
                      openMenus[prop.path] ? "open" : ""
                    }`}
                    style={{ marginLeft: "20px", paddingTop: "5px" }} // Align submenu to the left
                  >
                    <ul>
                      {prop.children.map((child, idx) => (
                        <li
                          key={idx}
                          className={
                            activeSubTab === child.path ? "active" : ""
                          }
                        >
                          <NavLink
                            to={prop.layout + prop.path + "/" + child.path}
                            onClick={() => handleSubTabClick(child.path)} // Mark sub-tab as active
                          >
                            <i
                              className={child.icon}
                              style={{ marginRight: "10px" }}
                            />
                            <p>{child.name}</p>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
