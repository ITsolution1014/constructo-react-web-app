import React from 'react'
import { Menu, Dropdown } from 'antd'
import { connect } from 'react-redux'
import kingdom from '../../../../assets/images/Kingdom.jpg'
import czech from '../../../../assets/images/czech-republic.jpg'
import styles from './style.module.scss'

@connect(({ settings }) => ({ settings }))
class LanguageSelector extends React.Component {
  changeLang = ({ key }) => {
    const { dispatch } = this.props
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'locale',
        value: key,
      },
    })
  }

  render() {
    const {
      settings: { locale },
    } = this.props
    const language = locale.substr(0, 2)

    const langMenu = (
      <Menu className={styles.menu} selectedKeys={[locale]} onClick={this.changeLang}>
        <Menu.Item key="en-US">
          <span role="img" aria-label="English" className="mr-2">
            <img style={{ width: '16px', marginRight: '10px' }} src={kingdom} alt="..." />
            🇬🇧
          </span>
          English
        </Menu.Item>
        <Menu.Item key="cs-CZ">
          <span role="img" aria-label="Czech" className="mr-2">
            <img style={{ width: '16px', marginRight: '10px' }} src={czech} alt="..." />
            cz
          </span>
          Česky
        </Menu.Item>
      </Menu>
    )
    return (
      <Dropdown overlay={langMenu} trigger={['click']}>
        <div className={styles.dropdown}>
          <strong className="text-uppercase">{language}</strong>
        </div>
      </Dropdown>
    )
  }
}

export default LanguageSelector
