import React from 'react'
import {TouchableOpacity, StyleSheet, Dimensions} from 'react-native'
import Colors from '../constants/Colors'

import HeaderText from './HeaderText'

const CheckOutButton = props => {
    return (
        <TouchableOpacity onPress={props.onPress} style={styles.container}>
            <HeaderText style={{ color: 'white', fontSize: props.fontSize }}>{props.children}</HeaderText>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width > 375 ? '70%' : '60%',
        height: Dimensions.get('window').height > 600 ? 50 : 40,
        backgroundColor: Colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
        marginBottom: Dimensions.get('window').height < 600 ? 10 : 20
    }
})

export default CheckOutButton;