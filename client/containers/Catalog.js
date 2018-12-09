import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Col, Row } from 'reactstrap'
import { Link } from 'react-router-dom'
import numeralize from 'numeralize-ru'
import Alerts from './Alerts'
import { Block } from '../components/Block'
import { Product } from '../components/Product'
import routes from '../routes'
import { startFetchProducts } from '../ducks/productsDucks'
import {
  startFetchCart,
  addProductToCart,
  removeProductFromCart
} from '../ducks/cartDucks'
import { formatPrice } from '../utils/formatters'

class Catalog extends Component {
  componentDidMount () {
    this.props.startFetchProducts()
    this.props.startFetchCart()
  }

  render () {
    const {
      products,
      cart: { cartProducts, priceWithoutDiscount, productsInCart },
      loadingProductIds,
      areProductsLoading,
      isProductsError,
      isCartLoading,
      isCartError,
      addProductToCart,
      removeProductFromCart
    } = this.props

    const showSpinner =
      areProductsLoading || isProductsError || isCartLoading || isCartError

    return (
      <Block showSpinner={showSpinner}>
        <Alerts />
        <Row>
          <Col xs={12}>
            <h1>
              В <Link to={routes.cart.getLink()}>корзине </Link>{' '}
              {cartProducts.length
                ? `${productsInCart} ${numeralize.pluralize(
                  productsInCart,
                  'товар',
                  'товара',
                  'товаров'
                )} на сумму ${formatPrice(priceWithoutDiscount)}`
                : 'нет товаров'}
            </h1>
          </Col>
        </Row>
        <Row>
          {products.map(product => {
            const isInCart = cartProducts.some(
              cartProduct => cartProduct.id === product.id
            )
            return (
              <Col key={product.id} xs={12} md={4}>
                <Product
                  {...product}
                  isLoading={loadingProductIds.some(id => id === product.id)}
                  isInCart={isInCart}
                  onClick={isInCart ? removeProductFromCart : addProductToCart}
                />
              </Col>
            )
          })}
        </Row>
      </Block>
    )
  }
}

export default connect(
  state => ({
    products: state.products.items,
    cart: state.cart.data,
    areProductsLoading: state.products.isLoading,
    isCartLoading: state.cart.isLoading,
    loadingProductIds: state.cart.loadingProductIds,
    isProductsError: state.products.isError,
    isCartError: state.cart.isError
  }),
  dispatch => ({
    startFetchProducts: () => dispatch(startFetchProducts()),
    startFetchCart: () => dispatch(startFetchCart()),
    addProductToCart: (productId, productName) =>
      dispatch(addProductToCart(productId, productName)),
    removeProductFromCart: (productId, productName) =>
      dispatch(removeProductFromCart(productId, productName))
  })
)(Catalog)
