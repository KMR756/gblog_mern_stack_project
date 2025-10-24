import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router";
import logo from "@/assets/images/logo-white.png";
import { FaHome } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { FaBlog } from "react-icons/fa";
import { FaComments } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";

const AppSideBar = () => {
  return (
    <Sidebar className="mt-25">
      <SidebarHeader className="bg-white ">
        {/* <img src={logo} className="h-15" alt="logo" width={120} /> */}
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="text-xl py-2 font-semibold">
                <FaHome
                  style={{ width: 22, height: 22 }}
                  className="text-primary"
                />
                <Link to={"#"}>Home</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="text-xl py-2 font-semibold">
                <BiSolidCategory
                  style={{ width: 22, height: 22 }}
                  className="text-primary"
                />
                <Link to={"#"}>Categories</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="text-xl py-2 font-semibold">
                <FaBlog
                  style={{ width: 22, height: 22 }}
                  className="text-primary"
                />
                <Link to={"#"}>Blogs</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="text-xl py-2 font-semibold">
                <FaComments
                  style={{ width: 22, height: 22 }}
                  className="text-primary"
                />
                <Link to={"#"}>Comments</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="text-xl py-2 font-semibold">
                <FaUserFriends
                  style={{ width: 22, height: 22 }}
                  className="text-primary"
                />
                <Link to={"#"}>Users</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl font-bold">
            Categories
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="text-xl py-2 font-semibold">
                <GoDotFill
                  style={{ width: 22, height: 22 }}
                  className=" text-primary"
                />
                <Link to={"#"}>Cetories Item</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSideBar;
