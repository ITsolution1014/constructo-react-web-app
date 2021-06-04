import React from 'react'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import ProfileMenu from './ProfileMenu'
import LanguageSelector from './LanguageSelector'
import styles from './style.module.scss'

@connect(({ settings }) => ({ settings }))
class TopBar extends React.Component {
  render() {
    const {
      settings: { isLightTheme },
    } = this.props
    return (
      <div className={isLightTheme ? styles.topbar : styles.topbarDark}>
        <div style={{ marginRight: 10 }}>
          <Link to="/projects">
            <Button className={isLightTheme ? '' : styles.btn}>
              <FormattedMessage id="topBar.buyNow" />
            </Button>
          </Link>
        </div>
        <div className="mr-4">
          <LanguageSelector />
        </div>

        <ProfileMenu />
      </div>
    )
  }
}

export default TopBar
