import {useState} from "react";
import {useData} from "./UseData";

export const useRolesList = () => {
    const [roles, setRoles] = useState([]);
    const {loading} = useData(`/roles?pageNumber=0`, (data) => setRoles(data.content));

    return {roles, loading}
}