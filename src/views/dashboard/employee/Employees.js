import { useState, useEffect } from 'react';
import { useHistory } from 'react-router'
import useFetch from '../../../hooks/useFetch'
import MainTable from '../../../components/MainTable'
import { Formik, Form } from "formik";
import { useTranslation } from 'react-i18next'
import { getData, deleteData } from '../../../services/NetworkService';
import { MyTextField, MySelectField, MuiAutocomplete } from '../../../components/FormFields'
const Employees = () => {
  const [page, setPage] = useState(1);
  const { error, isPending, data } = useFetch('employees', page - 1)
  const history = useHistory();
  const { t } = useTranslation();
  const { data: jobs } = useFetch('jobs', null, 1000)
  const { data: agn } = useFetch('agencies', null, 1000)
  const [employees, setEmployees] = useState(null)

  const handleAction = (data) => {
    history.push({
      pathname: 'employees/edit',
      data: data
    })
  }
  const handleDelete = (data) => {
    deleteData('employees/' + data.id)
    let newEmployees = employees.data.content.filter(o => o.id !== data.id)
    let data_ = employees.data
    data_.content = newEmployees
    setEmployees({ ...employees, data: data_ })
  }
  const handlePage = (page) => {
    setPage(page);
  };

  useEffect(() => {
    if (data) {
      setEmployees(data)
    }

  }, [data])

  return (
    <MainTable addRoute='/employees/add'
      addBtnTitle='Add Employee'
      fields={fields}
      data={employees}
      error={error}
      isPending={isPending}
      handleDelete={handleDelete}
      handleAction={handleAction}
      handlePage={handlePage}
      body={
        <div>
          <Formik
            initialValues={{ firstName: "", agencyName: "", jobName: "", sellerQualification: "" }}
            onSubmit={(values, { setSubmitting }) => {
              let queryString = '?';

              for (const key in values) {
                if (values[key]) {
                  queryString += key + '=' + values[key] + '&'
                }

              }
              queryString = queryString.slice(0, -1)

              getData('employees' + queryString)
                .then(response => {
                  if (response.data) {
                    console.log("------" + response.data.data);
                    setEmployees(response.data)
                    // setError(false)
                    // resetForm()
                  } else {
                    setEmployees([])
                    // setError(true)
                  }
                  //  setMsg(response.data.message)
                  setSubmitting(false)
                })
                .catch(error => {
                  setSubmitting(false)
                  console.log(error)
                })
            }}>
            {({ isSubmitting, setFieldValue }) => (
              <Form>
                <div className="row">
                  <div className="col-sm-6">
                    <MyTextField placeholder={t("First name")} name="firstName" label={t("First name")} />
                  </div>
                  <div className="col-sm-6">
                    <MyTextField placeholder={t("Last name")} name="lastName" label={t("Last name")} />
                  </div>
                </div>
                <div className="row">

                  <div className="col-sm-6">
                    <MyTextField placeholder={t("Email")} name="email" label={t("Email")} />
                  </div>
                  <div className="col-sm-6">
                    <MyTextField placeholder={t("Phone")} name="phone" label={t("Phone")} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    {agn && <MuiAutocomplete
                      data={agn.data.content}
                      setFieldValue={setFieldValue}
                      placeholder={t('Agency')}
                      displayKey={'name'}
                      name="agencyId"
                      valueKey="id"
                    />}
                  </div>
                  <div className="col-sm-6">
                    {jobs && <MySelectField
                      placeholder={t("Function")}
                      name="jobId"
                      options={
                        jobs.data.content.map(o => {
                          return { label: o.name, value: o.id }
                        })
                      } />}
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <button disabled={isSubmitting} className="btn btn-sm btn-primary">{t('Search')}</button>
                  </div>
                </div>
                <br />
              </Form>
            )}
          </Formik>
        </div>}
    />
  )
}

export default Employees

const fields = [
  { field: 'fullname', headerName: 'Full Name', dataRoute: 'employees', dataId: 'id', flex: 1 },
  { field: 'agencyName', headerName: 'Agency', dataRoute: 'agencies', dataId: 'agencyId', flex: 1 },
  { field: 'jobName', headerName: 'Function', flex: 1 },
  { field: 'sellerQualification', headerName: 'Grade', flex: 1 }
]
