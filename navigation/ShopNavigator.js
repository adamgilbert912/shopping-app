import React from 'react'
import { createStackNavigator, HeaderBackground } from 'react-navigation-stack'
import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer'
import { createAppContainer } from 'react-navigation'
import { View, SafeAreaView, Dimensions } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import {createSwitchNavigator} from 'react-navigation'

import ProductListScreen from '../screens/ProductListScreen'
import ProductDetailScreen from '../screens/ProductDetailScreen'
import Colors from '../constants/Colors'
import HeaderText from '../components/HeaderText'
import CartScreen from '../screens/CartScreen'
import OrdersScreen from '../screens/OrdersScreen'
import ProductInputScreen from '../screens/ProductInputScreen'
import ManageProductsScreen from '../screens/ManageProductsScreen'
import UserAuthScreen from '../screens/UserAuthScreen'
import StartUpScreen from '../screens/StartUpSceen'
import CheckOutButton from '../components/CheckOutButton'
import { useDispatch } from 'react-redux'
import { logOut } from '../store/actions/auth'

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

const AvailableProductStack = createStackNavigator({
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

const OrderStack = createStackNavigator({
    OrdersScreen: {
        screen: OrdersScreen,
        navigationOptions: {
            headerTitle: () => HeaderTitle('Orders')
        }
    }
}, { defaultNavigationOptions: defaultNavigationOptions })


const ManageProductsStack = createStackNavigator({
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


const DrawerNavigator = createDrawerNavigator({
    Shop: {
        screen: AvailableProductStack
    },
    Orders: {
        screen: OrderStack,
    },
    ManageProducts: {
        screen: ManageProductsStack,
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
    },
    contentComponent: props => {
        let dispatch = useDispatch()
        const logOutHandler = () => {
            dispatch(logOut())
            props.navigation.navigate('Auth')
        }
        return (
            <View style={{flex: 1}}>
                <SafeAreaView style={{flex: 1}} forceInset={{top: 'always', horizontal: 'never'}}>
                    <DrawerNavigatorItems {...props}/>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
                    <CheckOutButton onPress={logOutHandler} style={{backgroundColor: 'red', width: Dimensions.get('window').width > 375 ? '95%' : '80%'}}>Log Out</CheckOutButton>
                    </View>
                </SafeAreaView>
            </View>
        )
    }
})

const AuthenticationNavigator = createStackNavigator({
    Auth: {
        screen: UserAuthScreen,
    }
}, {defaultNavigationOptions: defaultNavigationOptions})

const MainNavigator = createSwitchNavigator({
    Start: StartUpScreen,
    Auth: AuthenticationNavigator,
    Shop: DrawerNavigator
})


export default createAppContainer(MainNavigator)