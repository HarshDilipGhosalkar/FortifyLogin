import axios from 'axios';
import jwt_decode from 'jwt-decode';

axios.defaults.baseURL = "http://localhost:9090";

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
