import React from "react";
import { Outlet } from "react-router-dom";

function UserPage() {
  return (
    <div>
      {/* <h2>User Profile</h2>
      <p>This is the main user profile page.</p> */}
      {/* Render child components */}
      <Outlet />
    </div>
  );
}

export default UserPage;
