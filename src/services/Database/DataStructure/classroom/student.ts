import { Database } from "../database";
import firebase from "firebase";

export class Student extends Database {
  classroomId: string;

  constructor(firestore: firebase.firestore.Firestore, classroomId: string) {
    super(firestore);
    this.classroomId = classroomId;
  }

  get(userId: string): Promise<firebase.firestore.DocumentSnapshot> {
    return this.getFirestore()
      .collection("Classrooms")
      .doc(this.classroomId)
      .collection("students")
      .doc(userId)
      .get();
  }

  list(): Promise<firebase.firestore.QuerySnapshot> {
    return this.getFirestore()
      .collection("Classrooms")
      .doc(this.classroomId)
      .collection("students")
      .get();
  }
}
