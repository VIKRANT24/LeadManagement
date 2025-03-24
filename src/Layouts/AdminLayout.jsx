import React from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import Footer from "../Components/Footer/Footer";
import Navbar from "../Components/Navbars/Navbars";
import { Route, Routes, Outlet, useLocation } from "react-router-dom";
import routes from "../routes.jsx";
import PerfectScrollbar from "perfect-scrollbar";
import FixedPlugin from "../Components/FixedPlugin/FixedPlugin.jsx";

function Dashboard(props) {
  const [backgroundColor, setBackgroundColor] = React.useState("black");
  const [activeColor, setActiveColor] = React.useState("info");
  const mainPanel = React.useRef();
  const location = useLocation();
  let ps; // Declare PerfectScrollbar instance

  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1 && mainPanel.current) {
      ps = new PerfectScrollbar(mainPanel.current);
      document.body.classList.toggle("perfect-scrollbar-on");
    }
    return () => {
      if (ps) {
        ps.destroy();
        ps = null;
        document.body.classList.toggle("perfect-scrollbar-on");
      }
    };
  }, []);

  React.useEffect(() => {
    if (mainPanel.current) {
      mainPanel.current.scrollTop = 0;
    }
    if (document.scrollingElement) {
      document.scrollingElement.scrollTop = 0;
    }
  }, [location]);

  const handleActiveClick = (color) => {
    setActiveColor(color);
  };

  const handleBgClick = (color) => {
    setBackgroundColor(color);
  };

  return (
    <div className="wrapper">
      <Sidebar
        {...props}
        routes={routes}
        bgColor={backgroundColor}
        activeColor={activeColor}
      />
      <div className="main-panel" ref={mainPanel}>
        <Navbar />
        {/* <Routes>
          {routes.map((route, key) => (
            <Route
              path={route.layout + route.path}
              element={<route.component />}
              key={key}
              exact
            />
          ))}
        </Routes> */}
        {/* <Routes>
          {routes.map((route, key) =>
            // Check if the route has children
            route.children ? (
              // If the route has children, render the parent route
              <Route
                key={key}
                path={route.layout + route.path}
                element={<route.component />}
              >

                {route.children.map((child, childKey) => (
                  <Route
                    key={childKey}
                    path={child.path} // The child path is relative to the parent
                    element={<child.component />} // The component to render for this child route
                  />
                ))}
              </Route>
            ) : (
              // If the route does not have children, render the route without any nested routes
              <Route
                key={key}
                path={route.layout + route.path} // Parent route path
                element={<route.component />} // Render the component for this route
              />
            )
          )}
        </Routes> */}
        <Outlet />
        <Footer />
      </div>
      {/* <FixedPlugin
        bgColor={backgroundColor}
        activeColor={activeColor}
        handleActiveClick={handleActiveClick}
        handleBgClick={handleBgClick}
      /> */}
    </div>
  );
}

export default Dashboard;

// import React from "react";
// import Sidebar from "../Components/Sidebar/Sidebar";
// import Footer from "../Components/Footer/Footer";
// import Navbar from "../Components/Navbars/Navbars";
// import { Route, Routes, useLocation, Outlet } from "react-router-dom";
// import routes from "../routes.jsx";

// function AdminLayout(props) {
//   const location = useLocation();

//   return (
//     <div className="wrapper">
//       <Sidebar {...props} routes={routes} />
//       <div className="main-panel">
//         <Navbar />
//         <Routes>
//           {routes.map((route, key) =>
//             route.children ? (
//               // Parent route with nested children
//               <Route path={route.path} element={<route.component />} key={key}>
//                 {route.children.map((child, childKey) => (
//                   <Route
//                     path={child.path}
//                     element={<child.component />}
//                     key={childKey}
//                   />
//                 ))}
//               </Route>
//             ) : (
//               // Regular route
//               <Route
//                 path={route.path}
//                 element={<route.component />}
//                 key={key}
//               />
//             )
//           )}
//         </Routes>
//         <Footer />
//       </div>
//     </div>
//   );
// }

// export default AdminLayout;
