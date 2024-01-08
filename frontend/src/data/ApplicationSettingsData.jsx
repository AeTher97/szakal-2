import {useData, usePut} from "./UseData";
import {useState} from "react";

export const useApplicationSettings = () =>{

    const [settings, setSettings] = useState([])

    const {loading} = useData(`/app-settings`, (data) => {
            setSettings(data)
        },
        [])

    const {put, loading: saveLoading} = usePut(`/app-settings`, (data) => {
        setSettings(data);
    })

    const getSetting = (name) => {
        return settings.find(setting => setting.name === name) ? settings.find(setting => setting.name === name).value
            : null;
    }

    const setSetting = (name, value) => {
        return put({
            value
        }, `/app-settings/${name}`)
    }

    return {settings, getSetting, setSetting, saveLoading}
}