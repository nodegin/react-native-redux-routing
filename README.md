# react-native-redux-routing <sup>v1.2.7</sup>

[![npm](https://img.shields.io/npm/v/react-native-redux-routing.svg?maxAge=2592000)](https://www.npmjs.com/package/react-native-redux-routing)
[![changelog](https://img.shields.io/badge/view-changelog-9575CD.svg?maxAge=2592000)](https://github.com/nodegin/react-native-redux-routing/wiki/Changelog)

An exquisitely crafted routing component for Redux based React Native applications.

Providing a consistent user interface for both iOS and Android.

![](https://cloud.githubusercontent.com/assets/8536244/17709163/a7a35d32-641a-11e6-9047-7e2fdd05db72.png)

## Install

`npm install -S react-native-redux-routing`

## Getting Started

Your `Application.js` should looks like below:

```jsx
import React from 'react'
import { Platform } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
  actions as routerActions,
  Router,
  Route
} from 'react-native-redux-routing'

import * as actionsA from './actions/actionsA'
import * as actionsB from './actions/actionsB'

import { SplashPage, MainPage } from './pages'

import ExtraDimensions from 'react-native-extra-dimensions-android'

export default connect(
  state => ({
    router: state.router,
    a: state.a,
    b: state.b,
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...routerActions,
      ...actionsA,
      ...actionsB,
    }, dispatch),
  })
)(class extends React.Component {

  render() {
    const statusBarSize = Platform.OS === 'ios' ? 20 : Platform.Version >= 23 ? ExtraDimensions.get('STATUS_BAR_HEIGHT') : 0
    const config = {
      renderNavigationView: () => <NavigationDrawer />,
      accentColor: '#C2185B',
      transparentStatusBar: true,
      statusBarStyle: 'light-content',
      statusBarSize // You have to specify the size of status bar manually
    }
    return (
      <Router {...this.props} config={config} initialRoute="splash">
        <Route id="splash" component={SplashPage} immersive={true} />
        <Route id="main" component={MainPage} />
      </Router>
    )
  }

})
```

## Component Properties

#### For the `<Router/>` element:

You must set the `initialRoute` property to get the router working.

You can set the `config` property to pass in your custom configurations.

#### For the `<Route/>` element:

You must set the `id` property which is unique to each route.

You must set the `component` property for which class should be rendered.

You can set the `immersive` property to true to hide the app bar (including navigation drawer).


## State Properties

- `this.props.router.drawerOpen`
- `this.props.router.navTitle`
- `this.props.router.data`
- `this.props.router.routes`
- `this.props.router.appBarSize`
- `this.props.router.transitioning`


## API

All router-provided actions starts with an underscore in order to prevent possible conflictions.

#### `this.props.actions._navigate(routeId, options = {})`

```jsx
this.props.actions._navigate('settings') // Push the "settings" route to the routes stack
this.props.actions._navigate(-1) // Pop the last route in the routes stack
this.props.actions._navigate('home', { reset: true }) // Reset the routes stack and navigate to "home" route
this.props.actions._navigate('page-1', { sceneConfig: CustomConfig }) // Changing scene with custom animation
this.props.actions._navigate('page-2', { animated: false }) // Changing scene without animation
this.props.actions._navigate('another', { replace: true }) // Replace the current scene to new scene
this.props.actions._navigate('analytics', { data: someObject }) // Move to another scene and transferring data to it
```

#### `this.props.actions._setNavAction(action = { renderer, handler })`

```jsx
this.props.actions._setNavAction({
  renderer: () => <Text>123</Text>, // Function that returns a React element
  handler: () => alert('clicked'), // Function that will triggers when the rendered element was pressed
})
this.props.actions._setNavAction(null) // Reset nav action
```

#### `this.props.actions._setNavTitle(title)`

```jsx
this.props.actions._setNavTitle('Page Title #' + 1) // Set the page title that shows on the app bar
```

#### `this.props.actions._openDrawer()`

```jsx
this.props.actions._openDrawer() // Open the navigation drawer
```

#### `this.props.actions._closeDrawer()`

```jsx
this.props.actions._closeDrawer() // Close the navigation drawer
```

#### `this.props.actions._addRouteListener(type, listener)`

```jsx
this.props.actions._addRouteListener('unload', () => 'Are you sure?') // Attach an `onUnload` listener for the current route
this.props.actions._addRouteListener('focus', () => 'Entered scene') // Attach an `onFocus` listener for the current route
this.props.actions._addRouteListener('blur', () => 'Leaved scene') // Attach an `onBlur` listener for the current route
```

#### `this.props.actions._removeRouteListener(listener)`

```jsx
this.props.actions._removeRouteListener('unload', listener) // `listener` must be the same one as you added to remove
this.props.actions._removeRouteListener('focus', listener) // `listener` must be the same one as you added to remove
this.props.actions._removeRouteListener('blur', listener) // `listener` must be the same one as you added to remove
```

The dispatchable actions are listed below:

```jsx
import { types as routerTypes } from 'react-native-redux-routing'

dispatch({
  type: routerTypes.ROUTE_PUSH,
  options: {
    route: 'settings',
    sceneConfig: CustomConfig,
  }
})

dispatch({
  type: routerTypes.ROUTE_POP,
  options: {
    sceneConfig: CustomConfig,
  }
})

dispatch({
  type: routerTypes.ROUTE_REPLACE,
  options: {
    route: 'another',
    sceneConfig: CustomConfig,
  }
})

dispatch({
  type: routerTypes.ROUTE_RESET,
  options: {
    route: 'settings',
    animated: false,
  }
})

dispatch({
  type: routerTypes.SET_NAV_ACTION,
  renderer: rendererFunc,
  handler: handlerFunc,
})

dispatch({
  type: routerTypes.SET_NAV_TITLE,
  title: 'New Title',
})

dispatch({
  type: routerTypes.OPEN_DRAWER,
})

dispatch({
  type: routerTypes.CLOSE_DRAWER,
})

dispatch({
  type: routerTypes.ADD_BLUR_LISTENER,
  listener,
})

dispatch({
  type: routerTypes.REMOVE_BLUR_LISTENER,
  listener,
})

dispatch({
  type: routerTypes.ADD_FOCUS_LISTENER,
  listener,
})

dispatch({
  type: routerTypes.REMOVE_FOCUS_LISTENER,
  listener,
})

dispatch({
  type: routerTypes.ADD_UNLOAD_LISTENER,
  listener,
})

dispatch({
  type: routerTypes.REMOVE_UNLOAD_LISTENER,
  listener,
})
```

## Configurations

You can modify the default configuration for the router by passing `config` property into its properties.

The default configuration are listed below:

```jsx
const defaultConfig = {
  renderNavigationView: () => null,
  accentColor: '#E0E0E0',
  transparentStatusBar: true,
  statusBarStyle: 'default',
  statusBarSize: 20,
}
```

<table>
  <tr>
    <th>Property</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>renderNavigationView</td>
    <td>Function</td>
    <td>Function that returns a React element.</td>
  </tr>
  <tr>
    <td>accentColor</td>
    <td>String</td>
    <td>
      Sets the accent color of the application,<br>
      must be a solid color starting with #.
    </td>
  </tr>
  <tr>
    <td>transparentStatusBar</td>
    <td>Boolean</td>
    <td>
      Indicates the status bar should be transparent. Android only.
    </td>
  </tr>
  <tr>
    <td>statusBarStyle</td>
    <td>String</td>
    <td>
      Indicates the theme should be dark or light.<br>
      Enum: "default", "light-content"
    </td>
  </tr>
  <tr>
    <td>statusBarSize</td>
    <td>Number</td>
    <td>
      Specify the size of the status bar.<br>
      Obtain yourself from other modules.
    </td>
  </tr>
</table>


## Setting up navigation drawer

The drawer layout uses [react-native-drawer-layout](https://github.com/iodine/react-native-drawer-layout) module, you can setup your own navigation drawer view renderer by setting `renderNavigationView` property in the router config object.

```jsx
render() {
  const config = {
    statusBarStyle: 'light-content',
    renderNavigationView: () => <NavigationDrawer />,
    accentColor: '#00695C',
  }
  return (
    <Router {...this.props} config={config} initialRoute="calendar">
      ...
    </Router>
  )
}
```

![](https://cloud.githubusercontent.com/assets/8536244/17712112/26ece3b8-6427-11e6-94e2-bc63cc3eb726.png)

## Adding navigation action dynamically

The example below shows how to adding a camera button dynamically:

```jsx
componentWillMount() {
  this.props.actions._setNavTitle('Camera Roll')
  this.props.actions._setNavAction({
    renderer: () => (
      <View style={{ alignItems: 'center', flexDirection: 'row' }}>
        <Icon name='camera-alt' style={{ color: '#fff', fontSize: 24 }} />
      </View>
    ),
    handler: () => {
      const date = new Date
      alert('Today is ' + date.toString())
    }
  })
}
```

![](https://cloud.githubusercontent.com/assets/8536244/17747581/0342c128-64e8-11e6-8158-1a1f410a71a8.png)

## Listening route focus / blur event

```jsx
class extends React.Component {
  ...

  componentDidMount() {
    this.onSceneFocusListener = () => alert('This component is now focused from route stack!')
    this.onSceneBlurListener = () => alert('This component is now blurred from route stack!')
    this.props.actions._addRouteListener('focus', this.onSceneFocusListener)
    this.props.actions._addRouteListener('blur', this.onSceneBlurListener)
  }

  componentWillUnmount() {
    this.props.actions._removeRouteListener('focus', this.onSceneFocusListener)
    this.props.actions._removeRouteListener('blur', this.onSceneBlurListener)
    // Alert message will not be shown again from now on
  }

  ...
}
```

## Confirm leaving route

```jsx
class extends React.Component {
  ...

  state = { apples: 10 }

  componentDidMount() {
    this.onUnloadListener = () => {
      if (this.state.apples > 0) {
        return 'Are you sure you want to leave your apples?'
      }
      // returning null will not prompt for confirmation
      return null
    }
    this.props.actions._addRouteListener('unload', this.onUnloadListener)
  }

  componentWillUnmount() {
    this.props.actions._removeRouteListener('unload', this.onUnloadListener)
    // Unload listener has been removed
  }

  ...
}
```

## Theming

You can theme your application easily by setting the `accentColor` property in the router config object.

The default value of `statusBarStyle` is `"default"` which indicates a light theme, change it to `"light-content"` for dark theme.

![](https://cloud.githubusercontent.com/assets/8536244/17713024/5d4cb15a-642b-11e6-973c-36824572d690.png)

## Credits

Thanks to [react-native-drawer-layout](https://github.com/iodine/react-native-drawer-layout) and [react-native-router-redux](https://github.com/Qwikly/react-native-router-redux) for their awesome work.
