import React from "react";
import { useFormik } from 'formik';
import { profileValidation } from "../helper/validate";
import { authenticate } from "../helper/helper";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { generateOTP } from "../helper/helper";

export default function ForgotPassword({ onclose, visible }) {
    const navigate = useNavigate();
    const handleonClose = (e) => {
        if (e.target.id == "container") onclose();
    }

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validate: profileValidation,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            console.log(values.email);
            let authPromise = authenticate(values.email)
            toast.promise(authPromise, {
                loading: 'Logging...',
                success: <b>User Found!</b>,
                error: <b>Invalid email</b>
            });

            authPromise.then(res => {
              generateOTP(values.email)
                   .then(res => {  
                        console.log(res)     
                // onclose();
                // navigate('/')
                        
                                           
                    })
                    .catch(error => {
                        console.log(error)
                    });
               
            })
            .catch(() => navigate('/'));
        }
    })

    if (!visible) return null;
    return (
        <div onClick={handleonClose} id="container" className=" inset-0 fixed bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center">
            <Toaster position='top-center' reverseOrder={false}></Toaster>

            <div className="bg-white flex flex-col rounded-2xl shadow-lg p-10 sm:max-w-3xl max-w-[90%]">
                <h1 className="font-bold text-2xl text-[#376549]">Forgot Password?</h1>
                <p className="text-xs mt-4 text-[#477E56]">Enter your Email.</p>
                <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
                    <input className="p-2 w-[100%] mt-8 rounded-[12px] border-2 border-[#AAD468] focus:border-teal-500 focus:outline-none text-xs text-[gray]" {...formik.getFieldProps('email')} type="text" placeholder='Email*' />
                    <button className="text-[14px] rounded-[12px] w-[100%] bg-[#376549] text-[#CBDFC3] py-[6px] border-2 border-[#AAD468] hover:border-teal-500" type='submit'>Submit</button>

                </form>
            </div>
        </div>

    );
}