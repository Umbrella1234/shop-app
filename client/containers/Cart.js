import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Col, Row, Button } from 'reactstrap'
import styled from 'styled-components'
import { Block } from '../components/Block'
import {
  StyledHeading,
  StyledStringButton
} from '../components/styledComponents/common'
import { startFetchProducts } from '../ducks/productsDucks'
import { startFetchCart, addProductToCart } from '../ducks/cartDucks'

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const StyledTableHeaderRow = styled.tr`
  background: grey;
`

const StyledTableHeader = styled.td`
  padding: 20px;
`

const StyledTableData = styled.td`
  padding: 20px;
`

const StyledPrice = styled.span`
  margin-left: 15px;
  ${({ isBig }) =>
    isBig &&
    `font-size: 30px;
     font-weight: bold;
  `}
`
const StyledPriceRow = styled.div`
  margin-left: ${({ marginLeft }) => `${marginLeft || 0}px`};
  margin-bottom: 10px;
`

const StyledButton = styled(Button)`
  width: 200px;
  height: 50px;
`

class Cart extends Component {
  componentDidMount () {
    this.props.startFetchProducts()
    this.props.startFetchCart()
  }

  render () {
    const {
      products,
      cart: {
        cartProducts,
        priceWithDiscount,
        priceWithoutDiscount,
        discountPercent
      },
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
            <StyledHeading>Корзина:</StyledHeading>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <StyledTable>
              <thead>
                <StyledTableHeaderRow>
                  <StyledTableHeader>Наименование</StyledTableHeader>
                  <StyledTableHeader>Габариты, мм</StyledTableHeader>
                  <StyledTableHeader>Вес</StyledTableHeader>
                  <StyledTableHeader>Цена, руб.</StyledTableHeader>
                  <StyledTableHeader>Количество</StyledTableHeader>
                  <StyledTableHeader>Стоимость, руб.</StyledTableHeader>
                  <StyledTableHeader>
                    <StyledStringButton>Удалить всё</StyledStringButton>
                  </StyledTableHeader>
                </StyledTableHeaderRow>
              </thead>
              <tbody>
                {cartProducts.map(({ id, quantity }) => {
                  const { name, size, weight, price } = products.find(
                    product => product.id === id
                  )
                  return (
                    <tr>
                      <StyledTableData>{name}</StyledTableData>
                      <StyledTableData>{size}</StyledTableData>
                      <StyledTableData>{weight}</StyledTableData>
                      <StyledTableData>{price}</StyledTableData>
                      <StyledTableData>{quantity}</StyledTableData>
                      <StyledTableData>{price * quantity}</StyledTableData>
                      <StyledTableData>
                        <StyledStringButton>Удалить</StyledStringButton>
                      </StyledTableData>
                    </tr>
                  )
                })}
              </tbody>
            </StyledTable>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={{ size: 4, offset: 7 }}>
            <div>
              <StyledPriceRow marginLeft='20'>
                Цена со{' '}
                <StyledStringButton>
                  скидкой {discountPercent}%
                </StyledStringButton>{' '}
                <StyledPrice isBig>{priceWithDiscount} Р</StyledPrice>
              </StyledPriceRow>
              <StyledPriceRow marginLeft='60'>
                Без скидки <StyledPrice>{priceWithoutDiscount} р</StyledPrice>
              </StyledPriceRow>
              <StyledPriceRow>
                <StyledButton color='danger'> Оформить заказ</StyledButton>
              </StyledPriceRow>
            </div>
          </Col>
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
)(Cart)
