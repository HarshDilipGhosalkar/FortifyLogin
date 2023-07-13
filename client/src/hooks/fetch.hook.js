import axios from "axios";
import { useEffect, useState } from "react";
import { getUsername } from '../helper/helper'

axios.defaults.baseURL = "http://localhost:9090";


/** custom hook */
export default function useFetch(query){
    const [getData, setData] = useState({ isLoading : false, apiData: undefined, status: null, serverError: null })

    useEffect(() => {
        const fetchData = async () => {
            try {
                setData(prev => ({ ...prev, isLoading: true}));

                const { email } = !query ? await getUsername() : '';
                
                const { data, status } = !query ? await axios.get(`/api/user/${email}`) : await axios.get(`/api/${query}`);
               
                if(status === 201 || status === 200){
                    setData(prev => ({ ...prev, isLoading: false,apiData : data, status: status}));
                }

                setData(prev => ({ ...prev, isLoading: false}));
            } catch (error) {
                setData(prev => ({ ...prev, isLoading: false, serverError: error }))
            }
        };
        fetchData()

    },[query]);

    return [getData, setData];
}