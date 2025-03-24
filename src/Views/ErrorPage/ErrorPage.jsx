import React from "react";
import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <div className="text-center mt-5">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you're looking for does not exist.</p>
      <Link to="/admin/dashboard" className="btn btn-primary">
        Go to Dashboard
      </Link>
    </div>
  );
}

export default ErrorPage;
