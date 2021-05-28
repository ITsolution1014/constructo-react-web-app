import React from 'react'
import { BackTop, Layout } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import TopBar from 'components/LayoutComponents/TopBar'
import Menu from 'components/LayoutComponents/Menu'
import Breadcrumbs from 'components/LayoutComponents/Breadcrumbs'
import Settings from 'components/LayoutComponents/Settings'
import classNames from 'classnames'

const mapStateToProps = ({ settings }) => ({
  isBorderless: settings.isBorderless,
  isSquaredBorders: settings.isSquaredBorders,
  isFixedWidth: settings.isFixedWidth,
  isMenuShadow: settings.isMenuShadow,
  isMenuTop: settings.isMenuTop,
  isLightTheme: settings.isLightTheme,
})

@withRouter
@connect(mapStateToProps)
class MainLayout extends React.PureComponent {
  render() {
    const {
      children,
      isBorderless,
      isSquaredBorders,
      isFixedWidth,
      isMenuShadow,
      isMenuTop,
      isLightTheme,
    } = this.props
    return (
      <Layout
        className={classNames({
          settings__borderLess: isBorderless,
          settings__squaredBorders: isSquaredBorders,
          settings__fixedWidth: isFixedWidth,
          settings__menuShadow: isMenuShadow,
          settings__menuTop: isMenuTop,
        })}
      >
        <BackTop />
        <Menu />
        <Settings />
        <Layout>
          <Layout.Header>
            <TopBar />
          </Layout.Header>
          <Layout.Content
            style={{
              height: '100%',
              position: 'relative',
              backgroundColor: isLightTheme ? '' : '#001529',
            }}
          >
            <Breadcrumbs />
            <div className="utils__content">{children}</div>
          </Layout.Content>
        </Layout>
      </Layout>
    )
  }
}

export default MainLayout
