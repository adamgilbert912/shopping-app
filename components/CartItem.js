import React from 'react'
import { View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import HeaderText from './HeaderText'
import DefaultText from './DefaultText'

const CartItem = props => {
    if (Dimensions.get('window').width < 375) {
        return (
            <TouchableOpacity style={{ ...styles.container, justifyContent: 'space-between' }} onPress={props.onPress}>
                <View style={styles.itemContainer}>
                    <HeaderText>{props.quantity}</HeaderText>
                    <Image style={styles.image} source={{ uri: props.imageSource }} />
                    <View style={{ ...styles.titleContainer, alignItems: 'center', width: '63%' }}>
                        <DefaultText style={{textAlign: 'center'}}>{props.title}</DefaultText>
                        <DefaultText style={{ color: 'green', marginHorizontal: 11, fontSize: 16 }}>${props.price}</DefaultText>
                    </View>
                </View>

                <TouchableOpacity onPress={props.onDelete}>
                    <AntDesign size={24} name='delete' color='red' />
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }
    return (
        <TouchableOpacity style={styles.container} onPress={props.onPress}>
            <View style={styles.itemContainer}>
                <HeaderText>{props.quantity}</HeaderText>
                <Image style={styles.image} source={{ uri: props.imageSource }} />
                <View style={styles.titleContainer}>
                    <DefaultText>{props.title}</DefaultText>
                </View>
            </View>
            <View style={styles.priceContainer}>
                <DefaultText style={{ color: 'green', fontSize: 16, textAlign: 'center' }}>${props.price}</DefaultText>
                <TouchableOpacity onPress={props.onDelete}>
                    <AntDesign size={24} style={{ marginLeft: 10 }} name='delete' color='red' />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: Dimensions.get('window').width * 0.9,
        height: Dimensions.get('window').height < 600 ? 120 : 150,
        borderTopWidth: 3,
        borderBottomWidth: 3,
        borderColor: 'grey',
        margin: 10,
        alignItems: 'center',
    },

    itemContainer: {
        flexDirection: 'row',
        height: '100%',
        width: '60%',
        alignItems: 'center'
    },

    titleContainer: {
        width: '54%'
    },

    priceContainer: {
        flexDirection: 'row',
        height: '100%',
        width: '40%',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },

    image: {
        width: 80,
        height: 80,
        marginHorizontal: 15
    }
})

export default CartItem;