import { Database } from "../database";
import firebase from "firebase";
import { Score } from "./score";

export class Work extends Database {
  workId: string | null;

  constructor(firestore: firebase.firestore.Firestore, workId?: string) {
    super(firestore);
    this.workId = workId ?? null;
  }

  score(studentId?: string): Score {
    if (this.workId === null) {
      throw Error("To get score. workId must be specified");
    }
    return new Score(this.getFirestore(), this.workId, studentId);
  }

  create(classroomId: string, workId: string): Promise<void> {
    return this.getFirestore().collection("Works").doc(workId).set({
      classroomId: classroomId,
    });
  }

  get(): Promise<firebase.firestore.DocumentSnapshot> {
    if (this.workId === null) {
      throw Error("To get work. workId must be specified");
    }
    return this.getFirestore().collection("Works").doc(this.workId).get();
  }
}
