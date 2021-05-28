import antdData from 'antd/lib/locale-provider/en_US'
import localeData from 'react-intl/locale-data/en'

const messages = {
  // Menu Start
  'topBar.issuesHistory': 'Issues History',
  'topBar.someProjects': 'Project',
  'topBar.projectManagement': 'Project Management',
  'topBar.typeToSearch': 'Type to search...',
  'topBar.buyNow': 'See Projects',
  'topBar.bitcoin': 'Bitcoin',
  'topBar.profileMenu.hello': 'Hello',
  'topBar.profileMenu.billingPlan': 'Billing Plan',
  'topBar.profileMenu.role': 'Role',
  'topBar.profileMenu.email': 'Email',
  'topBar.profileMenu.phone': 'Phone',
  'topBar.profileMenu.editProfile': 'Edit Profile',
  'topBar.profileMenu.logout': 'Logout',
  'topBar.profileMenu.Profile': 'Profile',

  // LeftMenu Start
  'leftMenu.recordList': 'Records',
  'leftMenu.filesList': 'Files',
  'leftMenu.address': 'Address book',
  'leftMenu.settings': 'Settings',

  // Menu ENd

  // Dashboard Start
  'dashboard.Home': 'Home',
  'dashboard.PagInfo': 'Current Page Info',
  'dashboard.detail': 'Details',
  'dashboard.setting': 'Setting',
  'dashboard.files': 'Files',
  'dashboard.diary': 'Diary',
  'dashboard.active': 'Active',
  'dashboard.inactive': 'Inactive',
  'dashboard.deleted': 'Deleted',
  // Dashboard End

  // Project List Start
  'projectList.create': 'New Project',
  'projectList.all': 'All',
  'projectList.name': 'Name',
  'projectList.street': 'Street',
  'projectList.state': 'State',
  'projectList.status': 'Status',
  'projectList.set': 'Set',
  'projectList.edit': 'Edit',
  'projectList.loading': 'Loading ...',
  // Project List ENd

  // Project Details Start
  'project.discard': 'Discard',
  'project.back': 'Back',
  'project.save': 'Save',
  'project.general.heading': 'General',
  'project.management.heading': 'Management',
  'project.setting.heading': 'Setting',
  'project.general.desc': 'General information about the project.',
  'project.management.desc': 'Management of the project',
  'project.setting.desc': 'Setting of the project',
  'project.general.city': 'City',
  'project.general.zip': 'Zip',
  'project.general.search': 'Search Location',
  'project.general.descField': 'Description',
  'project.management.startDate': 'Estimated Start ',
  'project.management.endDate': 'Estimated finish',
  'project.management.cloudSpace': 'Cloud space used',
  'project.management.cloudSpacebtn': 'Buy',
  'project.management.userUsed': 'Users used',
  'project.management.userUsedbtn': 'Request',
  'project.management.users': 'Users',
  'project.management.config': 'Configure user',
  'project.management.user.desc': 'Configuration of the users and their roles',
  'project.management.modal.email': 'New user email',
  'project.management.modal.add': 'Add',
  'project.management.modal.configRoles': 'Configure Roles',
  'project.management.modal.configRoles.modalName': 'Roles',
  'project.management.modal.configRoles.modaldesc': 'Configuration of the roles',
  'project.management.modal.configRoles.modalbtnAdd': 'Add new',
  'project.management.modal.configRoles.modalbtnClose': 'Close',
  'project.management.modal.configRoles.newRoleName': 'Role Settings',
  'project.management.modal.configRoles.newRoledec': 'Settings of the roles',
  'project.management.modal.configRoles.newRoleProject': 'Project',
  'project.management.modal.configRoles.newRoledoc': 'Documentation',
  'project.management.modal.configRoles.newRoledel': 'Delete',
  'project.management.modal.configRoles.newRoleVer': 'Version Rule',
  'project.management.modal.configRoles.newRoleSign': 'Signing Rule',
  'project.management.modal.configRoles.fields1': 'Read',
  'project.management.modal.configRoles.fields2': 'Write',
  'project.management.modal.configRoles.fields3': 'Disable',
  'project.management.modal.configRoles.true': 'True',
  'project.management.modal.configRoles.false': 'False',
  'project.management.modal.configRoles.delBtn': 'Delete Role',
  'project.setting.name': 'Setting',
  'project.setting.userName': 'User Name',
  'project.setting.cerate': 'Created At',
  'project.setting.updated': 'Updated At',
  'project.setting.active': 'Active',
  'project.setting.archived': 'Archived At',
  'project.setting.archive': 'Archive',
  'project.setting.deleted': 'Deleted At',
  'project.setting.delete': 'Delete',
  'project.setting.recover': 'Recover',

  'project.roles.addNew': 'Add New Role',
  'project.roles.roleName': 'Role Name',
  'project.roles.roleRule': 'Roles Rule',

  // Default non-deletable roles
  'project.roles.creator': 'Project creator',
  'project.roles.admin': 'System admin',
  'project.roles.guest': 'Guest',
  'project.roles.ordinary': 'Ordinary',

  'project.modal.err1': 'Please input your e-mail address',
  'project.modal.err2': 'Email is Not Correct',
  'project.users.err': 'Please input your e-mail address',
  // Project Details End

  // user Profile translation need here below
  // userProfile start
  'user.profile.firstName': 'First Name',
  'user.profile.lastName': 'Last Name',
  'user.profile.userName': 'User Name',
  'user.profile.title': 'Title',
  'user.profile.cancelBtn': 'Cancel',

  // RecordList Start
  'recordList.category': 'Category',
  'recordList.content': 'Content',
  'recordList.signed': 'Signed',
  'recordList.unsigned': 'Unsigned',
  'recordList.download': 'Download',
  'recordList.categ1': 'Ordinary',
  'recordList.categ2': 'Accident',
  'recordList.categ3': 'Review',
  'recordList.categ4': 'Bureau',
  'recordList.categ5': 'Material',
  'recordList.categ6': 'None',
  'recordList.create': 'Create Record',
  'recordList.Hdelete': 'Hard Delete',
  'recordList.HdeleteDesc': 'Are you sure you want to delete this record?',
  'recordList.confDel': 'Confirm Delete',
  'recordList.confHardDeldesc': 'Are you sure you want to Hard Delete this record?',
  'recordList.confHardDel': 'Confirm Hard Delete',
  // RecodList End

  // Record Details Start

  'recordDetails.pageName': 'Record Details',
  'recordDetails.desc': 'Full description',
  'recordDetails.sign': 'Sign',
  'recordDetails.upload': 'Upload Files',
  'recordDetails.verify': 'Verify',
  'recordDetails.tryAgain': 'Try Again',
  'recordDetails.time': 'Remaining Time',
  'recordDetails.placeholder': 'Type Your Verification Code',
  'recordDetails.expire': 'Verification Time Expire plesase Try Again With New Code',
  'recordDetails.notMatch': 'Verification Does Not Match',

  // Record List End

  // Record File List Start
  'recordDetails.fileName': 'File Name',

  'recordDetails.ext': 'Extension',
  'recordDetails.delAt': 'Deleted At',
  'recordDetails.mod': 'Module',
  'recordDetails.id': 'ID',
  'recordDetails.preview': 'Preview',
  'recordDetails.view': 'View',
  'recordDetails.dragHead1': 'Click or drag the file to this area to upload',
  'recordDetails.dragHead2':
    'Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files',

  // Record File List End

  // Files And Folder Start
  'files&foolders.add': 'Add File',
  'files&foolders.addFolder': 'Create Folder',
  'files&foolders.rename': 'Rename',
  'files&foolders.fname': 'Folder Name',
  'files&foolders.confirm': 'Confirm',
  'files&foolders.uplo': 'Uploading ...',
  'files&foolders.upload': 'Upload',
  'files&foolders.open': 'Open',

  // Files And Folder End

  // Landing Page Start
  'landingPage.register': 'Register',
  'landingPage.login': 'Login',
  'landingPage.about': 'About us',
  'landingPage.features': 'Features',
  'landingPage.pricing': 'Pricing',
  'landingPage.reviews': 'Reviews',
  'landingPage.contact': 'Contact',
  'landingPage.btn1': 'TRY',
  'landingPage.btn2': 'START USE',
  'landingPage.intro.head1.h1': 'Your system for building industry simplified',
  'landingPage.intro.par':
    'Constructo is simple and easy to use system for managment of building industry adn sharing of crucial information.',
  'landingPage.intro.head2.h5': 'Easy to use',
  'landingPage.intro.par2':
    'Simple, comprendious and effective for wide range of users. Intuitivecontrols allows to read, write, dictate and attach audio, video or just another document. Simple.',
  'landingPage.intro.head3.h2': 'Centralised system',
  'landingPage.intro.par3':
    'All information which are crucial for building project can be shared for better information flow. Because to know matters.',
  'landingPage.intro.head4.h5': 'Organized',
  'landingPage.intro.par4':
    'Diary, files, users and messages, attendance, schedule. All in one place. All organized.',
  'landingPage.MainIntro.head1': 'Constructo will help you grow in the industry',
  'landingPage.MainIntro.head2': 'Real-time information transfer',
  'landingPage.MainIntro.head3': 'Records are unchangeable',
  'landingPage.MainIntro.head4': 'Archived and secured',
  'landingPage.MainIntro.head5': 'Try',
  'landingPage.MainIntro.head6': 'Our solution fit your needs',
  'landingPage.MainIntro.par1': 'Use cases which saves money and time.',
  'landingPage.MainIntro.par2':
    'Textual information, videos, photos and all data are stored on secured cloud with priviledged access.With rules set by you, the data can be manipulated or seen only by specific users.',
  'landingPage.MainIntro.par3':
    'System Constructo signs every record with unique mechanism of electronic biometric or two-factor signature which prevents editing and proves validity.',
  'landingPage.MainIntro.par4':
    'All records are stored and archived. Crucial personal infromation are encrypted and stored only on servers within EU.',
  'landingPage.MainIntro.par5':
    'Buidling diary records, documentation files, chat, attendance and much more. Constructo simply saves your time and money.',
  'landingPage.MainIntro.btn': 'Try now',
  'landingPage.footer.head1':
    'CONSTRUCTO: SYSTEM FOR BUILDING INDUSTRY is supported by European Union.',
  'landingPage.footer.anchor': 'More',
  'landingPage.footer.email': 'gondola-graniti@email.cz',
  'landingPage.footer.p1': 'Lípová 15, Praha 2, 120 00',
  'landingPage.footer.p2': 'Share you stuff about Constructo',
}

export default {
  locale: 'en-US',
  antdData,
  localeData,
  messages,
}
