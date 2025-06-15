import { SignUp } from "@clerk/nextjs";
import React from "react";
//we made a [[...sign-in]] folder inside this in order to have a catch all route
const Page = () => {
  return (
    <div>
      <SignUp />
    </div>
  );
};

export default Page;
