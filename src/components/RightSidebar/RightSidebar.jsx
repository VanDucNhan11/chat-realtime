import React from 'react'
import './RightSidebar.css'
import assets from '../../assets/assets'
import { logout } from '../../config/firebase'

const RightSidebar = () => {
  return (
    <div className='rs'>
      <div className="rs-profile">
        <img src={assets.profile_img} alt="" />
        <h3>Van Duc Nhan <img src={assets.green_dot} className='dot' calt="" /></h3>
        <p>Xin chào, Tôi là Nhẩn đang sử dụng chat app</p>
      </div>
      <hr/>
      <div className="rs-media">
        <p>Media</p>
        <div>
          <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
          <img src={assets.pic3} alt="" />
          <img src={assets.pic4} alt="" />
          <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
        </div>
      </div>
      <button onClick={() => logout()}>Đăng xuất</button>
    </div>
  )
}

export default RightSidebar
