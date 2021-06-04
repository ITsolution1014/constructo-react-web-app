import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { reduce } from 'lodash'
import CircularJSON from 'circular-json'
import styles from './style.module.scss'

const mapStateToProps = ({ menu, settings }) => ({
  isMenuTop: menu.isMenuTop,
  menuTopData: menu.menuTopData,
  menuLeftData: menu.menuLeftData,
  isLightTheme: settings.isLightTheme,
})

@withRouter
@connect(mapStateToProps)
class Breadcrumbs extends React.Component {
  state = {
    breadcrumb: [],
  }

  componentDidMount() {
    const { match } = this.props
    this.setBreadcrumbs(this.props)
    if (match.url === '/files') localStorage.removeItem('list')
  }

  componentWillReceiveProps(newProps) {
    this.setBreadcrumbs(newProps)
  }

  setBreadcrumbs = props => {
    const { isMenuTop, menuTopData, menuLeftData } = this.props
    this.setState({
      breadcrumb: this.getBreadcrumb(props, isMenuTop ? menuTopData : menuLeftData),
    })
  }

  getPath(data, url, parents = []) {
    const items = reduce(
      data,
      (result, entry) => {
        if (result.length) {
          return result
        }
        if (entry.url === url) {
          return [entry].concat(parents)
        }
        if (entry.children) {
          const nested = this.getPath(entry.children, url, [entry].concat(parents))
          return (result || []).concat(nested.filter(e => !!e))
        }
        return result
      },
      [],
    )
    return items.length > 0 ? items : [false]
  }

  removeBreadCrumb = (item, ind) => {
    const { history } = this.props

    const storeData = CircularJSON.parse(localStorage.getItem('list'))
      ? [...CircularJSON.parse(localStorage.getItem('list'))]
      : []

    const updatedlist = storeData.slice(0, ind)
    const updatedStored = storeData.slice(0, ind + 1)

    localStorage.setItem('list', CircularJSON.stringify(updatedlist))
    const back = updatedStored.filter(ele => ele.pathname === item.pathname)

    localStorage.setItem('back', CircularJSON.stringify(back))
    let root = item.pathname.split('/')

    root.pop()
    root = root.join('/')

    history.push(root)
  }

  getBreadcrumb = (props, items) => {
    const {
      history: { location },
    } = this.props
    const [activeMenuItem, ...path] = this.getPath(items, props.location.pathname)
    const filedata = CircularJSON.parse(localStorage.getItem('list'))
    if (activeMenuItem && path.length) {
      return path.reverse().map((item, index) => {
        if (index === path.length - 1) {
          return (
            <span key={item.key}>
              <span className={`${styles.arrow} text-muted`} />
              <span className="text-muted">{item.title}</span>
              <span className={styles.arrow} />
              <strong>{activeMenuItem.title}</strong>
            </span>
          )
        }
        return (
          <span key={item.key}>
            <span className={`${styles.arrow} text-muted`} />
            <span className="text-muted">{item.title}</span>
          </span>
        )
      })
    }
    if (
      !activeMenuItem &&
      filedata &&
      location.pathname !== '/projects' &&
      location.pathname !== '/dashboard'
    ) {
      return (
        filedata &&
        filedata.map((item, index) => {
          if (index === path.length - 1) {
            return (
              <span key={String(Math.random())}>
                <span className={`${styles.arrow} text-muted`} />
                <span className="text-muted">{item.title}</span>
                <span className={styles.arrow} />
                <strong>{activeMenuItem.name}</strong>
              </span>
            )
          }
          return (
            <span key={String(Math.random())}>
              <span className={`${styles.arrow} text-muted`} />
              <Link onClick={() => this.removeBreadCrumb(item, index)}>
                <span className="text-muted">{item.name}</span>
              </Link>
            </span>
          )
        })
      )
    }
    return (
      <span>
        <span className={styles.arrow} />
        <strong>{activeMenuItem.name}</strong>
      </span>
    )
  }

  render() {
    const { breadcrumb } = this.state
    const { isLightTheme } = this.props
    return (
      <div className={isLightTheme ? styles.breadcrumbs : styles.breadcrumbsDark}>
        <div className={styles.path}>
          <Link to="/dashboard" className="text-muted">
            <FormattedMessage id="dashboard.Home" />
          </Link>
          {breadcrumb}
        </div>
      </div>
    )
  }
}

export default Breadcrumbs
