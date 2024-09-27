import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets'
import { signup, login } from '../../config/firebase'

const Login = () => {

  const [currState, setCurrState] = useState("Đăng ký")
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault(); 
    if (currState === "Đăng ký") {
      await signup(userName, email, password); 
    }
    else{
      login(email,password);
    }
  };

  return (
    <div className='login'>
        <img src={assets.logo_big} alt="" className="logo" />
        <form onSubmit={onSubmitHandler} className="login-form">
            <h2>{currState}</h2>
            {currState === "Đăng ký" ? <input onChange={(e)=>setUserName(e.target.value)} value={userName} type="text" placeholder='Họ và tên' className="form-input" required/>:null}
            <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder='Địa chỉ email' className="form-input" required/>
            <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder='Mật khẩu' className="form-input" required/>
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
