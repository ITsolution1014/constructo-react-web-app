import React from 'react'
import { createHashHistory } from 'history'
// import { useSelector } from 'react-redux'
// import { ThemeProvider } from 'styled-components'
import Localization from 'components/LayoutComponents/Localization'
import Router from './router'
// import { lightTheme, darkTheme } from './theme/theme'
// import GlobalStyles from './theme/global'

class BrowserRouter extends React.PureComponent {
  render() {
    const history = createHashHistory()
    return <Router history={history} />
  }
}

export default () => {
  // const theme = useSelector(
  //   state => state && state.settings && state.settings.isLightTheme && state.settings.isLightTheme,
  // )

  return (
    // <ThemeProvider theme={theme ? darkTheme : lightTheme}>
    // </ThemeProvider>
    // <GlobalStyles />
    <Localization>
      <BrowserRouter />
    </Localization>
  )
}
