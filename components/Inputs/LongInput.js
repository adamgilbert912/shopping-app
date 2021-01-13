import React, {useReducer, useCallback, useEffect} from 'react'
import { TextInput, View, StyleSheet, Dimensions } from 'react-native'
import { validate } from 'validate.js'

import HeaderText from '../HeaderText'
import DefaultText from '../DefaultText'
import Colors from '../../constants/Colors'

const longInputReducer = (state, action) => {
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

const LongInput = props => {
    const [inputState, dispatch] = useReducer(longInputReducer, {
        value: props.initialValue ? props.initialValue : '',
        isValid: props.initiallyValid ? props.initiallyValid : false,
        touched: false
    })

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
                if (validate({url: text}, {url: {presence: {allowEmpty: false}, url: true}})) {
                    isValid = false
                }
                passValidityDataHandler(isValid)
                dispatch({type: 'UPDATE_INPUT', value: text, isValid: isValid})
            }
            
            case 'description': {
                if (validate({description: text}, {description: {presence: {allowEmpty: false }, length: {minimum: 50}}})) {
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
            <HeaderText style={{ marginTop: Dimensions.get('window').height > 600 ? 5 : 0 }}>{props.header}</HeaderText>
            <TextInput
                {...props}
                style={{ ...styles.input, ...props.inputStyle }}
                onChangeText={(text) => inputHandler(text)}
                value={inputState.value}
                ref={props.reference}
                onBlur={() => dispatch({type: 'UPDATE_TOUCHED'})}
            />
            { inputState.touched && !inputState.isValid ? <DefaultText style={{ marginBottom: props.inputStyle.marginBottom? 7 : 0, marginTop: props.inputStyle.marginBottom? -8 : 2, color: 'red' }}>{props.errorMessage}</DefaultText> : undefined}
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