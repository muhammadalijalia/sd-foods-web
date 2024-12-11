import MainTable from '../../../components/MainTable'
import { useState, useEffect } from 'react';
import { deleteData } from '../../../services/NetworkService';
import { useHistory } from 'react-router'
import useFetch from '../../../hooks/useFetch'

const Categories = () => {
    const [page, setPage] = useState(1);
    const { error, isPending, data } = useFetch('categories', page - 1)
    const [categories, setCategories] = useState(null)
    const history = useHistory();

    const handleAction = (data) => {
        history.push({
            pathname: 'categories/edit',
            data: data
        })
    }

    const handleDelete = (data) => {
        deleteData('categories/' + data.id)
        let newCategories = categories.data.content.filter(o => o.id !== data.id)
        let data_ = categories.data
        data_.content = newCategories
        setCategories({ ...categories, data: data_ })
    }

    useEffect(() => {
        if (data) {
            setCategories(data)
        }
    }, [data])

    const handlePage = (page) => {
        setPage(page);
    };
    return (
        <MainTable addRoute='categories/add'
            addBtnTitle='Add Category'
            fields={fields}
            data={categories}
            error={error}
            isPending={isPending}
            handleDelete={handleDelete}
            handleAction={handleAction}
            handlePage={handlePage} />
    )
}
export default Categories;
const fields = [

    { field: 'name', headerName: 'Category', dataRoute: 'categories', dataId: 'id', flex: 1 },
    { field: 'type', headerName: 'Type', flex: 1 },

]
