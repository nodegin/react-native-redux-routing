import React from 'react'
import {
  StyleSheet,
  StatusBar,
  View,
  Dimensions,
  Platform,
} from 'react-native'

import AppBar from './AppBar'
import DrawerLayout from 'react-native-drawer-layout'

const windowSize = Dimensions.get('window')

export default class extends React.Component {

  _class() {
    return 'DrawerLayout'
  }

  state = {
    androidStatusBarSize: null,
    isStatusBarTranslucent: false,
  }

  componentWillReceiveProps(nextProps) {
    this.drawer[nextProps.router.drawerOpen ? 'openDrawer' : 'closeDrawer']()
  }

  handleOnLayout = (event) => {
    if (Platform.OS !== 'android') return
    if (!this.state.androidStatusBarSize && Platform.Version >= 21) {
      this.setState({
        androidStatusBarSize: Math.ceil(windowSize.height - event.nativeEvent.layout.height),
        isStatusBarTranslucent: true,
      })
    }
  }

  render() {
    const paddingTop = Platform.OS === 'ios' ? 20 : this.state.androidStatusBarSize
    return (
      <DrawerLayout
        ref={ref => this.drawer = ref}
        drawerWidth={windowSize.width * 0.75}
        drawerPosition={DrawerLayout.positions.Left}
        onLayout={this.handleOnLayout}
        onDrawerClose={() =>
          this.props.router.drawerOpen ? this.props.actions._closeDrawer() : null
        }
        renderNavigationView={() => {
          const rendered = this.props.config.renderNavigationView()
          const injected = React.cloneElement(rendered, {
            ...this.props
          })
          return (
            <View style={[styles.drawerWrapper, {
              backgroundColor: this.props.config.accentColor,
              paddingTop,
            }]}>
              {injected}
            </View>
          )
        }}>
        <StatusBar
          barStyle={this.props.config.statusBarStyle}
          translucent={this.state.isStatusBarTranslucent}
          backgroundColor="transparent" />
        <AppBar {...this.props} paddingTop={paddingTop} />
        <View style={styles.solid}>
          {this.props.children}
        </View>
      </DrawerLayout>
    )
  }

}

const styles = StyleSheet.create({
  drawerWrapper: {
    flex: 1,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  solid: {
    backgroundColor: '#fff',
    flex: 1,
  }
})
