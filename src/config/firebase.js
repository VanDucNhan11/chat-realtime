

import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore"
import { toast } from "react-toastify";


const firebaseConfig = {
    apiKey: "AIzaSyDkIL6Wiax2XyrYn9EPHyRw2khsPjaf5Js",
    authDomain: "chat-realtime-90aa3.firebaseapp.com",
    projectId: "chat-realtime-90aa3",
    storageBucket: "chat-realtime-90aa3.appspot.com",
    messagingSenderId: "798826218049",
    appId: "1:798826218049:web:ee279894a65685298c3cc0"
  };


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      console.log('User signed up successfully:', user);
      
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        username: username.toLowerCase(),
        email,
        name: "",
        avatar: "",
        bio: "Xin chào, tôi đang sử dụng chat này",
        lastSeen: Date.now(),
      });
  
      await setDoc(doc(db, "chats", user.uid), {
        chatData: [],
      });
      console.log('User document created successfully');
    } catch (error) {
      console.error('Signup error:', error.message);
      toast.error(error.code);
    }
  };
  

export {signup}