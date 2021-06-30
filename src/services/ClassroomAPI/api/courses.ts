import { AxiosPromise } from "axios";
import { api } from "./api";

export class courses extends api {
  /**
   *
   * @param courseId (Optional) Get the instance of course if specified. If not, get the list of available courses instead.
   * @returns AxiosPromises
   */
  get(courseId?: string): AxiosPromise {
    return super.sendRequest({
      method: "GET",
      url:
        "https://classroom.googleapis.com/v1/courses/" +
        (courseId ? courseId : ""),
    });
  }
}
