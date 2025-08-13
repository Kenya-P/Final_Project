import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function ProtectedRoute({ element: Component, isLoggedIn, ...props }) {
  return isLoggedIn ? <Component {...props} /> : <Navigate to="/" replace />;
}

ProtectedRoute.propTypes = {
  element: PropTypes.elementType.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

export default ProtectedRoute;
