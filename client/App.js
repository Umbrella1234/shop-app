import React, { Component } from 'react'
import { Switch, BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Container } from 'reactstrap'
import jsCookie from 'js-cookie'
import randomize from 'randomatic'
import { GlobalStyles } from './components/styledComponents/GlobalStyles'
import routes from './routes'
import { renderRoutes } from './utils/renderRoutes'
import configureStore from './store/configureStore'

const { store } = configureStore()

const userIdCookieString = 'userId'

const userIdCookie = jsCookie.get(userIdCookieString)
if (!userIdCookie) {
  jsCookie.set(userIdCookieString, randomize('0', 16))
}

class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <Container>
          <BrowserRouter>
            <Switch>{renderRoutes(routes)}</Switch>
          </BrowserRouter>
        </Container>
        <GlobalStyles />
      </Provider>
    )
  }
}

export default App
