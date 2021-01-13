import Product from "../../models/Product"
import { Alert } from 'react-native'

export const ADD_TO_CART = 'ADD_TO_CART'
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART'
export const ADD_TO_PRODUCTS = 'ADD_TO_PRODUCTS'
export const EDIT_PRODUCT = 'EDIT_PRODUCT'
export const DELETE_PRODUCT = 'DELETE_PRODUCT'
export const SUBMIT_ORDER = 'SUBMIT_ORDER'
export const SET_PRODDUCTS = 'SET_PRODUCTS'
export const SET_CART_PRODUCTS = 'SET_CART_PRODUCTS'
export const SET_ORDERS = 'SET_ORDERS'

export const addToCart = product => {
    return async dispatch => {
        try {
            const response = await fetch('https://shop-app-8eda0-default-rtdb.firebaseio.com/cartProducts/u1.json')

            if (!response.ok) {
                throw new Error('Error gettting user cart products.')
            }

            const data = await response.json()

            let productInCart = false
            let quantity = 0
            let cartProductKey;

            for (const key in data) {
                if (product.id === data[key].id) {
                    productInCart = true
                    quantity = data[key].quantity
                    cartProductKey = key
                    break;
                }
            }

            if (productInCart) {
                const quantityResponse = await fetch(`https://shop-app-8eda0-default-rtdb.firebaseio.com/cartProducts/u1/${cartProductKey}.json`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        quantity: quantity + 1
                    })
                })

                if (!quantityResponse.ok) {
                    throw new Error('Error adjusting the quantity of item in cart.')
                }
            } else {
                const postResponse = await fetch('https://shop-app-8eda0-default-rtdb.firebaseio.com/cartProducts/u1.json', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: product.title,
                        price: product.price,
                        description: product.description,
                        imageSource: product.imageSource,
                        quantity: 1,
                        id: product.id
                    })
                })

                if (!postResponse.ok) {
                    throw new Error('Error adding product to cart.')
                }
            }

            dispatch({ type: ADD_TO_CART, product: product })
        } catch (err) {
            Alert.alert('Error Occured', err.message, [{ text: 'Ok', style: 'cancel' }])
        }
    }

}

export const removeFromCart = product => {
    return async dispatch => {
        try {
            const response = await fetch('https://shop-app-8eda0-default-rtdb.firebaseio.com/cartProducts/u1.json')

            if (!response.ok) {
                throw new Error('Error getting user cart products.')
            }

            const data = await response.json()

            let cartProductkey;
            for (const key in data) {
                if (data[key].id === product.id) {
                    cartProductkey = key
                }
            }

            const deletionResponse = await fetch(`https://shop-app-8eda0-default-rtdb.firebaseio.com/cartProducts/u1/${cartProductkey}.json`, {
                method: 'DELETE'
            })

            if (!deletionResponse.ok) {
                throw new Error('Error deleting an item from the cart.')
            }

            dispatch({ type: REMOVE_FROM_CART, product: product })
        } catch (err) {
            Alert.alert('Error Occured', err.message, [{ text: 'Ok', style: 'cancel' }])
        }
    }
}

export const fetchCartProducts = () => {
    return async dispatch => {
        try {
            const response = await fetch('https://shop-app-8eda0-default-rtdb.firebaseio.com/cartProducts/u1.json')

            if (!response.ok) {
                throw new Error('Error fetching cart data.')
            }

            const data = await response.json()

            let cartProducts = []
            for (const key in data) {
                cartProducts.push(data[key])
            }

            dispatch({ type: SET_CART_PRODUCTS, cartProducts: cartProducts })
        } catch (err) {
            throw err
        }
    }
}

export const fetchOrders = () => {
    return async dispatch => {
        try {
            const response = await fetch('https://shop-app-8eda0-default-rtdb.firebaseio.com/orders/u1.json')
            
            if (!response.ok) {
                throw new Error('Error fetching user orders.')
            }

            const data = await response.json()

            let orders = []
            for (const key in data) {
                orders.push(data[key])
            }

            dispatch({ type: SET_ORDERS, orders: orders})
        } catch (err) {
            throw err
        }
    }
}

export const fetchProducts = () => {
    return async dispatch => {
        try {
            const response = await fetch('https://shop-app-8eda0-default-rtdb.firebaseio.com/products.json')

            if (!response.ok) {
                throw new Error('Cannot fetch data.')
            }

            const data = await response.json()

            let products = []
            for (const key in data) {
                products = [new Product(data[key].title, data[key].price, data[key].imageSource, data[key].description, key, 'u1')]
            }

            dispatch({ type: SET_PRODDUCTS, products: products })
        } catch (err) {
            throw err
        }
    }
}

export const addToProducts = (title, price, imageSource, description) => {
    return async dispatch => {
        const response = await fetch('https://shop-app-8eda0-default-rtdb.firebaseio.com/products.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                price,
                imageSource,
                description
            })
        })

        const data = await response.json()

        dispatch({ type: ADD_TO_PRODUCTS, title: title, price: price, imageSource: imageSource, description: description, id: data.name })
    }
}

export const editProduct = (title, description, imageSource, originalProduct) => {
    return async dispatch => {
        try {
            const response = await fetch(`https://shop-app-8eda0-default-rtdb.firebaseio.com/products/${originalProduct.id}.json`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    description,
                    imageSource
                })
            })

            if (!response.ok) {
                throw new Error("There was an error editing this item.")
            }

            dispatch({ type: EDIT_PRODUCT, originalProduct: originalProduct, title: title, description: description, imageSource: imageSource })
        } catch (err) {
            throw err
        }
    }
}



export const deleteProduct = (product) => {
    return async dispatch => {
        try {
            const response = await fetch(`https://shop-app-8eda0-default-rtdb.firebaseio.com/products/${product.id}.json`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error('There was an error deleting this item.')
            }

            dispatch({ type: DELETE_PRODUCT, product: product })
        } catch (err) {
            throw err
        }
    }
}

export const submitOrder = (products, total) => {
    return async dispatch => {
        try {
            const date = new Date()
            const orderResponse = await fetch('https://shop-app-8eda0-default-rtdb.firebaseio.com/orders/u1.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    products,
                    date: date.toISOString(),
                    total
                })
            })

            if (!orderResponse.ok) {
                throw new Error('There was an error submitting this order.')
            }

            const deleteCartResponse = await fetch('https://shop-app-8eda0-default-rtdb.firebaseio.com/cartProducts/u1.json', {
                method: 'DELETE',
            })

            if (!deleteCartResponse.ok) {
                throw new Error('There was an error clearing your cart.')
            }

            const data = await orderResponse.json()
            
            dispatch({ type: SUBMIT_ORDER, cartProducts: products, date: date, id: data.name, total: total })
        } catch (err) {
            throw err
        }
    }
}