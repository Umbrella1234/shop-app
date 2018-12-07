import React from 'react'
import { connect } from 'react-redux'
import { Alert } from 'reactstrap'
import { removeAlert } from '../ducks/alertDucks'

const Alerts = ({ messages, removeAlert }) =>
  messages.map(msg => (
    <Alert color={msg.color} isOpen toggle={() => removeAlert(msg.text)}>
      {msg.text}
    </Alert>
  ))

export default connect(
  state => ({
    messages: state.alerts.messages
  }),
  dispatch => ({
    removeAlert: text => dispatch(removeAlert(text))
  })
)(Alerts)
