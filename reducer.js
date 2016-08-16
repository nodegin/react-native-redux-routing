import { types } from './actions'

const initialState = {
  action: null,
  routes: [],
  drawerOpen: false,
  navActionRenderer: null,
  navActionHandler: null,
  navTitle: null,
}

const getTitle = id => (id.slice(0, 1).toUpperCase() + id.slice(1)).replace(/-/g, ' ')

const getUpdate = (action, routes) => {
  let route
  if (action.type === types.POP_ROUTE) {
    route = routes[routes.length - 1]
    if (!route) {
      throw new Error('Cannot pop the topmost route, route stack contains only 1 child.')
    }
  } else {
    route = action.route
  }
  return {
    action: action.type,
    routes,
    drawerOpen: false,
    navActionRenderer: null,
    navActionHandler: null,
    navTitle: getTitle(route),
  }
}

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case types.PUSH_ROUTE:
      return {
        ...state,
        ...getUpdate(action, [...state.routes, action.route]),
      }
    case types.POP_ROUTE:
      const routes = state.routes.filter((_, i) => i !== state.routes.length - 1)
      return {
        ...state,
        ...getUpdate(action, routes),
      }
    case types.RESET_ROUTES:
      return {
        ...state,
        ...getUpdate(action, [action.route]),
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
    default:
      return state
  }
}
