import { oauthCredential } from "@/types/Google/oauthCredential";
import { CourseManager } from "./api/course";

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
  course(courseId?: string): CourseManager {
    return new CourseManager(this._oauthCredential, courseId);
  }
}

export default ClassroomApi;
