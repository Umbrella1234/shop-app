import axios from 'axios'
import { BASE_URL } from '../constants'
import { CREATE_ORDER_SUCCESS } from './ordersDucks'
import { addAlert } from './alertDucks'
import { createReducer } from '../utils/createReducer'

const FETCH_CART = 'FETCH_CART'
const FETCH_CART_SUCCESS = 'FETCH_CART_SUCCESS'
const FETCH_CART_ERROR = 'FETCH_CART_ERROR'

const ADD_PRODUCT = 'ADD_PRODUCT'
const ADD_PRODUCT_SUCCESS = 'ADD_PRODUCT_SUCCESS'
const ADD_PRODUCT_ERROR = 'ADD_PRODUCT_ERROR'

const REMOVE_PRODUCT = 'REMOVE_PRODUCT'
const REMOVE_PRODUCT_SUCCESS = 'REMOVE_PRODUCT_SUCCESS'
const REMOVE_PRODUCT_ERROR = 'REMOVE_PRODUCT_ERROR'
const REMOVE_PRODUCT_FROM_STORE = 'REMOVE_PRODUCT_FROM_STORE'

const UPDATE_PRODUCT = 'UPDATE_PRODUCT'
const UPDATE_PRODUCT_SUCCESS = 'UPDATE_PRODUCT_SUCCESS'
const UPDATE_PRODUCT_ERROR = 'UPDATE_PRODUCT_ERROR'

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

const removeProduct = productId => ({
  type: REMOVE_PRODUCT,
  productId
})

const removeProductSuccess = (cartData, productId) => ({
  type: REMOVE_PRODUCT_SUCCESS,
  cartData,
  productId
})

const removeProductError = productId => ({
  type: REMOVE_PRODUCT_ERROR,
  productId
})

export const removeProductFromStore = productId => ({
  type: REMOVE_PRODUCT_FROM_STORE,
  productId
})

const updateProduct = productId => ({
  type: UPDATE_PRODUCT,
  productId
})

const updateProductSuccess = (cartData, productId, shouldPersistItem) => ({
  type: UPDATE_PRODUCT_SUCCESS,
  cartData,
  productId,
  shouldPersistItem
})

const updateProductError = productId => ({
  type: UPDATE_PRODUCT_ERROR,
  productId
})

export const startFetchCart = () => dispatch => {
  dispatch(fetchCart())
  axios
    .get(`${BASE_URL}/cart/get`)
    .then(res => {
      dispatch(fetchCartSuccess(res.data))
    })
    .catch(() => dispatch(fetchCartError()))
}

export const addProductToCart = (productId, name) => dispatch => {
  dispatch(addProduct(productId))
  axios({
    method: 'post',
    url: `${BASE_URL}/cart/add`,
    data: {},
    params: { productId }
  })
    .then(res => {
      dispatch(addProductSuccess(res.data.data, productId))
      dispatch(
        addAlert({
          color: 'success',
          text: `Товар "${name}" был добавлен в корзину YAAAAAAAAY`
        })
      )
    })
    .catch(() => dispatch(addProductError()))
}

export const removeProductFromCart = (productId, name) => dispatch => {
  dispatch(removeProduct(productId))

  axios({
    method: 'post',
    url: `${BASE_URL}/cart/delete`,
    data: {},
    params: { productId }
  })
    .then(res => {
      dispatch(removeProductSuccess(res.data.data, productId))
      if (name) {
        dispatch(
          addAlert({
            color: 'danger',
            text: `Товар "${name}" был удалён из корзины :(`
          })
        )
      }
    })
    .catch(() => dispatch(removeProductError()))
}

export const updateCartProduct = (productId, quantity) => dispatch => {
  dispatch(updateProduct(productId))
  axios({
    method: 'post',
    url: `${BASE_URL}/cart/update`,
    data: { product: { [productId]: quantity } }
  })
    .then(res => {
      const shouldPersistItem = quantity === 0
      dispatch(
        updateProductSuccess(res.data.data, productId, shouldPersistItem)
      )
    })
    .catch(() => dispatch(updateProductError()))
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
  }),
  [REMOVE_PRODUCT]: (state, { productId }) => {
    return {
      ...state,
      loadingProductIds: productId
        ? [...state.loadingProductIds, productId]
        : state.data.cartProducts.map(product => product.id)
    }
  },
  [REMOVE_PRODUCT_SUCCESS]: (state, { cartData, productId }) => ({
    ...state,
    data: cartData,
    loadingProductIds: productId
      ? state.loadingProductIds.filter(
        loadingProductId => loadingProductId !== productId
      )
      : []
  }),
  [REMOVE_PRODUCT_ERROR]: state => ({
    ...state,
    isError: true,
    loadingProductId: null
  }),
  [REMOVE_PRODUCT_FROM_STORE]: (state, { productId }) => {
    return {
      ...state,
      data: {
        ...state.data,
        cartProducts: state.data.cartProducts.filter(
          product => product.id !== productId
        )
      }
    }
  },
  [UPDATE_PRODUCT]: (state, { productId }) => ({
    ...state,
    loadingProductIds: [...state.loadingProductIds, productId]
  }),
  [UPDATE_PRODUCT_SUCCESS]: (
    state,
    { cartData, productId, shouldPersistItem }
  ) => {
    let { cartProducts } = cartData
    let zeroItems = state.data.cartProducts.filter(item => item.quantity === 0)
    if (shouldPersistItem) {
      zeroItems.push({ id: productId, quantity: 0 })
    } else {
      zeroItems = zeroItems.filter(item => item.id !== productId)
    }
    cartData.cartProducts = [...cartProducts, ...zeroItems]
    return {
      ...state,
      data: cartData,
      loadingProductIds: state.loadingProductIds.filter(
        loadingProductId => loadingProductId !== productId
      )
    }
  },
  [UPDATE_PRODUCT_ERROR]: state => ({
    ...state,
    isError: true,
    loadingProductId: null
  }),
  [CREATE_ORDER_SUCCESS]: () => initialState
})
