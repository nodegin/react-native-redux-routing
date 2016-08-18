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

  state = {
    isStatusBarTranslucent: false,
  }

  handleOnLayout = (event) => {
    if (this.props.router.$$_statusBarConfigured) return
    if (Platform.OS !== 'android') return
    let barSize = 0
    if (Platform.Version >= 21) {
      const statusBarSizeAndroid = Math.ceil(windowSize.height - event.nativeEvent.layout.height)
      barSize = statusBarSizeAndroid
    }
    this.props.actions.$$_updateStatusBar.call(null, this, barSize)
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
