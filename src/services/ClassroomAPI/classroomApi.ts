import { oauthCredential } from "@/types/Google/oauthCredential";
import { Course } from "./api/course";

class ClassroomApi {
  private _oauthCredential: oauthCredential;
  constructor(oauthCredential: oauthCredential) {
    this._oauthCredential = oauthCredential;
  }

  /**
   *
   * @param courseId The ID of the course to get the data
   * @returns The instance of courses
   */
  course(courseId?: string): Course {
    return new Course(this._oauthCredential, courseId);
  }
}

export default ClassroomApi;
