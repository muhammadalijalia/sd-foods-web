import React, { lazy, useState, useEffect } from 'react'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { getData } from 'src/services/NetworkService';
import { MyDateField } from '../../components/FormFields'
import { Formik, Form } from "formik"
import { CBadge, CCard, CCardBody, CCardHeader, CCol, CRow, CCallout } from '@coreui/react'
import useFetch from 'src/hooks/useFetch';
import Loading from '../../components/Loading'
const WidgetsDropdown1 = lazy(() => import('../widgets/WidgetsDropdown1.js'))

const Dashboard = () => {
  const { t } = useTranslation()
  const [startDate, setStartDate] = useState(moment().date(1).valueOf())
  const [endDate, setEndDate] = useState(moment().endOf('month').valueOf())
  const [stats, setStats] = useState(null)
  const { data: employee } = useFetch('employeeprofile')

  useEffect(() => {
    getData('orders/dashboard?' + `startDate=${moment().startOf('month').valueOf()}&endDate=${moment().endOf('month').valueOf()}`)
      .then(response => {
        if (response && response.data) {
          setStats(response.data.data)
        }
      })
  }, [])

  return (
    <>
      <Formik
        initialValues={{ startDate: moment().startOf('month').valueOf(), endDate: moment().endOf('month').valueOf() }}
        onSubmit={(values, { setSubmitting }) => {
          setStats(null)
          let queryString = '';
          for (const key in values) {
            if (values[key]) {
              queryString += key + '=' + values[key] + '&'
            }
          }
          values.startDate && setStartDate(values.startDate)
          values.endDate && setEndDate(values.endDate)
          queryString = queryString.slice(0, -1)
          getData('orders/dashboard?' + queryString)
            .then(response => {
              setSubmitting(false)
              if (response.data) {
                setStats(response.data.data)
                setSubmitting(false)
              }
            })
            .catch(error => {
              setSubmitting(false)
              console.log(error)
            })
            .catch(error => {
              setSubmitting(false)
              console.log(error)
            })
        }}>
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <div className="row" style={{ background: 'white', paddingTop: 20, margin: '0 1px 25px 0px', borderRadius: 5 }}>
              <div className="col-sm-3"></div>
              <div className="col-sm-4"></div>
              <div className="col-sm-2">
                <MyDateField
                  name="startDate"
                  label={t("Start date")}
                  setFieldValue={setFieldValue} />
              </div>
              <div className="col-sm-2">
                <MyDateField
                  name="endDate"
                  label={t("End date")}
                  setFieldValue={setFieldValue} />
              </div>
              <div className="col-sm-1">
                <button style={{ marginTop: 2 }} disabled={isSubmitting} className="btn btn-primary">{t('Search')}</button>&nbsp;
              </div>
            </div>
          </Form>
        )}
      </Formik>
      {employee && stats && <WidgetsDropdown1 employee={employee} startDate={startDate} endDate={endDate} stats={stats} />}
      {stats ?
      <>
        {stats && stats.damagedLocationWiseCounts && stats.damagedLocationWiseCounts.length > 0 &&
        <CRow>
          <CCol>
            <CCard>
              <CCardHeader>
                <strong>Damaged Quantity</strong>
              </CCardHeader>
              <CCardBody>
                {/*<CRow>
                  <CCol sm="6">
                    <CCallout color="warning">
                      <small className="text-muted">
                        Damaged Quantity
                      </small>
                      <br />
                      <strong className="h4">
                        {stats?.damagedQuantity
                        }
                      </strong>
                    </CCallout>
                  </CCol>
                </CRow>*/}
                <table className="table table-hover table-outline mb-0 d-none d-sm-table">
                  <thead className="thead-light">
                    <tr>
                      <th className="">{t('Product')}</th>
                      <th>{t('Location')}</th>
                      <th className="text-center">{t('Count')}</th>
                    </tr>
                  </thead>
                  <tbody>
                        {
                          stats && stats.damagedLocationWiseCounts.map(o => {
                              return (
                                  <tr>
                                    <td>
                                      <div>{o.productDto.name}</div>
                                    </td>
                                    <td className="">{o.locationsDto.warehouseName + '-' + o.locationsDto.name}</td>
                                    <td className="text-center">{o.count}</td>
                                  </tr>
                              )
                            }
                          )
                        }
                  </tbody>
                </table>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        }
        {stats && stats.expiryDaysThreshold && stats.expiredLocationWiseCounts.length > 0 &&
        <CRow>
          <CCol>
            <CCard>
              <CCardHeader>
                <strong>Almost Expired Stock ({stats && stats.expiryDaysThreshold} days threshold)</strong>
              </CCardHeader>
              <CCardBody>
                {/*<CRow>
                  <CCol sm="6">
                    <CCallout color="warning">
                      <small className="text-muted">
                        Damaged Quantity
                      </small>
                      <br />
                      <strong className="h4">
                        {stats?.damagedQuantity
                        }
                      </strong>
                    </CCallout>
                  </CCol>
                </CRow>*/}
                <table className="table table-hover table-outline mb-0 d-none d-sm-table">
                  <thead className="thead-light">
                    <tr>
                      <th className="">{t('Product')}</th>
                      <th>{t('Location')}</th>
                      <th>{t('Expiring in')}</th>
                      <th className="text-center">{t('Count')}</th>
                    </tr>
                  </thead>
                  <tbody>
                        {
                          stats && stats.expiredLocationWiseCounts.map(o => {
                              return (
                                  <tr>
                                    <td>
                                      <div>{o.productDto.name}</div>
                                    </td>
                                    <td className="">{o.locationsDto.warehouseName + '-' + o.locationsDto.name}</td>
                                    <td className="">{o.daysToExpire} {o.daysToExpire > 1 ? 'days' : o.daysToExpire < -1 ? 'days' : 'day'}</td>
                                    <td className="text-center">{o.count}</td>
                                  </tr>
                              )
                            }
                          )
                        }
                  </tbody>
                </table>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        }
      </> : <Loading />
      }
    </>
  )
}

export default Dashboard
