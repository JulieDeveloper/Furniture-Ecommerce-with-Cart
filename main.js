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
    })

    // handle error:
    .catch(err => console.error(err));