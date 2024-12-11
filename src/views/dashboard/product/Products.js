import MainTable from '../../../components/MainTable'
import { useState, useEffect } from 'react';
import useFetch from '../../../hooks/useFetch'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { deleteData, getData } from '../../../services/NetworkService';
import { MyTextField} from '../../../components/FormFields'
import { Formik, Form } from "formik";
import {useLocation} from "react-router-dom";

const Products = () => {
    const search = useLocation().search;
    const _q = new URLSearchParams(search).get('_q');
    const [page, setPage] = useState(1);
    const { error, isPending, data } = useFetch('products' + (_q ? '?name=' + _q : ''), page - 1)
    const [products, setProducts] = useState(null)
    const { t } = useTranslation();
    const history = useHistory();

    const handleAction = (data) => {
        history.push({
            pathname: '/products/edit',
            data: data
        })
    }
    const handleDelete = (data) => {
        deleteData('products/' + data.id)
        let newProducts = products.data.content.filter(o => o.id !== data.id)
        let data_ = products.data
        data_.content = newProducts
        setProducts({ ...products, data: data_ })
    }

    useEffect(() => {
        if (data) {
            setProducts(data)
        }
    }, [data])

    const handlePage = (page) => {
        setPage(page);
    };
    return (
        <MainTable addRoute='products/add'
            addBtnTitle='Add Product'
            fields={fields}
            data={products}
            error={error}
            isPending={isPending}
            handleDelete={handleDelete}
            handleAction={handleAction}
            handlePage={handlePage}
            body={
              <div>
                <Formik
                  initialValues={{ name: _q }}
                  onSubmit={(values, { setSubmitting }) => {
                    let queryString = '?';

                    for (const key in values) {
                      if (values[key]) {
                        queryString += key + '=' + values[key] + '&'
                      }

                    }
                    queryString = queryString.slice(0, -1)

                    getData('products' + queryString)
                      .then(response => {
                        if (response.data) {
                          console.log("------" + response.data.data);
                          setProducts(response.data)
                          // setError(false)
                          // resetForm()
                        } else {
                          setProducts([])
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
                          <MyTextField placeholder={t("product name")} name="name" label={t("product name")} />
                        </div>
                        <div className="col-sm-6">
                        <MyTextField placeholder={t("category name")} name="categoryName" label={t("category name")} />
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
    />
  )
}
export default Products;
const fields = [

    { field: 'name', headerName: 'Product', dataRoute: 'products', dataId: 'id', flex: 1 },
    {
        field: 'category',
        headerName: 'Category',
        flex: 1,
        valueFormatter: (params) =>
            params.value && params.value.name
    },
]
