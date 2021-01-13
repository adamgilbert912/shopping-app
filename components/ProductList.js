import React from 'react'
import { FlatList, StyleSheet} from 'react-native'

import ProductItem from './ProductItem'

const ProductList = props => {
    const renderProductItem = itemData => {
        return (
            <ProductItem
                price={itemData.item.price}
                title={itemData.item.title}
                imageSource={itemData.item.imageSource}
                onPress={props.onPress.bind(this, itemData.item)}
                leftButtonTitle={props.leftButtonTitle}
                rightButtonTitle={props.rightButtonTitle(itemData.item.userId)}
                leftOnPress={props.leftOnPress.bind(this, itemData.item)}
                rightOnPress={props.rightOnPress.bind(this, itemData.item)}
                leftButtonColor={props.leftButtonColor}
                rightButtonColor={props.rightButtonColor}
            />
        )
    }

    return (
        <FlatList {...props} contentContainerStyle={styles.list} data={props.data} renderItem={item => renderProductItem(item)} keyExtractor={(item) => item.id} />
    )
}

const styles = StyleSheet.create({
    list: {
        alignItems: 'center'
    }
})

export default ProductList