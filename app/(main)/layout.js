//contains all the routes
import React from "react";

const MainLayout = ({ children }) => {
  //Redirect user after onboarding - if the user is already done with onboarding then we skip this
  return <div className="container  mx-auto mt-24 mb-20">{children}</div>;
};

export default MainLayout;
