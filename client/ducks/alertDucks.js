import { createReducer } from '../utils/createReducer'

const ADD_ALERT = 'ADD_ALERT'
const REMOVE_ALERT = 'REMOVE_ALERT'

export const addAlert = message => ({
  type: ADD_ALERT,
  message
})

export const removeAlert = message => ({
  type: REMOVE_ALERT,
  message
})

const initialState = {
  messages: []
}

export const alertReducer = createReducer(initialState, {
  [ADD_ALERT]: (state, { message }) => ({
    ...state,
    messages: [...state.messages, message]
  }),
  [REMOVE_ALERT]: (state, { message }) => ({
    ...state,
    messages: state.messages.filter(alertMessage => alertMessage.text !== message)
  })
})
