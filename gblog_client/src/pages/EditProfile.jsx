import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
// Assuming correct paths for UI components and assets
import logo from "@/assets/images/logo-white.png";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router";
import { RouteIndex, RouteSignUp } from "@/helper/RoutesName";
import { ShowToast } from "@/helper/ShowToast";
import GoogleLogin from "@/components/GoogleLogin";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/user/user.slice";
import api from "@/helper/axios"; // Your globally configured Axios instance
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useAxiosPrivate } from "@/helper/useAxiosPrivate";
import Loading from "@/components/Loading";
import { FaCamera } from "react-icons/fa";
import Dropzone from "react-dropzone";

// ✅ Validation Schema
const formSchema = z.object({
    name: z
        .string()
        .min(1, "Enter your name."),
    email: z
        .string()
        .min(1, "Enter your email address.")
        .email("Invalid email address."),
    bio: z
        .string()
});

const EditProfile = () => {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [filePreview, setFilePreview] = useState()
    // console.log(user);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const { request, loading } = useAxiosPrivate();
    console.log(data);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            bio: ""
        },
    });
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

    }, [user]);

    useEffect(() => {
        if (data?.data && data?.success) {
            form.reset({
                email: data?.data?.user?.email,
                name: data?.data?.user?.name,
                bio: data?.data?.user?.bio,
            })
        }
    }, [data?.data])
    const onSubmit = async (values) => {

    };
    if (loading) return <Loading />;
    if (error) return <p>Error: {error.message}</p>;
    if (!data) return null;
    console.log(data);
    const handleFileSelection = (files) => {
        const file = files[0]
        console.log(file);
        const preview = URL.createObjectURL(file)
        setFilePreview(preview)
    }
    return (
        <div>
            <Card className="w-1/2 mx-auto my-17.5">

                <div className="flex items-center justify-center mt-10">


                    <Dropzone accept={{
                        "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"]
                    }}
                        multiple={false} onDrop={acceptedFiles => handleFileSelection(acceptedFiles)}>
                        {({ getRootProps, getInputProps }) => (

                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Avatar className="h-30 w-30 relative group">
                                    <AvatarImage src={filePreview ? filePreview : data?.data?.user?.avatar} />
                                    <div className="absolute z-60 w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  justify-center items-center bg-black opacity-20 border-3 border-primary group-hover:flex hidden cursor-pointer">
                                        <FaCamera className="text-primary" />
                                    </div>


                                </Avatar>
                            </div>

                        )}
                    </Dropzone>

                </div>




                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="px-20 py-5">
                        {/* Email */}
                        <FormField

                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xl">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Enter your Email."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="mt-5 text-xl">Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Enter your Name."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="mt-5 text-xl">Bio</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            type="text"
                                            placeholder="Enter your Bio."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-between mt-4 ">

                            <Button type="button" className="bg-red-500  hover:bg-red-600 w-auto ">Delete Profile</Button>
                            <Button
                                className='w-auto '
                                type="submit"
                                // Disable button during submission
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? "Updating..." : "Update"}
                            </Button>
                        </div>






                    </form>
                </Form>

            </Card>
        </div>
    );
};

export default EditProfile;
