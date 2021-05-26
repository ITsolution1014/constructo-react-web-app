
import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import Loadable from 'react-loadable'

import Loader from 'components/LayoutComponents/Loader'
import IndexLayout from 'layouts'
import NotFoundPage from 'pages/404'

const loadable = loader =>
  Loadable({
    loader,
    delay: false,
    loading: () => <Loader />,
  })

const routes = [
  // System Pages
  {
    path: '/landing',
    component: loadable(() => import('pages/Landing')),
    exact: true,
  },
  {
    path: '/user/login',
    component: loadable(() => import('pages/user/login')),
    exact: true,
  },
  {
    path: '/user/forgot',
    component: loadable(() => import('pages/user/forgot')),
    exact: true,
  },
  {
    path: '/user/register',
    component: loadable(() => import('pages/user/register')),
    exact: true,
  },

  // Dashboards
  {
    path: '/dashboard',
    component: loadable(() => import('pages/project/projectsList')),
    exact: true,
  },
  {
    path: '/construction/:projectId',
    component: loadable(() => import('pages/project/projectsConstruction')),
    exact: true,
  },
  {
    path: '/profile',
    component: loadable(() => import('pages/user/profile')),
    exact: true,
  },
  {
    path: '/construction',
    component: loadable(() => import('pages/project/projectsConstruction')),
    exact: true,
  },
  {
    path: '/recordsList',
    component: loadable(() => import('pages/Record/RecordList')),
    exact: true,
  },
  {
    path: '/records/:projectId',
    component: loadable(() => import('pages/Record')),
    exact: true,
  },
  {
    path: '/files',
    component: loadable(() => import('pages/Files')),
    exact: true,
  },
  {
    path:
      '/files/:folderId?/:folderId1?/:folderId2?/:folderId3?/:folderId4?/:folderId5?/:folderId6?/:folderId7?',
    component: loadable(() => import('pages/Files')),
  },
  {
    path: '/dashboard/beta',
    component: loadable(() => import('pages/dashboard/beta')),
    exact: true,
  },
  {
    path: '/dashboard/crypto',
    component: loadable(() => import('pages/dashboard/crypto')),
    exact: true,
  },
  {
    path: '/dashboard/gamma',
    component: loadable(() => import('pages/dashboard/gamma')),
    exact: true,
  },
  {
    path: '/dashboard/docs',
    component: loadable(() => import('pages/dashboard/docs')),
    exact: true,
  },
  {
    path: '/projects',
    component: loadable(() => import('pages/project/projectsList')),
    exact: true,
  },
  {
    path: '/users/:projectId',
    component: loadable(() => import('pages/project/projectsUsers')),
    exact: true,
  },
  {
    path: '/users',
    component: loadable(() => import('pages/project/projectsUsers')),
    exact: true,
  },
  {
    path: '/roles/:projectId',
    component: loadable(() => import('pages/project/projectsRoles')),
    exact: true,
  },
  {
    path: '/roles',
    component: loadable(() => import('pages/project/projectsRoles')),
    exact: true,
  },
]

class Router extends React.Component {
  render() {
    const { history } = this.props
    return (
      <ConnectedRouter history={history}>
        <IndexLayout>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
            {routes.map(route => (
              <Route
                path={route.path}
                component={route.component}
                key={route.path}
                exact={route.exact}
              />
            ))}
            <Route component={NotFoundPage} />
          </Switch>
        </IndexLayout>
      </ConnectedRouter>
    )
  }
}

export default Router
