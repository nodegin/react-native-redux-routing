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

  componentWillReceiveProps(nextProps) {
    if (this.drawer) {
      this.drawer[nextProps.router.drawerOpen ? 'openDrawer' : 'closeDrawer']()
    }
  }

  render() {
    return (
      <DrawerLayout
        ref={ref => this.drawer = ref}
        drawerWidth={windowSize.width * 0.75}
        drawerPosition={DrawerLayout.positions.Left}
        onDrawerOpen={() =>
          !this.props.router.drawerOpen ? this.props.actions._openDrawer() : null
        }
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
              paddingTop: this.props.config.statusBarSize,
            }]}>
              {injected}
            </View>
          )
        }}>
        <AppBar {...this.props} />
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
