import React from "react";
import logo from "@/assets/images/logo-white.png";
import { Button } from "./ui/button";
import { Link } from "react-router";
import { FaSignInAlt } from "react-icons/fa";
import SearchBox from "./SearchBox";
import { AuthIndex, RouteIndex, RouteSignIn } from "@/helper/RoutesName";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center fixed top-0 h-16 w-full z-20 bg-white px-5 border-b">
      <Link to={RouteIndex}>
        <div>
          <img src={logo} alt="" />
        </div>
      </Link>
      <div className="w-1/3 ">
        <SearchBox />
      </div>
      <div>
        <Button className="rounded-full font-bold" asChild>
          <Link to={`${AuthIndex}/${RouteSignIn}`}>
            <FaSignInAlt />
            Sign In
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
