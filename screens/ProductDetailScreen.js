import React from 'react'
import { View, StyleSheet, Image, ScrollView } from 'react-native'

import HeaderText from '../components/HeaderText'
import Colors from '../constants/Colors'
import ProductButton from '../components/ProductButton'
import DefaultText from '../components/DefaultText'
import { useDispatch } from 'react-redux'
import {addToCart} from '../store/actions/products'

const ProductDetailScreen = props => {
    const product = props.navigation.getParam('product')
    const canAddToCart = props.navigation.getParam('canAddToCart')

    const dispatch = useDispatch()

    let Button;

    if (canAddToCart) {
        Button = <ProductButton onPress={() => dispatch(addToCart(product))} style={styles.button}>Add To Cart</ProductButton>
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={{ uri: product.imageSource }} />
                </View>
                <View style={{...styles.priceContainer, justifyContent: canAddToCart ? 'space-between' : 'center'}}>
                    <HeaderText style={{ color: 'green', fontSize: 25}}>${product.price.toFixed(2)}</HeaderText>
                    {Button}
                </View>
                <View style={{ width: '80%', borderWidth: 1.5, borderColor: Colors.secondary }}></View>
                <HeaderText style={styles.descriptionHeader}>Description</HeaderText>
                <DefaultText style={{ textAlign: 'center', marginHorizontal: 5 }}>{product.description}</DefaultText>
            </View>
        </ScrollView>
    )
}

ProductDetailScreen.navigationOptions = navData => {
    const headerTitle = navData.navigation.getParam('product').title
    return {
        headerTitle: () => <HeaderText style={{ color: Colors.secondary }}>{headerTitle}</HeaderText>
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },

    imageContainer: {
        width: '100%',
        height: 225,
        borderBottomWidth: 3,
        borderColor: Colors.secondary,
        paddingBottom: 30
    },

    image: {
        width: '100%',
        height: '100%'
    },

    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        padding: 20
    },

    button: {
        backgroundColor: 'green',
        height: 40,
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20
    },

    descriptionHeader: {
        marginVertical: 15
    }
})

export default ProductDetailScreen;