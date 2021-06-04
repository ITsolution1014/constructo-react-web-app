import React from 'react'
import { connect } from 'react-redux'
import { Menu, Dropdown } from 'antd'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import styles from './style.module.scss'

@connect(({ user }) => ({ user }))
class ProfileMenu extends React.Component {
  logout = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'user/LOGOUT',
    })
  }

  render() {
    const { user } = this.props

    const menu = (
      <Menu selectable={false}>
        <Menu.Item>
          <strong>
            <FormattedMessage id="topBar.profileMenu.hello" /> {user.name || 'Anonymous'}
          </strong>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <div>
            <strong className="mr-2">
              <FormattedMessage id="topBar.profileMenu.email" />
            </strong>
            {user.email}
            <br />
            <strong className="mr-2">
              <FormattedMessage id="topBar.profileMenu.phone" />
            </strong>
            {user.phone || '-'}
          </div>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <Link to="/profile">
            <i className={`${styles.menuIcon} icmn-user`} />
            <FormattedMessage id="topBar.profileMenu.Profile" />
          </Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <a href="#" onClick={this.logout}>
            <i className={`${styles.menuIcon} icmn-exit`} />
            <FormattedMessage id="topBar.profileMenu.logout" />
          </a>
        </Menu.Item>
      </Menu>
    )
    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <div className={`${styles.dropdown} mt-3`}>
          <p style={{ fontWeight: 'bold' }}>{user && user.userName}</p>
        </div>
      </Dropdown>
    )
  }
}

export default ProfileMenu
