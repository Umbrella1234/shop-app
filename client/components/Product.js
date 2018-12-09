import React from 'react'
import { Button } from 'reactstrap'
import styled from 'styled-components'
import { formatPrice } from '../utils/formatters'

const StyledProductImage = styled.img`
  width: 100%;
  height: 300px;
  margin-bottom: 10px;
`

const StyledProductWrapper = styled.div`
  padding: 10px 20px;
  margin-bottom: 10px;
  border: 1px solid black;
`

const StyledName = styled.div`
  text-align: center;
  margin-bottom: 10px;
`

const StyledPrice = styled.div`
  margin-bottom: 10px;
`

export const Product = ({
  name,
  id,
  image,
  price,
  isInCart,
  isLoading,
  onClick
}) => (
  <StyledProductWrapper>
    <StyledName>{name}</StyledName>
    <StyledProductImage src={`productPictures/${image}`} alt={name} />
    <StyledPrice>Цена: {formatPrice(price)}</StyledPrice>
    <Button
      color={isInCart ? 'danger' : 'info'}
      disabled={isLoading}
      onClick={() => onClick(id, name)}
    >
      {isInCart ? 'Удалить из корзины' : 'Добавить в корзину'}
    </Button>
  </StyledProductWrapper>
)
