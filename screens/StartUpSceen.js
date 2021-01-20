import React from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { useEffect } from 'react'
import {View, StyleSheet} from 'react-native'
import { useDispatch } from 'react-redux'
import HeaderText from '../components/HeaderText'
import Colors from '../constants/Colors'

import {authenticate} from '../store/actions/auth'

const StartUpScreen = props => {
    const dispatch = useDispatch()

    useEffect(() => {
        const login = async () => {
            const userData = await AsyncStorage.getItem('userData')

            if (!userData) {
                props.navigation.navigate('Auth')
                return
            }

            const useableData = JSON.parse(userData)

            const {token, userId, expirationDate} = useableData
            if (new Date(expirationDate) <= new Date() || !token || !userId) {
                props.navigation.navigate('Auth')
                return
            }

            const expirationTime = new Date(expirationDate).getTime() - new Date().getTime()

            dispatch(authenticate(token, userId, expirationTime))
            props.navigation.navigate('Shop')
        }

        login()
    }, [])

    return (
        <View style={styles.container}>
            <HeaderText style={{textAlign: 'center', fontSize: 30, color: Colors.secondary}}>Shop App</HeaderText>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary
    }
})

export default StartUpScreen