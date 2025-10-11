import { createModal, closeModal } from './productModal.js';

const options = { method: 'GET', headers: { 'User-Agent': 'insomnia/11.6.1' } };
let rawProducts = [];


// HTML elements: 
const productsList_HTML = document.getElementById('product-grid');
const sortBy_HTML = document.getElementById('sort-by-select');
const sortOrder_HTML = document.getElementById('sort-order');
const resultCount_HTML = document.getElementById('result-count');
const modalCloseBtn = document.getElementById('close-modal-btn');

// API endpoint
let sortBy_Endpoint = 'sort=newest';
const BaseURL = 'https://furniture-api.fly.dev/v1/products?limit=100';
let fetchURL = BaseURL + '&' + sortBy_Endpoint;


// Fetch Product List
const fetchProducts = (URL) => {
    fetch(URL, options)
        .then(res => res.json())
        // handle success: 
        .then(res => {
            rawProducts = res.data
            renderProducts(rawProducts);
        })

        // handle error:
        .catch(err => console.error(err));

}


// Render Products
const renderProducts = (products) => {
    console.log('Rendering products:', products);
    let renderHTML = '';
    products.map(product => {
        renderHTML += `
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
        `})
    productsList_HTML.innerHTML = renderHTML;
    resultCount_HTML.textContent = products.length;
}

// Handle Sort By Change
sortBy_HTML.addEventListener('change', (e) => {
    sortedBy = e.target.value;
    console.log('Sort by:', sortedBy);

    switch (sortedBy) {
        case 'new-arrival':
            fetchURL = BaseURL + '&' + 'sort=newest';
            break;
        case 'price-asc':
            fetchURL = BaseURL + '&' + 'sort=price_asc';
            break;
        case 'price-desc':
            fetchURL = BaseURL + '&' + 'sort=price_desc';
            break;
        case 'name-asc':
            fetchURL = BaseURL + '&' + 'sort=name_asc';
            break;
        case 'name-desc':
            fetchURL = BaseURL + '&' + 'sort=name_desc';
            break;

    }
    fetchProducts(fetchURL);

})

// Handle Product Click for Modal
productsList_HTML.addEventListener('click', (e) => {
    const productCard = e.target.closest('.product-card');
    if (!productCard) return; // Clicked outside a product card

    const productId = productCard.getAttribute('data-id');
    const selectedProduct = rawProducts.find(product => product.id == productId);
    if (selectedProduct) {
        console.log('Selected Product:', selectedProduct);
        createModal(selectedProduct);
    }
});


// Handle Close Modal
modalCloseBtn.addEventListener('click', () => {
    console.log('Close modal button clicked');
    closeModal()
});

// Initial Fetch
fetchProducts(fetchURL);