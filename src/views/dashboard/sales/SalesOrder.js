import { useState, useEffect } from 'react';
import MainTable from '../../../components/MainTable'
import useFetch from '../../../hooks/useFetch'
import { MyTextField, MyDateField } from '../../../components/FormFields'
import { useTranslation } from 'react-i18next';
import { Formik, Form } from "formik";
import { getData } from '../../../services/NetworkService';
import moment from 'moment';
import { CSVLink } from "react-csv";

const SalesOrder = (props) => {
    const [page, setPage] = useState(1);
    let propData = props.location.data;
    const [sdate, setSdate] = useState(null);
    const [edate, setEdate] = useState(null);
    const [productFilter, setProductFilter] = useState(null);
    const [criteria] = useState(props.location.data ? props.location.data : null)
    const [search, setSearch] = useState(criteria);
    const [exportDate, setExportDate] = useState(null);
    const [exportData, setExportData] = useState(null);
    let date;
    let num = 1;    
    if(page >= 1 && sdate == null && edate == null && productFilter == null) {          
        if(propData != undefined) {
           date = "startDate="+propData.startDate+"&endDate="+propData.endDate + '&';
        }  else {
            date = `startDate=${moment().startOf('month').valueOf()}&endDate=${moment().endOf('month').valueOf()}` + '&';            
        }         
    }   
    else {   
        date =  (productFilter == null ? '' : "productName="+productFilter+"&")  ;           
        if(sdate){            
            date =  date + "startDate="+sdate+"&";
        }
        
        if(edate){
            date = date +"endDate="+edate +"&"
        }      
    }     
    const {error, isPending, data} = useFetch('prestashop/product/sales?' + date + 'page=' + (page -1));
    const [sales, setSales] = useState(null);    
    const { t } = useTranslation();

    const handlePage = (page) => {        
        setPage(page);        
    };
    
    const handlePageOnSearch = (page) => {
        setPage(page);
    }

    useEffect (() => {
        if(data){
            setSales(data);
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
        // queryString = queryString.slice(0, -1)
        setSearch(queryString)
        getData('prestashop/product/sales?' + queryString + 'isPageable=false')
          .then(response => {
            if (response.data) {
              let _exportData = []
              let responseData = response.data.data.content
              responseData.forEach((o) => {                
                let data = {                   
                   productId: o.id , productName: o.productName ,
                   taxValue: o.productTaxValue, quantitySold: o.productTotalQuantity, totalSalesVATIncl: o.productTotalSales, totalSalesVATExcl: o.productTotalSalesTaxExcl,
                   costPrice: o.productCostPrice
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
        { label: 'Product Name', key: 'productName' },
        { label: 'Quantity Sold', key: 'quantitySold' },
        { label: 'Cost Price', key: 'costPrice' },
        { label: 'Sales VAT Incl', key: 'totalSalesVATIncl' },
        { label: 'Sales VAT Excl', key: 'totalSalesVATExcl' },
        { label: 'VAT', key: 'taxValue' }
      ]

    return (         
        <MainTable 
            fields={fields}
            data={sales}
            error={error}
            isPending={isPending} 
            handlePage={handlePage}
            body={
                <Formik
                    initialValues={{startDate: propData != undefined ? 
                        propData.startDate : moment().startOf('month').valueOf(), 
                        endDate: propData != undefined ? 
                        propData.endDate : moment().endOf('month').valueOf()
                    }}
                    onSubmit={(values, {setSubmitting}) => {
                        let queryString = '';
                        for (const key in values){
                            if (values[key]) {
                                queryString += key + '=' + values[key] + '&'                                  
                              }   
                              if(key == 'startDate') {
                                setSdate(values[key]);
                              }
                              if(key == 'endDate') {
                                setEdate(values[key]);
                              }
                              if(key == 'productName') {
                                setProductFilter(values[key]);
                              }
                        }                                                                   
                        getData('prestashop/product/sales?' + queryString + 'page=0')
                            .then(response => {
                                    if(response.data){ 
                                        handlePageOnSearch(1);
                                        setSales(response.data)                                                                            
                                }                                  
                                setSubmitting(false)                                                          
                            }).catch(error=>{                                
                                console.log(error)
                                setSubmitting(false)
                            })
                    }}>
                        {({errors, isSubmitting, setFieldValue, setSubmitting, values }) =>
                        <Form>
                        <div className="row">
                        <div className="col-sm-3">
                            <MyTextField placeholder={t("Product Name")} name="productName" label={t("Product Name")} />
                        </div>
                        <div className="col-sm-3">
                          <MyDateField
                            name="startDate"
                            label={t("Start date")}
                            setFieldValue={setFieldValue}                            
                            />
                        </div>
                        <div className="col-sm-3">
                          <MyDateField
                            name="endDate"
                            label={t("End date")}
                            setFieldValue={setFieldValue}
                            />
                        </div> 
                        <div className="col-sm-3">
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
    )
}
export default SalesOrder;

const fields = [
    
    { field: 'productName', headerName: 'Product Name', dataId: 'id', flex: 1 },
    { field: 'productTotalQuantity', headerName: 'Quantity Sold', flex: 0.5 },
    { field: 'productCostPrice', headerName: 'Cost Price', flex: 0.5 },
    { field: 'productTotalSales', headerName: 'Sales VAT Incl', flex: 0.5 },
    { field: 'productTotalSalesTaxExcl', headerName: 'Sales VAT Excl', flex: 0.5},
    { field: 'productTaxValue', headerName: 'VAT', flex: 0.5}
]