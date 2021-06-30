import { oauthCredential } from "@/types/Google/oauthCredential";
import { courses } from "./api/courses";

class ClassroomApi {
  courses: courses;
  constructor(oauthCredential: oauthCredential) {
    this.courses = new courses(oauthCredential);
  }
}

export default ClassroomApi;
