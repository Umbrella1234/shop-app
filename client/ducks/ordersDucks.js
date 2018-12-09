import axios from 'axios'
import { BASE_URL } from '../constants'
import { addAlert } from './alertDucks'
import { createReducer } from '../utils/createReducer'

const FETCH_ORDERS = 'FETCH_ORDERS'
const FETCH_ORDERS_SUCCESS = 'FETCH_ORDERS_SUCCESS'
const FETCH_ORDERS_ERROR = 'FETCH_ORDERS_ERROR'

const CREATE_ORDER = 'CREATE_ORDER'
export const CREATE_ORDER_SUCCESS = 'CREATE_ORDER_SUCCESS'
const CREATE_ORDER_ERROR = 'CREATE_ORDER_ERROR'

const fetchOrders = () => ({
  type: FETCH_ORDERS
})

const fetchOrdersSuccess = ordersData => ({
  type: FETCH_ORDERS_SUCCESS,
  ordersData
})

const fetchOrdersError = () => ({
  type: FETCH_ORDERS_ERROR
})

const createOrder = () => ({
  type: CREATE_ORDER
})

const createOrderSuccess = ordersData => ({
  type: CREATE_ORDER_SUCCESS,
  ordersData
})

const createOrderError = () => ({
  type: CREATE_ORDER_ERROR
})

export const startFetchOrders = () => dispatch => {
  dispatch(fetchOrders())
  axios
    .get(`${BASE_URL}/orders`)
    .then(res => {
      dispatch(fetchOrdersSuccess(res.data))
    })
    .catch(() => dispatch(fetchOrdersError()))
}

export const createNewOrder = () => dispatch => {
  dispatch(createOrder())
  axios
    .post(`${BASE_URL}/orders`)
    .then(res => {
      dispatch(createOrderSuccess())
      dispatch(
        addAlert({
          color: 'success',
          text: `ЗАКАЗ ОФОРМЛЕН и находится на странице заказов YAAAAAAAAY`
        })
      )
    })
    .catch(() => dispatch(createOrderError()))
}

const initialState = {
  data: {
    orders: [],
    userData: {}
  },
  isGetOrdersLoading: false,
  isGetOrdersError: false,
  isCreateOrderLoading: false,
  isCreateOrderLoadingError: false
}

export const ordersReducer = createReducer(initialState, {
  [FETCH_ORDERS]: state => ({
    ...state,
    isGetOrdersLoading: true,
    isGetOrdersError: false
  }),
  [FETCH_ORDERS_SUCCESS]: (state, { ordersData }) => ({
    ...state,
    data: ordersData,
    isGetOrdersLoading: false,
    isGetOrdersError: false
  }),
  [FETCH_ORDERS_ERROR]: state => ({
    ...state,
    isGetOrdersLoading: false,
    isGetOrdersError: true
  }),
  [CREATE_ORDER]: state => ({
    ...state,
    isCreateOrderLoading: true,
    isCreateOrderLoadingError: false
  }),
  [CREATE_ORDER_SUCCESS]: (state, { ordersData }) => ({
    ...state,
    data: ordersData,
    isCreateOrderLoading: false,
    isCreateOrderLoadingError: false
  }),
  [CREATE_ORDER_ERROR]: state => ({
    ...state,
    isCreateOrderLoading: false,
    isCreateOrderLoadingError: true
  })
})
