import {useState} from "react";
import {useData, usePost, usePut} from "./UseData";

export const useCategories = (currentPage = 0) => {

    const [categories, setCategories] = useState();
    const [pageNumber, setPageNumber] = useState();

    const {loading} = useData(`/categories`, (data) => {
            setCategories(data.content)
            setPageNumber(data.totalPages)
        },
        [currentPage], [{name: "pageNumber", value: currentPage}])

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

    return {categories, loading, addCategory, modifyCategory, pageNumber}
}


