import antdData from 'antd/lib/locale-provider/cs_CZ'
import localeData from 'react-intl/locale-data/cs'

const messages = {
  // Menu Start
  'topBar.issuesHistory': 'Historie',
  'topBar.someProjects': 'Projekty',
  'topBar.projectManagement': 'Management projektu',
  'topBar.typeToSearch': 'Napište pro vyhledávání...',
  'topBar.buyNow': 'Projekty',
  'topBar.bitcoin': 'Bitcoin',
  'topBar.profileMenu.hello': 'Ahoj',
  'topBar.profileMenu.billingPlan': 'Platební plán',
  'topBar.profileMenu.role': 'Role',
  'topBar.profileMenu.email': 'E-mail',
  'topBar.profileMenu.phone': 'Telefon',
  'topBar.profileMenu.editProfile': 'Upravit profil',
  'topBar.profileMenu.logout': 'Odhlásit se',
  'topBar.profileMenu.Profile': 'Profil',

  // LeftMenu Start
  'leftMenu.recordList': 'Záznamy',
  'leftMenu.filesList': 'Dokumentace',
  'leftMenu.address': 'Seznam uživatelů',
  'leftMenu.settings': 'Nastavení',

  // Menu ENd

  // Dashboard Start
  'dashboard.Home': 'Domů',
  'dashboard.PagInfo': 'Aktuální informace',
  'dashboard.detail': 'Detail',
  'dashboard.setting': 'Nastavení',
  'dashboard.files': 'Dokumentace',
  'dashboard.diary': 'Deník',
  'dashboard.active': 'Aktivní',
  'dashboard.inactive': 'Neaktivní',
  'dashboard.deleted': 'Smazáno',
  // Dashboard End

  // Project List Start
  'projectList.create': 'Nový projekt',
  'projectList.all': 'Vše',
  'projectList.name': 'Název',
  'projectList.street': 'Ulice',
  'projectList.state': 'Stát',
  'projectList.status': 'Status',
  'projectList.set': 'Nastavit',
  'projectList.edit': 'Upravit',
  'projectList.loading': 'Načítání ...',
  // Project List ENd

  // Project Details Start
  'project.discard': 'Zahodit',
  'project.back': 'Zpět',
  'project.save': 'Uložit',
  'project.general.heading': 'Obecné',
  'project.management.heading': 'Management',
  'project.setting.heading': 'Nastavení',
  'project.general.desc': 'Obecné informace o projektu',
  'project.management.desc': 'Management projektu',
  'project.setting.desc': 'Nastavení projektu',
  'project.general.city': 'Město',
  'project.general.zip': 'PSČ',
  'project.general.search': 'Vyhledat pozici',
  'project.general.descField': 'Popis',
  'project.management.startDate': 'Odhadovaný začátek',
  'project.management.endDate': 'Odhadovaný konec',
  'project.management.cloudSpace': 'Použité místo',
  'project.management.cloudSpacebtn': 'Koupit',
  'project.management.userUsed': 'Využito uživatelů',
  'project.management.userUsedbtn': 'Vyžádat',
  'project.management.users': 'Uživatelé',
  'project.management.config': 'Nastavit uživatele',
  'project.management.user.desc': 'Nastavení uživatelů a rolí',
  'project.management.modal.email': 'Email nového uživatele',
  'project.management.modal.add': 'Přidat',
  'project.management.modal.configRoles': 'Nastavit role',
  'project.management.modal.configRoles.modalName': 'Role',
  'project.management.modal.configRoles.modaldesc': 'Nastavení rolí',
  'project.management.modal.configRoles.modalbtnAdd': 'Přidat',
  'project.management.modal.configRoles.modalbtnClose': 'Zavřít',
  'project.management.modal.configRoles.newRoleName': 'Nastavení role',
  'project.management.modal.configRoles.newRoledec': 'Nastavení rolí',
  'project.management.modal.configRoles.newRoleProject': 'Projekt',
  'project.management.modal.configRoles.newRoledoc': 'Dokumentace',
  'project.management.modal.configRoles.newRoledel': 'Mazat dokumentaci',
  'project.management.modal.configRoles.newRoleVer': 'Verzování',
  'project.management.modal.configRoles.newRoleSign': 'Podepisování',
  'project.management.modal.configRoles.fields1': 'Číst',
  'project.management.modal.configRoles.fields2': 'Zapisovat',
  'project.management.modal.configRoles.fields3': 'Vypnout',
  'project.management.modal.configRoles.true': 'ANO',
  'project.management.modal.configRoles.false': 'NE',
  'project.management.modal.configRoles.delBtn': 'Smazat roli',
  'project.setting.name': 'Nastavení',
  'project.setting.userName': 'Jméno uživatele',
  'project.setting.cerate': 'Vytvořeno',
  'project.setting.updated': 'Upraveno',
  'project.setting.active': 'Aktivní',
  'project.setting.archived': 'Archivováno',
  'project.setting.archive': 'Archivovat',
  'project.setting.deleted': 'Smazáno',
  'project.setting.delete': 'Smazat',
  'project.setting.recover': 'Obnovit',
  // here translation need
  'project.roles.addNew': 'Přidat novou roli',
  'project.roles.roleName': 'Název role',
  'project.roles.roleRule': 'Oprávnění rolí',
  // Default non-deletable roles
  'project.roles.creator': 'Tvůrce projektu',
  'project.roles.admin': 'Systémový administrátor',
  'project.roles.guest': 'Host',
  'project.roles.ordinary': 'Běžný',

  'project.modal.err1': 'Zadejte svou e-mailovou adresu',
  'project.modal.err2': 'E-mail není správný',
  'project.users.err': 'Zadejte svou e-mailovou adresu',

  // user Profile translation need here below
  // userProfile start
  'user.profile.firstName': 'Jméno',
  'user.profile.lastName': 'Příjmení',
  'user.profile.userName': 'Uživatelské jméno',
  'user.profile.title': 'Titul',
  'user.profile.cancelBtn': 'Zrušit',

  // Project Details End

  // RecordList Start
  'recordList.category': 'Kategorie',
  'recordList.content': 'Obsah',
  'recordList.signed': 'Podepsáno',
  'recordList.unsigned': 'Nepodepsáno',
  'recordList.download': 'Stáhnout',
  'recordList.categ1': 'Denní',
  'recordList.categ2': 'Nehoda',
  'recordList.categ3': 'Kontrola',
  'recordList.categ4': 'Uřední',
  'recordList.categ5': 'Materiál',
  'recordList.categ6': 'Žádná',
  'recordList.create': 'Vytvořit záznam',
  'recordList.Hdelete': 'Smazat trvale',
  'recordList.HdeleteDesc': 'Jste si jisti, že chcete smazat tento záznam?',
  'recordList.confDel': 'Potvrdit smazání',
  'recordList.confHardDeldesc': 'Jste si jisti, že chcete trvale smazat tento záznam?',
  'recordList.confHardDel': 'Potvrdit trvalé smazání',
  // RecodList End

  // Record Details Start

  'recordDetails.pageName': 'Detail záznamu',
  'recordDetails.desc': 'Popis',
  'recordDetails.sign': 'Podepsat',
  'recordDetails.upload': 'Nahrát soubory',
  // chages down belo for chez lang
  'recordDetails.verify': 'Ověřit',
  'recordDetails.tryAgain': 'Zkusit znovu',
  'recordDetails.time': 'Zbývající čas',
  'recordDetails.placeholder': 'Zadejte ověřovací kód',
  // 'recordDetails.expire': 'Verification Time Expire plesase Try Again With New Code',
  // 'recordDetails.notMatch': 'Verification Does Not Match',

  // Record List End

  // Record File List Start
  'recordDetails.fileName': 'Jméno souboru',

  'recordDetails.ext': 'Koncovka',
  'recordDetails.delAt': 'Smazáno',
  'recordDetails.mod': 'Modul',
  'recordDetails.id': 'ID',
  'recordDetails.preview': 'Náhled',
  'recordDetails.view': 'Zobrazit',
  'recordDetails.dragHead1': 'Klikněte nebo přetáhněte soubory do této oblasti',
  'recordDetails.dragHead2': 'Podporuje nahrání jednoho nebo více souborů.',

  // Record File List End

  // Files And Folder Start
  'files&foolders.add': 'Přidat soubor',
  'files&foolders.addFolder': 'Vytvořit složku',
  'files&foolders.rename': 'Přejmenovat',
  'files&foolders.fname': 'Jméno',
  'files&foolders.confirm': 'Potvrdit',
  'files&foolders.uplo': 'Nahrávám ...',
  'files&foolders.upload': 'Nahrát',
  'files&foolders.open': 'Otevřít',

  // Files And Folder End

  // Landing Page Start
  'landingPage.register': 'Registrovat',
  'landingPage.login': 'Přihlásit se',
  'landingPage.about': 'O nás',
  'landingPage.features': 'Funkce',
  'landingPage.pricing': 'Ceník',
  'landingPage.reviews': 'Recenze',
  'landingPage.contact': 'Kontakt',
  'landingPage.btn1': 'VYZKOUŠET',
  'landingPage.btn2': 'ZAČÍT POUŽÍVAT',
  'landingPage.intro.head1.h1': 'Váš  stavební deník  jednoduše',
  'landingPage.intro.par': 'Constructo je jednoduchý stavební deník, který vám usnadní práci.',
  'landingPage.intro.head2.h5': 'Jednoduché ovládání',
  'landingPage.intro.par2':
    'Jednoduchý, přehledný a nenáročný pro široké spektrum stavebníků, intuitivní ovládání, zapisujte, diktujte, vkládejte foto nebo video.',
  'landingPage.intro.head3.h2': 'Centralizovaný systém',
  'landingPage.intro.par3':
    'Díky centralizovanému systému máte možnost získat souhrnné informace o vedenístavby, vkládat data, připomínkovat atd.',
  'landingPage.intro.head4.h5': 'Přehlednost',
  'landingPage.intro.par4':
    'Přehledy, jako denní záznamy, mimořádné záznamy, docházka, harmonogram a mnoho dalších jsou pro Vás dostupné z kteréhokoliv místa.',
  'landingPage.MainIntro.head1': 'Constructo vás potáhne vpřed',
  'landingPage.MainIntro.head2': 'Přenos informací v reálném čase',
  'landingPage.MainIntro.head3': 'Znemožnění manipulace se záznamy',
  'landingPage.MainIntro.head4': 'Archivace dokumentů a bezpečnost',
  'landingPage.MainIntro.head5': 'Naše řešení pokryje všechny vaše potřeby',
  'landingPage.MainIntro.head6': 'Our solution fit your needs',
  'landingPage.MainIntro.par1':
    'Zde jsou praktické příklady při kterých vám naše aplikace ušetří nejvíce práce, času ale i peněz.',
  'landingPage.MainIntro.par2':
    'Textové záznamy, video nebo fotografie jsou v okamžiku vytvořenínesmazatelně uloženy. Podle Vámi nastavených přístupových práv máte jistotu,že jsou sdíleny jen ty informace, které jsou pro daný subjekt relevantní.',
  'landingPage.MainIntro.par3':
    'Jedinečnost elektronického stavebního deníku Constructo spočívá v tom, že záznamy jsou opatřeny biometrickým podpisem, kterýzaručuje právní validitu dokumentů.',
  'landingPage.MainIntro.par4':
    'Veškeré záznamy (dokumenty, smlouvy, zkoušky, revize, faktury) jsoupřehledně uloženy a bezpečně archivovány. Data v systému Constructo  jsou několikanásobně šifrována a bezpečněuložena na Cloudu v nejlépe střeženém datovém úložti v EU.',
  'landingPage.MainIntro.par5':
    'Standardní denní zápis, mimořádný zápis, archiv dokumentů, kontrola lidí napracovišti, harmonogram, seznam dodavatelů materiálů, seznam dodavatelských služeba mnoho dalšího. Automatizací a archivací komunikačních procesů přinese stavebnídeník značné úspory při výstavbě jak malého rozsahu, tak velkých stavebních celků,popřípadě u rekonstrukcí všeho druhů. Nepodstatnou úsporou je pochopitelnězkrácení doby samotné realizace.',
  'landingPage.MainIntro.btn': ' Začít používat',
  'landingPage.footer.head1':
    'CONSTRUCTO: ELEKTRONICKÝ STAVEBNÍ DENÍK je spolufinancován Evropskou unií.',
  'landingPage.footer.anchor': 'Více',
  'landingPage.footer.email': 'gondola-graniti@email.cz',
  'landingPage.footer.p1': 'Copyright © 2018 onstructo',
  'landingPage.footer.p2': 'Dejte o Constructu vedět svým kolegům',
}

export default {
  locale: 'cs-CZ',
  antdData,
  localeData,
  messages,
}
