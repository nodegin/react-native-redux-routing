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

const windowSize = Dimensions.get('window')
const appBarHeight = 54
const appBarIconSize = 24

export default class extends React.Component {

  _class() {
    return 'AppBar'
  }

  componentWillMount() {
    this.onWillFocusNavigationSub = this.props.navigator.navigationContext.addListener('willfocus', () => this.transitioning = true)
    this.onDidFocusNavigationSub = this.props.navigator.navigationContext.addListener('didfocus', () => this.transitioning = false)
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

  render() {
    const canBack = this.props.router.routes.length > 1 && !this.transitioning
    const pathData = canBack ?
      'M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z' :
      'M19,10H5V8H19V10M19,16H5V14H19V16Z'
    const contrastColor = this.props.config.statusBarStyle === 'default' ? '#000' : '#fff'
    return (
      <View style={[styles.appBar, {
        backgroundColor: this.props.config.accentColor,
        height: appBarHeight + this.props.paddingTop,
        paddingTop: this.props.paddingTop,
      }]}>
        <View style={[styles.appBarTitle, { top: this.props.paddingTop }]}>
          <Text style={[styles.appBarTitleText, { color: contrastColor }]}>{ this.props.router.navTitle }</Text>
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
            onPress={() => canBack ? this.props.actions._navigate(-1) : this.props.actions._openDrawer()}>
            <View />
          </TouchableHighlight>
        </View>
        <View style={styles.appBarFillBlank} />
        {
          !this.props.router.navActionRenderer ? null :
          <TouchableHighlight
            style={styles.appBarIconWrapper}
            underlayColor="rgba(255,255,255,.25)"
            onPress={this.props.router.navActionHandler}>
            {this.props.router.navActionRenderer()}
          </TouchableHighlight>
        }
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
    height: appBarHeight,
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
