import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Col, Row } from 'reactstrap'
import { Block } from '../components/Block'
import { Product } from '../components/Product'
import { startFetchProducts } from '../ducks/productsDucks'
import { startFetchCart, addProductToCart } from '../ducks/cartDucks'

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
      addProductToCart
    } = this.props

    const showSpinner =
      areProductsLoading || isProductsError || isCartLoading || isCartError

    return (
      <Block showSpinner={showSpinner}>
        <Row>
          <Col xs={12}>
            <h1>
              В корзине{' '}
              {cartProducts.length
                ? `${productsInCart} товара на сумму ${priceWithoutDiscount}`
                : 'нет товаров'}
            </h1>
          </Col>
        </Row>
        <Row>
          {products.map(product => (
            <Col key={product.id} xs={12} md={4}>
              <Product
                {...product}
                isLoading={loadingProductIds.some(id => id === product.id)}
                isInCart={cartProducts.some(
                  cartProduct => cartProduct.id === product.id
                )}
                addProductToCart={addProductToCart}
              />
            </Col>
          ))}
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
      dispatch(addProductToCart(productId, productName))
  })
)(Catalog)
