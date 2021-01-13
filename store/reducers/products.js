import PRODUCTS from '../../data/fake-data'
import { CartProduct } from '../../models/CartProduct'
import Order from '../../models/Order'
import Product from '../../models/Product'

import { ADD_TO_CART, ADD_TO_PRODUCTS, DELETE_PRODUCT, EDIT_PRODUCT, REMOVE_FROM_CART, SET_CART_PRODUCTS, SET_ORDERS, SET_PRODDUCTS, SUBMIT_ORDER } from '../actions/products'

const inititalState = {
    shopProducts: [],
    userProducts: [],
    cartProducts: [],
    pastOrders: []
}

const productsReducer = (state = inititalState, action) => {

    switch (action.type) {
        case SET_PRODDUCTS: {
            return {
                ...state,
                shopProducts: [...action.products, ...PRODUCTS],
                userProducts: action.products.filter((value) => value.userId === 'u1')
            }
        }
        case SET_CART_PRODUCTS: {
            return {
                ...state,
                cartProducts: action.cartProducts
            }
        }
        case SET_ORDERS: {
            return {
                ...state,
                pastOrders: action.orders
            }
        }
        case ADD_TO_CART: {
            const cartIndex = state.cartProducts.findIndex((value) => value.id === action.product.id)
            let newCartProducts = [...state.cartProducts]

            if (cartIndex >= 0) {
                newCartProducts[cartIndex].quantity++
            } else {
                const newCartItem = new CartProduct(action.product.title, action.product.price, action.product.imageSource, action.product.description, action.product.id, 1)
                if (newCartProducts.length > 0) {
                    newCartProducts.splice(0, 0, newCartItem)
                } else {
                    newCartProducts = [newCartItem]
                }
            }
            return { ...state, cartProducts: newCartProducts }
        }

        case REMOVE_FROM_CART: {
            const newCartProducts = state.cartProducts.filter((value) => value.id !== action.product.id)

            return { ...state, cartProducts: newCartProducts }
        }

        case ADD_TO_PRODUCTS: {
            let newUserProducts = state.userProducts
            const newProduct = new Product(action.title, action.price, action.imageSource, action.description, action.id, 'u1')

            if (state.userProducts.length > 0) {
                newUserProducts = [newProduct, ...newUserProducts]
            } else {
                newUserProducts = [newProduct]
            }

            let newShopProducts = state.shopProducts
            if (state.shopProducts.length > 0) {
                newShopProducts = [newProduct, ...newShopProducts]
            } else {
                newShopProducts = [newProduct]
            }

            return { ...state, userProducts: newUserProducts, shopProducts: newShopProducts }
        }

        case EDIT_PRODUCT: {
            const userProductsIndex = state.userProducts.findIndex((product) => product.id === action.originalProduct.id)
            const shopProductsIndex = state.shopProducts.findIndex((product) => product.id === action.originalProduct.id)

            console.log(shopProductsIndex)
            console.log(userProductsIndex)

            const originalProduct = action.originalProduct

            if (userProductsIndex >= 0 && shopProductsIndex >= 0) {
                originalProduct.title = action.title
                originalProduct.description = action.description
                originalProduct.imageSource = action.imageSource

                const newUserProducts = [...state.userProducts]
                const newShopProducts = [...state.shopProducts]

                newUserProducts[userProductsIndex] = originalProduct
                newShopProducts[shopProductsIndex] = originalProduct

                return { ...state, userProducts: newUserProducts, shopProducts: newShopProducts }
            }
        }

        case DELETE_PRODUCT: {
            const newShopProducts = [...state.shopProducts]
            const newUserProducts = [...state.userProducts]

            const deleteShopProductIndex = newShopProducts.findIndex((value) => value.id === action.product.id)
            const deleteUserProductIndex = newUserProducts.findIndex((value) => value.id === action.product.id)

            if (deleteShopProductIndex >= 0 && deleteUserProductIndex >= 0) {
                newShopProducts.splice(deleteShopProductIndex, 1)
                newUserProducts.splice(deleteUserProductIndex, 1)

                return { ...state, userProducts: newUserProducts, shopProducts: newShopProducts }
            }
        }

        case SUBMIT_ORDER: {
            const newOrder = new Order(action.cartProducts, action.date, action.id, action.total)
            const pastOrders = [newOrder, ...state.pastOrders]
            console.log(action.id)

            return {...state, pastOrders: pastOrders, cartProducts: []}
        }

        default: {
            return state
        }
    }
}

export default productsReducer;