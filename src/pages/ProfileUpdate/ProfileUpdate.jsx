import React, { useState } from 'react'
import assets from '../../assets/assets'
import './ProfileUpdate.css'

const ProfileUpdate = () => {

  const [image, setImage] = useState(false);

  return (
    <div className='profile'>
      <div className="profile-container">
        <form>
            <h3>Thông tin chi tiết</h3>
            <label htmlFor="avatar">
              <input onChange={(e)=>setImage(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden/>
              <img src={image? URL.createObjectURL(image) : assets.avatar_icon} alt="" />
              Cập nhật ảnh đại diện
            </label>
            <input type="text" placeholder='Tên của bạn' required/>
            <textarea placeholder='Tiểu sử' required></textarea>
            <button type='submit'>Lưu</button>
        </form>
        <img className='profile-pic' src={image? URL.createObjectURL(image) : assets.logo_icon} alt="" />
      </div>
    </div>
  )
}

export default ProfileUpdate