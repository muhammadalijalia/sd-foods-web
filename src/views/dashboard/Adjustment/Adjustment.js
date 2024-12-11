import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Form } from "formik";
import useFetch from '../../../hooks/useFetch'
import AdjustFields from "./AdjustmentFields";
import { putData, postData } from 'src/services/NetworkService';
import { SuccessMsg } from './../order/LocationFields';
import { getData } from '../../../services/NetworkService';
import toast from 'react-hot-toast';
import {
  useParams,
} from "react-router-dom"
import MainTable from '../../../components/MainTable'
import moment from 'moment'

const Adjustment = (props) => {

    const { t } = useTranslation();
    const { error, isPending, data } = useFetch('products/all/');
    const [successMsg, setSuccessMsg] = useState('')
    const [err, setError] = useState('');
    const { id } = useParams();
    const { data:stockCountDetail } = useFetch(`stock-counts/${id}`);
    const [lineItems, setLineItems] = useState()
    const [products, setProducts] = useState()

    let typeArray = [
        { id: 1, name: 'Quantity In' },
        { id: 2, name: 'Quantity Out' }
    ];

    const [initialValues, setInitialValues] = useState({
        id: null,
        name: null,
        externalSystemId: null,
        lotNumber: null,
        expiry: null,
        quantity: null,
        balance: null,
        recordedDate: null,
        recordedTime: null,
        transactionType: null,
        selectedDate: moment().valueOf(),
        prestashopProductId: null
    });

    const [stockUpdateDTO, setStockUpdateDTO] = useState([{
        productId: null,
        count: null
    }])

    useEffect(() => {
        if (data && stockCountDetail) {
            setInitialValues(initialValues);
            var prod_ = []
            let countedMap = new Map()
            stockCountDetail.data.stockCountLineItemDtos.map(o => {
                countedMap.set(o.productId, o.productId)
            })
            data.data.content.map(o => {
                if (countedMap.get(o.id) == null) {
                    prod_.push(o)
                }
                return o
            })
            data.data.content = prod_
            setProducts(data)
            setLineItems(stockCountDetail.data.stockCountLineItemDtos)
        }
    }, [data, stockCountDetail])

    // const handleSubmit = (values, setSubmitting, setFieldValue) => {
    //     if (window.confirm('Are you sure you want to publish this stock on e-commerce?')) {
    //         values.stockUpdateDTO[0].productId = values.initialValues.prestashopProductId;
    //         values.stockUpdateDTO[0].count = values.initialValues.quantity;
    //         toast.promise(putData('prestashop/product/stock', values.stockUpdateDTO),
    //             {
    //                 loading: "Loading",
    //                 success: (response) => {                        
    //                     putData('prestashop/adjustment', values)
    //                         .then((resp) => {                                
    //                         }).catch((e) => console.log(e))
    //                     postData(`stock-counts/${id}/line-items`, { quantity: values.initialValues.quantity, productId: values.initialValues.id })
    //                         .then((resp) => {
    //                             resp.data.data.productName = data.data.content.find(o => o.id === values.initialValues.id)?.name
    //                             data.data.content = data.data.content.filter(o => o.id !== values.initialValues.id)
    //                             setProducts(data)
    //                             setInitialValues(values.initialValues)
    //                             setLineItems([...lineItems, resp.data.data])
    //                         }).catch((e) => console.log(e))
    //                     setSubmitting(false)
    //                     return "Stock count successful"
    //                 },
    //                 error: (e) => {
    //                     console.log(e)
    //                     setSubmitting(false)
    //                     return "Error while update. Contact technical support."
    //                 }
    //             },
    //             {
    //                 style: {
    //                     minWidth: '180px',
    //                 },
    //                 position: "bottom-center"
    //             })                            
    //     }        
    //     setSubmitting(false)
    //     return false
    // }

    const handleSubmit = (values, setSubmitting, setFieldValue) => {
        toast.promise(putData('prestashop/adjustment', values),
            {
                loading: "Loading",
                success: (response) => {
                    postData(`stock-counts/${id}/line-items`, {quantity: values.initialValues.quantity, productId: values.initialValues.id})
                          .then((resp) => {
                              resp.data.data.productName = data.data.content.find(o => o.id === values.initialValues.id)?.name
                              data.data.content = data.data.content.filter(o => o.id !== values.initialValues.id)
                              setProducts(data)
                              setInitialValues(values.initialValues)
                              setLineItems([ ...lineItems, resp.data.data ])
                           }).catch((e) => console.log(e))
                    setSubmitting(false)
                    return "Stock count successful"
                },
                error: (e) => {
                    console.log(e)
                    setSubmitting(false)
                    return "Error while update. Contact technical support."
                }
            },
            {
                style: {
                    minWidth: '180px',                
					},
                position: "bottom-center"
            })
        }

    const fields = [

        { field: 'productName', headerName: 'Product', flex: 2, },
        {
            field: 'quantity',
            headerName: 'Stock Count',
            flex: 1,
        },
        {
            field: 'createdBy',
            headerName: 'Initiator',
            flex: 1,
        },
    ]

    return (
        <>
            {products && initialValues && stockCountDetail?.data && !(stockCountDetail.data.status === 'CLOSED' || stockCountDetail.data.status === 'CANCELLED') &&
                <Formik
                    initialValues={{ initialValues, stockUpdateDTO }}
                    enableReinitialize={true}
                    onSubmit={(values, { setSubmitting }) => {
                        handleSubmit(values, setSubmitting);
                    }}>
                    {({ errors, isSubmitting, setFieldValue, setSubmitting, values, setValues }) =>
                        <Form>
                            <AdjustFields
                                productsData={products}
                                values={values}
                                stockCountDetail={stockCountDetail.data}
                                setValues={setValues}
                                isSubmitting={isSubmitting}
                                setFieldValue={setFieldValue}
                                typeArray={typeArray}>
                            </AdjustFields>
                        </Form>
                    }
                </Formik>
            }

            {
                lineItems &&
                <MainTable
                    tableTitle='Product Line Items'
                    fields={fields}
                    data={lineItems.reverse()}
                    error={error}
                />
            }
        </>
    )
}

export default Adjustment;
