import firebase from "firebase";
import { Classroom } from "./DataStructure/classroom/classroom";

export class TaAssistantDb {
  private _firestore: firebase.firestore.Firestore;
  constructor(firestore: firebase.firestore.Firestore) {
    this._firestore = firestore;
  }

  classroom(classroomId?: string): Classroom {
    return new Classroom(this._firestore, classroomId);
  }
}
