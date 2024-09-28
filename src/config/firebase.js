

import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore"
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
        chatsData: [],
      });
      console.log('User document created successfully');
    } catch (error) {
      toast.error("Người dùng đã tồn tại")
    }
  };

const login = async (email,password) => {
    try {
      await signInWithEmailAndPassword(auth,email,password);
      toast.success("Đăng nhập thành công")
    } catch (error) {
      toast.error("Đăng nhập thất bại, sai email hoặc password")
    }
}

const logout = async () =>{
  try {
    await signOut(auth)
  } catch (error) {
    toast.success("Đăng xuất thành công")
  }
   
}

const resetPass = async (email) =>{
  if (!email) {
    toast.error("Nhập email của bạn")
    return null;
  }
  try {
    const userRef = collection(db,'users');
    const q = query(userRef, where("email", "==", email));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      await sendPasswordResetEmail(auth, email);
      toast.success("Đã gửi về email")
    }
    else{
      toast.error("Email không tồn tại")
    }
  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
}

export {signup,login,logout, auth,db, resetPass}