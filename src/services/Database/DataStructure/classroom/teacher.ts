import { Database } from "../database";
import firebase from "firebase";

export type IDs = {
  userId?: string;
  studentId?: string;
  classroomUserId?: string;
};

export class Teacher extends Database {
  classroomId: string;

  constructor(firestore: firebase.firestore.Firestore, classroomId: string) {
    super(firestore);
    this.classroomId = classroomId;
  }

  get(getUserBy: IDs): Promise<firebase.firestore.DocumentSnapshot> {
    if (typeof getUserBy.userId === "undefined") {
      throw Error("The userId must be specified to get the teacher");
    }
    return this.getFirestore()
      .collection("Classrooms")
      .doc(this.classroomId)
      .collection("teachers")
      .doc(getUserBy.userId)
      .get();
  }
}
