import React, { useRef, useState } from 'react'
import { Dimensions, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { Header } from 'react-navigation-stack'
import { LinearGradient } from 'expo-linear-gradient'

import HeaderText from '../components/HeaderText'
import Colors from '../constants/Colors'
import ShortInput from '../components/Inputs/ShortInput'
import LongInput from '../components/Inputs/LongInput'
import CheckOutButton from '../components/CheckOutButton'
import { useReducer } from 'react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { signUp, login } from '../store/actions/auth'
import LoadingScreen from '../components/LoadingScreen'

const UPDATE_VALIDITY = 'UPDATE_VALIDTY'
const UPDATE_VALUE = 'UPDATE_VALUE'

const inputReducer = (state, action) => {
    if (action.type === UPDATE_VALIDITY) {
        const updatedValidites = { ...state.isValid, [action.inputType]: action.isValid }

        let inputFieldValid = true
        for (const key in updatedValidites) {
            if (!updatedValidites[key]) {
                inputFieldValid = false
                break
            }
        }

        return { ...state, isValid: updatedValidites, inputIsValid: inputFieldValid }
    }

    if (action.type === UPDATE_VALUE) {
        return { ...state, values: { ...state.values, [action.inputType]: action.value } }
    }
}

const UserAuthScreen = props => {
    const [inputState, dispatchInputState] = useReducer(inputReducer, {
        values: {
            email: '',
            password: ''
        },
        isValid: {
            email: false,
            password: false
        },
        inputIsValid: false
    })
    const [isLoading, setIsLoading] = useState(false)
    const [inLogin, setInLogin] = useState(true)

    const dispatch = useDispatch()

    const passwordRef = useRef()

    const authHandler = async () => {
        try {
            setIsLoading(true)
            let action;
            if (inLogin) {
                await dispatch(login(inputState.values.email, inputState.values.password))
            } else {
                if (!inputState.inputIsValid) {
                    throw new Error('Email or password does not meet the credentials.')
                }
                await dispatch(signUp(inputState.values.email, inputState.values.password))
            }
            props.navigation.navigate('Shop')
        } catch (err) {
            Alert.alert('Error Occured', err.message, [{ text: 'Ok', style: 'cancel' }])
            setIsLoading(false)
        }
        
    }

    useEffect(() => {
        props.navigation.setParams({ headerTitle: inLogin ? 'Login' : 'Sign Up' })
    }, [inLogin])

    if (isLoading) {
        return (
            <LoadingScreen />
        )
    }

    return (
        <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset={Header.HEIGHT} behavior={Platform.OS === 'android' ? 'height' : 'padding'}>
            <LinearGradient style={styles.gradient} colors={[Colors.primary, 'white', Colors.primary]}>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <LongInput
                        inputType='email'
                        header='Enter Email:'
                        placeholder='Email'
                        plac
                        passValue={(value) => dispatchInputState({ type: UPDATE_VALUE, inputType: 'email', value: value })}
                        passValidityData={(isValid) => dispatchInputState({ type: UPDATE_VALIDITY, inputType: 'email', isValid: isValid })}
                        returnKeyType='next'
                        onSubmitEditing={() => passwordRef.current.focus()}
                        inLogin={inLogin}
                    />
                    <LongInput
                        inputStyle={{ marginBottom: 10 }}
                        secureTextEntry={true}
                        inputType='password'
                        header='Enter Password:'
                        placeholder='Password'
                        returnKeyType='done'
                        onSubmitEditing={inputState.isValid.email ? () => { } : undefined}
                        passValue={(value) => dispatchInputState({ type: UPDATE_VALUE, inputType: 'password', value: value })}
                        passValidityData={(isValid) => dispatchInputState({ type: UPDATE_VALIDITY, inputType: 'password', isValid: isValid })}
                        reference={passwordRef}
                        inLogin={inLogin}
                    />
                    <CheckOutButton style={{marginBottom: 20}} fontSize={20} onPress={authHandler}>{inLogin ? 'Login' : 'Sign Up'}</CheckOutButton>
                    <CheckOutButton onPress={() => setInLogin(!inLogin)} fontSize={20}>{inLogin ? 'Sign Up Instead' : 'Login Instead'}</CheckOutButton>
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    gradient: {
        flex: 1
    },
    scrollView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

const HeaderTitle = title => {
    return (
        <HeaderText style={{ color: Colors.secondary }}>{title}</HeaderText>
    )
}

UserAuthScreen.navigationOptions = navData => {
    const title = navData.navigation.getParam('headerTitle')
    return {
        headerTitle: () => HeaderTitle(title)
    }
}

export default UserAuthScreen