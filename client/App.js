import React, { Component } from 'react'
import { Switch, BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Container } from 'reactstrap'
import { GlobalStyles } from './components/styledComponents/GlobalStyles'
import routes from './routes'
import { renderRoutes } from './utils/renderRoutes'
import configureStore from './store/configureStore'
import Alerts from './containers/Alerts'

const { store } = configureStore()

class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <Container>
          <Alerts />
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
