import { oauthCredential } from "@/types/Google/oauthCredential";
import { AxiosPromise } from "axios";
import { api } from "./api";
import { StudentSubmission } from "./studentSubmission";

export class CourseWork extends api {
  courseId: string;
  courseWorkId: string | null;

  /**
   *
   * @param oauthCredential The Credential to be used during the request sending.
   * @param courseId The ID of the course to get the data;
   * @param courseWorkId The ID of the courseWork to get the data;
   */
  constructor(
    oauthCredential: oauthCredential,
    courseId: string,
    courseWorkId?: string
  ) {
    super(oauthCredential);
    this.courseId = courseId;
    this.courseWorkId = courseWorkId ?? null;
  }

  studentSubmission(submissionId?: string): StudentSubmission {
    if (this.courseWorkId === null) {
      throw Error(
        "To get the studetnSubmission, the courseWorkId must be specified"
      );
    }
    return new StudentSubmission(
      this.getOAuthCredential(),
      this.courseId,
      this.courseWorkId,
      submissionId
    );
  }

  /**
   * Get the all courseWork info.
   */
  list(): AxiosPromise {
    return this.sendRequest({
      method: "GET",
      url:
        "https://classroom.googleapis.com/v1/courses/" +
        this.courseId +
        "/courseWork",
    });
  }

  /**
   * Get the courseWork info.
   */
  get(): AxiosPromise {
    if (this.courseWorkId === null) {
      throw Error("To get the courseWork. The courseWorkId must be specified");
    }
    return this.sendRequest({
      method: "GET",
      url:
        "https://classroom.googleapis.com/v1/courses/" +
        this.courseId +
        "/courseWork/" +
        this.courseWorkId,
    });
  }
}
