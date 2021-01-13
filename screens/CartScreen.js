import React, { useState, useCallback } from 'react'
import { View, StyleSheet, FlatList, Dimensions, Alert, ActivityIndicator } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import HeaderText from '../components/HeaderText'
import CheckOutButton from '../components/CheckOutButton'
import CartItem from '../components/CartItem'
import DefaultText from '../components/DefaultText'
import { fetchCartProducts, removeFromCart, submitOrder } from '../store/actions/products'
import { useEffect } from 'react'
import Colors from '../constants/Colors'
import LoadingScreen from '../components/LoadingScreen'

const CartScreen = props => {
    const [submittedOrder, setSubmittedOrder] = useState(false)
    const [isLoading, setIslLoading] = useState(false)
    const [submitIsLoading, setSubmitIsLoading] = useState(false)
    const [error, setError] = useState()

    const cartProducts = useSelector(state => state.products.cartProducts)
    const dispatch = useDispatch()

    const submitOrderHandler = async () => {
        let total = 0
        for (let i=0; i < cartProducts.length; i++) {
            total += cartProducts[i].price*cartProducts[i].quantity
        }

        try {
            setError(null)
            setSubmitIsLoading(true)
            await dispatch(submitOrder(cartProducts, total))
            setSubmitIsLoading(false)
            setSubmittedOrder(true)
        } catch (err) {
            setError(err)
        }
    }

    const renderCartItem = itemData => {
        return (
            <CartItem
                onPress={() => props.navigation.navigate({ routeName: 'ProductDetailScreen', params: { product: itemData.item, canAddToCart: false } })}
                quantity={itemData.item.quantity}
                imageSource={itemData.item.imageSource}
                title={itemData.item.title}
                price={itemData.item.price}
                onDelete={() => dispatch(removeFromCart(itemData.item))}
            />
        )
    }

    const loadCartProducts = useCallback(async () => {
        setIslLoading(true)
        await dispatch(fetchCartProducts())
        setIslLoading(false)
    }, [setIslLoading, dispatch])

    const calculateSubtotal = () => {
        let subtotal = 0

        for (let i = 0; i < cartProducts.length; i++) {
            subtotal += (cartProducts[i].price * cartProducts[i].quantity)
        }

        return subtotal.toFixed(2)
    }

    useEffect(() => {
        if (error) {
            Alert.alert('Error Occured', error.message, [{text: 'Cancel', style: 'cancel'}, {text: 'Retry', style: 'default', onPress: submitIsLoading ? submitOrderHandler : loadCartProducts}])
        }
    }, [error])

    useEffect(() => {
        loadCartProducts()
    }, [loadCartProducts])

    if (isLoading) {
        return <LoadingScreen/>
    }

    if (cartProducts.length === 0) {
        const message = submittedOrder ? 'Thanks for Shopping!' : "You haven't added any items to the cart. Add some now!"
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 10 }}><DefaultText style={{ textAlign: 'center', fontSize: 18 }}>{message}</DefaultText></View>
    }

    return (
        <View style={styles.container}>
            <View style={styles.subtotalContainer}>
                <HeaderText>Subtotal:</HeaderText>
                <HeaderText style={{ color: 'green' }}>${calculateSubtotal()}</HeaderText>
            </View>
            {submitIsLoading ? <ActivityIndicator size='large' color={Colors.secondary}/> : <CheckOutButton onPress={() => submitOrderHandler()} fontSize={Dimensions.get('window').height > 600 ? 23 : 20}>Submit Order</CheckOutButton>}
            <HeaderText>Items:</HeaderText>
            <FlatList contentContainerStyle={{ alignItems: 'center' }} style={{ width: '100%' }} renderItem={(item) => renderCartItem(item)} data={cartProducts} keyExtractor={(item, index) => item.id} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },

    subtotalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '70%',
        margin: Dimensions.get('window').height < 600 ? 15 : 30
    }
})

export default CartScreen;