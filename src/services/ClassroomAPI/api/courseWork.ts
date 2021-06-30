import { oauthCredential } from "@/types/Google/oauthCredential";
import { AxiosPromise } from "axios";
import { api } from "./api";

export class CourseWork extends api {
  courseId: string | null;
  courseWorkId: string | null;

  /**
   *
   * @param oauthCredential The Credential to be used during the request sending.
   * @param courseId The ID of the course to get the data;
   * @param courseWorkId The ID of the courseWork to get the data;
   */
  constructor(
    oauthCredential: oauthCredential,
    courseId?: string,
    courseWorkId?: string
  ) {
    super(oauthCredential);
    this.courseId = courseId ?? null;
    this.courseWorkId = courseWorkId ?? null;
  }

  /**
   * Get the courseWork info.
   */
  get(): AxiosPromise {
    return super.sendRequest({
      method: "GET",
      url:
        "https://classroom.googleapis.com/v1/courses/" +
        this.courseId +
        "/courseWork",
    });
  }
}
