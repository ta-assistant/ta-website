import { oauthCredential } from "@/types/Google/oauthCredential";
import { AxiosPromise } from "axios";
import { api } from "./api";
import { CourseWorkManager } from "./courseWork";

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

  courseWork(workId?: string): CourseWorkManager {
    if (this.courseId === null) {
      throw Error("To access courseWork. You must specify the courseId");
    }
    return new CourseWorkManager(
      this.getOAuthCredential(),
      this.courseId,
      workId
    );
  }

  /**
   * Get the specific courses
   * @returns AxiosPromises
   */
  get(): AxiosPromise {
    if (this.courseId === null) {
      throw Error("To get the specific course. The courseId must be specified");
    }
    return this.sendRequest({
      method: "GET",
      url: "https://classroom.googleapis.com/v1/courses/" + this.courseId,
    });
  }

  /**
   * List all courses;
   * @returns AxiosPromises
   */
  list(): AxiosPromise {
    return this.sendRequest({
      method: "GET",
      url: "https://classroom.googleapis.com/v1/courses/",
    });
  }
}
