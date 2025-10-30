// publicApi.js
import axios from "axios";

const useAxiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default useAxiosPublic;

// USECASE:
// import publicApi from "../api/publicApi";

// const fetchProducts = async () => {
//   const res = await publicApi.get("/products");
//   return res.data;
// };
