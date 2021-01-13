import React from 'react'
import {Text} from 'react-native'

const HeaderText = props => {
    return (
        <Text style={{fontFamily: 'fontBold', fontSize: 22, ...props.style}}>{props.children}</Text>
    )
}

export default HeaderText;