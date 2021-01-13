import React, { useState } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, TouchableNativeFeedback, Dimensions, Platform, ImagePropTypes } from 'react-native'

import DefaultText from './DefaultText'
import ProductButton from './ProductButton'
import Colors from '../constants/Colors'

const ProductItem = props => {
    const [errorLoadingImage, setErrorLoadingImage] = useState(false)

    return (
        <View style={{...styles.container, backgroundColor: errorLoadingImage ? 'lightgrey' : undefined}}>
            <TouchableOpacity style={styles.touchable} onPress={props.onPress}>
                    <View style={styles.imageContainer}>
                        <Image style={styles.image} source={{ uri: props.imageSource }} onError={() => setErrorLoadingImage(true)}/>
                    </View>
                    <View style={styles.detailsContainer}>
                        <ProductButton style={{ ...styles.leftButton, backgroundColor: props.leftButtonColor }} onPress={props.leftOnPress}>{props.leftButtonTitle}</ProductButton>
                        <View style={styles.titleContainer}>
                            <DefaultText style={{ marginVertical: 5 }}>{props.title}</DefaultText>
                            <DefaultText style={{ marginVertical: 5, color: 'green' }}>${props.price.toFixed(2)}</DefaultText>
                        </View>
                        <ProductButton style={{ ...styles.rightButton, backgroundColor: props.rightButtonColor }} onPress={props.rightOnPress}>{props.rightButtonTitle}</ProductButton>
                    </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 250,
        width: Dimensions.get('window').width * 0.95,
        alignItems: 'center',
        borderRadius: 15,
        marginVertical: 10,
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 8
    },

    touchable: {
        height: '100%',
        width: '100%',
        borderRadius: 15,
        overflow: 'hidden'
    },

    imageContainer: {
        width: '100%',
        height: '75%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    image: {
        width: '100%',
        height: '100%'
    },

    detailsContainer: {
        flexDirection: 'row',
        width: '100%',
        height: '25%',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: Colors.primary
    },

    titleContainer: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: Dimensions.get('window').width > 375 ? '60%' : '56%'
    },

    leftButton: {
        width: Dimensions.get('window').width > 375 ? '20%' : '22%',
        height: '85%',
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.secondary
    },

    rightButton: {
        width: Dimensions.get('window').width > 375 ? '20%' : '22%',
        height: '85%',
        borderRadius: 7,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
    }
})


export default ProductItem