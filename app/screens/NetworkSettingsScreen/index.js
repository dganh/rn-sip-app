import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {View, ScrollView} from 'react-native'
import {connect} from 'react-redux'
import {changeNetworkSettings} from '../../modules/pjsip'
import * as Navigation from '../../modules/navigation'

import Header from '../../components/common/Header'
import ListSection from '../../components/common/ListSection'
import ListCheckbox from '../../components/common/ListCheckbox'
import ListTextField from '../../components/common/ListTextField'

import cs from '../../assets/styles/containers'

class NetworkSettingsScreen extends Component {

  constructor(props) {
    super(props)

    const s = this.props.settings.network
    const foreground = this.props.settings.foreground

    // We should disable network configuration (useWifi, use3g, useGprs, useEdge, useOtherNetworks) when useAnyway is TRUE.
    // Also we can't enable use mobile data while Wifi is not enabled

    const wifiDisabled = s ? s.useAnyway: false
    const mobileDisabled = s ? s.useAnyway || (!wifiDisabled && !s.useWifi) : false

    this.state = {
      foreground: foreground ? foreground: false,
      useAnyway: s ? s.useAnyway: true,
      useWifi: s ? s.useWifi: true,
      use3g: s ? s.use3g: true,
      useGprs: s ? s.useGprs: true,
      useEdge: s ? s.useEdge: true,
      useOtherNetworks: s ? s.useOtherNetworks: true,
      useInRoaming: s ? s.useInRoaming: false,
      wifiDisabled,
      mobileDisabled,
      enableStun: true,
      stunServers: this.props.settings.stun,
      codecs: JSON.stringify(this.props.settings.codecs)
    }

    this._onForegroundChange = this.onBooleanChanged.bind(this, "foreground")

    this._onAnywayChange = this.onBooleanChanged.bind(this, "useAnyway")
    this._onWifiChange = this.onBooleanChanged.bind(this, "useWifi")
    this._on3gChange = this.onBooleanChanged.bind(this, "use3g")
    this._onGprsChange = this.onBooleanChanged.bind(this, "useGprs")
    this._onEdgeChange = this.onBooleanChanged.bind(this, "useEdge")
    this._onOtherNetworksChange = this.onBooleanChanged.bind(this, "useOtherNetworks")
    this._onInRoamingChange = this.onBooleanChanged.bind(this, "useInRoaming")
    this._onStunEnabledChange = this.onBooleanChanged.bind(this, "enableStun")
    this._onStunServersChange = this.onStunServersChanged.bind(this)
    this._onCodecsChange = this.onCodecsChanged.bind(this)

    this._onSavePress = this.onSavePress.bind(this)
  }

  onSavePress() {
    const configuration = {
      foreground: this.state.foreground,
      useAnyway: this.state.useAnyway,
      useWifi: this.state.useWifi,
      use3g: this.state.use3g,
      useGprs: this.state.useGprs,
      useEdge: this.state.useEdge,
      useOtherNetworks: this.state.useOtherNetworks,
      useInRoaming: this.state.useInRoaming,
      enableStun: this.state.enableStun,
      stunServers: this.state.stunServers,
      codecs: this.state.codecs
    }

    this.props.onSavePress && this.props.onSavePress(configuration)
  }

  onBooleanChanged(property, value) {
    const newState = {...this.state, [property]: value}
    const wifiDisabled = newState.useAnyway
    const mobileDisabled = newState.useAnyway || (!wifiDisabled && !newState.useWifi)

    this.setState({...newState, wifiDisabled, mobileDisabled})
  }

  onStunServersChanged(servers) {
    this.setState({stunServers: servers})
  }

  onCodecsChanged(codecs) {
    this.setState({codecs})
  }

  render() {
    const platformHeaderProps = {}

    platformHeaderProps['leftItem'] = {
      title: 'Back',
      icon: require('../../assets/images/header/back_white.png'),
      layout: 'icon',
      onPress: this.props.onBackPress
    }
    platformHeaderProps['rightItem'] = {
      title: 'Save',
      icon: require('../../assets/images/header/ok_white.png'),
      layout: 'icon',
      onPress: this._onSavePress
    }

    return (
      <View style={cs.max}>
        <Header title={"Settings"} {...platformHeaderProps} />

        <ScrollView style={cs.max}>
          {/* <ListSection title="Connectivity settings"/>

          <ListCheckbox
            onChange={this._onAnywayChange}
            value={this.state.useAnyway}
            title="Always connect"
            description="Try to connect if any connection type available"
          />
          <ListCheckbox
            disabled={this.state.wifiDisabled}
            onChange={this._onWifiChange}
            value={this.state.useWifi}
            title="Use WiFi"
            description="Use WiFi for incoming and outgoing calls"
          />
          <ListCheckbox
            disabled={this.state.mobileDisabled}
            onChange={this._on3gChange}
            value={this.state.use3g}
            title="Use 3g (and better)"
            description="Your carrier MUST allow to use this option. Note that mobile carrier may also bill extra charge for data usage."
          />
          <ListCheckbox
            disabled={this.state.mobileDisabled}
            onChange={this._onGprsChange}
            value={this.state.useGprs}
            title="Use GPRS"
            description="Your carrier MUST allow to use this option. Note that mobile carrier may also bill extra charge for data usage."
          />
          <ListCheckbox
            disabled={this.state.mobileDisabled} onChange={this._onEdgeChange} value={this.state.useEdge}
            title="Use EDGE"
            description="Your carrier MUST allow to use this option. Note that mobile carrier may also bill extra charge for data usage."
          />
          <ListCheckbox
            disabled={this.state.useAnyway}
            onChange={this._onOtherNetworksChange}
            value={this.state.useOtherNetworks} title="Use other networks"
            description="Use other then WiFi or mobile data connection types"
          />
          <ListCheckbox
            onChange={this._onInRoamingChange}
            value={this.state.useInRoaming} title="Use in roaming"
            description="When application detects a roaming situation."
          />

          <ListSection title="Background connection"/> */}

          <ListCheckbox
            onChange={this._onForegroundChange}
            value={this.state.foreground}
            title="Run in background"
            description="Run in background"
          />

          <ListSection title="Nat traversal"/>

          <ListCheckbox
            value={false}
            title="Enable ICE"
            description="Turn on ICE feature"
            disabled
          />
          <ListCheckbox
            onChange={this._onStunEnabledChange}
            value={this.state.enableStun}
            title="Enable STUN"
            description="Turn on STUN feature"
          />
          <ListTextField
            inputProps={{autoCapitalize: "none", autoCorrect: false, editable: this.state.enableStun}}
            title="Stun servers"
            value={this.state.stunServers}
            onChange={this._onStunServersChange}
          />
          <ListTextField
            inputProps={{autoCapitalize: "none", autoCorrect: false, editable: true}}
            title="Codecs"
            placeHoder="Suported Codecs"
            value={this.state.codecs}
            onChange={this._onCodecsChange}
          />
        </ScrollView>
      </View>
    )
  }
}

NetworkSettingsScreen.propTypes = {
  settings: PropTypes.shape({
    network: PropTypes.object,
    service: PropTypes.shape({
      foreground: PropTypes.bool
    })
  }),
  onBackPress: PropTypes.func,
  onSavePress: PropTypes.func
}

function select(store) {
  return {
    settings: store.pjsip.endpointSettings
  }
}

function actions(dispatch) {
  return {
    onBackPress: () => {
      dispatch(Navigation.goBack())
    },
    onSavePress: (configuration) => {
      dispatch(changeNetworkSettings(configuration))
    }
  }
}

export default connect(select, actions)(NetworkSettingsScreen)
