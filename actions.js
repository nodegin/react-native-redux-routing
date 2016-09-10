import { Alert } from 'react-native'

export const types = {
  ROUTE_PUSH: 'ROUTE_PUSH',
  ROUTE_POP: 'ROUTE_POP',
  ROUTE_REPLACE: 'ROUTE_REPLACE',
  ROUTE_RESET: 'ROUTE_RESET',
  SET_NAV_ACTION: 'SET_NAV_ACTION',
  SET_NAV_TITLE: 'SET_NAV_TITLE',
  OPEN_DRAWER: 'OPEN_DRAWER',
  CLOSE_DRAWER: 'CLOSE_DRAWER',
  /*  Event listeners  */
  ADD_BLUR_LISTENER: 'ADD_BLUR_LISTENER',
  REMOVE_BLUR_LISTENER: 'REMOVE_BLUR_LISTENER',
  ADD_FOCUS_LISTENER: 'ADD_FOCUS_LISTENER',
  REMOVE_FOCUS_LISTENER: 'REMOVE_FOCUS_LISTENER',
  ADD_UNLOAD_LISTENER: 'ADD_UNLOAD_LISTENER',
  REMOVE_UNLOAD_LISTENER: 'REMOVE_UNLOAD_LISTENER',
}

const getTitle = id => (id.slice(0, 1).toUpperCase() + id.slice(1)).replace(/-/g, ' ')

const confirmationLeaving = msg => new Promise((resolve, reject) => {
  Alert.alert('Confirm Navigation', msg, [
    { text: 'Leave', onPress: () => resolve(true), },
    { text: 'Stay', onPress: () => resolve(false), },
  ])
})

export const _navigate = (route, options = {}) => {
  return async (dispatch, getState) => {
    const state = getState()
    let type, title
    if (typeof options.animated !== 'boolean') {
      options.animated = true
    }
    if (route === -1) {
      type = types.ROUTE_POP
      route = state.router.routes[state.router.routes.length - 2]
      title = getTitle(route || '')
    } else {
      type = options.reset ? types.ROUTE_RESET : options.replace ? types.ROUTE_REPLACE : types.ROUTE_PUSH
      title = getTitle(route)
    }
    /*  Navigation confirmation  */
    const currentRoute = state.router.routes[state.router.routes.length - 1]
    if (state.router.$$_unloadEventListeners[currentRoute]) {
      const msg = state.router.$$_unloadEventListeners[currentRoute]()
      if (!!msg) {
        const confirmLeave = await confirmationLeaving(msg)
        if (!confirmLeave) {
          return
        }
      }
    }
    options.route = route
    dispatch({ type, options })
    dispatch({
      type: types.SET_NAV_TITLE,
      title,
    })
    dispatch(_closeDrawer())
  }
}

export const _setNavAction = action => dispatch => setTimeout(() => dispatch({
  type: types.SET_NAV_ACTION,
  renderer: action !== null ? action.renderer : null,
  handler: action !== null ? action.handler : null,
}), 0)

export const _setNavTitle = title => dispatch => setTimeout(() => dispatch({
  type: types.SET_NAV_TITLE,
  title,
}), 0)

export const _openDrawer = () => ({ type: types.OPEN_DRAWER })

export const _closeDrawer = () => ({ type: types.CLOSE_DRAWER })

const getRouteListenerDispatchable = (dispatchType, eventType, listener) => ({
  type: `${dispatchType.toUpperCase()}_${eventType.toUpperCase()}_LISTENER`,
  listener,
})

export const _addRouteListener = (type, listener) => {
  if (['blur', 'focus', 'unload'].indexOf(type) < 0) {
    throw new Error('Route event type must be `blur`, `focus` or `unload')
  }
  return getRouteListenerDispatchable('add', type, listener)
}

export const _removeRouteListener = (type, listener) => {
  if (['blur', 'focus', 'unload'].indexOf(type) < 0) {
    throw new Error('Route event type must be `blur`, `focus` or `unload`')
  }
  return getRouteListenerDispatchable('remove', type, listener)
}

/*  Router internal method, DO NOT CALL  */
export const $$_pageTransitioning = (_caller, transitioning) => {
  return dispatch => {
    if (_caller._class() !== 'StatusBar') return
    dispatch({
      type: '$$_SET_PAGE_TRANSITIONING',
      transitioning,
    })
  }
}
export const $$_setPreviousListeners = (_caller, onWillFocusListener, onDidFocusListener) => {
  return dispatch => {
    if (_caller._class() !== 'StatusBar') return
    dispatch({
      type: '$$_SET_PREVIOUS_LISTENERS',
      onWillFocusListener,
      onDidFocusListener,
    })
  }
}
export const $$_routeIsChanging = (_caller, changing) => {
  return dispatch => {
    if (_caller._class() !== 'Router') return
    dispatch({
      type: '$$_DISPATCH_ROUTE_CHANGING',
      changing,
    })
  }
}
