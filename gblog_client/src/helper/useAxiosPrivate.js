import { useState } from "react";
import api from "./axios";

export const useAxiosPrivate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (method, url, data = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api({ method, url, data });
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { request, loading, error };
};

/*
uses:
GET:
const { request, loading } = useAxiosPrivate();
const data = await request("get", "/user/profile");

POST:
const newUser = await request("post", "/user", { name: "Rejoan", email: "a@b.com" });

PUT:
await request("put", "/user/123", { name: "Updated Name" });

DELETE:
await request("delete", "/user/123");
*/
