import axios, { AxiosInstance } from "axios";
import { toast } from "react-toastify";

export const api: AxiosInstance = axios.create({
  baseURL: "https://reqres.in/api/",
});

api.interceptors.request.use(
  async (request) => {
    return request;
  },
  function (error) {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  async (response) => response.data,
  async (error) => {
    if (error.response) {
      const { message } = error.response.data;
      if (message) {
        toast.error(message);
      }
      return { data: null };
    }
    toast.error("Oops !!! Something Went Wrong !!!");
    return { data: null };
  }
);
