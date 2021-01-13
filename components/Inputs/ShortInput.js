import React, {useCallback, useEffect, useReducer} from 'react'
import { TextInput, View, StyleSheet, Dimensions } from 'react-native'
import { validate } from 'validate.js'

import Colors from '../../constants/Colors'
import HeaderText from '../HeaderText'
import DefaultText from '../DefaultText'

const shortInputReducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_INPUT': {
            return {...state, value: action.value, isValid: action.isValid}
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
        touched: false
    })

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
            case 'number': {
                if (validate({number: text}, {number: {presence: {allowEmpty: false}, numericality: {greaterThan: 0}}})) {
                    isValid = false
                }
                passValidityDataHandler(isValid)
                dispatch({type: 'UPDATE_INPUT', value: text, isValid: isValid})
            }
            
            case 'title': {
                if (validate({title: text}, {title: {presence: {allowEmpty: false}}})) {
                    isValid = false
                }
                passValidityDataHandler(isValid)
                dispatch({type: 'UPDATE_INPUT', value: text, isValid: isValid})
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
                    onChangeText={(text) => inputHandler(text)}
                    value={inputState.value}
                    onBlur={() => dispatch({type: 'UPDATE_TOUCHED'})}
                    ref={props.reference}
                />
            </View>
            { inputState.touched && !inputState.isValid ? <View style={styles.errorMessageContainer}><DefaultText style={styles.errorMessage}>{props.errorMessage}</DefaultText></View> : undefined}
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

