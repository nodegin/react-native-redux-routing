import React from 'react'
import {
  Navigator,
  View,
  BackAndroid,
  Platform,
  InteractionManager,
} from 'react-native'

import { types } from '../actions'
import DrawerLayout from './DrawerLayout'

const SceneConfig = {
  ...Navigator.SceneConfigs.PushFromRight,
  springTension: 200,
  springFriction: 20,
  gestures: null
}

export default class extends React.Component {

  _class() {
    return 'Router'
  }

  constructor(props) {
    super(props)

    if (!this.props.initialRoute) {
      throw new Error('You must specify the `initialRoute` property for the router')
    }
    if (this.props.config && typeof this.props.config !==  'object') {
      throw new Error('Property `config` for the router must be an object')
    }
    if (typeof this.props.config.statusBarStyle === 'string' &&
        ['default', 'light-content'].indexOf(this.props.config.statusBarStyle) < 0) {
      throw new Error('Property `statusBarStyle` in config must be "default" or "light-content"')
    }

    const defaultConfig = {
      renderNavigationView: () => null,
      statusBarStyle: 'default',
      accentColor: '#E0E0E0',
    }

    this.config = {...defaultConfig, ...this.props.config}
    this.routes = {}

    React.Children.forEach(props.children, (child, index) => {
      if (!child.type.prototype._class || child.type.prototype._class() !== 'Route') {
        throw new Error('Children of `Router` must be an instance of `Route`')
      }
      if (!child.props.id) {
        throw new Error('Property `id` cannot be found in route #' + index)
      }
      if (!child.props.component) {
        throw new Error('Property `component` cannot be found in route keyed `' + child.props.id + '`')
      }
      this.routes[child.props.id] = child.props
    })

    this.props.actions._navigate(this.props.initialRoute, true)
  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', () => {
        if (this.props.router.drawerOpen) {
          this.props.actions._closeDrawer()
        } else if (this.props.router.routes.length > 1) {
          this.props.actions._navigate(-1)
          return true
        }
        return false
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    const currentRoute = this.props.router.routes[this.props.router.routes.length - 1]
    const nextRoute = nextProps.router.routes[nextProps.router.routes.length - 1]
    if (currentRoute !== nextRoute) {
      this.handleRouteChange(this.routes[currentRoute], this.routes[nextRoute], nextProps.router.action)
    }
  }

  handleRouteChange(currentRouteProps, nextRouteProps, type) {
    if (type === types.PUSH_ROUTE) {
      this.navigator.push(this.getRoute(nextRouteProps))
    }
    if (type === types.POP_ROUTE) {
      const routes = this.navigator.getCurrentRoutes()
      if (routes.length > 0) {
        this.navigator.pop()
      }
    }
    if (type === types.RESET_ROUTES) {
      const route = this.getRoute(nextRouteProps)
      if (!currentRouteProps) {
        this.navigator.resetTo(route)
      } else {
        this.navigator.push(route)
        InteractionManager.runAfterInteractions(() => {
          this.navigator.immediatelyResetRouteStack([route])
        })
      }
    }
  }

  getRoute(routeProps) {
    let navigation = null
    if (!routeProps.immersive) {
      navigation = (
        <DrawerLayout {...routeProps} config={this.config} />
      )
    }
    return {
      id: routeProps.id,
      component: routeProps.component,
      navigation,
    }
  }

  renderScene(route, navigator) {
    const Component = route.component

    /*  Remove from props  */
    const { children, config, initialRoute, ...props } = this.props
    let child = <Component id={route.id} {...props} navigator={navigator} />

    if (route.navigation !== null) {
      child = React.cloneElement(route.navigation, {
        ...props,
        navigator,
        route,
        children: child
      })
    }

    return child
  }

  render() {
    return (
      <Navigator
        ref={nav => this.navigator = nav}
        configureScene={() => SceneConfig}
        initialRoute={{
          id: null,
          component: View,
          navigation: null,
        }}
        renderScene={this.renderScene.bind(this)} />
    )
  }

}
