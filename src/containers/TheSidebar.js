import { useState, useEffect, useContext, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { UserContext } from '../UserProvider'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem, CImg
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

const TheSidebar = () => {
  const dispatch = useDispatch()
  const show = useSelector(state => state.sidebarShow)
  const [navigation, setNavigation] = useState(null);
  const { t } = useTranslation();
  const { user } = useContext(UserContext);

  useEffect(() => {
    let nav = []
    user.permissions.map(o => {
      nav.push(
        {
          _tag: 'CSidebarNavDropdown',
          name: t(o.name),
          icon: <CIcon name={o.icon} customClasses="c-sidebar-nav-icon" />,
          _children: o.childList.filter(o => o.menuUrl !== null && o.menuUrl.length > 0).map(c => (
            {
              _tag: 'CSidebarNavItem',
              name: t(c.name),
              to: c.displayMenu
            }
          ))
        }
      )
    })
    setNavigation(nav)
  }, [])

  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({ type: 'set', sidebarShow: val })}
    >
      <CSidebarBrand className="d-md-down-none" to="/">
        <div className="c-sidebar-brand-full">
          <CImg
            src={'/logo-transparent-sdfoods.png'}
            className="c-sidebar-brand-full"
            height={50}
          />
        </div>
        <CImg

                    src={'/logo/logo-foh-mini-white.png'}
                    className="c-sidebar-brand-minimized"
                    height={30}
                  />

      </CSidebarBrand>
      {navigation && <CSidebarNav>
        <CCreateElement
          items={navigation}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        />
      </CSidebarNav>}
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  )
}

export default memo(TheSidebar)
