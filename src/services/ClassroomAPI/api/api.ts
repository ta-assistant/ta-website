import { oauthCredential } from "@/types/Google/oauthCredential";
import axios, { AxiosPromise, AxiosRequestConfig } from "axios";

export class api {
  private _oauthCredential: oauthCredential;

  constructor(oauthCredential: oauthCredential) {
    this._oauthCredential = oauthCredential;
  }

  getOAuthCredential(): oauthCredential {
    return this._oauthCredential;
  }

  sendRequest(config: AxiosRequestConfig): AxiosPromise {
    if (typeof config.headers === "undefined") {
      config.headers = {};
    }
    config.headers.Authorization =
      "Bearer " + this._oauthCredential.credential.oauthAccessToken;
    return axios(config);
  }
}
