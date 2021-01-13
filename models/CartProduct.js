import Product from './Product'

export class CartProduct extends Product {
    constructor(title, price, imageSource, description, id, quantity) {
        super(title, price, imageSource, description, id)
        this.quantity = quantity
    }
}

export default CartProduct;