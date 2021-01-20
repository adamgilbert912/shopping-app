import React, {useReducer, useCallback, useEffect} from 'react'
import { TextInput, View, StyleSheet, Dimensions } from 'react-native'
import { validate } from 'validate.js'

import HeaderText from '../HeaderText'
import DefaultText from '../DefaultText'
import Colors from '../../constants/Colors'

const longInputReducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_INPUT': {
            return {...state, value: action.value, isValid: action.isValid, errorMessage: action.errorMessage}
        }

        case 'UPDATE_TOUCHED': {
            return {...state, touched: true}
        }

        default: {
            return {...state}
        }
    }
}

const LongInput = props => {
    const [inputState, dispatch] = useReducer(longInputReducer, {
        value: props.initialValue ? props.initialValue : '',
        isValid: props.initiallyValid ? props.initiallyValid : false,
        errorMessage: null,
        touched: false
    })

    const inputType = props.inputType.charAt(0).toUpperCase() + props.inputType.slice(1)

    const passValidityDataHandler = data => {
        props.passValidityData(data)
    }

    const passValueHandler = data => {
        props.passValue(data)
    }

    const inputHandler = text => {
        let isValid = true
        passValueHandler(text)

        switch (props.inputType) {
            case 'url': {
                const error = validate({url: text}, {url: {presence: {allowEmpty: false}, url: true}})
                if (error) {
                    isValid = false
                }
                passValidityDataHandler(isValid)
                dispatch({type: 'UPDATE_INPUT', value: text, isValid: isValid, errorMessage: error ? error.url[0] + '.' : null})
                return
            }
            
            case 'description': {
                const error = validate({description: text}, {description: {presence: {allowEmpty: false }, length: {minimum: 50}}})
                if (error) {
                    isValid = false
                }
                passValidityDataHandler(isValid)
                dispatch({type: 'UPDATE_INPUT', value: text, isValid: isValid, errorMessage: error ? error.description[0] + '.' : null})
                return
            }

            case 'email': {
                const error = validate({email: text}, {email: {presence: {allowEmpty: false}, email: true}})
                if (error) {
                    isValid = false
                }
                
                passValidityDataHandler(isValid)
                dispatch({type: 'UPDATE_INPUT', value: text, isValid: isValid, errorMessage: error ? error.email[0] + '.' : null})
                return
            }

            case 'password': {
                const isLongEnough = text.length >= 7
                const hasLowerCase = /[a-z]/.test(text)
                const hasUpperCase = /[A-Z]/.test(text)
                const hasDigit = /[0-9]/.test(text)

                let error;

                if (!hasLowerCase) {
                    isValid = false
                    error = 'Must have a lower case letter.'
                }
                if (!hasDigit) {
                    isValid = false
                    error = 'Must have at least one digit.'
                }
                if (!hasUpperCase) {
                    isValid = false
                    error = 'Must have an upper case letter.'
                }
                if (!isLongEnough) {
                    isValid = false
                    error = 'Must be at least 7 characters.'
                }

                passValidityDataHandler(isValid)
                dispatch({type: 'UPDATE_INPUT', value: text, isValid: isValid, errorMessage: error})
                return
            }

            default: {
                return
            }

        }

    }

    return (
        <View style={styles.container}>
            <HeaderText style={{ marginTop: Dimensions.get('window').height > 600 ? 5 : 0 }}>{props.header}</HeaderText>
            <TextInput
                {...props}
                style={{ ...styles.input, ...props.inputStyle }}
                onChangeText={(text) => inputHandler(text)}
                value={inputState.value}
                ref={props.reference}
                onBlur={() => dispatch({type: 'UPDATE_TOUCHED'})}
            />
            { props.inLogin ? undefined : (inputState.touched && !inputState.isValid ? <DefaultText style={{ marginBottom: props.inputStyle && props.inputStyle.marginBottom ? 7 : 0, marginTop: props.inputStyle && props.inputStyle.marginBottom ? -8 : 2, color: 'red' }}>{inputState.errorMessage ? inputState.errorMessage : inputType + " can't be blank."}</DefaultText> : undefined)}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '85%',
        marginTop: 5,
        alignItems: 'center'
    },

    input: {
        borderColor: Colors.secondary,
        borderWidth: 3,
        borderRadius: 10,
        width: '100%',
        backgroundColor: Colors.primary,
        fontFamily: 'fontRegular',
        fontSize: 16,
        padding: 5,
        marginTop: 10,
        textAlign: 'center',
    }
})

export default LongInput;