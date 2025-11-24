const sortbyNewArrival = (products) => {
    return products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

const sortbyPriceAsc = (products) => {
    return products.sort((a, b) => a.price - b.price);
}

const sortbyPriceDesc = (products) => {
    return products.sort((a, b) => b.price - a.price);
}

const sortbyNameAsc = (products) => {
    return products.sort((a, b) => a.name.localeCompare(b.name));
}

const sortbyNameDesc = (products) => {
    return products.sort((a, b) => b.name.localeCompare(a.name));
}



async function sortProducts(sortingOptions) {
    console.log('Sorting options:', sortingOptions);
    const { pageName, products, sortedBy } = sortingOptions;
    let productsList = [...products];
    // sorting for 'all' page
    if (pageName === 'all') {
        const Base_URL = 'https://furniture-api.fly.dev/v1/products?limit=100';
        let fetchURL = Base_URL;
        switch (sortedBy) {
            case 'new_arrival':
                fetchURL += '&sort=newest';
                console.log('fetchURL for new-arrival:', fetchURL);
                break;
            case 'price_asc':
                fetchURL += '&sort=price_asc';
                console.log('fetchURL for price-asc:', fetchURL);
                break;
            case 'price_desc':
                fetchURL += '&sort=price_desc';
                console.log('fetchURL for price-desc:', fetchURL);
                break;
            case 'name_asc':
                fetchURL += '&sort=name_asc';
                console.log('fetchURL for name-asc:', fetchURL);
                break;
            case 'name_desc':
                fetchURL += '&sort=name_desc';
                console.log('fetchURL for name-desc:', fetchURL);
                break;
        }
        try {
            const response = await fetch(fetchURL);
            const res = await response.json();
            productsList = res.data;
            console.log('Sorted productsList:', productsList);
        } catch (err) {
            console.error('Fetch error:', err);
        }

        return productsList;
    } else {
        // sorting for category-specific pages
        switch (sortedBy) {
            case 'new_arrival':
                return sortbyNewArrival(productsList);
            case 'price_asc':
                return sortbyPriceAsc(productsList);
            case 'price_desc':
                return sortbyPriceDesc(productsList);
            case 'name_asc':
                return sortbyNameAsc(productsList);
            case 'name_desc':
                return sortbyNameDesc(productsList);
            default:
                return sortbyNewArrival(productsList);
        }
    }



}
export { sortProducts };