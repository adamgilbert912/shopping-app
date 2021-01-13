import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Alert, Dimensions, ActivityIndicator } from 'react-native'
import { Header } from 'react-navigation-stack'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import Colors from '../constants/Colors'
import { MaterialIcons } from '@expo/vector-icons'
import { useDispatch } from 'react-redux'
import { addToProducts, editProduct } from '../store/actions/products'
import HeaderText from '../components/HeaderText'

import ShortInput from '../components/Inputs/ShortInput'
import LongInput from '../components/Inputs/LongInput'
import LoadingScreen from '../components/LoadingScreen'

const UPDATE_VALIDITY = 'UPDATE_VALIDITY'
const UPDATE_VALUE = 'UPDATE_VALUE'

const inputReducer = (state, action) => {
    if (action.type === UPDATE_VALIDITY) {
        const newValidities = { ...state.validities, [action.inputType]: action.isValid }

        let formIsValid = true
        for (const key in newValidities) {
            if (!newValidities[key]) {
                formIsValid = false
                break;
            }
        }

        return { ...state, validities: newValidities, formIsValid: formIsValid }
    }

    if (action.type === UPDATE_VALUE) {
        const newValues = { ...state.values, [action.inputType]: action.value }

        return { ...state, values: newValues }
    }
}

const ProductInputScreen = props => {
    const product = props.navigation.getParam('product')
    //handle validities and values inside reducer state
    const [inputState, dispatchInputState] = useReducer(inputReducer, {
        validities: {
            title: !!product,
            price: !!product,
            description: !!product,
            imageSource: !!product,
        },

        values: {
            title: product ? product.title : '',
            price: product ? product.price : '',
            description: product ? product.description : '',
            imageSource: product ? product.imageSource : ''
        },

        formIsValid: !!product
    })

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()

    const dispatch = useDispatch()

    const priceInput = useRef()
    const descriptionInput = useRef()
    const imageInput = useRef()

    const dismissKeyboard = () => {
        Keyboard.dismiss()
    }

    const productHandler = useCallback(async () => {
        try {
            setError(null)
            setIsLoading(true)
            if (inputState.formIsValid) {
                if (product) {
                    await dispatch(
                        editProduct(
                            inputState.values.title,
                            inputState.values.description,
                            inputState.values.imageSource,
                            product
                        )
                    )
                } else {
                    await dispatch(
                        addToProducts(
                            inputState.values.title,
                            parseFloat(inputState.values.price),
                            inputState.values.imageSource,
                            inputState.values.description
                        )
                    )
                }
                setIsLoading(false)
                props.navigation.goBack()
            } else {
                Alert.alert('Input Not Valid', 'Check for input errors.', [{ text: 'Okay', style: 'default' }])
            }
        } catch (err) {
            setError(err)
        }

    }, [inputState, dispatch])

    useEffect(() => {
        if (error) {
            Alert.alert('Error Occurred', error.message, [{text: 'Cancel', style: 'cancel', onPress: props.navigation.goBack}, {text: 'Retry', style: 'default', onPress: productHandler}])
        }
    }, [error])

    useEffect(() => {
        props.navigation.setParams({ productHandler: productHandler })
    }, [productHandler])

    if (isLoading) {
        return <LoadingScreen/>
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={Header.HEIGHT} behavior={Platform.OS === 'android' ? 'height' : 'padding'}>
            <ScrollView style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
                    <View style={styles.container}>
                        <ShortInput
                            header='Title:'
                            inputType='title'
                            initialValue={product ? product.title : undefined}
                            placeholder='Title'
                            errorMessage='Title is not valid.'
                            returnKeyType='next'
                            passValidityData={(validity) => dispatchInputState({ type: UPDATE_VALIDITY, inputType: 'title', isValid: validity })}
                            passValue={(value) => dispatchInputState({ type: UPDATE_VALUE, inputType: 'title', value: value })}
                            initiallyValid={!!product}
                            onSubmitEditing={() => { product ? descriptionInput.current.focus() : priceInput.current.focus() }}
                        />
                        <ShortInput
                            initialValue={product ? '$' + product.price.toFixed(2).toString() : undefined}
                            inputType='number'
                            header='Price:'
                            errorMessage='Price is not valid.'
                            editable={product ? false : true}
                            placeholder='Price'
                            returnKeyType='next'
                            keyboardType='decimal-pad'
                            reference={priceInput}
                            passValidityData={(validity) => dispatchInputState({ type: UPDATE_VALIDITY, inputType: 'price', isValid: validity })}
                            passValue={(value) => dispatchInputState({ type: UPDATE_VALUE, inputType: 'price', value: value })}
                            initiallyValid={!!product}
                            onSubmitEditing={() => descriptionInput.current.focus()}
                        />
                        <LongInput
                            inputStyle={{ height: Dimensions.get('window').height > 600 ? 200 : 150, textAlign: 'left', textAlignVertical: 'top' }}
                            initialValue={product ? product.description : undefined}
                            initiallyValid={!!product}
                            inputType='description'
                            returnKeyType='next'
                            multiline={true}
                            passValidityData={(validity) => dispatchInputState({ type: UPDATE_VALIDITY, inputType: 'description', isValid: validity })}
                            passValue={(value) => dispatchInputState({ type: UPDATE_VALUE, inputType: 'description', value: value })}
                            onSubmitEditing={() => imageInput.current.focus()}
                            header='Description:'
                            errorMessage='Description is not valid.'
                            reference={descriptionInput}
                        />
                        <LongInput
                            initialValue={product ? product.imageSource : undefined}
                            initiallyValid={!!product}
                            inputStyle={{ marginBottom: Dimensions.get('window').height < 600 ? 10 : undefined }}
                            inputType='url'
                            header='Image URL:'
                            passValidityData={(validity) => dispatchInputState({ type: UPDATE_VALIDITY, inputType: 'imageSource', isValid: validity })}
                            passValue={(value) => dispatchInputState({ type: UPDATE_VALUE, inputType: 'imageSource', value: value })}
                            errorMessage='Image URL is not valid.'
                            reference={imageInput}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView >
    )
}

ProductInputScreen.navigationOptions = navData => {
    const productHandler = navData.navigation.getParam('productHandler')
    const product = navData.navigation.getParam('product')

    const HeaderTitle = title => {
        return (
            <HeaderText style={{ color: Colors.secondary }}>{title}</HeaderText>
        )
    }

    const rightHeaderCreator = product => {
        if (product) {
            return (
                <HeaderButtons>
                    <Item color={Colors.secondary} title='Done' onPress={() => productHandler(product)} />
                </HeaderButtons>
            )
        } else {
            return (
                <HeaderButtons>
                    <Item
                        IconComponent={MaterialIcons}
                        color={Colors.secondary}
                        title='Submit'
                        iconName='done'
                        iconSize={30}
                        onPress={() => productHandler()}
                    />
                </HeaderButtons>
            )
        }
    }

    return (
        {
            headerRight: () => rightHeaderCreator(product),
            headerTitle: product ? () => HeaderTitle('Edit') : () => HeaderTitle('Add an Item')
        }
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    }
})

export default ProductInputScreen;