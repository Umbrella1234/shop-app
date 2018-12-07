import axios from 'axios'
import { createReducer } from '../utils/createReducer'

const FETCH_PRODUCTS = 'FETCH_PRODUCTS'
const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS'
const FETCH_PRODUCTS_ERROR = 'FETCH_PRODUCTS_ERROR'

const fetchProducts = () => ({
  type: FETCH_PRODUCTS
})

const fetchProductsSuccess = products => ({
  type: FETCH_PRODUCTS_SUCCESS,
  products
})

const fetchProductsError = () => ({
  type: FETCH_PRODUCTS_ERROR
})

export const startFetchProducts = () => dispatch => {
  dispatch(fetchProducts())
  axios
    .get('/api/v1/products')
    .then(res => {
      dispatch(fetchProductsSuccess(res.data.products))
    })
    .catch(() => dispatch(fetchProductsError()))
}

const initialState = {
  items: [],
  isLoading: false,
  isError: false
}

export const productsReducer = createReducer(initialState, {
  [FETCH_PRODUCTS]: state => ({
    ...state,
    isLoading: true,
    isError: false
  }),
  [FETCH_PRODUCTS_SUCCESS]: (state, { products }) => ({
    ...state,
    items: products,
    isLoading: false,
    isError: false
  }),
  [FETCH_PRODUCTS_ERROR]: state => ({
    ...state,
    isLoading: false,
    isError: true
  })
})
