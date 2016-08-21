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

  componentDidMount() {
    if (this.props.router.$$_statusBarConfigured) return
    if (Platform.OS !== 'android') return
    /*  Give some time to render the layout  */
    setTimeout(() => {
      if (this.flex) {
        this.flex.measureInWindow((ox, oy, width, height, px, py) => {
          const barSize = Math.abs(oy)
          this.props.actions.$$_updateStatusBarSize.call(null, this, barSize)
        })
      }
    }, 80)
  }

  render() {
    return (
      <View ref={f => this.flex = f} style={{ backgroundColor: '#fefefe', flex: 1 }}>
        <StatusBar
          barStyle={this.props.config.statusBarStyle}
          translucent={true}
          backgroundColor="transparent" />
        {this.props.children}
      </View>
    )
  }

}
