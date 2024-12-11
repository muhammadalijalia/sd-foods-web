import useFetch from '../../../hooks/useFetch'
import DetailsTable from 'src/components/DetailsTable';
import { putData } from '../../../services/NetworkService';
import { useTranslation } from 'react-i18next'
import React, { useState } from 'react'
import { SuccessMsg} from "../order/LocationFields";

function ProductDetails(props) {
  const id = props.match.params.id
  const { error, isPending, data } = useFetch('products/' + id)
  const [confirmDialog, setConfirmDialog] = useState(false)
  const { t } = useTranslation();
  let [successMsg, setSuccessMsg] = useState('')
  const [err] = useState(false)
  let [submitting, setSubmitting] = useState(false)

  const handleAction = () => {

    setConfirmDialog(false)
    setSubmitting(true)

    if(!data.data.category.prestashopCategoryId){
        alert("The product category is either not available on ecommerce store or not sync with SDFoods data. Please publish the cateogory from category edit/detail page")
        setSubmitting(false)
        return
    }

    data.data.action = 'PUBLISH'
    putData('products/'+ data.data.id, data.data)
            .then(response => {
                setSubmitting(false)
                setSuccessMsg(t("Your form is submitted successfully"))
                setTimeout(() => { setSuccessMsg('') }, 2500)
                data.data.prestashopProductId = response.data.data.prestashopProductId
            })
            .catch(error => {
                // setErrorMsg()
                setSubmitting(false)
            })
  }

  return (
    <>
    <DetailsTable
      title={data && data.data.name}
      fields={fields}
      data={data && data.data}
      error={error}
      isPending={isPending}
    />
    <SuccessMsg successMsg={successMsg} err={err} />
    {data && !data.data.prestashopProductId && confirmDialog == false &&
       <button type="button" disabled={submitting} className="btn btn-success" onClick={() => {setConfirmDialog(true) }}>{t('Add product on ecommerce store')}</button>

    }
    {confirmDialog === true &&
                  <>
                    <div className="row">
                          <div className="col-sm-4" style={{ backgroundColor: '#ffffff', paddingTop: 10, paddingBottom: 10 }}>
                            <label className="col-form-label" htmlFor="flexCheckDefault" >
                              <b>{t('Are you sure you want to continue?')}</b>&nbsp;
                            </label>
                          </div>
                          <div className="col-sm-1" style={{ backgroundColor: '#ffffff', paddingTop: 10, paddingBottom: 10 }}>
                            <button type="button" disabled={submitting}  className="btn-sm btn-primary" onClick={() => {handleAction() }}>{t('Yes')}</button>&nbsp;
                            <button type="button" disabled={submitting}  className="btn-sm btn-danger" onClick={() => { setConfirmDialog(false) }}>
                                {t('No')}
                            </button>
                        </div>
                    </div>
                  </>
        }
    </>
    )
}
export default ProductDetails;
const fields = [
  { key: 'name', headerName: 'Name' },
  { key: 'category', headerName: 'Category' },
  { key: 'ref', headerName: 'Ref' },
  { key: 'description', headerName: 'Description' },
  { key: 'htPrice', headerName: 'Price' },
  { key: 'unit', headerName: 'Unit' },
  { key: 'tva', headerName: 'TVA' },
  // { key: 'partner', headerName: 'Vendor' }
]