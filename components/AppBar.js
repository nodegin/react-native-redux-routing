import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableHighlight,
  Platform,
  WebView,
} from 'react-native'

import { types } from '../actions'

const windowSize = Dimensions.get('window')
const appBarIconSize = 24

export default class extends React.Component {

  _class() {
    return 'AppBar'
  }

  handleMenuPress = () => {
    if (this.props.router.transitioning) {
      return
    }
    setTimeout(() => {
      if (this.props.router.routes.length > 1) {
        this.props.actions._navigate(-1)
      } else {
        this.props.actions._openDrawer()
      }
    }, 150)
  }

  handleNavActionPress = () => setTimeout(this.props.router.navActionHandler, 150)

  render() {
    const { router } = this.props
    const menuIcon = 'M19,10H5V8H19V10M19,16H5V14H19V16Z'
    const backIcon = 'M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z'
    let pathData
    if (router.action === types.ROUTE_PUSH) {
      pathData = !router.transitioning && router.routes.length > 1 ? backIcon : router.routes.length > 2 ? backIcon : menuIcon
    } else if (router.action === types.ROUTE_POP) {
      pathData = !router.transitioning && router.routes.length < 2 ? menuIcon : backIcon
    } else if (router.action === types.ROUTE_REPLACE) {
      pathData = router.routes.length > 1 ? backIcon : menuIcon
    } else {
      pathData = menuIcon
    }
    const contrastColor = this.props.config.statusBarStyle === 'default' ? '#000' : '#fff'
    return (
      <View style={styles.appBarContainer}>
        <View style={{
          backgroundColor: this.props.config.accentColor,
          height: this.props.config.statusBarSize,
        }} />
        <View style={[styles.appBar, {
          backgroundColor: this.props.config.accentColor,
          height: router.appBarSize,
        }]}>
          <View style={[styles.appBarTitle, { height: router.appBarSize }]}>
            <Text style={[styles.appBarTitleText, { color: contrastColor }]}>{ router.navTitle }</Text>
          </View>
          <View style={styles.appBarMenuIconWrapper}>
            <View style={styles.appBarMenuIcon}>
              <WebView
                source={{
                  html:
    `
    <style>body{background:${this.props.config.accentColor};margin:0}</style>
    <body><svg style="width:${appBarIconSize}px;height:${appBarIconSize}px" viewBox="0 0 24 24">
    <path fill="${contrastColor}" d="${pathData}"/></svg></body>
    `
                }}
                scrollEnabled={false} />
            </View>
            <TouchableHighlight
              style={[styles.appBarMenuIconHighlight, styles.appBarMenuIconWrapper]}
              underlayColor="rgba(255,255,255,.25)"
              onPress={this.handleMenuPress}>
              <View />
            </TouchableHighlight>
          </View>
          <View style={styles.appBarFillBlank} />
          {
            !router.navActionRenderer ? null :
            <TouchableHighlight
              style={styles.appBarIconWrapper}
              underlayColor="rgba(255,255,255,.25)"
              onPress={this.handleNavActionPress}>
              {router.navActionRenderer()}
            </TouchableHighlight>
          }
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  appBar: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 8,
    paddingRight: 8,
  },
  appBarMenuIconWrapper: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  appBarMenuIcon: {
    height: appBarIconSize,
    width: appBarIconSize,
  },
  appBarMenuIconHighlight: {
    borderRadius: 2,
    left: 0,
    position: 'absolute',
    top: 0,
  },
  appBarIconWrapper: {
    alignItems: 'center',
    borderRadius: 2,
    height: 32,
    justifyContent: 'center',
    paddingLeft: 4,
    paddingRight: 4,
  },
  appBarTitle: {
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    width: windowSize.width
  },
  appBarTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  appBarFillBlank: {
    flex: 1,
  },
})
