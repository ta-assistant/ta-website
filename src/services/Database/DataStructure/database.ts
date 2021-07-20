import firebase from "firebase";

export class Database {
  private _firestore: firebase.firestore.Firestore;

  constructor(firestore: firebase.firestore.Firestore) {
    this._firestore = firestore;
  }

  getFirestore(): firebase.firestore.Firestore {
    return this._firestore;
  }
}
