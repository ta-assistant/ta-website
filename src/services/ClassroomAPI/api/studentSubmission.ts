import { oauthCredential } from "@/types/Google/oauthCredential";
import { AxiosPromise } from "axios";
import { api } from "./api";

export class StudentSubmission extends api {
  courseId: string;
  courseWorkId: string;
  submissionId: string | null;

  constructor(
    oauthCredential: oauthCredential,
    courseId: string,
    courseWorkId: string,
    submissionId?: string
  ) {
    super(oauthCredential);
    this.courseId = courseId;
    this.courseWorkId = courseWorkId;
    this.submissionId = submissionId ?? null;
  }

  get(): AxiosPromise {
    if (this.submissionId === null) {
      throw Error(
        "To get the specific submission. The submissionId is required"
      );
    }
    return this.sendRequest({
      method: "GET",
      url:
        "https://classroom.googleapis.com/v1/courses/" +
        this.courseId +
        "/courseWork/" +
        this.courseWorkId +
        "/studentSubmissions/" +
        this.submissionId,
    });
  }

  list(): AxiosPromise {
    return this.sendRequest({
      method: "GET",
      url:
        "https://classroom.googleapis.com/v1/courses/" +
        this.courseId +
        "/courseWork/" +
        this.courseWorkId +
        "/studentSubmissions",
    });
  }
}
