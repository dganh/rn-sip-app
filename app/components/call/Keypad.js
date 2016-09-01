'use strict';

import React, { Component, PropTypes } from 'react';
import {
    TouchableHighlight,
    TouchableOpacity,
    View,
    Text,
    Image,
    Platform,
    StyleSheet,
    PixelRatio,
    TabBarIOS,
    Dimensions
} from 'react-native'
import {correctFontSizeForScreen} from '../../utils/scale';
import s from '../../styles/components/call/KeypadStyles';

export default class Keypad extends Component {

    constructor(props) {
        super(props);

        let {height, width} = Dimensions.get('window');
        let ratio = height / width;

        this.state = {
            keySize: 0,
            heightRatio: ratio * ratio
        };
    }

    onKeyPress(key) {
        this.props.onKeyPress && this.props.onKeyPress(key);
    }

    onLayoutKey(event) {
        var {width, height} = event.nativeEvent.layout;
        this.setState({keySize: height});
        
        this.props.onDefineKeySize && this.props.onDefineKeySize({width, height});
    }

    renderKey(digit, letters) {
        var props = {};


        if (digit == '1') {
            props['onLayout'] = (event) => this.onLayoutKey(event);
        }

        if (digit == '*' || digit == '#') {
            return (
                <View key={digit} style={{flex: 0.202}} />
            )
        }

        return (
            <View {...props} key={digit} style={s.keyWrapper}>

                {
                    /* Show key only when we know it's width to render square touchable */
                    !this.state.keySize ? null :
                    <TouchableHighlight underlayColor="#ccd9e2"
                                        style={[s.keyTouchable, {width: this.state.keySize}]}
                                        onPress={this.onKeyPress.bind(this, digit)}>
                        <View style={{backgroundColor: 'transparent'}}>
                            <Text style={s.keyDigitText}>{digit}</Text>
                            <Text style={s.keyLettersText}>{letters}</Text>
                        </View>
                    </TouchableHighlight>
                }
            </View>
        )
    }

    render() {
        let keys = [
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['*', '0', '#']
        ];

        let desc = [
            ['', 'ABC', 'DEF'],
            ['GHI', 'JKL', 'MNO'],
            ['PQRS', 'TUV', 'WXYZ'],
            ['', '+', '']
        ];

        let keypad = [];

        for (let i=0; i < keys.length; i++) {

            keypad.push((
                <View key={keys[i].join("|")} style={s.row}>
                    <View style={s.outerLineOffset} />
                    {this.renderKey(keys[i][0], desc[i][0])}
                    <View style={s.innerLineOffset} />
                    {this.renderKey(keys[i][1], desc[i][1])}
                    <View style={s.innerLineOffset} />
                    {this.renderKey(keys[i][2], desc[i][2])}
                    <View style={s.outerLineOffset} />
                </View>
            ));

            if (i != keys.length - 1) {
                keypad.push((
                    <View key={"split" + i} style={{flex: 0.006 * this.state.heightRatio}} />
                ))
            }
        }

        return (
            <View style={this.props.style}>
                {keypad}
            </View>
        )
    }
}

Keypad.propTypes = {
    style: View.propTypes.style,
    onKeyPress: PropTypes.func,
    onDefineKeySize: PropTypes.func
};
