import React from "react";
import { Outlet } from "react-router-dom";

const Placeholder = ({ message = "Coming Soon..." }) => {
  return (
    <div>
      <h2>{message}</h2>
      {/* <Outlet /> Render child routes here */}
    </div>
  );
};

export default Placeholder;
