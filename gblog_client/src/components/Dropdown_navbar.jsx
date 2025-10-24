import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import userAvater from "@/assets/images/user.png";
import { Badge } from "@/components/ui/badge";
import { IoPeopleSharp } from "react-icons/io5";
import { FaBlog } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { Link, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Ghost } from "lucide-react";
import { getEnv } from "@/helper/getEnv";
import { json, success } from "zod";
import { ShowToast } from "@/helper/ShowToast";
import { removeUser } from "@/redux/user/user.slice";
import { RouteIndex } from "@/helper/RoutesName";
import Swal from "sweetalert2";

const Dropdown_navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user.data);
  console.log(user);
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out!",
    });
    if (!result.isConfirmed) return;
    try {
      const response = await fetch(`http://localhost:8000/api/auth/logout`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        return ShowToast("error", data.message);
      }
      dispatch(removeUser());
      navigate(RouteIndex);
      Swal.fire({
        title: "Logged Out!",
        text: "You have been logged out successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      ShowToast("error", error.message);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="md:h-15 md:w-15">
          <AvatarImage src={user.avater || userAvater} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-3">
        <DropdownMenuLabel className="bg-amber-100">
          <div className="flex justify-center items-center ">
            {user.role === "admin" && <Badge variant="default">ADMIN</Badge>}
          </div>

          <p className="text-center font-semibold">{user.name}</p>
          <p className="font-semibold text-sm">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to={"#"}>
          <DropdownMenuItem>
            <IoPeopleSharp />
            Profile
          </DropdownMenuItem>
        </Link>
        <Link to={"#"}>
          <DropdownMenuItem>
            <FaBlog />
            Create Blog
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />
        <Button onClick={handleLogout} className="w-full" variant="outline">
          <DropdownMenuItem className="">
            <IoLogOut />
            LogOut
          </DropdownMenuItem>
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Dropdown_navbar;
