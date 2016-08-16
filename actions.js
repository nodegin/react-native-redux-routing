export const types = {
  PUSH_ROUTE: 'PUSH_ROUTE',
  POP_ROUTE: 'POP_ROUTE',
  RESET_ROUTES: 'RESET_ROUTES',
  SET_NAV_ACTION: 'SET_NAV_ACTION',
  SET_NAV_TITLE: 'SET_NAV_TITLE',
  OPEN_DRAWER: 'OPEN_DRAWER',
  CLOSE_DRAWER: 'CLOSE_DRAWER',
}

export const _navigate = (route, reset) => {
  return dispatch => {
    if (route === -1) {
      dispatch({
        type: types.POP_ROUTE,
      })
    } else if (reset) {
      dispatch({
        type: types.RESET_ROUTES,
        route,
      })
    } else {
      dispatch({
        type: types.PUSH_ROUTE,
        route,
      })
    }
  }
}

export const _setNavAction = navAction => ({
  type: types.SET_NAV_ACTION,
  renderer: navAction.renderer,
  handler: navAction.handler,
})

export const _setNavTitle = title => ({
  type: types.SET_NAV_TITLE,
  title,
})

export const _openDrawer = () => ({ type: types.OPEN_DRAWER })

export const _closeDrawer = () => ({ type: types.CLOSE_DRAWER })
