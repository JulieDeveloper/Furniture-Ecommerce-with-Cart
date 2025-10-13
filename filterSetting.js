// const filterSettings = {
//     categories: {
//         living: { soft: false, chair: false, tvTable: false, lamp: false },
//         bedroom: { mattress: false, wardrobe: false, mirror: false, lamp: false },
//         kitchenDining: { kitchen: false, table: false, chair: false },
//         office: { desk: false, chair: false },
//         bathroom: { vanity: false, mirror: false },
//         outdoor: { garden: false },

//     },

//     woodTypes: {
//         walnut: false,
//         maple: false,
//         oak: false,
//         pine: false,
//         eucalyptus: false,
//         bamboo: false,
//         teak: false,
//         cedar: false,
//     },
//     finishes: {
//         matte: false,
//         glossy: false,
//         stained: false,
//         painted: false,
//     },
// };


let productsList = [];

// Fetch products by SINGLE category
async function fetchByCategory(category) {
    const API_URL = 'https://furniture-api.fly.dev/v1/products';
    const endpoint_LIMIT = 100;
    const response = await fetch(`${API_URL}?limit=${endpoint_LIMIT}&category=${category}`);
    const data = await response.json();
    productsList = data.data;
    return productsList;
}

// Fetch multiple categories one by one
async function fetchProductsByCategories(categories) {
    let allProducts = [];

    for (const category of categories) {
        const products = await fetchByCategory(category);
        allProducts = allProducts.concat(products);
    }

    return allProducts;
}

// Filter + Sort
function filterAndSort(products, filters, sortOption) {
    let result = [...products];

    // Filter by wood type
    if (filters.woodTypes.length > 0) {
        result = result.filter(item => filters.woodTypes.includes(item.wood_type));
    }

    // Filter by finish
    if (filters.finishes.length > 0) {
        result = result.filter(item => filters.finishes.includes(item.finish));
    }

    // Sorting
    if (sortOption) {
        switch (sortOption) {
            case 'price_asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'name_asc':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name_desc':
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'newest':
                result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case 'oldest':
                result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                break;
        }
    }

    return result;
}

// Main function to get products
async function getFilteredProducts(selectedCategories, filters, sortOption) {
    const allProducts = await fetchProductsByCategories(selectedCategories);
    const finalProducts = filterAndSort(allProducts, filters, sortOption);
    return finalProducts;
}
