import React from 'react'
import './LeftSidebar.css'
import assets from '../../assets/assets'

const LeftSidebar = () => {
  return (
    <div className='ls'>
      <div className="ls-top">
        <div className="ls-nav">
            <img src={assets.logo} className='logo' alt="" />
            <div className="menu">
                <img src={assets.menu_icon} alt="" />
                <div className="sub-menu">
                  <p>Cập nhật thông tin cá nhân</p>
                  <hr />
                  <p>Đăng xuất</p>
                </div>
            </div>
        </div>
        <div className="ls-search">
            <img src={assets.search_icon} alt="" />
            <input type="text" placeholder='Nhập tên cần tìm..' />
        </div>
      </div>
      <div className="ls-list">
        {Array(10).fill("").map((item, index)=>(
            <div key={index} className="friends">
            <img src={assets.profile_img} alt="" />
            <div>
                <p>Văn Đức Nhẩn</p>
                <span>Xin chào, bạn khoẻ không?</span>
            </div>
        </div>
        ))}
      </div>
    </div>
  )
}

export default LeftSidebar