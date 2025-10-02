const options = { method: 'GET', headers: { 'User-Agent': 'insomnia/11.6.1' } };
let rawProduct = {};
const productListEle = document.getElementById('product-list');

// Fetch Product List
fetch('https://furniture-api.fly.dev/v1/products', options)
    .then(res => res.json())
    // handle success: 
    .then(res => {
        rawProduct = res.data
        console.log(rawProduct);
        productListEle.innerHTML = rawProduct.map(product => `
            <div class="product-card">
                <img src="${product.image_path}" alt="${product.name}" class="product-image"/>
                <h2 class="product-name">${product.name}</h2>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <p class="product-description">${product.description}</p>
            </div>
        `).join('');
    })

    // handle error:
    .catch(err => console.error(err));