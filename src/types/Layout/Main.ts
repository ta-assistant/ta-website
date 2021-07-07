import firebase from "firebase";
import { oauthCredential } from "../Google/oauthCredential";

export type CallbackHandler = (
  user: firebase.User,
  authCredential: oauthCredential
) => void;
