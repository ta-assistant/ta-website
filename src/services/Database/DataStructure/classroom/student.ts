import { Database } from "../database";
import firebase from "firebase";
import { IDs } from "./teacher";

export class Student extends Database {
  classroomId: string;

  constructor(firestore: firebase.firestore.Firestore, classroomId: string) {
    super(firestore);
    this.classroomId = classroomId;
  }

  get(by: IDs): Promise<firebase.firestore.DocumentSnapshot> {
    if (typeof by.userId === "undefined") {
      throw Error("To get the specific student. Please speficied the userId");
    }
    return this.getFirestore()
      .collection("Classrooms")
      .doc(this.classroomId)
      .collection("students")
      .doc(by.userId)
      .get();
  }

  search(by: IDs): Promise<firebase.firestore.QuerySnapshot> {
    if (typeof by === "undefined") {
      throw Error("Please specified by param");
    }
    const firestoreCollection = this.getFirestore()
      .collection("Classrooms")
      .doc(this.classroomId)
      .collection("students");
    let firestoreSearch: firebase.firestore.Query | null = null;

    if (typeof by.classroomUserId !== "undefined") {
      firestoreSearch = firestoreCollection.where(
        "classroomUserId",
        "==",
        by.classroomUserId
      );
    }

    if (typeof by.studentId !== "undefined") {
      if (firestoreSearch === null) {
        firestoreSearch = firestoreCollection.where(
          "studentId",
          "==",
          by.studentId
        );
      } else {
        firestoreSearch = firestoreSearch.where(
          "studentId",
          "==",
          by.studentId
        );
      }
    }

    if (firestoreSearch === null) {
      throw Error(
        "To search student, Please specified either `classroomUserId` or `studentId`"
      );
    }

    return firestoreSearch.get();
  }

  list(): Promise<firebase.firestore.QuerySnapshot> {
    return this.getFirestore()
      .collection("Classrooms")
      .doc(this.classroomId)
      .collection("students")
      .get();
  }
}
