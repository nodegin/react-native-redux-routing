import { types } from './actions'

const initialState = {
  action: null,
  options: {},
  data: {},
  routes: [],
  drawerOpen: false,
  navActionRenderer: null,
  navActionHandler: null,
  navTitle: null,
  appBarSize: 54,
  transitioning: false,
  $$_blurEventListeners: {},
  $$_focusEventListeners: {},
  $$_unloadEventListeners: {},
  $$_routeIsChanging: false,
  $$_previousWillFocusListener: null,
  $$_previousDidFocusListener: null,
}

const getUpdate = (action, state) => {
  let routes
  let { route, reset, data = {}, ...options } = action.options
  if (action.type === types.ROUTE_POP) {
    routes = state.routes.filter((_, i) => i !== state.routes.length - 1)
    route = routes[routes.length - 1]
    if (!route) {
      throw new Error('Cannot pop the topmost route, route stack contains only 1 child.')
    }
  } else {
    if (action.type === types.ROUTE_PUSH) {
      routes = [...state.routes, route]
    } else if (action.type === types.ROUTE_REPLACE) {
      routes = state.routes.filter((_, i) => i !== state.routes.length - 1).concat(route)
    } else if (action.type === types.ROUTE_RESET) {
      routes = [route]
    }
  }
  return {
    action: action.type,
    options,
    routes,
    data,
    navActionRenderer: null,
    navActionHandler: null,
    $$_routeIsChanging: true,
  }
}

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case types.ROUTE_PUSH:
    case types.ROUTE_POP:
    case types.ROUTE_REPLACE:
    case types.ROUTE_RESET:
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
    case types.ADD_BLUR_LISTENER:
    case types.ADD_FOCUS_LISTENER:
    case types.ADD_UNLOAD_LISTENER:
      /*  Get current route id  */
      const routeId = state.routes[state.routes.length - 1]
      const addListeners = `$$_${action.type.replace(/.+_([a-z]+)_.+/gi, '$1').toLowerCase()}EventListeners`
      return {
        ...state,
        [addListeners]: {
          ...state[addListeners],
          [routeId]: action.listener,
        }
      }
    case types.REMOVE_BLUR_LISTENER:
    case types.REMOVE_FOCUS_LISTENER:
    case types.REMOVE_UNLOAD_LISTENER:
      const listenerType = `$$_${action.type.replace(/.+_([a-z]+)_.+/gi, '$1').toLowerCase()}EventListeners`
      const filtered = Object.keys(state[listenerType]).reduce((listeners, route) =>{
        const current = state[listenerType][route] === action.listener ? {} : { [route]: state[listenerType][route] }
        return { ...listeners, ...current, }
      }, {})
      return {
        ...state,
        [listenerType]: filtered,
      }
    case '$$_SET_PAGE_TRANSITIONING':
      return {
        ...state,
        transitioning: action.transitioning,
      }
    case '$$_DISPATCH_ROUTE_CHANGING':
      return {
        ...state,
        $$_routeIsChanging: action.changing,
      }
    case '$$_SET_PREVIOUS_LISTENERS':
      return {
        ...state,
        $$_previousWillFocusListener: action.onWillFocusListener,
        $$_previousDidFocusListener: action.onDidFocusListener,
      }
    default:
      return state
  }
}
