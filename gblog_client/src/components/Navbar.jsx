import React from "react";
import logo from "@/assets/images/logo-white.png";
import { Button } from "./ui/button";
import { Link } from "react-router";
import { FaSignInAlt } from "react-icons/fa";
import SearchBox from "./SearchBox";
import { RouteIndex, RouteSignIn } from "@/helper/RoutesName";
import { useSelector } from "react-redux";
import Dropdown_navbar from "./Dropdown_navbar";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  // console.log(user);

  return (
    <div className="flex justify-between items-center fixed top-0 h-25 w-full z-20 bg-white px-5 border-b">
      <Link to={RouteIndex}>
        <div>
          <img className="h-10 md:h-15" src={logo} alt="" />
        </div>
      </Link>
      <div className="w-1/3 ">
        <SearchBox />
      </div>
      <div>
        {!user.isLoggedIn ? (
          <Button className="rounded-md text-2xl py-7 px-5 font-bold" asChild>
            <Link to={RouteSignIn}>
              <FaSignInAlt style={{ width: 30, height: 30 }} />
              Sign In
            </Link>
          </Button>
        ) : (
          <Dropdown_navbar />
        )}
      </div>
    </div>
  );
};

export default Navbar;
