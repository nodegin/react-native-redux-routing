import * as _actions from './actions'
import reducer from './reducer'
import Router from './components/Router'
import Route from './components/Route'

const { types, ...actions } = _actions

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  router: ownProps.router,
  actions: {
    ...dispatchProps.actions,
    ...ownProps.actions,
  }
})

export {
  Router,
  Route,
  actions,
  types,
  reducer,
  mergeProps,
}
