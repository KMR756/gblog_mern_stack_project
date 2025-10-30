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
import { ShowToast } from "@/helper/ShowToast";
import { removeUser } from "@/redux/user/user.slice";
import { RouteIndex } from "@/helper/RoutesName";
import Swal from "sweetalert2";
// import { persistor } from "@/store";
import api from "@/helper/axios";

const Dropdown_navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Get user safely from Redux
  const user = useSelector((state) => state.user.user);
  // console.log(user);

  // ✅ Handle logout
  const handleLogout = async () => {
    // 1. Confirmation using SweetAlert2 remains the same
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
      // 2. CONVERSION TO AXIOS
      // We use the 'api' instance.
      // - The base URL (http://localhost:8000/api) is included automatically.
      // - credentials: "include" (withCredentials: true) is included automatically.
      const response = await api.post(`/auth/logout`);

      // Axios automatically throws an error for 4xx/5xx status codes,
      // so we only proceed if the request was successful (2xx status).

      // Dispatch logout actions
      dispatch(removeUser());
      navigate(RouteIndex);

      // Optional: If you use Redux Persist and need to clear it manually
      // persistor.purge();

      // Show success alert
      Swal.fire({
        title: "Logged Out!",
        text: response.data.message || "You have been logged out successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      // 3. AXIOS ERROR HANDLING
      // The error object now contains the response data under error.response.data
      const message =
        error.response?.data?.message || "Something went wrong. Logout failed.";

      ShowToast("error", message);

      // NOTE: If the logout call fails, it's safer to *force* a client-side logout
      // to prevent the UI from showing a logged-in state when the server session is dead.
      dispatch(removeUser());
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="md:h-15 md:w-15">
          <AvatarImage src={user?.avatar || userAvater} />
          <AvatarFallback>{user?.name ? user.name[0] : "U"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mr-3">
        <DropdownMenuLabel className="bg-amber-100">
          <div className="flex justify-center items-center gap-2">
            {user?.role && (
              <Badge variant="default">{user.role?.toUpperCase()}</Badge>
            )}
          </div>
          <p className="text-center font-semibold">
            {user?.name || "User Name"}
          </p>
          <p className="text-center text-sm">
            {user?.email || "email@example.com"}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <Link to={"/user-profile"}>
          <DropdownMenuItem>
            <IoPeopleSharp />
            Profile
          </DropdownMenuItem>
        </Link>

        <Link to={"/create-blog"}>
          <DropdownMenuItem>
            <FaBlog />
            Create Blog
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        <Button onClick={handleLogout} className="w-full" variant="outline">
          <DropdownMenuItem>
            <IoLogOut />
            Log Out
          </DropdownMenuItem>
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Dropdown_navbar;
