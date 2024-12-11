import { useState, useEffect } from 'react';
import { useHistory } from 'react-router'
import useFetch from '../../../hooks/useFetch'
import MainTable from '../../../components/MainTable'
import { deleteData } from '../../../services/NetworkService';

const Regions = () => {
  const [page, setPage] = useState(1);
  const { error, isPending, data } = useFetch('regions', page - 1)
  const [regions, setRegions] = useState(null)
  const history = useHistory();

  const handleAction = (data) => {
    history.push({
      pathname: 'regions/edit',
      data: data
    })
  }

  const handleDelete = (data) => {
    deleteData('regions/' + data.id)
    let newRegions = regions.data.content.filter(o => o.id !== data.id)
    let data_ = regions.data
    data_.content = newRegions
    setRegions({ ...regions, data: data_ })
  }

  useEffect(() => {
    if (data) {
      setRegions(data)
    }
  }, [data])

  const handlePage = (page) => {
    setPage(page);
  };

  return (
    <MainTable addRoute='regions/add'
      addBtnTitle='Add Region'
      fields={fields}
      data={regions}
      error={error}
      isPending={isPending}
      handleAction={handleAction}
      handleDelete={handleDelete}
      handlePage={handlePage} />
  )
}

export default Regions

const fields = [
  { field: 'name', headerName: 'Region', flex: 1 },
  { field: 'chiefName', headerName: 'Responsible', flex: 1 },
]

