

import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore"
import { toast } from "react-toastify";


const firebaseConfig = {
  apiKey: "AIzaSyDm4bEc01AeCjanCE7TkyHes7HTFMiH_c4",
  authDomain: "chat-time-7e4b1.firebaseapp.com",
  projectId: "chat-time-7e4b1",
  storageBucket: "chat-time-7e4b1.appspot.com",
  messagingSenderId: "878218036105",
  appId: "1:878218036105:web:288e852fdb183a96875758"
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

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    toast.success("Đăng nhập thành công")
  } catch (error) {
    toast.error("Đăng nhập thất bại, sai email hoặc password")
  }
}

const logout = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    toast.success("Đăng xuất thành công")
  }

}

const resetPass = async (email) => {
  if (!email) {
    toast.error("Nhập email của bạn")
    return null;
  }
  try {
    const userRef = collection(db, 'users');
    const q = query(userRef, where("email", "==", email));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      await sendPasswordResetEmail(auth, email);
      toast.success("Đã gửi về email")
    }
    else {
      toast.error("Email không tồn tại")
    }
  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
}

export { signup, login, logout, auth, db, resetPass }