import {useState} from "react";
import {useData, usePost, usePut} from "./UseData";

export const useCategories = (currentPage = 0) => {

    const [reload, setReload] = useState(0);
    const [pageNumber, setPageNumber] = useState();
    const [categories, setCategories] = useState();

    const {loading} = useData(`/categories`, (data) => {
            setCategories(data.content)
            setPageNumber(data.totalPages)
        },
        [currentPage, reload], [{name: "pageNumber", value: currentPage},
            {name: "pageSize", value: 9999}])

    const {post} = usePost(`/categories`, (content) => setCategories(current => {
        return [...current, content]
    }))

    const {put} = usePut(`/categories/id`, content => {
        setCategories(old => {
            return [...old.filter(category => category.id !== content.id), content]
        })
    })

    const addCategory = (name) => {
        return post({
            name
        })
    }

    const modifyCategory = (id, name) => {
        return put({
            name
        }, `/categories/${id}`)
    }


    const reloadData = () => {
        setReload(reload + 1);
    }

    return {categories, loading, addCategory, modifyCategory, pageNumber, reloadData}
}


