import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { ListGroupItem, Row, Col } from 'reactstrap'
import { DATE_FORMAT, ANONYMOUS_USER_NAME } from '../constants'
import { formatPrice } from '../utils/formatters'
import { StyledHeading } from '../components/styledComponents/common'
import { Block } from '../components/Block'
import { PaginatedList } from '../components/pagination/PaginatedList'
import { startFetchOrders } from '../ducks/ordersDucks'

class Orders extends Component {
  componentDidMount () {
    this.props.startFetchOrders()
  }

  renderOrders = ({ discount, price, productsCount, timeStamp, products }) => (
    <ListGroupItem key={timeStamp} color='success'>
      <div>Имя {this.props.userData.firstname || ANONYMOUS_USER_NAME}</div>
      <div>Фамилия {this.props.userData.lastname || ANONYMOUS_USER_NAME}</div>
      <div>Отчество {this.props.userData.middlename || ANONYMOUS_USER_NAME}</div>
      <div>Email: {this.props.userData.email || 'unknown email'}</div>
      <div>Цена: {formatPrice(price)}</div>
      <div>Размер скидки: {formatPrice(discount)}</div>
      <div>Дата совершения заказа: {moment(timeStamp).format(DATE_FORMAT)}</div>
      <div>Колличество товаров: {productsCount}</div>
      <div>
        Приобретённые товары:
        <ul>
          {products.map(product => (
            <li key={product.id}>
              {product.name} {product.quantity} шт.
            </li>
          ))}
        </ul>
      </div>
    </ListGroupItem>
  )

  render () {
    const {
      orders,
      userData: { firstname, lastname, middlename },
      isGetOrdersLoading,
      isGetOrdersError
    } = this.props

    return (
      <Block showSpinner={isGetOrdersLoading || isGetOrdersError}>
        <Row>
          <Col xs={12}>
            <StyledHeading>Совершённые заказы:</StyledHeading>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {orders.length ? (
              <PaginatedList
                items={orders}
                renderItems={this.renderOrders}
                itemsPerPage={10}
              />
            ) : (
              'Нет совершённых заказов'
            )}
          </Col>
        </Row>
      </Block>
    )
  }
}

export default connect(
  state => ({
    orders: state.orders.data.orders,
    userData: state.orders.data.userData,
    isGetOrdersLoading: state.orders.isGetOrdersLoading,
    isGetOrdersError: state.orders.isGetOrdersError
  }),
  dispatch => ({
    startFetchOrders: () => dispatch(startFetchOrders())
  })
)(Orders)
