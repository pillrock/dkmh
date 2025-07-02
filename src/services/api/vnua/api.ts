import axios from "axios";
import {
  infoStudent_DATARESPONSE,
  Login_DATARESPONSE,
} from "./dataTypeResponse";
const baseApi = axios.create({
  baseURL: "https://daotao.vnua.edu.vn",
  timeout: 60000,
  headers: { Accept: "application/json, text/plain, */*" },
});

const API_ENDPOINT = {
  login: "/api/auth/login",
  infoStudent: "/dkmh/api/dkmh/w-locsinhvieninfo",
  allDataSubject: "/dkmh/api/dkmk/w-locdsnhomto",
  allDataSubjectSigned: "/dkmh/api/dkmk/w-locdskqdkmhsinhvien",
  handleRegisterSubject: "/dkmh/api/dkmk/w-xulydkmhsinhvien",
};
const handleError = (error: unknown, context: string): never => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message;
    throw new Error(`${context}${message}`);
  } else if (error instanceof Error) {
    throw new Error(`${context}${error.message}`);
  }
  throw new Error(`${context} failed: Unknown error`);
};

//////////////////////////////////////////////////////
export const login = async (
  username: string,
  password: string
): Promise<Login_DATARESPONSE> => {
  try {
    const rawData = `username=${username}&password=${password}&grant_type=password`;
    const res = await baseApi.post(API_ENDPOINT.login, rawData);
    return res.data;
  } catch (error: unknown) {
    throw handleError(error, "");
  }
};

export const getInfoStudent = async (
  access_token: string
): Promise<infoStudent_DATARESPONSE> => {
  try {
    const authString = `Bearer ${access_token}`;
    const res = await baseApi.post(
      API_ENDPOINT.infoStudent,
      {},
      {
        headers: { Authorization: authString },
      }
    );
    return res.data;
  } catch (error: unknown) {
    throw handleError(error, "");
  }
};
