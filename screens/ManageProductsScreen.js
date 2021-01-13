import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import ProductList from '../components/ProductList'
import Colors from '../constants/Colors'
import NavigationButton from '../components/NavigationButton'
import { MaterialIcons } from '@expo/vector-icons'
import DefaultText from '../components/DefaultText'
import { deleteProduct } from '../store/actions/products'

const ManageProductsScreen = props => {
    const userProducts = useSelector(state => state.products.userProducts)
    const dispatch = useDispatch()
    const [error, setError] = useState()

    const removeProduct = async product => {
        try {
            await dispatch(deleteProduct(product))
        } catch (err) {
            setError(err)
        }
    }

    const deleteHandler = product => {
        Alert.alert(
            'Are you sure?',
            'You are about to delete this item and there is no going back.',
            [{ text: 'No', style: 'default' }, { text: 'Yes', style: 'destructive', onPress: () => removeProduct(product) }]
        )
    }

    useEffect(() => {
        if (error) {
            Alert.alert('Error Occured', error.message, [{text: 'Ok', style: 'cancel'}])
            setError(null)
        }
    }, [error])

    if (userProducts.length === 0) {
        return (
            <View style={{ ...styles.container, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                <DefaultText style={{ textAlign: 'center', fontSize: 18 }}>You haven't started selling any items. Start selling now!</DefaultText>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <ProductList
                data={userProducts}
                onPress={(product) => props.navigation.navigate('ProductDetailScreen', { canAddToCart: false, product: product })}
                leftButtonTitle='Edit'
                rightButtonTitle={() => 'Delete'}
                leftOnPress={(product) => props.navigation.navigate('ProductInputScreen', { product: product })}
                rightOnPress={(product) => deleteHandler(product)}
                leftButtonColor={Colors.secondary}
                rightButtonColor='red'
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

ManageProductsScreen.navigationOptions = navData => {
    return (
        {
            headerLeft: () => (
                <HeaderButtons HeaderButtonComponent={NavigationButton}>
                    <Item iconName='ios-menu' title='Menu' onPress={() => navData.navigation.toggleDrawer()} />
                </HeaderButtons>
            ),
            headerRight: () => (
                <HeaderButtons>
                    <Item IconComponent={MaterialIcons} color={Colors.secondary} iconSize={23} iconName='add' title='Add' onPress={() => navData.navigation.navigate('ProductInputScreen')} />
                </HeaderButtons>
            )
        }
    )
}

export default ManageProductsScreen