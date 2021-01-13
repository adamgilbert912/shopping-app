import React from 'react'
import {Text} from 'react-native'

const DefaultText = props => {
    return (
        <Text style={{fontFamily: 'fontRegular', fontSize: 16, ...props.style}}>{props.children}</Text>
    )
}

export default DefaultText;