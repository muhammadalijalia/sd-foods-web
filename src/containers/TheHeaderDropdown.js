import { useContext } from 'react'
import { UserContext } from '../UserProvider'
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

const TheHeaderDropdown = () => {
  const { t } = useTranslation();
  const { user, logout } = useContext(UserContext);
  return (
    <CDropdown
      inNav
      className="c-header-nav-items mx-2"
      direction="down"
    >
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          <CImg
            src={'/avatars/profile-default.png'}
            className="c-avatar-img"
            alt=""
          />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">

        <CDropdownItem >
          <CIcon name="cil-settings" className="mfe-2" />
          <Link to="/changepassword">{t('Change password')}</Link>
        </CDropdownItem>
        <CDropdownItem >
          <CIcon name="cil-user" className="mfe-2" />
          <Link to="/myprofile">{t('My Profile')}</Link>
        </CDropdownItem>
        <CDropdownItem divider />
        <CDropdownItem onClick={() => logout()}>
          <CIcon name="cil-lock-locked" className="mfe-2" />
          {t("Logout")}
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default TheHeaderDropdown
