import { oauthCredential } from "@/types/Google/oauthCredential";
import { AxiosPromise } from "axios";
import { api } from "./api";
import { CourseWork } from "./courseWork";

export class Course extends api {
  courseId: string | null;
  /**
   *
   * @param oauthCredential The Credential to be used during the request sending.
   * @param courseId The ID of the course to get the data;
   */
  constructor(oauthCredential: oauthCredential, courseId?: string) {
    super(oauthCredential);
    this.courseId = courseId ?? null;
  }

  courseWork(workId?: string): CourseWork {
    if (this.courseId === null) {
      throw Error("To access courseWork. You must specify the courseId");
    }
    return new CourseWork(this.getOAuthCredential(), this.courseId, workId);
  }

  /**
   *
   * @returns AxiosPromises
   */
  get(): AxiosPromise {
    return super.sendRequest({
      method: "GET",
      url:
        "https://classroom.googleapis.com/v1/courses/" +
        (this.courseId !== null ? this.courseId : ""),
    });
  }
}
