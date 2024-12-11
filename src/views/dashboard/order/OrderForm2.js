import { Form, Formik, useFormikContext } from "formik";
import Content from "src/components/Content";
import { MyTextField, MyTimeField, MuiAutocomplete, MuiAutocompleteField, MyProgress, MyDateField } from "src/components/FormFields";
import { useState, useEffect, useContext } from 'react'
import useFetch from '../../../hooks/useFetch'
import { postData, postFormData, putData } from '../../../services/NetworkService'
import { useTranslation } from 'react-i18next'
import { UserContext } from '../../../UserProvider'
import Loading from 'src/components/Loading';
import { Location, save, updateProductLocationsMap, updateLocationFields, LoadPage, SuccessMsg } from "./LocationFields";
import { useHistory } from 'react-router'
import { postNotification } from "./OrderDetails";
import { CFooter, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react'
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';
import { useRef } from "react";

function OrderForm2(props) {
    const { t } = useTranslation();
    const [locQuantity] = useState(new Map())
    const history = useHistory();
    const { data: vendors } = useFetch('partners', null, 1000)
    const { data: employees } = useFetch('employees', null, 1000)
    const { data: products } = useFetch('products', null, 1000)
    const [selectedProducts,] = useState([])
    const [total, setTotal] = useState(0)
    const orderData = props.location.data
    const edit = props.location.data ? true : false
    const [initialValues, setInitialValues] = useState({
        employee: null, totalAmount: null, quantity: null, numberOfUnits: null, product: null, photos: [], products: [], discountPercentage: null, discountedAmount: null,
    });
    const [selectedVendor, setSelectedVendor] = useState(null)
    const [isLoaded, setLoaded] = useState(false)
    const { user } = useContext(UserContext);
    const [validateQuotation, setValidateQuotation] = useState(false)
    const [productLocationMap] = useState(new Map());
    const { data: warehouses } = useFetch('warehouses', null, 1000)
    const [locations, setLocations] = useState([])
    const [orders, setOrders] = useState([])
    const [orderStatus, setOrderStatus] = useState(null)
    const id = orderData ? orderData.id : null;
    let [successMsg, setSuccessMsg] = useState('')
    const [err, setErr] = useState(false)
    const [locQuantityList] = useState(new Map())
    const [open, setOpen] = useState(false)
    const [productId, setProductId] = useState();
    const [otherProductNames, setOtherProductNames] = useState([]);
    const [selectedProductName, setSelectedProductName] = useState(null)
    const [isSubstituteName, setIsSubstituteName] = useState([true])
    const formRef = useRef()

    useEffect(() => {
        if (warehouses) {
            let loc = []
            warehouses.data.content.forEach(warehouse => {
                warehouse.locations.forEach(location => {
                    let locObj = { 'name': warehouse.name + " - " + location.name, 'id': location.id };
                    loc.push(locObj)
                });
            })
            setLocations(loc)
        }
        if (edit && orderData && vendors) {
            setOrderStatus(orderData.status)
            let vendor = vendors.data.content.filter(o => o.id === orderData.partner.id)
            setSelectedVendor(vendor)
            setInitialValues(orderData)
            setLoaded(true)
        }
        if (user && employees) {
            let emp = employees.data.content.filter(o => o.login === user.name)
            setInitialValues({ ...initialValues, 'employee': emp[0] })
            setLoaded(true)
        }
        if (orderData) {
            setOrders(orderData)
            updateProductLocationsMap(orderData.products, productLocationMap, locQuantity, locQuantityList)
        }
        for (let i = 0; i < user.permissions.length; i++) {
            const parent_ = user.permissions[i];
            if (parent_.childList.length > 0) {
                for (let j = 0; j < parent_.childList.length; j++) {
                    const child = parent_.childList[j];
                    if (child.permission === 'validate_quotation')
                        setValidateQuotation(true)
                }
            }
        }
    }, [orders, employees, user, vendors, warehouses, setLocations])

    useEffect(() => {
        try {
            if (orders !== null) {
                orders.products.forEach(product => {
                    selectedProducts.push({ 'id': product.id, 'name': product.otherName == null ? product.name : product.otherName.name, 'htPrice': product.htPrice, 'quantity': product.quantity, 'orderProductId': product.orderProductId, 'numberOfUnits': product.numberOfUnits, 'ref': product.ref })
                })
                let _total = 0;
                selectedProducts.forEach(product => {
                    _total += product.quantity * product.htPrice
                })
                setTotal(_total)
            }
        }
        catch (err) {
            return;
        }


    }, [orders])

    useEffect(() => {
        if (formRef.current) {
            console.log(formRef.current.values)
            if (formRef.current.values.productOtherName && formRef.current.values.productOtherName != '') {
                setIsSubstituteName(false)
                // formRef.current.values.substituteName = null
            } else {
                setIsSubstituteName(true)
            }
        }
    }, [selectedProductName])

    const setErrorMsg = () => {
        setErr(true)
        setSuccessMsg(t("It looks there is an error while processing your request. Please report this issue to us so we can fix it Some error occured, Sorry for inconvenience, Please try again later"))
        setTimeout(() => { setSuccessMsg(''); setErr(false); }, 2500)
    }
    const setRespValues = (data, values) => {
        setSuccessMsg(t("Your order is updated successfully"))
        updateProductLocationsMap(data.data.products, productLocationMap, locQuantity, locQuantityList)
        values.products = data.data.products
        values.comments = ""
        setOrderStatus(data.data.status)
        setTimeout(() => { setSuccessMsg(''); LoadPage(data.data.status, id, history); }, 2500)
    }

    function addProduct(values, setValues) {
        console.log(values)
        let selectedProduct = values.product
        console.log(selectedProduct)
        selectedProduct.quantity = values.quantity
        selectedProduct.numberOfUnits = values.numberOfUnits
        if ((!values.productOtherName || values.productOtherName == null) && values.substituteName && values.substituteName != "") {
            selectedProduct.otherName = {
                name: values.substituteName,
                productId: values.product.id
            }
        } else if (values.productOtherName) {
            selectedProduct.otherName = {
                id: values.productOtherName.id,
                name: values.productOtherName.name,
                productId: values.productOtherName.productId
            }
        }        
        selectedProducts.push(selectedProduct)
        values.products = selectedProducts
        if (formRef.current) {
            if (formRef.current.values.substituteName && formRef.current.values.substituteName != '') {
                formRef.current.values.substituteName = null
            }
            console.log(formRef.current.values)
        }
        let _total = 0;
        selectedProducts.forEach(product => {
            _total += product.quantity * product.htPrice
        })
        setTotal(_total)
        values.totalAmount = _total
        setValues(values)
    }
    const handleSubmit = (values, setSubmitting) => {
        let dataFiles = [];
        let artifect_types = '';
        let base_paths = '';
        if (selectedProducts.length === 0) {
            alert("Please add atleast one product")
            setSubmitting(false)
            return
        }
        if (!(orderStatus === "STOCKED" || orderStatus === "RECEIVED")) {
            console.log(selectedProducts)
            values.products = selectedProducts
        }
        var formData = new FormData();
        formData.append('artifect_type', artifect_types)
        if (edit) {
            const id = orders.id;
            if (dataFiles.length === 0) {
                values.id = id
                putData('orders/' + id, values).then(resp => {
                    if (resp.data) {
                        console.log(resp.data)
                        setSubmitting(false)
                        LoadPage(resp.data.data.status, id, history)
                        postNotification(resp.data, t)
                        return
                    }
                })
            } else {
                base_paths = base_paths.slice(0, -1);
                formData.append('base_path', base_paths)
                dataFiles.map(o => {
                    return formData.append('dataFiles', o)
                })
                postFormData(formData)
                    .then(async res => {
                        if (res && res.data.files) {
                            res.data.files.map(file =>
                            ({
                                'path': file.path,
                                'mimeType': file.mimetype,
                                'title': file.filename,
                                'description': values.description,
                                'mediaType': file.artifect_type
                            })
                            )
                            values.products = orders.products
                            values.id = id
                            const resp = await putData('orders/' + id, values)
                            if (resp.data) {
                                console.log(resp.data)
                                LoadPage(resp.data.data.status, id, history)
                                setSubmitting(false)
                                postNotification(resp.data, t)
                            }
                        }
                    })
                    .catch(error => {
                        setErrorMsg()
                    })
            }
        } else {
            if (values.photos) {
                values.photos.map(o => {
                    dataFiles.push(o)
                    if (artifect_types.length > 0)
                        artifect_types += ','
                    artifect_types += 'photo'
                })
                delete values.photos
            }
            postData('orders', values)
                .then(async response => {
                    const id = response.data.data.id;
                    if (dataFiles.length === 0) {
                        setSubmitting(false)
                        LoadPage(response.data.data.status, id, history)
                        postNotification(response.data, t)
                        return
                    }
                    artifect_types.split(',').map(type => {
                        return base_paths += '/orders/' + id + '/' + type + ','
                    })
                    base_paths = base_paths.slice(0, -1);
                    formData.append('base_path', base_paths)
                    dataFiles.map(o => {
                        return formData.append('dataFiles', o)
                    })
                    const res = await postFormData(formData);
                    if (res && res.data.files) {
                        let files = res.data.files.map(file =>
                        ({
                            'path': file.path,
                            'mimeType': file.mimetype,
                            'title': file.filename,
                            'description': values.description,
                            'mediaType': file.artifect_type
                        })
                        )
                        values.photos = files
                        values.id = id
                        const resp = await putData('orders/' + id, values)
                        if (resp.data) {
                            console.log(resp.data)
                            LoadPage(resp.data.data.status, id, history)
                            postNotification(resp.data, t)
                            setSubmitting(false)
                        }
                    }
                    else {
                        setErrorMsg()
                    }
                })
                .catch(error => {
                    setSubmitting(false)
                    alert(error)
                })
        }
    }

    const handleRemoveClick = (index, values, setValues) => {
        let total_ = values.totalAmount - (selectedProducts[index].quantity * selectedProducts[index].htPrice)
        selectedProducts.splice(index, 1)
        values.totalAmount = total_
        setTotal(total_)
        setValues(values)
    }  

    const handleOtherProductNames = (value) => {        
        setOtherProductNames((value.otherNames == null) ? [] : value.otherNames)        
    }

    // const addSubstitueProductName = (values, setValues) => {
    //     console.log(values)
    //     alert(JSON.stringify(values.substituteName))
    //     toast.promise(
    //         postData(`productname`,{productId: values.product.id, name: values.substituteName}),
    //         {                
    //             loading: "Loading",
    //             success: (response) => {
    //                 console.log(response)
    //                 values.product.productNameDto = []
    //                 values.product.productNameDto.push(response.data.data)                    
    //                 setValues(values)
    //                 console.log(values)                    
    //                 return "Substitute name added successfully"
    //             },
    //             error: (e) => {
    //                 console.log(e)
    //                 return "Product name could not be added"
    //             }
    //         }            
    //     )        
    // }

    return (
        !isLoaded ? <Loading /> :
            <Content title={edit ? t('Edit Order') : t('Add Order')} >
                <Formik
                    innerRef={formRef}
                    initialValues={initialValues}
                    enableReinitialize={true}
                    resetForm={true}
                    onSubmit={(values, { setSubmitting }) => {
                        if (orderStatus === "STOCKED") {
                            save(values, setSubmitting, productLocationMap, orderData, id, updateLocationFields, setRespValues)
                        }
                        else {
                            handleSubmit(values, setSubmitting)
                        }
                    }}
                >
                    {({ values, isSubmitting, setFieldValue, setValues, setSubmitting }) => (
                        <Form>
                            <table className="table table-lightborder" style={{ borderTopWidth: 3, borderColor: "white", borderTopStyle: 'solid' }}>
                                <tbody>
                                    <tr>
                                        <th className="col-sm-3">{t('Order Number')} </th>
                                        <td className="col-sm-3 text-left">{orders ? orders.number : null}</td>
                                        <th className="col-sm-3">{t('Status')}</th>
                                        <td className="text-left">{t(orderStatus)}</td>
                                    </tr>
                                    <br />
                                </tbody>
                            </table>
                            {(edit ? (selectedVendor ? true : false) : true) && vendors && <MuiAutocomplete
                                data={vendors.data.content}
                                setFieldValue={setFieldValue}
                                placeholder={t('Enter Vendors')}
                                displayKey={'name'}
                                name="partner.id"
                                valueKey="id"
                                val={selectedVendor !== null ? selectedVendor[0] : null}
                                label={t('Enter Vendors')}
                                required
                            />}
                            {(orderStatus === 'STOCKED' || orderStatus === 'RECEIVED') ? null :
                                <>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            {products && <MuiAutocomplete
                                                disabled={orderStatus == 'STOCKED' || orderStatus == "PUBLISHED" || orderStatus == "CANCELLED"}
                                                data={products.data.content}
                                                setFieldValue={setFieldValue}
                                                placeholder={t('Select a Product')}
                                                displayKey={'name'}
                                                name='product'
                                                parentCallbackOpt={(value) => {
                                                    handleOtherProductNames(value)
                                                    if (value != null) {
                                                        setProductId(value.id);
                                                        setOpen(true);
                                                    }
                                                    else {
                                                        setProductId(value.id)
                                                        setOpen(false);
                                                    }
                                                }}
                                            />}
                                        </div>
                                        <div className="col-sm-3">
                                            {products && <MuiAutocompleteField
                                                disabled={orderStatus == 'STOCKED' || orderStatus == "PUBLISHED" || orderStatus == "CANCELLED"}
                                                data={otherProductNames}
                                                setFieldValue={setFieldValue}
                                                placeholder={t('Select a different name')}
                                                displayKey={'name'}
                                                name='productOtherName'
                                                setSelectedProductName={setSelectedProductName}
                                            />}
                                        </div>
                                        <div className="col-sm-3">
                                            <br></br>
                                            <MyTextField
                                                disabled={orderStatus == 'STOCKED' || orderStatus == "PUBLISHED" || orderStatus == "CANCELLED" || !isSubstituteName}
                                                placeholder={t('Substitue Name')}
                                                name="substituteName"
                                                label={t('Substitute Name')}
                                            />
                                        </div>
                                        {/* {open &&
                                            <div className="col-sm-2">
                                                <br></br>
                                                <button disabled={false} type="button" className="btn btn-sm btn-primary"
                                                    onClick={() => { addSubstitueProductName(values, setValues) }}> Add Product Name
                                                </button>
                                            </div>
                                        } */}
                                        {/* </div>
                                    <div className="row"> */}
                                        <div className="col-sm-2">
                                            <br></br>
                                            <MyTextField disabled={orderStatus == 'STOCKED' || orderStatus == "PUBLISHED" || orderStatus == "CANCELLED"}
                                                placeholder={t('Pallet')} name="quantity" label={t('Pallet')} type='number' val={values.quantity || null} />
                                        </div>
                                        <div className="col-sm-2">
                                            <br></br>
                                            <MyTextField disabled={orderStatus == 'STOCKED' || orderStatus == "PUBLISHED" || orderStatus == "CANCELLED"}
                                                placeholder={t('Quantity')} name="numberOfUnits" label={t('Quantity')} type='number' val={values.numberOfUnits || null} />
                                        </div>
                                        <div className="col-sm-2">
                                            <br></br>
                                            <button disabled={orderStatus == 'STOCKED' || orderStatus == "PUBLISHED" || orderStatus == "CANCELLED"} type="button" className="btn btn-sm btn-primary" onClick={() => {
                                                if (values.product) {
                                                    // if (values.quantity && values.numberOfUnits) {
                                                    addProduct(values, setValues)
                                                    // }
                                                    // else {
                                                    // alert(t('Please enter quantity and number of units'))
                                                    // }
                                                } else {
                                                    alert('Please select a product')
                                                }
                                            }
                                            }>
                                                +
                                            </button>
                                        </div>
                                    </div >
                                </>
                            }
                            <table className="table table-lightborder">
                                <tbody>
                                    {(orderStatus === 'STOCKED' || orderStatus === 'RECEIVED') ? null :
                                        <>
                                            <tr>
                                                <th>{t('Ref')}</th>
                                                <th>{t('Product')}</th>
                                                <th>{t('Pallet')}</th>
                                                <th>{t('Quantity')}</th>
                                                <th></th>
                                            </tr>
                                            {selectedProducts && selectedProducts.map((product, index) =>
                                                <tr key={product.id}>
                                                    <td>
                                                        {product.ref == null ? '' : product.ref}
                                                    </td>
                                                    <td>
                                                        {product.otherName ? product.otherName.name : product.name}
                                                    </td>
                                                    <td>
                                                        {product.quantity}
                                                    </td>
                                                    <td>
                                                        {product.numberOfUnits}
                                                    </td>

                                                    <td>
                                                        <button type="button" disabled={isSubmitting || orderStatus == 'STOCKED' || orderStatus == "PUBLISHED" || orderStatus == "CANCELLED"} className="btn btn-sm btn-danger" onClick={() => handleRemoveClick(index, values, setValues)}>{t('Delete')}</button>
                                                    </td>
                                                </tr>
                                            )}
                                            {validateQuotation &&
                                                <>
                                                    <tr>
                                                        <td></td><td></td><td></td><td></td>
                                                        <td><b>{t('Discount')}:</b></td>
                                                        <td>
                                                            {values.discountPercentage}
                                                        </td>
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <td></td><td></td><td></td><td></td>
                                                        <td><b>{t('Discounted Amount')}:</b></td>
                                                        <td>
                                                            {values.discountedAmount}
                                                        </td>
                                                        <td></td>
                                                    </tr>
                                                </>
                                            }
                                        </>
                                    }
                                </tbody>
                            </table>
                            {
                                (orderStatus === "RECEIVED" || orderStatus === "STOCKED") &&
                                <Location
                                    orderData={orderData}
                                    productLocationMap={productLocationMap}
                                    values={values}
                                    setFieldValue={setFieldValue}
                                    setValues={setValues}
                                    locations={locations}
                                    locQuantity={locQuantity}
                                    confirmDialog={false}
                                    disabled={orderStatus == 'STOCKED' || orderStatus == "PUBLISHED" || orderStatus == "CANCELLED"}
                                    locQuantityList={locQuantityList}
                                    isSubmitting={isSubmitting}
                                    setSubmitting={setSubmitting}
                                    id={id}
                                    updateLocationFields={updateLocationFields}
                                    setRespValues={setRespValues}
                                    edit={true}
                                    orderStatus={orderStatus}
                                    setErrorMsg={setErrorMsg}
                                />
                            }{
                                <div className='row'>
                                    <div className='col'>
                                        <MyDateField name="expectedDeliveryDate" val={orders.expectedDeliveryDate ? orders.expectedDeliveryDate : null} label={"Expected Delivery Date"} setFieldValue={setFieldValue} required />
                                    </div>
                                    <div className='col'>
                                        <MyTimeField name="expectedDeliveryTime" val={orders.expectedDeliveryTime ? orders.expectedDeliveryTime : null} label={"Expected Delivery Time"} setFieldValue={setFieldValue} required />
                                    </div>
                                </div>
                            }
                            {orderStatus === 'CONFIRMED' && <MyDateField val={orders.deliveryDate ? orders.deliveryDate : null} name="deliveryDate" label={"Delivery Date"} setFieldValue={setFieldValue} />}
                            {orderStatus === "STOCKED" &&
                                <div className="row">
                                    <div className="col-sm-11">
                                        <button type="submit" disabled={isSubmitting} className="btn btn-success" onClick={() => { setFieldValue('status', orderStatus); }}>{t('Save')}</button>
                                    </div>
                                </div>
                            }
                            {!(orderStatus === "RECEIVED" || orderStatus === "STOCKED") &&
                                <div>
                                    <button type="submit" disabled={isSubmitting} className="btn btn-sm btn-primary">{t('Submit')}</button>
                                </div>}
                            <SuccessMsg successMsg={successMsg} err={err} />
                            <MyProgress isSubmitting={isSubmitting} />
                        </Form>
                    )}
                </Formik>
            </Content>
    )
}
export default OrderForm2;
