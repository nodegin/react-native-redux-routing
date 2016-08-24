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

    onWillFocus = this.props.navigator.navigationContext.addListener('willfocus', event => {
      //  this.currentRoute will go away
      //  event.data.route will be focused
      this.nextRoute = event.data.route
      this.props.actions.$$_pageTransitioning.call(null, this, true)
    })
    
    onDidFocus = this.props.navigator.navigationContext.addListener('didfocus', event => {
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
