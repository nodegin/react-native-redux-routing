import * as _actions from './actions'
import reducer from './reducer'
import Router from './components/Router'
import Route from './components/Route'

const { types, ...actions } = _actions

export {
  Router,
  Route,
  actions,
  types,
  reducer,
}
