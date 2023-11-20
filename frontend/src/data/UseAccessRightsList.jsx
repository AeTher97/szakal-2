import {useState} from "react";
import {useData} from "./UseData";

export const useAccessRightsList = () => {
    const [accessRights, setAccessRights] = useState([]);
    const {loading} = useData(`/accessRights?pageNumber=0`, (data) => setAccessRights(data.content));

    return {accessRights, loading}
}
