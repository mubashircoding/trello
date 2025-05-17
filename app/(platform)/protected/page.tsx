"use client"

import { UserButton } from "@clerk/nextjs";

const ProtectedPage = () => {


  return(
     <div className="">
        <UserButton
        afterSignOutUrl="/"
        />
    </div>
    );
};
export default ProtectedPage;
