import MainTable from '../../../components/MainTable'
import { useState, useEffect } from 'react';
import useFetch from '../../../hooks/useFetch'
import { deleteData } from '../../../services/NetworkService';
import { useHistory } from 'react-router'
import { useTranslation } from 'react-i18next'
import { MyTextField, MyDateField, MuiAutocomplete, MySelectField } from '../../../components/FormFields'
import { Formik, Form } from "formik";
import { getData } from '../../../services/NetworkService';
import { CSVLink } from "react-csv"
import moment from 'moment'

function Orders(props) {
  const [page, setPage] = useState(1);
  let pathname = props.location.pathname
  const [criteria] = useState(props.location.data ? props.location.data : null)
  const [search, setSearch] = useState(criteria)
  pathname = pathname.substring(1, pathname.length)
  let status = pathname === 'new' ? 'NEW' : pathname === 'validated' ? 'VALIDATED' : pathname === 'confirmed' ?
    'CONFIRMED' : pathname === 'received' ? 'RECEIVED' : pathname === 'stocked' ? 'STOCKED' : pathname === 'published' ? 'PUBLISHED' : pathname === 'cancelled' ? 'CANCELLED' : null

  const { error, isPending, data } = useFetch('orders', page - 1, null, null, null, 'createdOn,desc',
    status != null && search != null ? `status=${status}&${search}` : status != null ? `status=${status}` : search)
  const history = useHistory();
  const { t } = useTranslation();
  const [orders, setOrders] = useState(null)
  const { data: vendors } = useFetch('partners', null, 1000)
  const [exportDate, setExportDate] = useState(null)
  const [exportData, setExportData] = useState(null)


  const fields = [

    { field: 'number', headerName: 'Order No', dataRoute: pathname, dataId: 'id', flex: 1 },
    {
      field: 'partner', headerName: 'Vendor', flex: 1,
      valueFormatter: (params) => params.value && params.value.name
    },
    (status === 'CONFIRMED' || status === 'RECEIVED' || status === 'STOCKED') ? { field: 'deliveryDate', headerName: 'Delivery Date', date: true, flex: 1 } :
      { field: 'createdOn', headerName: 'Created Date', date: true, flex: 1 },

    {
      field: 'status', headerName: 'Status', flex: 1,
      valueFormatter: (params) => params.value && t(params.value)
    },

  ]

  const handleAction = (data) => {
    history.push({
      pathname: 'orders/edit',
      data: data
    })
  }

  const handleDelete = (data) => {
    if(pathname == 'published'){
      alert("PUBLISHED orders cannot be deleted")
      return;
    }
    deleteData('orders/' + data.id)
    let newOrders = orders.data.content.filter(o => o.id !== data.id)
    let data_ = orders.data
    data_.content = newOrders
    setOrders({ ...orders, data: data_ })
  }
  const handlePage = (page) => {
    setPage(page);
  };
  useEffect(() => {
    if (data) {
      setOrders(data)
    }

  }, [data])
  useEffect(() => {
    if (exportData) {
      setTimeout(() => document.getElementById('export_link').click(), 500)
    }
  }, [exportData])
  const export_ = (values, setSubmitting) => {
    setSubmitting(false)
    let queryString = '';
    for (const key in values) {
      if (values[key]) {
        queryString += key + '=' + values[key] + '&'
      }

    }
    queryString = queryString.slice(0, -1)
    setSearch(queryString)
    getData('orders?size=10000&' + queryString)
      .then(response => {
        if (response.data) {
          let _exportData = []
          let responseData = response.data.data.content
          responseData.forEach((o) => {
            let data = {
              week: o.createdOn ? ('S' + moment(o.createdOn).week()) : '', createdOn: o.createdOn ? moment(o.createdOn).format('DD/MM/YY') : '',
              ordernumber: o.number, status: o.status, startTime: o.startTime, deliveryDate: o.deliveryDate, deliveryTime: o.deliveryTime,
              purchaseorder: o.purchaseOrder, supervisor: o.supervisor, transporter: o.transporterName, name: o.employee?.name,

            }
            _exportData.push(data)
            console.log(_exportData)
          })
          setExportDate(new Date().getTime())
          setExportData(_exportData)
          console.log(exportData)
          setSubmitting(false)
        }
      })
      .catch(error => {
        setSubmitting(false)
        console.log(error)
      })

  }
  const headers = [
    { label: 'Semaine', key: 'week' },
    { label: 'Created on', key: 'createdOn' },
    { label: 'Order Number', key: 'ordernumber' },
    { label: 'status', key: 'status' },
    { label: 'Product Name', key: 'productname' },
    { label: 'Category', key: 'category' },
    { label: 'Delivery Date', key: 'deliveryDate' },
    { label: 'Delivery Time', key: 'deliveryTime' },
    { label: 'Start Time', key: 'startTime' },
    { label: 'Supervisor', key: 'supervisor' },
    { label: 'Employee name', key: 'name' }

  ]

  return (
    <MainTable addRoute='orders/add'
      addBtnTitle={t('Add Order')}
      fields={fields}
      data={orders}
      error={error}
      isPending={isPending}
      overRideDelete={!(pathname === 'stocked' || pathname === 'published')}
      handleAction={handleAction}
      handleDelete={handleDelete}
      handlePage={handlePage}
      body={
        <Formik
          initialValues={{ lastName: "", firstName: "" }}
          onSubmit={(values, { setSubmitting }) => {
            let queryString = '';

            for (const key in values) {
              if (values[key]) {
                queryString += key + '=' + values[key] + '&'
              }

            }
            queryString = queryString.slice(0, -1)
            queryString += status ? `&status=${status}` : ''
            setSearch(queryString)
            // console.log(queryString)
            getData('orders?sort=createdOn,desc&' + queryString)
              .then(response => {
                if (response.data) {
                  setOrders(response.data)
                }
                setSubmitting(false)
              })
              .catch(error => {
                setSubmitting(false)
                console.log(error)
              })
          }}>
          {({ values, errors, isSubmitting, setSubmitting, setFieldValue }) => (
            <Form>
              <div className="row">
                {/* <div className="col-sm-6">
                <MyTextField placeholder={t("First name")} name="firstName" label={t("First name")} />
              </div>
              <div className="col-sm-6">
                <MyTextField placeholder={t("Last name")} name="lastName" label={t("Last name")} />
              </div> */}
                <div className="col-sm-6">
                  <MyTextField placeholder={t("Order Number")} name="orderNo" label={t("Order number")} />
                </div>
                < div className="col-sm-6" >
                  <
                    MySelectField placeholder={
                      t("Logistics")
                    }
                    name="logisticsType"

                    options={
                      [{
                        label: 'Inhouse Transporter',
                        value: 'IN_HOUSE'
                      },
                      {
                        label: 'Transport provided by supplier',
                        value: 'BY_SUPPLIER'
                      },
                      {
                        label: 'Outsource with the name of transport company',
                        value: 'OUTSOURCE'
                      },

                      ]
                    }
                  />
                  {
                    values.logisticsType && values.logisticsType === 'OUTSOURCE' &&
                    <
                      MyTextField placeholder={
                        t("Transport Company Name")
                      }
                      name="transporterName"
                      label={
                        t("Transport Company Name")
                      }
                    />
                  }

                </div>

                <div className="col-sm-6">
                  <MyTextField placeholder={t("Product")} name="productName" label={t("Product Name")} />
                </div>
                <div className="col-sm-6">
                  {vendors && <MuiAutocomplete
                    data={vendors.data.content}
                    setFieldValue={setFieldValue}
                    placeholder={t('Enter Vendors')}
                    displayKey={'name'}
                    name="vendorId"
                    valueKey="id"
                  // val={selectedVendor !== null ? selectedVendor[0] : null}


                  />
                  }
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <MyDateField
                    name="startDate"
                    label={t("Start date")}
                    setFieldValue={setFieldValue} />
                </div>
                <div className="col-sm-6">
                  <MyDateField
                    name="endDate"
                    label={t("End date")}
                    setFieldValue={setFieldValue} />
                </div>
                <div className="col-sm-6">
                  <MyDateField
                    name="startDeliveryDate"
                    label={t("Start Delivery date")}
                    setFieldValue={setFieldValue} />
                </div>
                <div className="col-sm-6">
                  <MyDateField
                    name="endDeliveryDate"
                    label={t("End Delivery date")}
                    setFieldValue={setFieldValue} />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <button disabled={isSubmitting} className="btn btn-sm btn-primary">{t('Search')}</button>&nbsp;
                  {

                    <><button type="button" disabled={isSubmitting} color='default' style={{ textDecoration: 'underline' }} className="btn btn-link btn-sm" onClick={() => { setFieldValue("status", null); export_(values, setSubmitting); }}>{t('Export')}</button>&nbsp;</>
                  }
                  {exportData && <CSVLink hidden color='default' style={{ textDecoration: 'underline' }} filename={`${exportDate}.csv`} headers={headers} id="export_link" data={exportData}>{t('Export')}</CSVLink>}
                </div>
              </div>

              {/* <div className="col-sm-6">
                {data && data.data.totalElements}
              </div> */}
              <br />
            </Form>
          )}
        </Formik>
      }
    />
  )
}
export default Orders;
