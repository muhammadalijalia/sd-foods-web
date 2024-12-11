import { useState, useEffect } from 'react';
import { useHistory } from 'react-router'
import useFetch from '../../../hooks/useFetch'
import MainTable from '../../../components/MainTable'
import { useTranslation } from 'react-i18next'
import { deleteData } from '../../../services/NetworkService';

const Agencies = () => {
  const [page, setPage] = useState(1);
  const { error, isPending, data } = useFetch('agencies', page - 1)
  const history = useHistory();
  const [agencies, setAgencies] = useState(null)
  const { t } = useTranslation();


  const handleAction = (data) => {
    history.push({
      pathname: 'agencies/edit',
      data: data
    })
  }
  const handleDelete = (data) => {
    deleteData('agencies/' + data.id)
    let newAgencies = agencies.data.content.filter(o => o.id !== data.id)
    let data_ = agencies.data
    data_.content = newAgencies
    setAgencies({ ...agencies, data: data_ })
}

useEffect(() => {
    if (data) {
        setAgencies(data)
    }
}, [data])

  const handlePage = (page) => {
    setPage(page);
  };

  return (
    <MainTable addRoute='agencies/add'
      addBtnTitle='Add Agency'
      fields={fields}
      data={agencies}
      error={error}
      isPending={isPending}
      handleDelete={handleDelete}
      handleAction={handleAction}
      handlePage={handlePage} />
  )
}

export default Agencies

const fields = [

  { field: 'name', headerName: 'Agency', dataRoute: 'agencies', dataId: 'id', flex: 1 },
  { field: 'directorName', headerName: 'Director',dataRoute: 'employees', dataId: 'agencyDirectoryId', flex: 1 },


  {
    field: 'addressDto',
    headerName: 'City',
    flex: 1,
    valueFormatter: (params) =>
     params.value && params.value.city
  },
]
