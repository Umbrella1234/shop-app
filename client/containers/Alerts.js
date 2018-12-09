import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Alert } from 'reactstrap'
import { removeAlert, resetAlerts } from '../ducks/alertDucks'

class Alerts extends Component {
  componentWillUnmount () {
    this.props.resetAlerts()
  }

  render () {
    const { messages, removeAlert } = this.props

    return messages.map((msg, i) => (
      <Alert
        key={i}
        color={msg.color}
        isOpen
        toggle={() => removeAlert(msg.text)}
      >
        {msg.text}
      </Alert>
    ))
  }
}

export default connect(
  state => ({
    messages: state.alerts.messages
  }),
  dispatch => ({
    removeAlert: text => dispatch(removeAlert(text)),
    resetAlerts: text => dispatch(resetAlerts())
  })
)(Alerts)
