import React, { useEffect, useState, useCallback } from 'react'
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import NavigationButton from '../components/NavigationButton'

import { useDispatch, useSelector } from 'react-redux'
import { addToCart, fetchCartProducts } from '../store/actions/products'
import Colors from '../constants/Colors'
import ProductList from '../components/ProductList'
import { fetchProducts } from '../store/actions/products'
import DefaultText from '../components/DefaultText'
import LoadingScreen from '../components/LoadingScreen'

const ProductListScreen = props => {
    const shopProducts = useSelector(state => state.products.shopProducts)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [err, setError] = useState()

    const dispatch = useDispatch()

    const userId = useSelector(state => state.auth.userId)

    const addProductToCart = product => {
        dispatch(addToCart(product))
    }

    const loadProducts = useCallback(async () => {
        setError(null)
        try {
            setIsRefreshing(true)
            await dispatch(fetchProducts())
            setIsRefreshing(false)
        } catch (err) {
            setError(err)
        }
    }, [setError, dispatch, setIsLoaded])

    useEffect(() => {
        const loadProductsListener = props.navigation.addListener('willFocus', loadProducts)

        return (
            loadProductsListener.remove()
        )
    }, [loadProducts])

    useEffect(() => {
        setIsLoaded(false)
        loadProducts().then(() => setIsLoaded(true))
    }, [loadProducts])

    if (err) {
        Alert.alert('Error Loading Data', 'There was an error trying to fetch the products data.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Reload', onPress: () => loadProducts(), style: 'default' }])
    }

    if (!isLoaded) {
        return <LoadingScreen />
    }

    if (isLoaded && shopProducts.length === 0) {
        return (
            <View style={styles.center}>
                <DefaultText style={{ textAlign: 'center', marginHorizontal: 10, fontSize: 18 }}>There's no products in the shop! Be the first to add one!</DefaultText>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <ProductList
                onRefresh={loadProducts}
                refreshing={isRefreshing}
                data={shopProducts}
                onPress={(product) => props.navigation.navigate('ProductDetailScreen', { canAddToCart: product.userId !== userId, product: product })}
                leftButtonTitle='Details'
                rightButtonTitle={(id) => id === userId ? 'Edit' : 'To Cart'}
                leftOnPress={(product) => props.navigation.navigate('ProductDetailScreen', { canAddToCart: true, product: product })}
                rightOnPress={(product) => { product.userId === userId ? props.navigation.navigate('ProductInputScreen', { product: product }) : addProductToCart(product) }}
                leftButtonColor={Colors.secondary}
                rightButtonColor='green'
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },

    list: {
        alignItems: 'center'
    }
})

ProductListScreen.navigationOptions = navData => {
    const navigate = () => navData.navigation.navigate({ routeName: 'CartScreen' })

    return (
        {
            headerLeft: () => (
                <HeaderButtons HeaderButtonComponent={NavigationButton}>
                    <Item iconName='ios-menu' title='Menu' onPress={() => navData.navigation.toggleDrawer()} />
                </HeaderButtons>
            ),
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={NavigationButton}>
                    <Item iconName='ios-cart' title='Cart' onPress={() => navigate()} />
                </HeaderButtons>
            )
        }
    )
}

export default ProductListScreen;