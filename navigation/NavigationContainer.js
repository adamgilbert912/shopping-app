import React, { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import ShopNavigator from './ShopNavigator'
import { NavigationActions } from 'react-navigation'

const NavigationContainer = props => {
    const token = useSelector(state => !!state.auth.token)
    const navigator = useRef()

    useEffect(() => {
        if (!token) {
            navigator.current.dispatch(NavigationActions.navigate({routeName: 'Auth'}))
        }
    }, [token])

    return <ShopNavigator ref={navigator} />
}

export default NavigationContainer