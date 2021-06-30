import { Database } from "../database";
import firebase from "firebase";
import { Teacher } from "./teacher";

export class Classroom extends Database {
  classroomId: string | null;

  constructor(firestore: firebase.firestore.Firestore, classroomId?: string) {
    super(firestore);
    this.classroomId = classroomId ?? null;
  }

  teacher(): Teacher {
    if (this.classroomId === null) {
      throw Error("To get the teacher info. The classroomId is needed");
    }
    return new Teacher(this.getFirestore(), this.classroomId);
  }

  /**
   * Get specific classroom from database.
   * ** Classroom ID is needed **
   */
  get(): Promise<firebase.firestore.DocumentSnapshot> {
    if (this.classroomId === null) {
      throw Error("To get classroom, Classroom ID must be specified");
    }
    return super
      .getFirestore()
      .collection("Classrooms")
      .doc(this.classroomId)
      .get();
  }

  /**
   *  Get all classroom available in database
   * @returns Promise<firebase.firestore.QuerySnapshot>
   */
  list(): Promise<firebase.firestore.QuerySnapshot> {
    return super.getFirestore().collection("Classrooms").get();
  }
}
