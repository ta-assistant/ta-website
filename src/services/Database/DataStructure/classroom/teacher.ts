import { Database } from "../database";
import firebase from "firebase";
import { TaUserIds } from "@/types/TA/IDs";

export class Teacher extends Database {
  classroomId: string;

  constructor(firestore: firebase.firestore.Firestore, classroomId: string) {
    super(firestore);
    this.classroomId = classroomId;
  }

  get(by: TaUserIds): Promise<firebase.firestore.DocumentSnapshot> {
    if (typeof by.userId === "undefined") {
      throw Error("The userId must be specified to get the teacher");
    }
    return this.getFirestore()
      .collection("Classrooms")
      .doc(this.classroomId)
      .collection("teachers")
      .doc(by.userId)
      .get();
  }
}
