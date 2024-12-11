import React, { useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../../UserProvider'
import { useTranslation } from 'react-i18next'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CInputGroup,
  CRow, CImg
} from '@coreui/react'
import { Formik, Form } from 'formik';
import { MyTextField } from 'src/components/FormFields';
import { getData } from 'src/services/NetworkService';
import { Link } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(UserContext);
  const { t } = useTranslation();
  return (
    <div className="c-app c-app-login c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="4">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <Formik
                    initialValues={{ 'username': '', 'password': '' }}
                    onSubmit={(values) => {
                      const params = new URLSearchParams()
                      params.append('username', values.username)
                      params.append('password', values.password)
                      const config = {
                        withCredentials: true,
                        headers: {
                          'Content-Type': 'application/x-www-form-urlencoded'
                        }
                      }
                      axios.post(process.env.REACT_APP_SERVER_URL + 'login', params, config)
                        .then((res) => {
                          if (res.status === 200) {
                            getData('mainmenu')
                              .then(res => {
                                login(values.username, res.data)
                              }).catch(() => alert('Login failed!'))
                          }
                        })
                        .catch((err) => {
                          console.log(err)
                          alert('Login failed!')
                        })
                    }}
                  >
                    {() => (
                      <Form className="text-center">
                        <CImg
                          src={'/logo-main-sdfoods.png'}
                          className="login-logo"
                          width='230'
                          height='150'
                        />
                        <br/>
                        <br/>
                        <p className="text-muted">{t('Sign In to your account')}</p>
                          <MyTextField name="username" placeholder={t("Username")} autoComplete="username" required />
                          <MyTextField type="password" name="password" placeholder={t("Password")} autoComplete="current-password" required />
                          <CRow className="justify-content-center"><CButton color="primary" className="px-4" type="submit">{t('Login')}</CButton></CRow>
                          <CRow className="justify-content-center pt-2"><Link to='/forgotpassword'>{t('Forgot password')}</Link></CRow>
                      </Form>
                    )}
                  </Formik>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
