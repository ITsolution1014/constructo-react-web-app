import React from 'react'
import { connect } from 'react-redux'
import { Scrollbars } from 'react-custom-scrollbars'
import { Switch } from 'antd'
import styles from './style.module.scss'

const mapStateToProps = ({ settings }) => ({ settings })

@connect(mapStateToProps)
class Settings extends React.Component {
  changeSetting = (setting, value) => {
    const { dispatch } = this.props
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting,
        value,
      },
    })
  }

  closeSettings = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isSettingsOpen',
        value: false,
      },
    })
  }

  render() {
    const {
      settings: { isLightTheme, isSettingsOpen, isMenuTop, isMenuCollapsed },
    } = this.props

    return (
      <div
        className={isSettingsOpen ? `${styles.settings} ${styles.settingsOpened}` : styles.settings}
      >
        <Scrollbars style={{ height: '100vh' }}>
          <div className={styles.container}>
            <div className={styles.title}>
              Theme Settings
              <button
                className={`${styles.close} fa fa-times`}
                onClick={this.closeSettings}
                type="button"
              />
            </div>

            <div className={styles.item}>
              <Switch
                disabled={isMenuTop}
                checked={isMenuCollapsed && !isMenuTop}
                onChange={value => {
                  this.changeSetting('isMenuCollapsed', value)
                }}
              />
              <span className={styles.itemLabel}>Collapsed Menu</span>
            </div>

            <div className={styles.item}>
              <Switch
                disabled
                checked={isLightTheme}
                onChange={value => {
                  this.changeSetting('isLightTheme', value)
                }}
              />
              <span className={styles.itemLabel}>Light Theme</span>
            </div>
          </div>
        </Scrollbars>
      </div>
    )
  }
}

export default Settings
