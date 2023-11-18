import {useState} from "react";
import {useData, usePost} from "./UseData";

export const useCategories = () => {

    const [categories, setCategories] = useState();
    const {loading} = useData(`/categories?pageNumber=0`, (data) => setCategories(data.content))

    const post = usePost(`/categories`, (content) => setCategories(current => {
        return [...current, content]
    }))
    const addCategory = (name) => {
        post({
            name
        })
    }

    return {categories, loading, addCategory}
}


