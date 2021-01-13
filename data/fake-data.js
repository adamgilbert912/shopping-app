import Product from '../models/Product'

const PRODUCTS = [
    new Product('Xbox Series X', 
    199.99, 
    'https://media.wired.com/photos/5f69306df7e842c951860afc/125:94/w_1526,h_1148,c_limit/Gear-Xbox-Series-X-S-src-Microsoft.jpg',
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus finibus nisi mauris, sed dapibus augue viverra in. Morbi dictum mauris leo, a vestibulum elit iaculis nec. Aliquam sit amet dolor ex. Integer eu dapibus libero. Fusce convallis massa non eros pulvinar fringilla. Maecenas sodales efficitur aliquet. Nulla finibus odio quis sagittis aliquam. Praesent euismod lacus eleifend, bibendum felis nec, iaculis arcu. Vivamus rhoncus posuere velit in ultricies. Suspendisse mi magna, ullamcorper id lacus commodo, pretium imperdiet diam. Ut condimentum vulputate dolor varius suscipit. Morbi eu tortor erat. Integer sed lectus gravida, interdum risus ac, tempus lacus. Duis vel eleifend neque. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
    'xbox',
    'u2'),

    new Product('PS5', 
    199.99, 
    'https://cdn.images.express.co.uk/img/dynamic/143/590x/PS5-restock-rumour-UK-1377823.jpg?r=1609272652977',
    'Not as good as an Xbox',
    'ps5',
    'u2')
]

export default PRODUCTS;