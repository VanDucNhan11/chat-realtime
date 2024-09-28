import { async } from '@firebase/util';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useContext, useState } from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import assets from '../../assets/assets'
import { auth, db } from '../../config/firebase';
import { AppContext } from '../../context/AppContext';
import upload from '../../lib/upload';
import './ProfileUpdate.css'

const ProfileUpdate = () => {

  const navigate = useNavigate();

  const [image, setImage] = useState(false);
  const [name,setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, serUid] = useState("");
  const [prevImage, setPervImage] = useState("");
  const {setUserData} = useContext(AppContext);

  const profileUpdate = async (event) => {
    event.preventDefault();
    try {
      const docRef = doc(db, 'users', uid);
      let imgUrl = prevImage;
  
      // Nếu người dùng chọn ảnh mới thì tải lên ảnh mới
      if (image) {
        imgUrl = await upload(image);
        setPervImage(imgUrl);
      } else if (!prevImage) {
        // Nếu chưa có ảnh đại diện trước đó, sử dụng ảnh avatar_icon
        imgUrl = assets.avatar_icon;
      }
  
      // Cập nhật thông tin trong CSDL với avatar (nếu có), bio, và name
      await updateDoc(docRef, {
        avatar: imgUrl,
        bio: bio,
        name: name
      });
  
      const snap = await getDoc(docRef);
      setUserData(snap.data());
      navigate('/chat');
      toast.success("Cập nhật thông tin thành công");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };
  
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        serUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const userData = docSnap.data();
  
          if (userData.name) setName(userData.name);
          if (userData.bio) setBio(userData.bio);
          if (userData.avatar) {
            setPervImage(userData.avatar);
          } else {
            // Nếu người dùng chưa có avatar, mặc định sử dụng avatar_icon
            setPervImage(assets.avatar_icon);
          }
        }
      } else {
        navigate('/');
      }
    });
  }, [navigate]);
  

  return (
    <div className='profile'>
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
            <h3>Thông tin chi tiết</h3>
            <label htmlFor="avatar">
              <input onChange={(e)=>setImage(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden/>
              <img src={image? URL.createObjectURL(image) : assets.avatar_icon} alt="" />
              Cập nhật ảnh đại diện
            </label>
            <input onChange={(e)=>setName(e.target.value)} value={name}  type="text" placeholder='Tên của bạn' required/>
            <textarea onChange={(e)=>setBio(e.target.value)} value={bio} placeholder='Tiểu sử' required></textarea>
            <button type='submit'>Lưu</button>
        </form>
        <img className='profile-pic' src={image? URL.createObjectURL(image) : prevImage ? prevImage : assets.logo_icon} alt="" />
      </div>
    </div>
  )
}

export default ProfileUpdate