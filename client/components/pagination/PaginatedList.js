import React, { Component } from 'react'
import { Row, Col, ListGroup } from 'reactstrap'
import { Pages } from './Pages'

export class PaginatedList extends Component {
  state = {
    activePageNumber: 1
  }

  setActivePage = pageNum => {
    this.setState({ activePageNumber: pageNum })
  }

  render () {
    const {
      items,
      renderItems,
      itemsPerPage
    } = this.props

    const { activePageNumber } = this.state

    return (
      <div>
        <Row>
          <Col xs={12}>
            <ListGroup>
              {items.map((item, index) => {
                if (
                  index <= activePageNumber * itemsPerPage &&
                  index >= activePageNumber * itemsPerPage - itemsPerPage
                ) {
                  return renderItems(item, index)
                }
                return null
              })}
            </ListGroup>
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs={12}>
            <Pages
              activePageNumber={activePageNumber}
              totalPages={Math.ceil(items.length / itemsPerPage)}
              setActivePage={this.setActivePage}
            />
          </Col>
        </Row>
      </div>
    )
  }
}
