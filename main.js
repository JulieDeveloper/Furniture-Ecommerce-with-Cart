const options = { method: 'GET', headers: { 'User-Agent': 'insomnia/11.6.1' } };
let rawProduct = {};

// HTML elements: 
const productsList_HTML = document.getElementById('product-grid');



const endPoint = 'https://furniture-api.fly.dev/v1/products';

// Fetch Product List
fetch(endPoint, options)
    .then(res => res.json())
    // handle success: 
    .then(res => {
        rawProduct = res.data
        console.log(rawProduct);
        productsList_HTML.innerHTML = rawProduct.map(product => `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image_path}" alt="${product.name}" class="product-image" alt="Product Image" />
            <div class="product-details">
                <div>
                    <h2 class="product-name">${product.name}</h2>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                </div>
                <div class="add-to-cart-btn">+</div>
            </div>
        </div>
        `).join('');
    })

    // handle error:
    .catch(err => console.error(err));