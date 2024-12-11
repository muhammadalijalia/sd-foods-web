import MainTable from '../../../components/MainTable'
import { useState, useEffect } from 'react';
import useFetch from '../../../hooks/useFetch'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { deleteData, getData, postData, putData } from '../../../services/NetworkService';
import { MyDateField} from '../../../components/FormFields'
import { Formik, Form } from "formik";
import {useLocation} from "react-router-dom";
import moment from 'moment'
import toast from 'react-hot-toast'
import { IconButton, Box } from '@material-ui/core'
import {CIcon} from "@coreui/icons-react"
import Loading from 'src/components/Loading';

const StockCount = () => {
    const search = useLocation().search;
    const [page, setPage] = useState(1);
    const { error, isPending, data } = useFetch('stock-counts', page - 1, 20, null, null, 'createdOn,desc')
    const [stockCounts, setStockCounts] = useState(null)
    const [loader, setLoader] = useState(true)
    const { t } = useTranslation();
    const history = useHistory();

    useEffect(() => {
        if (data) {
            data.data.content.map(o => o.createdOn = moment(o.createdOn).format('DD/MM/YYYY'))
            setStockCounts(data)
            setLoader(false)
        }
    }, [data])

    const handlePage = (page) => {
        setPage(page);
    };


    const startCount = (data) => {
       toast.promise(
              putData(`stock-counts/${data.id}`, {id: data.id, status: "IN_PROGRESS"}),
              {
                loading: 'Loading',
                success: (resp) => {setTimeout(() => {history.push({pathname: `/stock-counts/${data.id}`})}, 1000); return "Stock Count Started"},
                error: (e) => "Error initating stock count. Contact technical support."
              },
              {
                position: 'bottom-center'
              }
       )
    }


    const close = (data) => {
       if (window.confirm('Are you sure you want to close?')) {
       toast.promise(
              putData(`stock-counts/${data.id}`, {id: data.id, status: "CLOSED"}),
              {
                loading: 'Loading',
                success: (resp) => {setTimeout(() => {history.push({pathname: `/stock-counts/${data.id}`})}, 2000); return "Stock Count Closed"},
                error: (e) => "Error closing stock count. Contact technical support."
              },
              {
                position: 'bottom-center'
              }
       )
       }
    }

    const resume = (data) => {
        history.push({pathname: `/stock-counts/${data.id}`})
    }

    const handleAdd = () => {
       setLoader(true)
       toast.promise(
              postData('stock-counts', {}),
              {
                loading: 'Loading',
                success: (resp) => {
                          resp.data.data.createdOn = moment(resp.data.data.createdOn).format('DD/MM/YYYY')
                          data.data.content.unshift(resp.data.data)
                          data.data.content = data.data.content.slice(0, 19)
                          setStockCounts(data)
                          setLoader(false)
                          return "Stock Count Initiated Successfully"
                },
                error: (e) => "Error initiating stock count. Contact technical support."
              },
              {
                position: 'top-center'
              }
       )
    };

    const fields = [

        { field: 'createdOn', headerName: 'Started On', flex: 1, dataRoute: 'stock-counts', dataId: 'id'},
        {
            field: 'createdBy',
            headerName: 'Initiator',
            flex: 1,
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
        },
        {
            field: 'stockCountLineItemsDto',
            headerName: 'Products Count',
            flex: 1,
            valueFormatter: (params) =>  params.row.stockCountLineItemDtos ? params.row.stockCountLineItemDtos.length : 0
        },
        {
          field: 'Activities',
            renderCell: (params) => (
              <>
                {params.row && params.row.status === 'NEW' &&
                  <IconButton size="small" href={null} onClick={() => startCount(params.row)}><CIcon title="Start" size={'sm'} name={'cilArrowRight'}  style={{color: "blue"}}/></IconButton>}
                {params.row && params.row.status === 'IN_PROGRESS' &&
                <><IconButton size="small" href={null} onClick={() => resume(params.row)}><CIcon title="Resume" size={'sm'} name={'cilPencil'} /></IconButton>
                <IconButton size="small" href={null} onClick={() => close(params.row)}><CIcon title="Close" size={'sm'} name={'cilLockLocked'}  style={{color: "maroon"}}/></IconButton>
                </>}
                {params.row && (params.row.status === 'CLOSED' || params.row.status === 'CANCELLED') &&
                <IconButton size="small" href={null} onClick={() => resume(params.row)}><CIcon title="View Details" size={'sm'} name={'cilList'} style={{color: "orange"}}/></IconButton>}
              </>
          )
        }
    ]
    return (
      <>
        {!loader && stockCounts ?
         <MainTable title={'Stock Counts'} addBtnTitle={'Initiate Stock Count'}
            fields={fields}
            data={stockCounts}
            error={error}
            isPending={isPending}
            handlePage={handlePage}
            handleAddCallback={handleAdd}
            body={
              <div>
                <Formik
                  initialValues={{ startDate: moment().startOf('month').valueOf(), endDate: moment().endOf('month').valueOf()}}
                  onSubmit={(values, { setSubmitting }) => {
                    let queryString = '?';

                    for (const key in values) {
                      if (values[key]) {
                        queryString += key + '=' + values[key] + '&'
                      }

                    }
                    queryString = queryString.slice(0, -1)

                    getData('stock-counts' + queryString + '&sort=createdOn,desc')
                      .then(response => {
                        if (response.data) {
                          response.data.data.content.map(o => o.createdOn = moment(o.createdOn).format('DD/MM/YYYY'))
                          setStockCounts(response.data)
                        } else {
                          setStockCounts([])
                        }
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
                          <MyDateField
                          name="startDate"
                          label={t("Start date")}
                          setFieldValue={setFieldValue}
                          />
                        </div>
                        <div className="col-sm-6">
                        <MyDateField
                          name="endDate"
                          label={t("End date")}
                          setFieldValue={setFieldValue}
                          />
                        </div>
                        <div className="col-sm-6">
                          <button disabled={isSubmitting} className="btn btn-sm btn-primary">{t('Search')}</button>
                        </div>
            </div>
                <br />
              </Form>
            )}
          </Formik>
        </div>}
        />: <Loading />
        }
      </>
  )
}
export default StockCount;
