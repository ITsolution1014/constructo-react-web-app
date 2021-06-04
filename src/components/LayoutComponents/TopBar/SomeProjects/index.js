import React from 'react'
import { Menu, Dropdown } from 'antd'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import styles from './style.module.scss'

@connect(({ project }) => ({ project }))
class SomeProjects extends React.Component {
  // async componentDidMount() {
  //   const { dispatch ,project:{userProjects}} = this.props
  //  if(!userProjects) await dispatch({ type: 'project/GET_USER_PROJECT' })
  // }

  render() {
    const { project } = this.props
    const { userProjects } = project
    const name =
      (project &&
        Object.values(project).length &&
        userProjects &&
        Object.values(userProjects).length &&
        userProjects.name) ||
      ''

    const menu = (
      <Menu selectable={false}>
        <Menu.Item>
          <Link to="/">Another Project</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/">Another Project</Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.ItemGroup title="Filters">
          <Menu.Item>
            <Link to="/">My open issues</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/">Reported by me</Link>
          </Menu.Item>
        </Menu.ItemGroup>
        <Menu.Divider />
        <Menu.Item>
          <Link to="/">
            <i className={`${styles.menuIcon} icmn-cog`} /> Settings
          </Link>
        </Menu.Item>
      </Menu>
    )
    return (
      <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft">
        <div className={styles.dropdown}>
          <i className={`${styles.icon} icmn-folder-open`} />
          <span className="d-none d-xl-inline">
            <strong>
              {name && name.length ? name : <FormattedMessage id="topBar.someProjects" />}
            </strong>
          </span>
        </div>
      </Dropdown>
    )
  }
}

export default SomeProjects
