import React, { Component } from 'react'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'
import axios from 'axios'

const { store } = configureStore()

class App extends Component {
  componentDidMount () {
    axios.get('/api/v1/cart').then(res => console.log(res))
  }

  render () {
    return (
      <Provider store={store}>
        <div>app</div>
      </Provider>
    )
  }
}

export default App
