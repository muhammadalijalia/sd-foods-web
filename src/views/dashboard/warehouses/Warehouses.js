import MainTable from '../../../components/MainTable'
import { useState, useEffect } from 'react';
import { deleteData } from '../../../services/NetworkService';
import { useHistory } from 'react-router'
import useFetch from '../../../hooks/useFetch'

const Warehouses = () => {
    const [page, setPage] = useState(1);
    const { error, isPending, data } = useFetch('warehouses', page - 1)
    const [categories, setCategories] = useState(null)
    const history = useHistory();

    const handleAction = (data) => {
        history.push({
            pathname: 'warehouses/edit',
            data: data
        })
    }

    const handleDelete = (data) => {
        deleteData('warehouses/' + data.id)
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
        <MainTable addRoute='warehouses/add'
            addBtnTitle='Add Warehouse'
            fields={fields}
            data={data}
            error={error}
            isPending={isPending}
            handleDelete={handleDelete}
            handleAction={handleAction}
            handlePage={handlePage} />
    )
}
export default Warehouses;
const fields = [

    { field: 'name', headerName: 'Name', dataRoute: 'warehouses', dataId: 'id', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 1 },

]
