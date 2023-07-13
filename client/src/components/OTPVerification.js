import React, { useState } from "react";
import { useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { generateOTP, verifyOTP } from "../helper/helper";
import { useAuthStore } from '../store/store'

export default function OTPVerification({ onclose, visible}) {
   const{email} =useAuthStore(state=> state.auth)
   const [OTP,setOTP]=useState("");
    const navigate = useNavigate();
    const handleonClose = (e) => {
        if (e.target.id == "container") onclose();
    }
    
   
    async function onSubmit(e){
        e.preventDefault();
      try {
       const{status}= await verifyOTP(OTP)
       if(status === 201){
        toast.success('Verify Successfully!')
         navigate('/reset')
      } 
      } catch (error) {
        return toast.error('Wront OTP! Check email again!')
      }
    }
    
    async function resendOTP(){
     generateOTP(email)
     .then(code => {
        console.log("otppromisse",code);
        toast.success("OTP has been send to your email!")
    })
    .catch(error => {
        toast.error("Could not Send it!")

    });
    }

    if (!visible) return null;
    return (
        <div onClick={handleonClose} id="container" className=" inset-0 fixed bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center">
            <Toaster position='top-center' reverseOrder={false}></Toaster>

            <div className="bg-white flex flex-col rounded-2xl shadow-lg p-10 sm:max-w-5xl max-w-[90%]">
                <h1 className="font-bold text-2xl text-[#376549]">Recovery</h1>
                <p className="text-xs mt-4 text-[#477E56]">Enter OTP to Recover password.</p>
                <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                    <input className="p-2 w-[100%] mt-8 rounded-[12px] border-2 border-[#AAD468] focus:border-teal-500 focus:outline-none text-xs text-[gray]" onChange={(e)=>setOTP(e.target.value)} type="text" placeholder='OTP*' />
                    <button className="text-[14px] rounded-[12px] w-[100%] bg-[#376549] text-[#CBDFC3] py-[6px] border-2 border-[#AAD468] hover:border-teal-500" type='submit'>Recover</button>
                    <p className="text-xs mt-4 text-[#477E56] cursor-pointer" onClick={resendOTP}>Cant get OTP.<span className="text-[red] ">Resend?</span></p>
                </form>
            </div>
        </div>

    );
}