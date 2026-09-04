import React from "react";
import { Link } from "react-router-dom";
import { Leaf, ArrowLeft, Home, Search } from "lucide-react";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="not-found-page-wrapper">
      <div className="not-found-card">
        <div className="not-found-icon-wrap">
          <Leaf size={36} />
        </div>
        <span className="not-found-code">404</span>
        <h1 className="not-found-title">Botanical Route Not Found</h1>
        <p className="not-found-description">
          The specimen or page you are looking for has been moved, repotted, or does not exist in our botanical taxonomy.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            <Home size={16} />
            <span>Return to Home</span>
          </Link>
          <Link to="/scanner" className="btn btn-outline">
            <Search size={16} />
            <span>Open Plant Scanner</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
