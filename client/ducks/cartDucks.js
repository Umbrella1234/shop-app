import axios from 'axios'
import { addAlert } from './alertDucks'
import { createReducer } from '../utils/createReducer'

const FETCH_CART = 'FETCH_CART'
const FETCH_CART_SUCCESS = 'FETCH_CART_SUCCESS'
const FETCH_CART_ERROR = 'FETCH_CART_ERROR'

const ADD_PRODUCT = 'ADD_PRODUCT'
const ADD_PRODUCT_SUCCESS = 'ADD_PRODUCT_SUCCESS'
const ADD_PRODUCT_ERROR = 'ADD_PRODUCT_ERROR'

const fetchCart = () => ({
  type: FETCH_CART
})

const fetchCartSuccess = cartData => ({
  type: FETCH_CART_SUCCESS,
  cartData
})

const fetchCartError = () => ({
  type: FETCH_CART_ERROR
})

const addProduct = productId => ({
  type: ADD_PRODUCT,
  productId
})

const addProductSuccess = (cartData, productId) => ({
  type: ADD_PRODUCT_SUCCESS,
  cartData,
  productId
})

const addProductError = productId => ({
  type: ADD_PRODUCT_ERROR,
  productId
})

export const startFetchCart = () => dispatch => {
  dispatch(fetchCart())
  axios
    .get('/api/v1/cart/get')
    .then(res => {
      dispatch(fetchCartSuccess(res.data))
    })
    .catch(() => dispatch(fetchCartError()))
}

export const addProductToCart = (productId, name) => dispatch => {
  dispatch(addProduct(productId))
  axios({
    method: 'post',
    url: '/api/v1/cart/add',
    data: {},
    params: { productId }
  })
    .then(res => {
      dispatch(addProductSuccess(res.data.data, productId))
      dispatch(
        addAlert({
          type: 'success',
          text: `Товар "${name}" был добавлен в корзину YAAAAAAAAY`
        })
      )
    })
    .catch(() => dispatch(addProductError()))
}

const initialState = {
  data: {
    cartProducts: [],
    priceWithoutDiscount: 0,
    priceWithDiscount: 0,
    discount: 0,
    discountPercent: 0
  },
  loadingProductIds: [],
  isLoading: false,
  isError: false
}

export const cartReducer = createReducer(initialState, {
  [FETCH_CART]: state => ({
    ...state,
    isLoading: true,
    isError: false
  }),
  [FETCH_CART_SUCCESS]: (state, { cartData }) => ({
    ...state,
    data: cartData,
    isLoading: false,
    isError: false
  }),
  [FETCH_CART_ERROR]: (state, { productId }) => ({
    ...state,
    isLoading: false,
    isError: true
  }),
  [ADD_PRODUCT]: (state, { productId }) => ({
    ...state,
    loadingProductIds: [...state.loadingProductIds, productId]
  }),
  [ADD_PRODUCT_SUCCESS]: (state, { cartData, productId }) => ({
    ...state,
    data: cartData,
    loadingProductIds: state.loadingProductIds.filter(
      loadingProductId => loadingProductId !== productId
    )
  }),
  [ADD_PRODUCT_ERROR]: state => ({
    ...state,
    isError: true,
    loadingProductId: null
  })
})
