import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { registerValidation } from '../helper/validate';
import { registerUser } from '../helper/helper';


export default function Register1() {
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      email: 'doyol56239@cnogs.com',
      username: 'example123',
      password: 'admin@123'
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      let registerPromise = registerUser(values)
      toast.promise(registerPromise, {
        loading: 'Creating...',
        success: <b>Register Successfully...!</b>,
        error: <b>Could not Register.</b>
      });
      console.log("this promise",registerPromise);
      // registerPromise(()=>console.log("success"))
    }
  })
  return (

    <>
      
      <h1 className="font-bold text-2xl text-[#376549]">Register</h1>
      <p className="text-xs mt-4 text-[#477E56]">If you already a member easily login.</p>
      <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
        <input className="p-2 w-[100%] mt-8 rounded-[12px] border-2 border-[#AAD468] focus:border-teal-500 focus:outline-none text-xs text-[gray]" {...formik.getFieldProps('username')} type="text" placeholder='Username*' />
        <input className="p-2 w-[100%] rounded-[12px] border-2 border-[#AAD468] focus:border-teal-500 focus:outline-none text-xs text-[gray]" {...formik.getFieldProps('email')} type="text" placeholder='Email*' />
        <input className="p-2 w-[100%] rounded-[12px] border-2 border-[#AAD468] focus:border-teal-500 focus:outline-none text-xs text-[gray] " {...formik.getFieldProps('password')} type="text" placeholder='Password*' />
        <button className="text-[14px] rounded-[12px] w-[100%] bg-[#376549] text-[#CBDFC3] py-[6px] border-2 border-[#AAD468] hover:border-teal-500" type='submit'>Register</button>

      </form>
      <div className='mt-2 grid grid-cols-3 items-center text-[#376549]'>
        <hr className='border-[#376549]' />
        <p className='text-center'>Or</p>
        <hr className='border-[#376549]' />
      </div>
      <button className="text-[14px] my-[17px] rounded-[12px] w-[100%]  bg-white text-[#376549] py-[5px] border-2 border-[#AAD468] hover:border-teal-500" >Login with google</button>
      <hr className='border-[#376549] my-[10px]' />
     
    </>


  )
}

