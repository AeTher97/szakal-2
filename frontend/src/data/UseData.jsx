import {useEffect, useState} from "react";
import axios from "axios";
import {useDispatch} from "react-redux";
import {showError} from "../redux/AlertActions";

export const useData = (baseUrl,
                        updateFunction,
                        triggers = [],
                        urlParams = [],
                        locks = []) => {

    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();


    let url = baseUrl;
    let first = true;
    for (let param of urlParams) {
        if (param.value !== null && param.value !== undefined) {
            url += `${first ? "?" : "&"}${param.name}=${param.value}`;
            first = false;
        }
    }

    useEffect(() => {
        for (let lock of locks) {
            if (!lock) {
                return;
            }
        }

        let mounted = true;
        setLoading(true)
        axios.get(url).then((res) => {
            if (mounted) {
                updateFunction(res.data)
            }
        }).catch(e => {
            if (e.response.data && e.response.data.error) {
                dispatch(showError(e.response.data.error))
            }
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


export const usePut = (url, updateFunction = () => {
}) => {

    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();

    return {
        loading, put: (data, overrideUrl = undefined) => {
            setLoading(true)
            return axios.put(overrideUrl ? overrideUrl : url, data).then(res => {
                updateFunction(res.data)
            }).catch(e => {
                if (e.response.data && e.response.data.error) {
                    console.error(e.response.data.error);
                    dispatch(showError(e.response.data.error))
                }
            }).finally(() => {
                setLoading(false);
            })
        }
    }
}

export const usePost = (url, updateFunction = () => {
}) => {

    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();


    return {
        loading, post: (data, overrideUrl) => {
            setLoading(true)
            return axios.post(overrideUrl ? overrideUrl : url, data).then(res => {
                updateFunction(res.data)
                return res.data;
            }).catch(e => {
                if (e.response.data && e.response.data.error) {
                    console.error(e.response.data.error);
                    dispatch(showError(e.response.data.error))
                }
                throw e;
            }).finally(() => {
                setLoading(false);
            })
        }
    }
}
export const useDelete = (url, updateFunction = () => {
}) => {

    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();


    return {
        loading, deleteReq: (data, overrideUrl) => {
            setLoading(true)
            return axios.delete(overrideUrl ? overrideUrl : url, data).then(res => {
                updateFunction(res.data)
                return res.data;
            }).catch(e => {
                if (e.response.data && e.response.data.error) {
                    console.error(e.response.data.error);
                    dispatch(showError(e.response.data.error))
                }
                throw e;
            }).finally(() => {
                setLoading(false);
            })
        }
    }
}
