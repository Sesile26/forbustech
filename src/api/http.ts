import axios from "axios";

const httpClient = axios.create({
  baseURL: "https://official-joke-api.appspot.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const get = <T>(url: string) =>
  httpClient.get<T>(url).then((res) => res.data);

export default httpClient;
