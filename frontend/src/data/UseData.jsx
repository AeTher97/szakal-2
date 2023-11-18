import {useEffect, useState} from "react";
import axios from "axios";

export const useData = (url, updateFunction, triggers = []) => {

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true;
        axios.get(url).then((res) => {
            if (mounted) {
                updateFunction(res.data)
            }
        }).catch(e => {
            console.log(e.response.data.error);
        }).finally(() => {
            if (mounted) {
                setLoading(false);
            }
        })
        return () => {
            mounted = false;
        }
    }, [...triggers]);


    return {loading}
}


export const usePut = (url, updateFunction) => {
    return (data) => {
        axios.put(url, data).then(res => {
            updateFunction(res.data)
        })
    }
}

export const usePost = (url, updateFunction) => {
    return (data) => {
        axios.post(url, data).then(res => {
            updateFunction(res.data)
        })
    }
}