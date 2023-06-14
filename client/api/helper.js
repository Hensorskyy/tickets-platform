import axios from "axios";

export const getAxiosClient = ({ req }) => {
  const isWindow = typeof window === "undefined";
  const axiosConfig = {
    baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
    headers: req?.headers,
  };

  return axios.create(isWindow && axiosConfig);
};
