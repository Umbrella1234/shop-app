import React from 'react'
import { Route } from 'react-router-dom'

export const renderRoutes = routesData =>
  Object.values(routesData).map(({ getLink, ...routerProps }) => (
    <Route key={routerProps.path} {...routerProps} />
  ))
