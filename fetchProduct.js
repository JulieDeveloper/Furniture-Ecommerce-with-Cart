const BASE_URL = 'https://furniture-api.fly.dev/v1/products';

const categoryMap = {
    living: ['sofa', 'chair', 'stool', 'tv table', 'lamp'],
    bedroom: ['matress', 'wardrove', 'mirror', 'lamp'],
    kitchenDining: ['kitchen', 'table', 'chair'],
    office: ['desk', 'chair'],
    bathroom: ['vanitory', 'mirror'],
    outdoor: ['garden'],
};

async function fetchProducts(pageName) {
    let productsList = [];

    try {
        // Best Seller Page
        if (pageName === 'bestSellers') {
            const res = await fetch(`${BASE_URL}?featured=true&limit=100`);
            const data = await res.json();
            productsList = data.data;
            return productsList;
        }

        // All products Page
        if (pageName === 'all') {
            const res = await fetch(`${BASE_URL}?limit=100`);
            const data = await res.json();
            productsList = data.data;
            return productsList;
        }

        // Category-specific Pages
        const categories = categoryMap[pageName];
        if (!categories) {
            console.error(`Invalid page name: ${pageName}`);
            return;
        }

        console.log('Fetching categories for page:', pageName, categories);

        // Sequentially fetch each category and add to list
        for (const category of categories) {
            const res = await fetch(`${BASE_URL}?limit=100&category=${category}`);
            const data = await res.json();
            const result = data.data;
            productsList.push(...result); // Add each category’s products into the main list
        }

        return productsList;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

export { fetchProducts };