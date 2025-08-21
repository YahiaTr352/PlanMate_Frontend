import Cookie from "cookie-universal";
import { Navigate } from "react-router-dom";

export const RedirectFromRoot = () => {
  const cookie = Cookie();
  const userId = cookie.get("userId");

  return userId ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />;
};
