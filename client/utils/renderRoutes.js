import React from 'react'
import { Route } from 'react-router-dom'

export const renderRoutes = routesData =>
  routesData.map(routeData => <Route key={routeData.path} {...routeData} />)
