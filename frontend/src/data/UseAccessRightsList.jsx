import {useState} from "react";
import {useData} from "./UseData";

export const useAccessRightsList = () => {
    const [accessRights, setAccessRights] = useState([]);
    const {loading} = useData(`/accessRights`, (data) => setAccessRights(data));

    return {accessRights, loading}
}
