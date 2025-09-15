import PropTypes from "prop-types";
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  isLoggedIn,
  element,
  children,
  redirectTo = "/",
}) {
  if (!isLoggedIn) return <Navigate to={redirectTo} replace />;
  return element ?? children ?? null;
}

ProtectedRoute.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  element: PropTypes.node,
  children: PropTypes.node,
  redirectTo: PropTypes.string,
};