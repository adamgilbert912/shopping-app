import React from 'react'
import { createStackNavigator, HeaderBackground } from 'react-navigation-stack'
import { createDrawerNavigator } from 'react-navigation-drawer'
import { createAppContainer } from 'react-navigation'
import { Text, Platform } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import ProductListScreen from '../screens/ProductListScreen'
import ProductDetailScreen from '../screens/ProductDetailScreen'
import Colors from '../constants/Colors'
import HeaderText from '../components/HeaderText'
import CartScreen from '../screens/CartScreen'
import OrdersScreen from '../screens/OrdersScreen'
import ProductInputScreen from '../screens/ProductInputScreen'
import ManageProductsScreen from '../screens/ManageProductsScreen'

const defaultNavigationOptions = {
    headerTintColor: Colors.secondary,
    headerStyle: {
        backgroundColor: Colors.primary,
    },
}

const HeaderTitle = title => {
    return (
        <HeaderText style={{ color: Colors.secondary }}>{title}</HeaderText>
    )
}

const availableProductStack = createStackNavigator({
    ProductListScreen: {
        screen: ProductListScreen,
        navigationOptions: {
            title: 'Shop',
            headerTitle: () => HeaderTitle('Shop'),

        }
    },
    ProductDetailScreen: {
        screen: ProductDetailScreen,
        navigationOptions: {
            
        }
    },
    CartScreen: {
        screen: CartScreen,
        navigationOptions: {
            title: 'Cart',
            headerTitle: () => HeaderTitle('Cart')
        }
    },
    ProductInputScreen: {
        screen: ProductInputScreen,
        navigationOptions: {
            headerTitle: () => HeaderTitle('Edit')
        }
    }
}, { defaultNavigationOptions: { ...defaultNavigationOptions} })

const orderStack = createStackNavigator({
    OrdersScreen: {
        screen: OrdersScreen,
        navigationOptions: {
            headerTitle: () => HeaderTitle('Orders')
        }
    }
}, { defaultNavigationOptions: defaultNavigationOptions })


const manageProductsStack = createStackNavigator({
    ProductListScreen: {
        screen: ManageProductsScreen,
        navigationOptions: {
            headerTitle: () => HeaderTitle('Your Items'),
            title: 'Your Items'
        },
        params: {
            inManageProducts: true
        }
    },
    ProductInputScreen: {
        screen: ProductInputScreen,
        navigationOptions: {
            headerBackTitle: 'Items'
        }
    },
    ProductDetailScreen: {
        screen: ProductDetailScreen,
        navigationOptions: {
            headerBackTitle: 'Items'
        }
    }
}, { defaultNavigationOptions: defaultNavigationOptions})


const drawerNavigator = createDrawerNavigator({
    Shop: {
        screen: availableProductStack
    },
    Orders: {
        screen: orderStack,
    },
    ManageProducts: {
        screen: manageProductsStack,
        navigationOptions: {
            title: 'Manage Items'
            
        },
        
    }
}, {
    contentOptions: {
        activeTintColor: Colors.secondary,
        labelStyle: {
            fontFamily: 'fontBold',
            fontSize: 20
        }
    }
})

export default createAppContainer(drawerNavigator)