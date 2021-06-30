import { Database } from "../database";
import firebase from "firebase";

export class Score extends Database {
  workId: string;
  studentId: string | null;

  constructor(
    firestore: firebase.firestore.Firestore,
    workId: string,
    studentId?: string
  ) {
    super(firestore);
    this.workId = workId;
    this.studentId = studentId ?? null;
  }

  get(): Promise<firebase.firestore.DocumentSnapshot> {
    if (this.studentId === null) {
      throw Error("To get score, StudentId must be specified");
    }
    return this.getFirestore()
      .collection("Works")
      .doc(this.workId)
      .collection("scores")
      .doc(this.studentId)
      .get();
  }

  list(): Promise<firebase.firestore.QuerySnapshot> {
    return this.getFirestore()
      .collection("Works")
      .doc(this.workId)
      .collection("scores")
      .get();
  }
}
