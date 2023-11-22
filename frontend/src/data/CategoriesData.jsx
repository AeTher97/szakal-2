import {useState} from "react";
import {useData, usePost, usePut} from "./UseData";

export const useCategories = () => {

    const [categories, setCategories] = useState();
    const {loading} = useData(`/categories?pageNumber=0`, (data) => setCategories(data.content))

    const {post} = usePost(`/categories`, (content) => setCategories(current => {
        return [...current, content]
    }))

    const {put} = usePut(`/categories/id`, content => {
        setCategories(old => {
            return [...old.filter(category => category.id !== content.id), content]
        })
    })

    const addCategory = (name) => {
        post({
            name
        })
    }

    const modifyCategory = (id, name) => {
        put({
            name
        }, `/categories/${id}`)
    }

    return {categories, loading, addCategory, modifyCategory}
}


