import { Database } from "../database";
import firebase from "firebase";
import { Teacher } from "./teacher";
import { Student } from "./student";
import { Course } from "@/types/ClassroomAPI/courses";

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

  student(): Student {
    if (this.classroomId === null) {
      throw Error("To get the teacher info. The classroomId is needed");
    }
    return new Student(this.getFirestore(), this.classroomId);
  }

  async create(course: Course, firebaseUserId: string): Promise<void> {
    const classroomCheckInstance = await this.getFirestore()
      .collection("Classrooms")
      .doc(course.id)
      .get();
    if (classroomCheckInstance.exists) {
      throw Error("This class has already been created.");
    }
    await this.getFirestore().collection("Classrooms").doc(course.id).set({
      name: course.name,
      ownerId: course.ownerId,
      courseState: course.courseState,
      linkTimestamp: Date.now(),
      linkBy: firebaseUserId,
    });
    await this.getFirestore()
      .collection("Classrooms")
      .doc(course.id)
      .collection("teachers")
      .doc(firebaseUserId)
      .set({});
    return;
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
