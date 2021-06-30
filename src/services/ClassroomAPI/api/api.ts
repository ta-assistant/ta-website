import { oauthCredential } from "@/types/Google/oauthCredential";
import axios, { AxiosPromise, AxiosRequestConfig } from "axios";

export class api {
  oauthCredential: oauthCredential;

  constructor(oauthCredential: oauthCredential) {
    this.oauthCredential = oauthCredential;
  }

  sendRequest(config: AxiosRequestConfig): AxiosPromise {
    if (typeof config.headers === "undefined") {
      config.headers = {};
    }
    config.headers.Authorization =
      "Bearer " + this.oauthCredential.credential.oauthAccessToken;
    return axios(config);
  }
}
