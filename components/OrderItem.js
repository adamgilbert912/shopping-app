import React, { useState } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import Colors from '../constants/Colors'
import CheckOutButton from './CheckOutButton'
import HeaderText from './HeaderText'
import DefaultText from './DefaultText'

const OrderItem = props => {
    const [pressedMore, setPressedMore] = useState(false)

    const date = new Date(props.order.date)
    
    const orderDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()

    let orderDetails;

    if (pressedMore) {
        const renderOrderItem = cartProduct => (
            <View style={styles.itemContainer}>
                <View style={{ width: '60%', flexDirection: 'row', alignItems: 'center' }}>
                    <HeaderText style={{ marginHorizontal: 10 }}>{cartProduct.quantity}</HeaderText>
                    <DefaultText>{cartProduct.title}</DefaultText>
                </View>
                <View style={{width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                    <DefaultText style={{marginHorizontal: 10}}>${cartProduct.price}</DefaultText>
                </View>
            </View>
        )

        orderDetails = (
            <View style={styles.detailsContainer}>
                <HeaderText style={{ textAlign: 'center' }}>Items</HeaderText>
                {props.order.products.map(cartProduct => renderOrderItem(cartProduct))}
            </View>
        )
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.basicAndButtonContainer}>
                <View style={styles.basicInfoContainer}>
                    <HeaderText style={{ color: 'green', fontSize: Dimensions.get('window').height > 600 ? 25 : 22}}>${props.order.total}</HeaderText>
                    <HeaderText style={{ fontSize: Dimensions.get('window').height > 600 ? 25 : 22 }}>{orderDate}</HeaderText>
                </View>
                <CheckOutButton fontSize={23} onPress={() => setPressedMore(!pressedMore)}>{pressedMore ? 'Close' : 'More'}</CheckOutButton>
            </View>
            {orderDetails}
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        width: '95%',
        alignSelf: 'center',
        borderRadius: 15,
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        shadowOpacity: 0.8,
        elevation: 8,
        backgroundColor: Colors.primary,
        margin: 20,
        alignItems: 'center'
    },

    basicAndButtonContainer: {
        height: 100,
        width: '100%',
        alignItems: 'center'
    },

    basicInfoContainer: {
        width: '80%',
        height: '40%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 3
    },

    detailsContainer: {
        width: '100%',
        backgroundColor: 'lightgrey',
        borderRightColor: 'grey',
        borderBottomColor: 'grey',
        borderLeftColor: 'grey',
        borderTopColor: 'black',
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        borderWidth: 3,
        justifyContent: 'center'
    },

    itemContainer: {
        flexDirection: 'row',
        width: '100%'
    }
})

export default OrderItem