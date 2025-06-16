import Cookie from "cookie-universal";

export const getAuthData = () => {
  const cookie = Cookie();
  return {
    userId: cookie.get("userId"),
    token: cookie.get("token"),
  };
};
