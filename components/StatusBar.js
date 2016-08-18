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
    if (Platform.OS !== 'android') return
    if (!this.props.router.statusBarSize && Platform.Version >= 21) {
      const statusBarSizeAndroid = Math.ceil(windowSize.height - event.nativeEvent.layout.height)
      this.setState({ isStatusBarTranslucent: true })
      this.props.actions.$$_updateStatusBarSize.call(null, this, statusBarSizeAndroid)
    }
  }

  render() {
    return (
      <View onLayout={this.handleOnLayout} style={{ flex: 1 }}>
        <StatusBar
          barStyle={this.props.config.statusBarStyle}
          translucent={this.state.isStatusBarTranslucent}
          backgroundColor="transparent" />
        {this.props.children}
      </View>
    )
  }

}
