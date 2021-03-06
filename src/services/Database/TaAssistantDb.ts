import firebase from "firebase";
import { Classroom } from "./DataStructure/classroom/classroom";
import { Work } from "./DataStructure/work/work";
import { UserManagement } from "./DataStructure/Users/user";

export class TaAssistantDb {
  private _firestore: firebase.firestore.Firestore;
  constructor(firestore: firebase.firestore.Firestore) {
    this._firestore = firestore;
  }

  classroom(classroomId?: string): Classroom {
    return new Classroom(this._firestore, classroomId);
  }

  work(workId?: string): Work {
    return new Work(this._firestore, workId);
  }

  users(): UserManagement {
    return new UserManagement(this._firestore);
  }
}
