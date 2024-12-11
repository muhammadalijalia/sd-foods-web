import { useTranslation } from 'react-i18next'
import { MyTextField, MyDateField, MuiAutocomplete, MyTimeField } from '../../../components/FormFields'
import { TextField } from "@material-ui/core";
import Moment from 'moment'
import { useState, useEffect } from 'react';
import '../../../scss/style.scss';
import { CCard, CCardHeader, CCardText, CCol, CContainer, CRow } from '@coreui/react';
import { element } from 'prop-types';
import { getData, putData } from '../../../services/NetworkService';
import toast from 'react-hot-toast'

const AdjustFields = ({ setFieldValue, values, setValues, productsData, isSubmitting, typeArray, stockCountDetail }) => {
    const { t } = useTranslation();
    const [enableProducts, setEnableProducts] = useState(true);

    const handleProductBalance = (value) => {
        if (value == null)
          return        
        getData('prestashop/adjustment/product/' + value.id + '?date=' + values.initialValues.selectedDate)
            .then(response => {
                values.initialValues.balance = response.data.data.balance;
                values.initialValues.id = value.id;
                values.initialValues.prestashopProductId = value.prestashopProductId;
                setValues(values)
            })
            .catch(error => {
                console.log(error);
            })
    }

    const close = () => {
       if (window.confirm('Are you sure you want to close?')) {
          toast.promise(
              putData(`stock-counts/${stockCountDetail.id}`, {id: stockCountDetail.id, status: "CLOSED"}),
              {
                loading: 'Loading',
                success: (resp) => {setEnableProducts(false); return "Stock Count Closed"},
                error: (e) => "Error closing stock count. Contact technical support."
              },
              {
                position: 'bottom-center'
              }
          )
          return false
       }
       return false
    }

    return (
        <>
            {enableProducts && <CCard style={{ padding: '16px' }}>
                <CCardHeader style={{ paddingLeft: '0px', borderColor: 'black', fontSize: '20px' }}>Stock Count</CCardHeader>
                <div className='col-sm-12' style={{ display: 'flex', paddingLeft: '0px' }}>
                    <div className='col-sm-4' style={{paddingLeft: '0px', marginTop: '21px', display: 'none'}}>
                        <MyDateField
                          name={`initialValues.selectedDate`}
                          label={t("Date")}
                          setFieldValue={setFieldValue}
                          onBlur={() => handleProductBalance(values.initialValues.id)}
                        />
                    </div>
                    <div className='col-sm-6' style={{paddingLeft: '0px'}}>
                        <MuiAutocomplete
                            data={productsData.data.content}
                            setFieldValue={setFieldValue}
                            placeholder={t('Select Products')}
                            displayKey={'name'}
                            name={`initialValues.product`}
                            // valueKey="id"
                            // label={t('Products')}
                            parentCallbackOpt={(value) => handleProductBalance(value) }
                            required
                        />
                    </div>
                    <div className='col-sm-4' style={{paddingLeft: '0px', marginTop: '21px'}}>
                        <MyTextField name={`initialValues.quantity`}
                            label={t('Quantity')} type='number' required
                        />
                    </div>
                    <div className="col-sm-3" style={{ marginTop: '21px', paddingTop: '5px' }}>
                        <button disabled={isSubmitting} className="btn btn-sm btn-primary" onClick={() => setFieldValue("action", "confirm")}>{t('Add Count')}</button>&nbsp;
                        <button type="button" disabled={isSubmitting} className="btn btn-sm btn-danger" onClick={() => {close()}}>{t('Close Count')}</button>&nbsp;
                    </div>
                </div>
            </CCard>}
        </>

    )
}

export default AdjustFields;
