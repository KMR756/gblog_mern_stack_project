import { Card, CardHeader } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAxiosPrivate } from "@/helper/useAxiosPrivate";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import Loading from "@/components/Loading";
const UserProfile = () => {
  const user = useSelector((state) => state.user.user);

  // console.log(user);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { request, loading } = useAxiosPrivate();
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const data = await request("get", `get-user/${user?._id}`);
        // console.log(data);
        setData(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (user?._id) fetchdata();
  }, []);
  if (loading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return null;
  console.log(data);
  return (
    <div>
      <Card className="w-1/2 mx-auto my-17.5">
        <div className="flex items-center justify-center mt-10">
          <Avatar className="h-30 w-30">
            <AvatarImage src={data?.data?.user?.avatar} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="px-20 py-5">
          <div>
            <h1 className="text-xl">Name</h1>
            <Input
              className="focus-visible:ring-0 mt-1 border-secondary focus-visible:border-secondary focus-visible:ring-offset-0 focus:outline-none"
              readOnly
              defaultValue={data?.data?.user?.name}
            />
          </div>
          <div className="mt-5">
            <h1 className="text-xl">Email</h1>
            <Input
              className="focus-visible:ring-0 mt-1 border-secondary focus-visible:border-secondary focus-visible:ring-offset-0 focus:outline-none"
              readOnly
              defaultValue={data?.data?.user?.email}
            />
          </div>
          <div className="mt-5">
            <h1 className="text-xl">Bio</h1>
            <Textarea
              className="focus-visible:ring-0 mt-1 border-secondary focus-visible:border-secondary focus-visible:ring-offset-0 focus:outline-none"
              readOnly
              defaultValue={data?.data?.user?.bio}
            />
          </div>
          <div className="flex  justify-end mt-6">
            <Link to={"/edit-profile"}><Button>Edit Profile</Button></Link>

          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserProfile;
