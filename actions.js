import { InteractionManager } from 'react-native'

export const types = {
  PUSH_ROUTE: 'PUSH_ROUTE',
  POP_ROUTE: 'POP_ROUTE',
  RESET_ROUTES: 'RESET_ROUTES',
  SET_NAV_ACTION: 'SET_NAV_ACTION',
  SET_NAV_TITLE: 'SET_NAV_TITLE',
  OPEN_DRAWER: 'OPEN_DRAWER',
  CLOSE_DRAWER: 'CLOSE_DRAWER',
  ADD_BLUR_LISTENER: 'ADD_BLUR_LISTENER',
  REMOVE_BLUR_LISTENER: 'REMOVE_BLUR_LISTENER',
  ADD_FOCUS_LISTENER: 'ADD_FOCUS_LISTENER',
  REMOVE_FOCUS_LISTENER: 'REMOVE_FOCUS_LISTENER',
}

const getTitle = id => (id.slice(0, 1).toUpperCase() + id.slice(1)).replace(/-/g, ' ')

export const _navigate = (route, options = {}) => {
  return (dispatch, getState) => {
    const state = getState()
    let type, title
    options.route = route
    if (typeof options.animated !== 'boolean') {
      options.animated = true
    }
    if (route === -1) {
      type = types.POP_ROUTE
      title = getTitle(state.router.routes[state.router.routes.length - 2] || '')
    } else {
      type = options.reset ? types.RESET_ROUTES : types.PUSH_ROUTE
      title = getTitle(route)
    }
    dispatch({ type, options })
    //  Not using InteractionManager.runAfterInteractions for better visual effect
    setTimeout(() => dispatch(_setNavTitle(title)), 0)
  }
}

export const _setNavAction = navAction => {
  return dispatch => InteractionManager.runAfterInteractions(() => {
    dispatch({
      type: types.SET_NAV_ACTION,
      renderer: navAction.renderer,
      handler: navAction.handler,
    })
  })
}

export const _setNavTitle = title => ({
  type: types.SET_NAV_TITLE,
  title,
})

export const _openDrawer = () => ({ type: types.OPEN_DRAWER })

export const _closeDrawer = () => ({ type: types.CLOSE_DRAWER })

const getRouteListenerDispatchable = (dispatchType, eventType, listener) => ({
  type: `${dispatchType.toUpperCase()}_${eventType.toUpperCase()}_LISTENER`,
  listener
})

export const _addRouteListener = (type, listener) => {
  if (['blur', 'focus'].indexOf(type) < 0) {
    throw new Error('Route event type must be `blur` or `focus`')
  }
  return getRouteListenerDispatchable('add', type, listener)
}

export const _removeRouteListener = (type, listener) => {
  if (['blur', 'focus'].indexOf(type) < 0) {
    throw new Error('Route event type must be `blur` or `focus`')
  }
  return getRouteListenerDispatchable('remove', type, listener)
}

/*  Router internal method, DO NOT CALL  */
export const $$_updateStatusBar = (_caller, size) => {
  return (dispatch) => {
    if (_caller._class() !== 'StatusBar') return
    dispatch({
      type: '$$_UPDATE_STATUS_BAR_SIZE',
      size,
    })
  }
}
