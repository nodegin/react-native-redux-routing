import React from 'react'
import {
  Navigator,
  View,
  BackAndroid,
  Platform,
  InteractionManager,
} from 'react-native'

import buildStyleInterpolator from 'react-native/Libraries/Utilities/buildStyleInterpolator'

import { types } from '../actions'
import StatusBar from './StatusBar'
import DrawerLayout from './DrawerLayout'

const DefaultSceneConfig = {
  ...Navigator.SceneConfigs.PushFromRight,
  gestures: null
}

const NoTransition = {
  opacity: {
    from: 1,
    to: 1,
    min: 1,
    max: 1,
    type: 'linear',
    extrapolate: false,
    round: 100,
  },
}

const NoAnimation = {
  ...Navigator.SceneConfigs.PushFromRight,
  gestures: null,
  defaultTransitionVelocity: 50,
  animationInterpolators: {
    into: buildStyleInterpolator(NoTransition),
    out: buildStyleInterpolator(NoTransition),
  },
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
    if (typeof this.props.config.statusBarSize !== 'number') {
      throw new Error('Property `statusBarSize` must be Number')
    }

    const defaultConfig = {
      renderNavigationView: () => null,
      accentColor: '#E0E0E0',
      transparentStatusBar: true,
      statusBarStyle: 'default',
      statusBarSize: 0,
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

    InteractionManager.runAfterInteractions(() => {
      this.props.actions._navigate(this.props.initialRoute, { reset: true })
    })
  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', () => {
        if (this.props.router.drawerOpen) {
          this.props.actions._closeDrawer()
          return true
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
      this.handleRouteChange(this.routes[currentRoute], this.routes[nextRoute], nextProps.router)
    }
  }

  getSceneConfigFromOptions(options) {
    let sceneConfig = null
    if (!options.animated) {
      sceneConfig = NoAnimation
    } else if (options.sceneConfig) {
      sceneConfig = options.sceneConfig
    }
    return sceneConfig
  }

  handleRouteChange(currentRoute, nextRoute, nextRouter) {
    if (nextRouter.action === types.ROUTE_PUSH) {
      this.props.actions.$$_routeIsChanging.call(null, this, false)
      this.navigator.push(this.getRoute(nextRoute, nextRouter))
    }
    if (nextRouter.action === types.ROUTE_POP) {
      const routes = this.navigator.getCurrentRoutes()
      if (routes.length < 1) {
        return
      }
      const sceneConfig = this.getSceneConfigFromOptions(nextRouter.options)
      if (sceneConfig) {
        const newStack = [...routes]
        newStack[routes.length - 1].sceneConfig = sceneConfig
        this.navigator.immediatelyResetRouteStack(newStack)
      }
      InteractionManager.runAfterInteractions(() => {
        this.props.actions.$$_routeIsChanging.call(null, this, false)
        this.navigator.pop()
      })
    }
    if (nextRouter.action === types.ROUTE_REPLACE) {
      const routes = this.navigator.getCurrentRoutes()
      const savedSceneConfig = routes[routes.length - 1].sceneConfig
      const route = this.getRoute(nextRoute, nextRouter)
      this.navigator.push(route)
      InteractionManager.runAfterInteractions(() => {
        const newStack = routes.filter((r, i) => i <= routes.length - 1 - 1).concat(route)
        newStack[newStack.length - 1].sceneConfig = savedSceneConfig
        this.props.actions.$$_routeIsChanging.call(null, this, false)
        this.navigator.immediatelyResetRouteStack(newStack)
      })
    }
    if (nextRouter.action === types.ROUTE_RESET) {
      const route = this.getRoute(nextRoute, nextRouter)
      if (!currentRoute) {
        /*  Initial route  */
        this.props.actions.$$_routeIsChanging.call(null, this, false)
        this.navigator.resetTo(route)
      } else {
        this.navigator.push(route)
        InteractionManager.runAfterInteractions(() => {
          this.props.actions.$$_routeIsChanging.call(null, this, false)
          this.navigator.immediatelyResetRouteStack([route])
        })
      }
    }
  }

  getRoute(nextRoute, nextRouter) {
    if (!nextRoute) {
      const route = nextRouter.routes[nextRouter.routes.length - 1]
      throw new Error('Try to navigate to an unknown route `' + route + '`')
    }
    let navigation = null
    if (!nextRoute.immersive) {
      navigation = (
        <DrawerLayout {...nextRoute} config={this.config} />
      )
    }
    return {
      id: nextRoute.id,
      component: nextRoute.component,
      navigation,
      sceneConfig: this.getSceneConfigFromOptions(nextRouter.options) || DefaultSceneConfig,
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
    } else {
      child = (
        <View style={{ flex: 1 }}>
          <View style={{
            backgroundColor: config.statusBarStyle === 'default' ? '#fff' : '#000',
            height: config.statusBarSize,
          }} />
          {child}
        </View>
      )
    }

    return <StatusBar {...this.props} navigator={navigator}>{child}</StatusBar>
  }

  render() {
    return (
      <Navigator
        ref={nav => this.navigator = nav}
        configureScene={route => route.sceneConfig}
        initialRoute={{
          id: null,
          component: View,
          navigation: null,
          sceneConfig: NoAnimation,
        }}
        renderScene={this.renderScene.bind(this)} />
    )
  }

}
