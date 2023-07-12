import axios from 'axios';
import jwt_decode from 'jwt-decode';

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;


/** Make API Requests */

/** authenticate function */
export async function authenticate(email){
    try {
       await axios.post('/api/authenticate', {email})
       return Promise.resolve();
    } catch (error) {
       return Promise.reject({ error })
    }
}

/** To get username from Token */
export async function getUsername(){
    const token = localStorage.getItem('token')
    if(!token) return Promise.reject("Cannot find Token");
    let decode = jwt_decode(token)
    return decode;
}

/** register user function */
export async function registerUser(credentials){
    try {
        const { data : { msg }, status } = await axios.post(`/api/register`, credentials);

        
        console.log("status",status);
        
        
        return Promise.resolve(msg)
        
    } catch (error) {
        console.log(error.response.data.error.error);
        return Promise.reject({ error })
    }
}

/** login function */
export async function login({ email, password }){
    try {
        if(email){
            const { data } = await axios.post('/api/login', { email, password })
            console.log(data);
            return Promise.resolve({ data });
        }
    } catch (error) {
        return Promise.reject({ error : "Password doesn't Match...!"})
    }
}

/** update user profile function */
export async function updateUser(response){
    try {
        
        const token = await localStorage.getItem('token');
        const data = await axios.put('/api/updateuser', response, { headers : { "Authorization" : `Bearer ${token}`}});

        return Promise.resolve({ data })
    } catch (error) {
        return Promise.reject({ error : "Couldn't Update Profile...!"})
    }
}

/** generate OTP */
export async function generateOTP(email){
    try {
        const {data:{code}} = await axios.get('/api/generateOTP', { params : { email }});

        // send mail with the OTP
        // if(status === 201){
        //     let { data : { email }} = await getUser({ username });
        //     let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
        //     await axios.post('/api/registerMail', { username, userEmail: email, text, subject : "Password Recovery OTP"})
        // }
        return Promise.resolve(code);
    } catch (error) {
        return Promise.reject({ error });
    }
}

/** verify OTP */
export async function verifyOTP({ email, code }){
    try {
       const { data, status } = await axios.get('/api/verifyOTP', { params : { email, code }})
       return { data, status }
    } catch (error) {
        return Promise.reject(error);
    }
}

/** reset password */
export async function resetPassword({ email, password }){
    try {
        const { data, status } = await axios.put('/api/resetPassword', { email, password });
        return Promise.resolve({ data, status})
    } catch (error) {
        return Promise.reject({ error })
    }
}