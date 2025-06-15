import React from "react";

//using this, we are applying common styles to both the folders while also ensuring they
//have their cildren elements unaffected to them
const AuthLayout = ({ children }) => {
  return <div className="flex justify-center pt-40">{children}</div>;
};

export default AuthLayout;
