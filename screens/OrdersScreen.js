import React, { useEffect, useState, useCallback } from 'react'
import { View, StyleSheet, FlatList, Alert } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { useDispatch, useSelector } from 'react-redux'
import DefaultText from '../components/DefaultText'
import LoadingScreen from '../components/LoadingScreen'

import NavigationButton from '../components/NavigationButton'
import OrderItem from '../components/OrderItem'
import { fetchOrders } from '../store/actions/products'

const OrdersScreen = props => {
    const pastOrders = useSelector(state => state.products.pastOrders)
    const [isLoading, setIsLoading] = useState(false)

    const dispatch = useDispatch()

    const loadOrders = useCallback(async () => {
        try {
            setIsLoading(true)
            await dispatch(fetchOrders())
            setIsLoading(false)
        } catch (err) {
            Alert.alert('Error Occured', err.message, [{text: 'Cancel', style: 'cancel'}, {text: 'Retry', style: 'default', onPress: loadOrders}])
        }
    }, [dispatch, setIsLoading])

    useEffect(() => {
        loadOrders()
    }, [loadOrders])

    if (isLoading) {
        return <LoadingScreen/>
    }

    if (pastOrders.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <DefaultText style={{ fontSize: 18, textAlign: 'center' }}>You haven't made any orders yet!</DefaultText>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList contentContainerStyle={{ width: '100%' }} data={pastOrders} renderItem={itemData => <OrderItem order={itemData.item} />} keyExtractor={item => item.id} />
        </View>
    )
}

OrdersScreen.navigationOptions = navData => {
    return (
        {
            headerLeft: () => (
                <HeaderButtons HeaderButtonComponent={NavigationButton}>
                    <Item iconName='ios-menu' onPress={() => navData.navigation.toggleDrawer()} />
                </HeaderButtons>
            )
        }
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default OrdersScreen;