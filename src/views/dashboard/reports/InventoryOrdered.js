import { useState, useEffect } from 'react';
import MainTable from '../../../components/MainTable'
import useFetch from '../../../hooks/useFetch'
import { MyTextField, MyDateField, MuiAutocomplete } from '../../../components/FormFields'
import { useTranslation } from 'react-i18next';
import { Formik, Form } from "formik";
import { getData } from '../../../services/NetworkService';
import moment from 'moment';
import { CSVLink } from "react-csv";
import '../../../scss/style.scss';

const InventoryOrdered = () => {
    const [page, setPage] = useState(1);
    const [exportDate, setExportDate] = useState(null);
    const [exportData, setExportData] = useState(null);
    const { data: vendors } = useFetch('partners', null, 1000)
    const [final, setFinal] = useState(false)
    const [search, setSearch] = useState('startDate=' + moment().subtract(1, "days").valueOf()
        + '&endDate=' + moment().valueOf() + '&page=' + (page - 1));
    const { data: orderedInventory, error: error, isPending: isPending } = useFetch('orders/inventory?' + search);
    const [inventory, setInventory] = useState([])
    const { t } = useTranslation();

    const handlePage = (page_) => {
        setPage(page_);
        setSearch(search.replace('&page=' + (page - 1), '&page=' + (page_ - 1)))
    };

    useEffect(() => {
        if (vendors && orderedInventory) {
            if (orderedInventory.data) {
                setInventory(orderedInventory)
            } else {
                setInventory([])
            }
            setFinal(true)
        }
    }, [vendors, orderedInventory])

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
        setSearch(queryString)
        getData('orders/inventory?' + queryString + 'isPageable=false')
            .then(response => {
                if (response.data) {
                    let _exportData = []
                    let responseData = response.data.data.content
                    responseData.forEach((o) => {
                        let data = {
                            productId: o.id, productName: o.name,
                            orderedPallets: o.totalOrderedPallets, 
                            receivedPallets: o.totalReceivedPallets,
                            orderedNumberofUnits: o.totalOrderedNumberOfUnits,
                            receiverdNumberofUnits: o.totalReceivedNumberOfUnits,
                            damagedQuantity: o.damagedQuantity,
                            vendorName: o.vendorName
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
        { label: 'Product Id', key: 'productId' },
        { label: 'Vendor Name', key: 'vendorName' },
        { label: 'Product Name', key: 'productName' },
        { label: 'Ordered Pallets', key: 'orderedPallets' },
        { label: 'Received Pallets', key: 'receivedPallets' },
        { label: 'Ordered Number of Units', key: 'orderedNumberofUnits' },
        { label: 'Received Number of Units', key: 'receiverdNumberofUnits' },
        { label: 'damagedQuantity', key: 'damagedQuantity' }
    ]

    return (
        <>
            {final &&
                <MainTable
                    tableTitle={"Products Received"}
                    fields={fields}
                    data={inventory}
                    error={error}
                    isPending={isPending}
                    handlePage={handlePage}
                    body={
                        <Formik
                            initialValues={{
                                startDate: moment().subtract(1, "days").valueOf(),
                                endDate: moment().valueOf()
                            }}
                            onSubmit={(values, { setSubmitting }) => {
                                let queryString = '';
                                for (const key in values) {
                                    if (values[key]) {
                                        queryString += key + '=' + values[key] + '&'
                                    }
                                }
                                queryString += 'page=0'
                                setSearch(queryString)
                                setSubmitting(false)                              
                            }}>
                            {({ errors, isSubmitting, setFieldValue, setSubmitting, values }) =>
                                <Form>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <MyTextField placeholder={t("Product Name")} name="productName" label={t("Product Name")} />
                                        </div>
                                        <div className="col-sm-3 auto-complete-display">
                                            <MuiAutocomplete
                                                data={vendors.data.content}
                                                setFieldValue={setFieldValue}
                                                placeholder={t('Enter Vendors')}
                                                displayKey={'name'}
                                                name="vendorName"
                                                valueKey="name"
                                            // val={selectedVendor !== null ? selectedVendor[0] : null}                                                
                                            />
                                        </div>
                                        <div className="col-sm-2">
                                            <MyDateField
                                                name="startDate"
                                                label={t("Start date")}
                                                setFieldValue={setFieldValue}
                                            />
                                        </div>
                                        <div className="col-sm-2">
                                            <MyDateField
                                                name="endDate"
                                                label={t("End date")}
                                                setFieldValue={setFieldValue}
                                            />
                                        </div>
                                        <div className="col-sm-2">
                                            <button disabled={isSubmitting} className="btn btn-sm btn-primary">{t('Search')}</button>&nbsp;
                                            {
                                                <><button type="button" disabled={isSubmitting} color='default' style={{ textDecoration: 'underline' }} className="btn btn-link btn-sm" onClick={() => { export_(values, setSubmitting); }}>{t('Export')}</button>&nbsp;</>
                                            }
                                            {exportData && <CSVLink hidden color='default' style={{ textDecoration: 'underline' }} filename={`${exportDate}.csv`} headers={headers} id="export_link" data={exportData}>{t('Export')}</CSVLink>}
                                        </div>
                                    </div>
                                </Form>
                            }
                        </Formik>
                    }
                />
            }
        </>
    )
}
export default InventoryOrdered;

const fields = [

    { field: 'vendorName', headerName: 'Vendor', flex: 2 },
    { field: 'name', headerName: 'Product', dataId: 'id', flex: 3},
    { field: 'totalOrderedPallets', headerName: 'Ordered Pallets', flex: 2 },
    { field: 'totalReceivedPallets', headerName: 'Received Pallets', flex: 2 },
    { field: 'totalOrderedNumberOfUnits', headerName: 'Ordered Numeber of Units', flex: 2 },
    { field: 'totalReceivedNumberOfUnits', headerName: 'Received Number of Units', flex: 2 },
    { field: 'damagedQuantity', headerName: 'Damaged Quantity', flex: 2 }
    
]