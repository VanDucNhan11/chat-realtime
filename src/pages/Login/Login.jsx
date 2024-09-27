import React from 'react'
import './Login.css'
import assets from '../../assets/assets'
import { useState } from 'react'

const Login = () => {

  const [currState, setCurrState] = useState("Đăng ký")

  return (
    <div className='login'>
        <img src={assets.logo_big} alt="" className="logo" />
        <form className="login-form">
            <h2>{currState}</h2>
            {currState === "Đăng ký" ? <input type="text" placeholder='Họ và tên' className="form-input" required/>:null}
            <input type="email" placeholder='Địa chỉ email' className="form-input" required/>
            <input type="password" placeholder='Mật khẩu' className="form-input" required/>
            <button type='submit'>{currState === "Đăng ký"?"Xác nhận":"Đăng nhập"}</button>
            <div className="login-term">
               <input type="checkbox" />
               <p>Đồng ý với các điều khoản sử dụng và chính sách bảo mật</p>
            </div>
            <div className="login-forgot">
                {
                  currState === "Đăng ký" ?<p className="login-toggle">Bạn đã có tài khoản ? <span onClick={()=>setCurrState("Đăng nhập")}>Đăng nhập ngay</span></p>
                  :<p className="login-toggle">Bạn chưa có tài khoản ? <span onClick={()=>setCurrState("Đăng ký")}>Đăng ký ngay</span></p>
                }
            </div>
        </form>
    </div>
  )
}

export default Login
