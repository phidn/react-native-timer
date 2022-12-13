/**
 * https://reactnavigation.org/docs/navigation-container/
 */

import { createRef } from 'react'

export const navigationRef = createRef()

export const navigate = (name, params) => {
  navigationRef.current?.navigate(name, params)
}

export const goBack = () => {
  navigationRef.current?.goBack()
}
