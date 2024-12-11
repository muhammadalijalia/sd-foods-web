import { useState, useEffect } from 'react';
import { useHistory } from 'react-router'
import useFetch from '../../../hooks/useFetch'
import MainTable from '../../../components/MainTable'
import { deleteData } from '../../../services/NetworkService';

const Partners = () => {
  const [page, setPage] = useState(1);
  const { error, isPending, data } = useFetch('partners', page - 1)
  const [partners, setPartners] = useState(null)
  const history = useHistory();

  const handleAction = (data) => {
    history.push({
      pathname: 'partners/edit',
      data: data
    })
  }

  const handleDelete = (data) => {
    deleteData('partners/' + data.id)
    let newPartners = partners.data.content.filter(o => o.id !== data.id)
    let data_ = partners.data
    data_.content = newPartners
    setPartners({ ...partners, data: data_ })
  }

  useEffect(() => {
    if (data) {
      setPartners(data)
    }
  }, [data])


  const handlePage = (page) => {
    setPage(page);
  };

  return (
    <>
      <MainTable addRoute='partners/add'
        addBtnTitle='Add Partner'
        fields={fields}
        data={partners}
        error={error}
        isPending={isPending}
        handleAction={handleAction}
        handleDelete={handleDelete}
        handlePage={handlePage} />
    </>
  )
}

export default Partners

const fields = [
  { field: 'name', headerName: 'Partner', dataRoute: 'partners', dataId: 'id', flex: 1 },
]
