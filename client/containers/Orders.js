import React, { Component } from 'react'
import { connect } from 'react-redux'
import { startFetchOrders } from '../ducks/ordersDucks'

class Orders extends Component {
  componentDidMount () {
    this.props.startFetchOrders()
  }

  render () {
    return <div>Orders</div>
  }
}

export default connect(
  state => ({
    products: state.products.items,
    isLoading: state.products.isLoading,
    isError: state.products.isError
  }),
  dispatch => ({
    startFetchOrders: () => dispatch(startFetchOrders())
  })
)(Orders)
