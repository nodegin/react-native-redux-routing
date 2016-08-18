import { Platform } from 'react-native'
import { types } from './actions'

const initialState = {
  action: null,
  options: {},
  routes: [],
  drawerOpen: false,
  navActionRenderer: null,
  navActionHandler: null,
  navTitle: null,
  statusBarSize: Platform.OS === 'ios' ? 20 : 0,
  $$_statusBarConfigured: Platform.OS === 'ios',
}

const getTitle = id => (id.slice(0, 1).toUpperCase() + id.slice(1)).replace(/-/g, ' ')

const getUpdate = (action, state) => {
  let routes
  let { route, reset, ...options } = action.options
  if (action.type === types.POP_ROUTE) {
    routes = state.routes.filter((_, i) => i !== state.routes.length - 1)
    route = routes[routes.length - 1]
    if (!route) {
      throw new Error('Cannot pop the topmost route, route stack contains only 1 child.')
    }
  } else {
    if (action.type === types.PUSH_ROUTE) {
      routes = [...state.routes, route]
    } else if (action.type === types.RESET_ROUTES) {
      routes = [route]
    }
  }
  return {
    action: action.type,
    options,
    routes,
    navActionRenderer: null,
    navActionHandler: null,
    navTitle: getTitle(route),
  }
}

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case types.PUSH_ROUTE:
    case types.POP_ROUTE:
    case types.RESET_ROUTES:
      return {
        ...state,
        ...getUpdate(action, state),
      }
    case types.SET_NAV_ACTION:
      return {
        ...state,
        navActionRenderer: action.renderer,
        navActionHandler: action.handler,
      }
    case types.SET_NAV_TITLE:
      return {
        ...state,
        navTitle: action.title,
      }
    case types.OPEN_DRAWER:
      return {
        ...state,
        drawerOpen: true,
      }
    case types.CLOSE_DRAWER:
      return {
        ...state,
        drawerOpen: false,
      }
    case '$$_UPDATE_STATUS_BAR_SIZE':
      return state.$$_statusBarConfigured ? state : {
        ...state,
        statusBarSize: Platform.OS === 'ios' ? 20 : action.size,
        $$_statusBarConfigured: true
      }
    default:
      return state
  }
}
