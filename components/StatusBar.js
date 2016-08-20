import React from 'react'
import {
  StatusBar,
  View,
  Dimensions,
  Platform,
  InteractionManager,
} from 'react-native'

import AppBar from './AppBar'
import DrawerLayout from 'react-native-drawer-layout'

const windowSize = Dimensions.get('window')

export default class extends React.Component {

  _class() {
    return 'StatusBar'
  }

  currentRoute = null
  nextRoute = null

  componentWillMount() {
    this.onWillFocusNavigationSub = this.props.navigator.navigationContext.addListener('willfocus', event => {
      //  this.currentRoute will go away
      //  event.data.route will be focused
      this.nextRoute = event.data.route
      this.props.actions.$$_pageTransitioning.call(null, this, true)
    })
    this.onDidFocusNavigationSub = this.props.navigator.navigationContext.addListener('didfocus', event => {
      if (this.currentRoute) {
        const goneId = this.currentRoute.id
        if (this.props.router.$$_blurEventListeners[goneId]) {
          //  make it async
          setTimeout(this.props.router.$$_blurEventListeners[goneId], 0)
        }
      }
      //  this.currentRoute has gone away
      //  event.data.route has been focused
      this.currentRoute = event.data.route
      this.nextRoute = null
      if (this.currentRoute) {
        const currentId = this.currentRoute.id
        if (this.props.router.$$_focusEventListeners[currentId]) {
          //  make it async
          setTimeout(this.props.router.$$_focusEventListeners[currentId], 0)
        }
      }
      this.props.actions.$$_pageTransitioning.call(null, this, false)
    })
  }

  componentWillUnmount() {
    if (this.onWillFocusNavigationSub) {
      this.onWillFocusNavigationSub.remove()
      this.onWillFocusNavigationSub = null
    }
    if (this.onDidFocusNavigationSub) {
      this.onDidFocusNavigationSub.remove()
      this.onDidFocusNavigationSub = null
    }
  }

  handleOnLayout = (event) => {
    if (this.props.router.$$_statusBarConfigured) return
    if (Platform.OS !== 'android') return
    let barSize = 0
    if (Platform.Version >= 21) {
      const statusBarSizeAndroid = Math.ceil(windowSize.height - event.nativeEvent.layout.height)
      barSize = statusBarSizeAndroid
    }
    this.props.actions.$$_updateStatusBarSize.call(null, this, barSize)
  }

  render() {
    return (
      <View onLayout={this.handleOnLayout} style={{ flex: 1 }}>
        <StatusBar
          barStyle={this.props.config.statusBarStyle}
          translucent={this.props.router.statusBarSize > 0}
          backgroundColor="transparent" />
        {this.props.children}
      </View>
    )
  }

}
