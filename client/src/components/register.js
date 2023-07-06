import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import styles from '../styles/Username.module.css';
import wheat from '../assets/farm.jpg';
import Login from './login';
import Register1 from './register1';
import ForgotPassword from './forgotPassword';

export default function Register() {


  const [visible, setvisibility] = useState(false);
  const handleonClose = () => setvisibility(false);
  function hideLogin() {
    console.log("yes");
    document.querySelector("main").classList.toggle("login-form-mode");
    document.querySelector(".login-section").classList.toggle("hidden");
    document.querySelector(".register-section").classList.toggle("hidden");
  }
  return (

    <section className=" min-h-screen flex items-center justify-center ">
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className=" inner-div flex rounded-2xl shadow-lg p-5 sm:max-w-3xl max-w-[90%]">
        {/* form */}

        <div className="login-section sm:w-1/2 px-10 form-wrap ease-in-out duration-[0.8s]">
          <Login />
          <p onClick={() => setvisibility(true)} className=' cursor-pointer text-[12px] text-[#376549]'>Forgot your password?</p>
          <hr className='border-[#376549] my-[10px]' />
          <div className='flex items-center'>
            <p className='text-[12px] text-[#376549]'>Dont have Account?</p>
            <button onClick={hideLogin} className="ml-[15px] text-[12px] justify-center rounded-[10px]   text-white bg-[#376549] px-[10px] py-[6px] border-2 border-[#AAD468] hover:border-teal-500" >Register</button>
          </div>
        </div>
        <div className="register-section hidden sm:w-1/2 px-10 form-wrap">
          <Register1 />
          <div className='flex items-center'>
            <p className='text-[12px] text-[#376549]'>Already have Account?</p>
            <button onClick={hideLogin} className="ml-[15px] text-[12px] justify-center rounded-[10px]   text-white bg-[#376549] px-[10px] py-[6px] border-2 border-[#AAD468] hover:border-teal-500" >Login</button>
          </div>
        </div>

        {/* img div */}
        <div className="w-1/2 sm:block hidden img-div ease-in-out duration-[0.8s]">
          <img className="rounded-2xl h-[100%]" src={wheat} />
        </div>

      </div>

      <ForgotPassword onclose={handleonClose} visible={visible} />
    </section>


  )
}

