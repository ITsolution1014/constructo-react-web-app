import React from 'react'
import { FormattedMessage } from 'react-intl'

export async function getLeftMenuData() {
  return [
    {
      title: <FormattedMessage id="topBar.someProjects" />,
      key: 'someProjects',
      icon: 'icmn icmn-file-text',
      children: [
        {
          key: 'details',
          title: <FormattedMessage id="dashboard.detail" />,
          url: '/construction',
          // pro: true,
        },
        {
          key: 'users',
          title: <FormattedMessage id="project.management.users" />,
          url: '/users',
          // pro: true,
        },
        {
          key: 'roles',
          title: <FormattedMessage id="project.management.modal.configRoles.modalName" />,
          url: '/roles',
          // pro: true,
        },
      ],
    },
    {
      divider: true,
    },
    {
      title: <FormattedMessage id="leftMenu.recordList" />,
      key: 'records',
      url: '/recordslist',
      icon: 'icmn icmn-briefcase',
    },
    {
      title: <FormattedMessage id="leftMenu.filesList" />,
      key: 'files',
      url: '/files',
      icon: 'icmn icmn-files-empty',
      // pro: true,
    },
    // {
    //   title: <FormattedMessage id="leftMenu.address" />,
    //   key: 'addressBook',
    //   icon: 'icmn icmn-address-book',
    //   // pro: true,
    // },
    {
      title: <FormattedMessage id="leftMenu.settings" />,
      key: 'settings',

      icon: 'icmn icmn-cog',
      // pro: true,
    },
    // {
    //   title: 'Dashboard Docs',
    //   key: 'dashboardDocs',
    //   url: '/dashboard/alpha/docs',
    //   icon: 'icmn icmn-home',
    //   // pro: true,
    // },
    {
      divider: true,
    },
  ]
}
export async function getTopMenuData() {
  return [
    {
      title: <FormattedMessage id="topBar.someProjects" />,
      key: 'someProjects',
      icon: 'icmn icmn-file-text',
      children: [
        {
          key: 'details',
          title: <FormattedMessage id="dashboard.detail" />,
          url: '/dashboard/alpha/details',
          // pro: true,
        },
        {
          key: 'users',
          title: <FormattedMessage id="project.management.users" />,
          url: '/dashboard/alpha/users',
          // pro: true,
        },
        {
          key: 'roles',
          title: <FormattedMessage id="project.management.modal.configRoles.modalName" />,
          url: '/dashboard/alpha/roles',
          // pro: true,
        },
      ],
    },

    {
      title: <FormattedMessage id="leftMenu.recordList" />,
      key: 'records',
      url: '/records',
      icon: 'icmn icmn-briefcase',
    },
    {
      title: <FormattedMessage id="leftMenu.filesList" />,
      key: 'files',
      url: '/files',
      icon: 'icmn icmn-files-empty',
      // pro: true,
    },
    // {
    //   title: <FormattedMessage id="leftMenu.address" />,
    //   key: 'addressBook',
    //   icon: 'icmn icmn-address-book',
    //   // pro: true,
    // },
    {
      title: <FormattedMessage id="leftMenu.settings" />,
      key: 'settings',

      icon: 'icmn icmn-cog',
      // pro: true,
    },
  ]
}
