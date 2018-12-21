import firebase from 'firebase/app';
import 'firebase/database';

const config = {
  apiKey: "AIzaSyAyuM9nLn1RHUv1j5PmWHmz7aJZkMbAvM4",
  authDomain: "react-slideshow-10adf.firebaseapp.com",
  databaseURL: "https://react-slideshow-10adf.firebaseio.com",
  projectId: "react-slideshow-10adf",
  storageBucket: "",
  messagingSenderId: "503357597586"
};

class Firebase {
  constructor() {
      firebase.initializeApp(config);
      this.db = firebase.database()
  }

  slides = () => {
    return this.db.ref('slides');
  }
}

export default Firebase
