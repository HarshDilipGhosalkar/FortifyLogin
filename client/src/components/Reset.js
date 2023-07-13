import React, { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { resetPasswordValidation } from '../helper/validate'
import { resetPassword } from '../helper/helper'
import { useAuthStore } from '../store/store';
import { useNavigate, Navigate } from 'react-router-dom';
import useFetch from '../hooks/fetch.hook'

export default function Reset() {

    const { email } = useAuthStore(state => state.auth);
    const navigate = useNavigate();
    const [{ isLoading, apiData, status, serverError }] = useFetch('createResetSession')

    const formik = useFormik({
        initialValues: {
            password: '',
            confirm: ''
        },
        validate: resetPasswordValidation,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {

            let resetPromise = resetPassword({ email, password: values.password })

            toast.promise(resetPromise, {
                loading: 'Updating...',
                success: <b>Reset Successfully...!</b>,
                error: <b>Could not Reset!</b>
            });

            resetPromise.then(function () { navigate('/') })
            .catch((error)=> console.log(error));

        }
    })

    if (status && status !== 201) return <Navigate to={'/'} replace={true}></Navigate>
    if (isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
    if (serverError) return <Navigate to={'/'} replace={true}></Navigate>
    

    return (
        <>
            <section className=" min-h-screen flex items-center justify-center ">
                <Toaster position='top-center' reverseOrder={false}></Toaster>
                <div className=" inner-div flex rounded-2xl shadow-lg p-5 sm:w-[25%] md:w-[40%] lg:w-[25%] max-w-[90%]">
                    {/* form */}

                    <div className="login-section sm:w-[100%] p-10 form-wrap ease-in-out duration-[0.8s]">

                        <h1 className="font-bold text-2xl text-[#376549]">Reset Password</h1>
                        <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
                            <input className="p-2 mt-8 w-[100%] rounded-[12px] border-2 border-[#AAD468] focus:border-teal-500 focus:outline-none text-xs text-[gray]" {...formik.getFieldProps('password')} type="text" placeholder='password*' />
                            <input className="p-2 w-[100%] rounded-[12px] border-2 border-[#AAD468] focus:border-teal-500 focus:outline-none text-xs text-[gray] " {...formik.getFieldProps('confirm')} type="text" placeholder='confirm password*' />
                            <button className="mt-[20px] text-[14px] rounded-[12px] w-[100%] bg-[#376549] text-[#CBDFC3] py-[6px] border-2 border-[#AAD468] hover:border-teal-500" type='submit'>Reset</button>

                        </form>

                    </div>
                </div>
            </section>
        </>
    )
}
