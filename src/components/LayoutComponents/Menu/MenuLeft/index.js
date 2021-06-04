import React from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Layout, notification } from 'antd'
import store from 'store'
import { Scrollbars } from 'react-custom-scrollbars'
import _ from 'lodash'

import styles from './style.module.scss'

const { Sider } = Layout
const { SubMenu, Divider } = Menu

const mapStateToProps = ({ menu, settings }) => ({
  menuData: menu.menuLeftData,
  isMenuCollapsed: settings.isMenuCollapsed,
  isMobileView: settings.isMobileView,
  isSettingsOpen: settings.isSettingsOpen,
  isLightTheme: settings.isLightTheme,
  isMobileMenuOpen: settings.isMobileMenuOpen,
})

@withRouter
@connect(mapStateToProps)
@connect(({ project, user }) => ({ project, user }))
class MenuLeft extends React.Component {
  state = {
    selectedKeys: store.get('app.menu.selectedKeys') || [],
    openedKeys: store.get('app.menu.openedKeys') || [],
  }

  async componentWillMount() {
    const {
      dispatch,
      project: { userProjects },
    } = this.props
    this.setSelectedKeys(this.props)
    if (!userProjects) await dispatch({ type: 'project/GET_USER_PROJECT' })
  }

  componentDidMount() {
    const {
      user: { projectID: projectId },
    } = this.props
    if (!projectId)
      notification.warn({
        message: 'Please Set Project To Access All Feature Of this App ',
        duration: 5,
      })
  }

  componentWillReceiveProps(newProps) {
    if (newProps.isMenuCollapsed && !newProps.isMobileView) {
      this.setState({
        openedKeys: [],
      })
    }
    this.setSelectedKeys(newProps)
  }

  setSelectedKeys = props => {
    const { menuData } = this.props
    const flattenItems = (items, key) =>
      items.reduce((flattenedItems, item) => {
        flattenedItems.push(item)
        if (Array.isArray(item[key])) {
          return flattenedItems.concat(flattenItems(item[key], key))
        }
        return flattenedItems
      }, [])
    const selectedItem = _.find(flattenItems(menuData, 'children'), [
      'url',
      props.location.pathname,
    ])
    this.setState({
      selectedKeys: selectedItem ? [selectedItem.key] : [],
    })
  }

  onCollapse = (value, type) => {
    const { dispatch, isMenuCollapsed } = this.props
    if (type === 'responsive' && isMenuCollapsed) {
      return
    }

    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isMenuCollapsed',
        value: !isMenuCollapsed,
      },
    })

    this.setState({
      openedKeys: [],
    })
  }

  onOpenChange = openedKeys => {
    store.set('app.menu.openedKeys', openedKeys)
    this.setState({
      openedKeys,
    })
  }

  handleClick = e => {
    const { dispatch, isSettingsOpen } = this.props
    store.set('app.menu.selectedKeys', [e.key])
    // custom action on settings menu item
    if (e.key === 'settings') {
      dispatch({
        type: 'settings/CHANGE_SETTING',
        payload: {
          setting: 'isSettingsOpen',
          value: !isSettingsOpen,
        },
      })
      return
    }
    this.setState({
      selectedKeys: [e.key],
    })
  }

  generateMenuItems = () => {
    const { menuData = [], project } = this.props

    const { userProjects } = project

    if (
      project &&
      Object.values(project).length &&
      userProjects &&
      Object.values(userProjects).length
    ) {
      const { name, projectID: projectId } = userProjects
      if (name && menuData[0] && projectId) {
        menuData[0].title = name
        menuData[0].children[0].url = `/construction/${projectId}`
        menuData[0].children[1].url = `/users/${projectId}`
        menuData[0].children[2].url = `/roles/${projectId}`
      }
    }

    const generateItem = item => {
      const { key, title, url, icon, disabled, pro } = item
      const {
        user: { projectID: projectId },
      } = this.props
      if (item.divider) {
        return <Divider key={Math.random()} />
      }
      if (item.url) {
        return (
          <Menu.Item key={key} disabled={disabled}>
            <Link to={projectId ? url : '/'}>
              {icon && <span className={`${icon} ${styles.icon} icon-collapsed-hidden`} />}
              <span className={styles.title}>{title}</span>
              {pro && <span className="badge badge-primary badge-collapsed-hidden ml-2">PRO</span>}
            </Link>
          </Menu.Item>
        )
      }
      return (
        <Menu.Item key={key} disabled={disabled}>
          {icon && <span className={`${icon} ${styles.icon} icon-collapsed-hidden`} />}
          <span className={styles.title}>{title}</span>
          {pro && <span className="badge badge-primary badge-collapsed-hidden ml-2">PRO</span>}
        </Menu.Item>
      )
    }

    const generateSubmenu = items =>
      items.map(menuItem => {
        if (menuItem.children) {
          const subMenuTitle = (
            <span key={menuItem.key}>
              <span className={styles.title}>{menuItem.title}</span>
              {menuItem.icon && <span className={`${menuItem.icon} ${styles.icon}`} />}
            </span>
          )
          return (
            <SubMenu title={subMenuTitle} key={menuItem.key}>
              {generateSubmenu(menuItem.children)}
            </SubMenu>
          )
        }
        return generateItem(menuItem)
      })

    return menuData.map(menuItem => {
      if (menuItem.children) {
        const subMenuTitle = (
          <span key={menuItem.key}>
            <span className={styles.title}>{menuItem.title}</span>
            {menuItem.icon && <span className={`${menuItem.icon} ${styles.icon}`} />}
          </span>
        )
        return (
          <SubMenu title={subMenuTitle} key={menuItem.key}>
            {generateSubmenu(menuItem.children)}
          </SubMenu>
        )
      }
      return generateItem(menuItem)
    })
  }

  render() {
    const { selectedKeys, openedKeys } = this.state
    const { isMobileView, isMenuCollapsed, isLightTheme } = this.props
    const menuSettings = isMobileView
      ? {
          width: 256,
          collapsible: false,
          collapsed: false,
          onCollapse: this.onCollapse,
        }
      : {
          width: 256,
          collapsible: true,
          collapsed: isMenuCollapsed,
          onCollapse: this.onCollapse,
          breakpoint: 'lg',
        }

    const menu = this.generateMenuItems()
    return (
      <Sider
        {...menuSettings}
        className={isLightTheme ? `${styles.menu} ${styles.light}` : styles.menu}
      >
        <Scrollbars
          className={isMobileView ? styles.scrollbarMobile : styles.scrollbarDesktop}
          renderThumbVertical={({ style, ...props }) => (
            <div
              {...props}
              style={{
                ...style,
                width: '4px',
                borderRadius: 'inherit',
                backgroundColor: '#c5cdd2',
                left: '1px',
              }}
            />
          )}
          autoHide
        >
          <Menu
            theme={isLightTheme ? 'light' : 'dark'}
            onClick={this.handleClick}
            selectedKeys={selectedKeys}
            openKeys={openedKeys}
            onOpenChange={this.onOpenChange}
            mode="inline"
            className={styles.navigation}
          >
            {menu}
          </Menu>
        </Scrollbars>
      </Sider>
    )
  }
}

export default MenuLeft
