import { useState, useEffect } from 'react';
import { useHistory } from 'react-router'
import useFetch from '../../../hooks/useFetch'
import MainTable from '../../../components/MainTable'
import { deleteData } from '../../../services/NetworkService';

const Teams = () => {
  const [page, setPage] = useState(1);
  const { error, isPending, data } = useFetch('teams', page - 1)
  const [teams, setTeams] = useState(null)
  const history = useHistory();

  const handleAction = (data) => {
    history.push({
      pathname: 'teams/edit',
      data: data
    })
  }

  const handlePage = (page) => {
    setPage(page);
  };
  const handleDelete = (data) => {
    deleteData('teams/' + data.id)
    let newTeams = teams.data.content.filter(o => o.id !== data.id)
    let data_ = teams.data
    data_.content = newTeams
    setTeams({ ...teams, data: data_ })
  }

  useEffect(() => {
    if (data) {
      setTeams(data)
    }
  }, [data])

  return (
    <MainTable addRoute='teams/add'
      addBtnTitle='Add Team'
      fields={fields}
      data={teams}
      error={error}
      isPending={isPending}
      handleDelete={handleDelete}
      handleAction={handleAction}
      handlePage={handlePage} />
  )
}

export default Teams

const fields = [

  { field: 'name', headerName: 'Team', flex: 1, dataRoute: 'teams', dataId: 'id' },
  { field: 'agencyName', headerName: 'Agency', dataRoute: 'agencies', dataId: 'agencyId', flex: 1 },

]
