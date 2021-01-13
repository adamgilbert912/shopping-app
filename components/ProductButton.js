import React from 'react'
import { TouchableOpacity } from 'react-native'
import HeaderText from './HeaderText'

const ProductButton = props => {
    return (
        <TouchableOpacity onPress={props.onPress} style={{ overflow: 'hidden', ...props.style }}>
            <HeaderText style={{ color: 'white', fontSize: 16 }}>{props.children}</HeaderText>
        </TouchableOpacity>
    )
}

export default ProductButton;