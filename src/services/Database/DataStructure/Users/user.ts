import { Database } from "../database";
import firebase from "firebase";
import { TaUserIds } from "@/types/TA/IDs";

export class UserManagement extends Database {
  constructor(firestore: firebase.firestore.Firestore) {
    super(firestore);
  }

  get(userId: string): Promise<firebase.firestore.DocumentSnapshot> {
    return this.getFirestore().collection("Users").doc(userId).get();
  }

  search(taUserIds: TaUserIds): Promise<firebase.firestore.QuerySnapshot> {
    if (typeof taUserIds === "undefined") {
      throw Error("taUserIds is required in order to search user");
    }
    const firestoreCollection = this.getFirestore().collection("Users");
    let firestoreQuery: firebase.firestore.Query | null = null;
    Object.entries(taUserIds).forEach(([key, value]) => {
      if (firestoreQuery === null) {
        firestoreQuery = firestoreCollection.where(key, "==", value);
      } else {
        firestoreQuery = firestoreQuery.where(key, "==", value);
      }
    });
    if (firestoreQuery === null) {
      throw Error(
        "There is no property specified in the taUserIds. Searching canceled"
      );
    }
    return (firestoreQuery as firebase.firestore.Query).get();
  }
}
