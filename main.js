import { createModal, closeModal } from './productModal.js';
import { fetchProducts } from './fetchProduct.js';

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


// handle Filter Menu Toggle
const filterMenuCheckbox_HTML = document.getElementById('filter-by-checkbox');
const filterMenu_HTML = document.getElementById('filter-menu');

filterMenuCheckbox_HTML.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    console.log('Filter menu checkbox changed:', isChecked);

    // Toggle Filter Menu Display
    if (isChecked) {
        filterMenu_HTML.style.right = '0';
    } else {
        filterMenu_HTML.style.right = '-400px';
    }
});

// Handle Page Change
const pageNames = ['bestSellers', 'all', 'living', 'bedroom', 'kitchenDining', 'office', 'bathroom', 'outdoor']; // Corresponding to menu's html's IDs
pageNames.forEach(pageName => {
    const menuItem = document.getElementById(`menu-${pageName}`);
    const pageNameId = pageName
    if (menuItem) {
        menuItem.addEventListener('click', () => {
            console.log(`Menu item clicked: ${pageName}`);
            // Update page title
            if (pageNameId === 'bestSellers') {
                document.getElementById('page-title').textContent = 'Best Sellers';
            } else if (pageNameId === 'all') {
                document.getElementById('page-title').textContent = 'All Products';
            } else if (pageNameId === 'kitchenDining') {
                document.getElementById('page-title').textContent = 'Kitchen & Dining';
            } else {
                document.getElementById('page-title').textContent = pageNameId;
            }

            // Fetch and render products based on page
            fetchProducts(pageName).then(products => {
                rawProducts = products; // Update rawProducts for modal 
                renderProducts(products);
            });
        });
    }
})



// Initial Fetch
fetchProducts('All').then(products => {
    rawProducts = products; // Update rawProducts for modal functionality
    renderProducts(products);
});