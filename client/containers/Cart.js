import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Col, Row, Button } from 'reactstrap'
import styled from 'styled-components'
import { createNewOrder } from '../ducks/ordersDucks'
import { Block } from '../components/Block'
import {
  StyledHeading,
  StyledStringButton
} from '../components/styledComponents/common'
import { startFetchProducts } from '../ducks/productsDucks'
import {
  startFetchCart,
  removeProductFromCart,
  updateCartProduct,
  removeProductFromStore
} from '../ducks/cartDucks'
import { formatPrice } from '../utils/formatters'
import Alerts from './Alerts'

const BREAKPOINT = 1000
const TD_BACKGROUND_COLOR = 'rgb(192,192,192, 0.5)'

const StyledTable = styled.table`
  width: 100%;
  min-width: ${BREAKPOINT}px;
  border-collapse: collapse;
`
const StyledTableWrapper = styled.div`
  overflow: auto;
`

const StyledTableHeaderRow = styled.tr`
  background: ${TD_BACKGROUND_COLOR};
`
const StyledTableRow = styled.tr`
  &:nth-child(even) {
    background: ${TD_BACKGROUND_COLOR};
    opacity: 0.5;
  }
`

const StyledTableHeader = styled.td`
  padding: 20px;
`

const StyledTableData = styled.td`
  padding: 20px;
  ${({ isCentered }) => isCentered && `text-align: center`}
  ${({ isBold }) => isBold && `font-weight: bold`}
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

const StyledQuantityInput = styled.input`
  width: 30px;
  margin: 0 5px;
  text-align: center;

  &:disabled {
    background: none;
    border-width: 1px;
  }
`

const StyledPriceSectionWrapper = styled.div`
  @media (min-width: ${BREAKPOINT}px) {
    display: flex;
    justify-content: flex-end;
    margin-right: 200px;
  }
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
      isCartLoading,
      isCreateOrderLoading,
      isProductsError,
      isCartError,
      removeProductFromCart,
      updateCartProduct,
      createNewOrder,
      removeProductFromStore
    } = this.props

    const showSpinner =
      areProductsLoading || isProductsError || isCartLoading || isCartError

    const hasProducts = !!cartProducts.length

    return (
      <React.Fragment>
        <Alerts />
        <Block showSpinner={showSpinner}>
          <Row>
            <Col xs={12}>
              <StyledHeading>Корзина:</StyledHeading>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              {hasProducts ? (
                <StyledTableWrapper>
                  <StyledTable>
                    <thead>
                      <StyledTableHeaderRow>
                        <StyledTableHeader isBold>
                          Наименование
                        </StyledTableHeader>
                        <StyledTableHeader>Габариты, мм</StyledTableHeader>
                        <StyledTableHeader>Вес</StyledTableHeader>
                        <StyledTableHeader>Цена, руб.</StyledTableHeader>
                        <StyledTableHeader>Количество</StyledTableHeader>
                        <StyledTableHeader>Стоимость, руб.</StyledTableHeader>
                        <StyledTableHeader>
                          <StyledStringButton
                            onClick={() =>
                              hasProducts && removeProductFromCart()
                            }
                          >
                            Удалить всё
                          </StyledStringButton>
                        </StyledTableHeader>
                      </StyledTableHeaderRow>
                    </thead>
                    <tbody>
                      {cartProducts
                        .sort((a, b) => a.id - b.id)
                        .map(({ id, quantity }) => {
                          const { name, size, weight, price } = products.find(
                            product => product.id === id
                          )
                          const isLoading = loadingProductIds.some(
                            loadingProductId => loadingProductId === id
                          )
                          const fullPrice = price * quantity
                          return (
                            <StyledTableRow key={id}>
                              <StyledTableData>{name}</StyledTableData>
                              <StyledTableData>{size}</StyledTableData>
                              <StyledTableData>{weight}</StyledTableData>
                              <StyledTableData>
                                {formatPrice(price)}
                              </StyledTableData>
                              <StyledTableData>
                                <Button
                                  color='danger'
                                  disabled={quantity === 0 || isLoading}
                                  onClick={() =>
                                    updateCartProduct(id, quantity - 1)
                                  }
                                >
                                  -
                                </Button>
                                <StyledQuantityInput
                                  type='text'
                                  disabled
                                  value={quantity}
                                />
                                <Button
                                  color='danger'
                                  disabled={isLoading}
                                  onClick={() =>
                                    updateCartProduct(id, quantity + 1)
                                  }
                                >
                                  +
                                </Button>
                              </StyledTableData>
                              <StyledTableData isBold>
                                {fullPrice === 0 ? '-' : fullPrice}
                              </StyledTableData>
                              <StyledTableData>
                                <StyledStringButton
                                  onClick={() => {
                                    if (!isLoading) {
                                      if (quantity > 0) {
                                        removeProductFromCart(id)
                                      } else {
                                        removeProductFromStore(id)
                                      }
                                    }
                                  }}
                                >
                                  Удалить
                                </StyledStringButton>
                              </StyledTableData>
                            </StyledTableRow>
                          )
                        })}
                    </tbody>
                  </StyledTable>
                </StyledTableWrapper>
              ) : (
                'В корзине нет товаров.'
              )}
            </Col>
          </Row>
          {hasProducts && (
            <Row>
              <Col xs={12}>
                <StyledPriceSectionWrapper>
                  <div>
                    {discountPercent > 0 && (
                      <StyledPriceRow marginLeft='20'>
                        Цена со{' '}
                        <StyledStringButton>
                          скидкой {discountPercent}%
                        </StyledStringButton>{' '}
                        <StyledPrice isBig>
                          {formatPrice(priceWithDiscount)}
                        </StyledPrice>
                      </StyledPriceRow>
                    )}

                    <StyledPriceRow marginLeft='60'>
                      Цена без скидки{' '}
                      <StyledPrice>
                        {formatPrice(priceWithoutDiscount)}
                      </StyledPrice>
                    </StyledPriceRow>
                    {priceWithDiscount > 0 && (
                      <StyledPriceRow>
                        <StyledButton
                          disabled={isCreateOrderLoading}
                          onClick={() => createNewOrder()}
                          color='danger'
                        >
                          {' '}
                          Оформить заказ
                        </StyledButton>
                      </StyledPriceRow>
                    )}
                  </div>
                </StyledPriceSectionWrapper>
              </Col>
            </Row>
          )}
        </Block>
      </React.Fragment>
    )
  }
}

export default connect(
  state => ({
    products: state.products.items,
    cart: state.cart.data,
    isCreateOrderLoading: state.orders.isCreateOrderLoading,
    areProductsLoading: state.products.isLoading,
    isCartLoading: state.cart.isLoading,
    loadingProductIds: state.cart.loadingProductIds,
    isProductsError: state.products.isError,
    isCartError: state.cart.isError
  }),
  dispatch => ({
    startFetchProducts: () => dispatch(startFetchProducts()),
    startFetchCart: () => dispatch(startFetchCart()),
    removeProductFromCart: productId =>
      dispatch(removeProductFromCart(productId)),
    removeProductFromStore: productId =>
      dispatch(removeProductFromStore(productId)),
    updateCartProduct: (productId, quantity) =>
      dispatch(updateCartProduct(productId, quantity)),
    createNewOrder: () => dispatch(createNewOrder())
  })
)(Cart)
