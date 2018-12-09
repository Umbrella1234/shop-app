import React from 'react'
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap'

export class Pages extends React.Component {
  handlePrevClick = () => {
    if (this.props.activePageNumber > 1) {
      this.props.setActivePage(this.props.activePageNumber - 1)
    }
  }

  handleNextClick = () => {
    const { activePageNumber, totalPages } = this.props
    if (activePageNumber < totalPages) {
      this.props.setActivePage(activePageNumber + 1)
    }
  }

  render () {
    const { totalPages, activePageNumber, setActivePage } = this.props

    const nextButtons = []
    const prevButtons = []

    if (activePageNumber < totalPages) {
      for (let i = activePageNumber + 1; i <= activePageNumber + 2; i++) {
        if (i <= totalPages) {
          nextButtons.push(
            <PaginationItem key={i} onClick={() => setActivePage(i)}>
              <PaginationLink>{i}</PaginationLink>
            </PaginationItem>
          )
        }
      }
    }

    if (activePageNumber > 1) {
      for (let i = activePageNumber - 2; i <= activePageNumber - 1; i++) {
        if (i > 0) {
          prevButtons.push(
            <PaginationItem key={i} onClick={() => setActivePage(i)}>
              <PaginationLink>{i}</PaginationLink>
            </PaginationItem>
          )
        }
      }
    }

    return (
      <Pagination>
        <PaginationItem>
          <PaginationLink previous onClick={this.handlePrevClick} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink onClick={() => setActivePage(1)}>...</PaginationLink>
        </PaginationItem>
        {prevButtons}
        <PaginationItem active>
          <PaginationLink>{activePageNumber}</PaginationLink>
        </PaginationItem>
        {nextButtons}
        <PaginationItem>
          <PaginationLink onClick={() => setActivePage(totalPages)}>
            ...
          </PaginationLink>
        </PaginationItem>
        <PaginationLink next onClick={this.handleNextClick} />
      </Pagination>
    )
  }
}
