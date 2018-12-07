import React from 'react'
import { GridLoader } from 'react-spinners'
import { css } from 'react-emotion'

const centered = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

export const Block = ({ showSpinner, children }) => {
  return showSpinner ? <GridLoader className={centered} /> : children
}
