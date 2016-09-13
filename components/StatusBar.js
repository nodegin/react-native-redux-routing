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
    if (this.props.router.$$_previousWillFocusListener) this.props.router.$$_previousWillFocusListener.remove()
    if (this.props.router.$$_previousDidFocusListener) this.props.router.$$_previousDidFocusListener.remove()

    const onWillFocus = this.props.navigator.navigationContext.addListener('willfocus', event => {
      //  this.currentRoute will go away
      //  event.data.route will be focused
      this.nextRoute = event.data.route
      this.props.actions.$$_pageTransitioning.call(null, this, true)
    })

    const onDidFocus = this.props.navigator.navigationContext.addListener('didfocus', event => {
      if (this.currentRoute === null && this.nextRoute === null) {
        //  initial route
        if (this.props.router.$$_focusEventListeners[event.data.route.id]) {
          this.props.router.$$_focusEventListeners[event.data.route.id]()
        }
      } else if (this.currentRoute !== null && this.nextRoute !== null) {
        //  route changed
        if (this.props.router.$$_blurEventListeners[this.currentRoute.id]) {
          this.props.router.$$_blurEventListeners[this.currentRoute.id]()
        }
        if (this.props.router.$$_focusEventListeners[this.nextRoute.id]) {
          this.props.router.$$_focusEventListeners[this.nextRoute.id]()
        }
      }
      //  this.currentRoute has gone away
      //  event.data.route has been focused
      this.currentRoute = event.data.route
      this.nextRoute = null
      this.props.actions.$$_pageTransitioning.call(null, this, false)
    })
    this.props.actions.$$_setPreviousListeners.call(null, this, onWillFocus, onDidFocus)
  }

  render() {
    const statusBarBackground = this.props.config.statusBarStyle === 'default' ? '#fff' : '#000'
    return (
      <View style={{ backgroundColor: '#fffeff', flex: 1 }}>
        <StatusBar
          barStyle={this.props.config.statusBarStyle}
          translucent={this.props.config.transparentStatusBar}
          backgroundColor={this.props.config.transparentStatusBar ? 'transparent' : statusBarBackground} />
        {this.props.children}
      </View>
    )
  }

}
