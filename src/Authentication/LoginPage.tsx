import './Authentication.css'
import genxThofaLogo from '../assets/Images/Layer_1.svg'
import passswordicon from '../assets/Icons/Frame.png'
import passwordiconHide from '../assets/Icons/passwordhideicon.svg'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setToken } from '../service/tokenService';



function LoginPage() {
  const navigate=useNavigate()

  const[passicon,setPassicon]=useState<boolean>(false)
   const [email,setemail]=useState<string>('')
  const [password,setpassword]=useState<string>('')
  const [emptyemailinputIndicator,setEmptyemailinputINdicator]=useState<boolean>(false)
    const [emptypasswordinputIndicator,setemptypasswordinputIndicator]=useState<boolean>(false)

  const handlePasswordIconClick = () =>{
    setPassicon(!passicon)
  }
  
const handleLogin=(e:React.FormEvent)=>{
  e.preventDefault()
  if(email.trim() ==""){
        setEmptyemailinputINdicator(true)
}
if(password.trim()==""){
  setemptypasswordinputIndicator(true)
}

axios.post(`http://127.0.0.1:8000/api/auth/login`,{email,password})
    .then((response) => {
    console.log(response);
    setToken(response.data.access_token);
    navigate('/Dashboard')
  })
  .catch((error)=>{
    alert('invalid password')
    console.log('invalid password :',error)})
}

const borderStyle={
  border:'1.5px solid var(--color-warning)'
}

  return (
    <>
<div className="Login-Page-Container w-100 vh-100 d-flex justify-content-center align-items-center">
<div className='login-form'>
<form onSubmit={handleLogin} >
  <div className='d-flex align-items-center w-100 justify-content-center'><img src={genxThofaLogo} /></div>
    <div className="invoice-login-form-group">
      <label style={{position:"relative"}}> Email Address
        <input style={emptyemailinputIndicator ? borderStyle :{}} autoComplete='off' value={email} onChange={e=>setemail(e.target.value)} type="email" placeholder='example@gmail.com' />
                 {emptyemailinputIndicator==false?null:<span style={{position:"absolute",fontSize:"13px",bottom:"-30%",left:"1%",color:"var(--color-warning)"}}>Please Enter Your Email !</span>}

        </label>
         <label style={{position:"relative"}}>Password
        <input  style={emptyemailinputIndicator ? borderStyle :{}} value={password} onChange={e=>setpassword(e.target.value)} type={`${passicon==false?'password':'text'}`} placeholder='Pass@1234' /> {passicon==false ?<img onClick={handlePasswordIconClick} style={{position:"absolute"}} src={passswordicon} alt="" />: <img onClick={handlePasswordIconClick} style={{position:"absolute"}} src={passwordiconHide}/>}
                 {emptypasswordinputIndicator==false?null:<span style={{position:"absolute",fontSize:"13px",bottom:"-30%",left:"1%",color:"var(--color-warning)"}}>Please Enter Your Password !</span>}
        </label>
<p className='forget-pass'><Link style={{textDecoration:"none"}} to='/forgetpassword'>Forget Password?</Link></p>
</div>
<button type='submit' className='btn log-btn'>Login</button>
</form>
</div>
</div>
    </>
  )
}

export default LoginPage