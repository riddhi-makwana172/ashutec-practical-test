import axios, { AxiosError, AxiosResponse } from "axios";

interface ApiCallParams {
  method: string;
  path?: string;
  signal?: any;
  url?: string;
}

export const callAPIInterface = (axiosObj: ApiCallParams) => {
  return new Promise((resolve, reject) => {
    const host = "https://pokeapi.co/api/v2";
    let jwtOptions: ApiCallParams = {
      method: axiosObj.method,
      url: `${host}${axiosObj.path}`,
    };
    if (axiosObj.signal) jwtOptions["signal"] = axiosObj.signal;
    let apiCall = axios(jwtOptions);
    apiCall
      .then((response: AxiosResponse) => {
        resolve(response.data);
      })
      .catch((err: AxiosError) => reject(err));
  });
};
