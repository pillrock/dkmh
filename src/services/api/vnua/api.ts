import axios from "axios";
import {
  AllDataSubject_DATARESPONSE,
  infoStudent_DATARESPONSE,
  Login_DATARESPONSE,
} from "./dataTypeResponse";
const baseApi = axios.create({
  baseURL: "https://daotao.vnua.edu.vn",
  timeout: 60000 * 5,
  headers: {
    Accept: "application/json, text/plain, */*",
  },
});

const API_ENDPOINT = {
  login: "/api/auth/login",
  checkAccessToken: "/api/sms/w-locketquaduyetsinhvien",
  infoStudent: "/api/dkmh/w-locsinhvieninfo",
  allDataSubject: "/api/dkmh/w-locdsnhomto",
  allDataSubjectSigned: "/dkmh/api/dkmh/w-locdskqdkmhsinhvien",
  registerSubject: "/api/dkmh/w-xulydkmhsinhvien",
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

export const getAllDataSubject = async (
  access_token: string
): Promise<AllDataSubject_DATARESPONSE> => {
  try {
    const data = {
      is_CVHT: false,
      additional: {
        paging: { limit: 9999, page: 1 },
        ordering: [{ name: "", order_type: "" }],
      },
    };
    const authString = `Bearer ${access_token}`;
    const res = await baseApi.post(API_ENDPOINT.allDataSubject, data, {
      headers: { Authorization: authString },
    });
    return res.data;
  } catch (error: unknown) {
    throw handleError(error, "getAllDataSubject er: ");
  }
};

export const checkAccessToken = async (access_token: string) => {
  try {
    const authString = `Bearer ${access_token}`;
    const res = await baseApi.post(
      API_ENDPOINT.checkAccessToken,
      {},
      { headers: { Authorization: authString } }
    );
    return res.data;
  } catch (error: unknown) {
    throw handleError(error, "checkAccessToken error: ");
  }
};

export const registerSubject = async ({
  access_token,
  id_to_hoc,
}: {
  access_token: string;
  id_to_hoc: string;
}) => {
  try {
    const authString = `Bearer ${access_token}`;
    const data = {
      filter: {
        id_to_hoc,
        is_checked: true,
      },
    };
    const res = await baseApi.post(API_ENDPOINT.registerSubject, data, {
      headers: { Authorization: authString },
    });
    return res.data;
  } catch (error: unknown) {
    throw handleError(error, "registerSubject error: ");
  }
};
