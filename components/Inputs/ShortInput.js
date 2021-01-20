import React, {useCallback, useEffect, useReducer} from 'react'
import { TextInput, View, StyleSheet, Dimensions } from 'react-native'
import { validate } from 'validate.js'

import Colors from '../../constants/Colors'
import HeaderText from '../HeaderText'
import DefaultText from '../DefaultText'

const shortInputReducer = (state, action) => {
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

const ShortInput = props => {

    const [inputState, dispatch] = useReducer(shortInputReducer, {
        value: props.initialValue ? props.initialValue : '',
        isValid: props.initiallyValid ? props.initiallyValid : false,
        errorMessage: null,
        touched: false
    })

    const inputType = props.inputType.charAt(0).toUpperCase() + props.inputType.slice(1)

    const passValidityDataHandler = (data) => {
        props.passValidityData(data)
    }

    const passValueHandler = data => {
        props.passValue(data)
    }

    const inputHandler = text => {
        let isValid = true
        passValueHandler(text)
        
        switch (props.inputType) {
            case 'price': {
                const error = validate({price: text}, {price: {presence: {allowEmpty: false}, numericality: {greaterThan: 0}}})
                if (error) {
                    isValid = false
                }
                passValidityDataHandler(isValid)
                dispatch({type: 'UPDATE_INPUT', value: text, isValid: isValid, errorMessage: error ? error.price[0] + '.' : null})
                return
            }
            
            case 'title': {
                const error = validate({title: text}, {title: {presence: {allowEmpty: false}}})
                if (error) {

                    isValid = false
                }
                passValidityDataHandler(isValid)
                dispatch({type: 'UPDATE_INPUT', value: text, isValid: isValid, errorMessage: error ? error.title[0] + '.' : null})
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
                const hasLowerCase = text.match('/^(?=.*[a-z])$/')
                const hasUpperCase = text.match('/^(?=.*[A-Z])$/')
                const hasDigit = text.match('/^(?=.*\d)$/')

                let error;

                if (!isLongEnough) {
                    isValid = false
                    error = 'Must be at least 7 characters.'
                }
                if (!hasLowerCase) {
                    isValid = false
                    error = 'Must have a lower case letter.'
                }
                if (!hasUpperCase) {
                    isValid = false
                    error = 'Must have an upper case letter.'
                }
                if (!hasDigit) {
                    isValid = false
                    error = 'Must have at least one digit.'
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
            <View style={styles.titleAndPriceContainer}>
                <View style={{ width: Dimensions.get('window').width > 375 ? '19%' : '24%'}}>
                    <HeaderText>{props.header}</HeaderText>
                </View>
                <TextInput
                    {...props}
                    style={styles.titleAndPriceInput}
                    onChangeText={inputHandler}
                    value={inputState.value}
                    onBlur={() => dispatch({type: 'UPDATE_TOUCHED'})}
                    ref={props.reference}
                />
            </View>
            {props.inLogin ? undefined : (inputState.touched && !inputState.isValid ? <View style={styles.errorMessageContainer}><DefaultText style={styles.errorMessage}>{inputState.errorMessage ? inputState.errorMessage : inputType + " can't be blank."}</DefaultText></View> : undefined)}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '90%'
    },

    titleAndPriceContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginVertical: 15
    },

    titleAndPriceInput: {
        borderColor: Colors.secondary,
        borderWidth: 3,
        borderRadius: 10,
        width: '60%',
        height: 40,
        backgroundColor: Colors.primary,
        fontFamily: 'fontRegular',
        fontSize: 20,
        padding: 5,
        textAlign: 'center',
    },

    errorMessageContainer: {
        marginTop: -14,
        width: '65%',
        alignSelf: 'flex-end',
        alignItems: 'flex-start'
    },

    errorMessage: {
        color: 'red'
    }
})

export default ShortInput;

