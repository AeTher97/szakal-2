import {useEffect, useState} from "react";
import axios from "axios";

export const useData = (url, updateFunction, triggers = [], locks = []) => {

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        for (let lock of locks) {
            if (!lock) {
                return;
            }
        }
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
    }, [...triggers, url]);


    return {loading}
}


export const usePut = (url, updateFunction = () => {
}) => {
    return (data, overrideUrl = undefined) => {
        return axios.put(overrideUrl ? overrideUrl : url, data).then(res => {
            updateFunction(res.data)
        })
    }
}

export const usePost = (url, updateFunction = () => {
}) => {
    return (data, overrideUrl) => {
        return axios.post(overrideUrl ? overrideUrl : url, data).then(res => {
            updateFunction(res.data)
            return res.data;
        })
    }
}