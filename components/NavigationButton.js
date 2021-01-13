import React from 'react'
import {HeaderButton} from 'react-navigation-header-buttons'
import Colors from '../constants/Colors'
import {Ionicons} from '@expo/vector-icons'

const NavigationButton = props => {
    return (
        <HeaderButton
        {...props}
        IconComponent={Ionicons}
        iconSize={30}
        color={Colors.secondary}
        />
    )
}

export default NavigationButton;