import { createData } from "./crud.js";

const createModal = (productData) => {
	const testingData = {
		id: "9c987c3b-81dd-4ba5-951b-13823e1b7ee0",
		name: "Testing Testing Name",
		category: "kitchen",
		description:
			"This elegant oak kitchen set offers a perfect blend of style and functionality. It features spacious cabinets, a sturdy countertop, and a built-in island that enhances your cooking experience. The modern design complements any kitchen decor with its warm oak finish.",
		wood_type: "oak",
		finish: "medium",
		dimensions: {
			depth: 60,
			width: 240,
			height: 90
		},
		price: 1599.99,
		weight: 150,
		image_path:
			"https://wvxxlssoccbctxspmtyy.supabase.co/storage/v1/object/public/products/public/d848937a-84bf-4c82-902b-9372cd4ada8f.jpeg",
		stock: 1000,
		sku: "7acf5760-5a43-4a27-83a4-00e7d30c2947",
		status: "active",
		created_at: "2024-11-10T14:11:42.24849+00:00",
		updated_at: "2024-11-11T22:49:09.508134+00:00",
		featured: true,
		discount_price: 1567,
		tags: null
	};

	const productModal_HTML = document.querySelector(".product-modal");
	productModal_HTML.style.display = "flex";

	const data = productData ? productData : testingData;

	const productImage_html = document.querySelector("#modal-product-img");
	productImage_html.style.backgroundImage = `url(${data.image_path})`;
	const productModalMain_HTML = document.querySelector("#modal-product-main");

	const resultHTML = `
        <!-- main ----------------------------->
        <!-- path bar -->
         <div>
          <div class="path-bar">
            <a href="#" class="path-link">All</a>
            <p>></p>
            <a href="#" class="path-link">${data.category}</a>
          </div>
          <!-- name -->
          <h2 class="product-name">${data.name}</h2>
          <!--  details ----------------------------->
          <!-- price -->
          <div class="row">
            <p class="row-label">Price</p>
            <p>$${data.price}</p>
          </div>
          <!-- description -->
          <div class="row-can-collapse">
            <p class="row-label">Description</p>
            <input
              type="checkbox"
              name="collapse-toggle"
              id="description-toggle"
            />
            <label for="description-toggle" class="collapse-label"
              ><img src="./assets/collapse-icon.svg" alt="collapse icon"
            /></label>
            <div class="row-content">
              <p>${data.description}</p>
            </div>
          </div>
          <!-- Specification -->
          <div class="row-can-collapse">
            <p class="row-label">Specification</p>
            <input
              type="checkbox"
              name="collapse-toggle"
              id="specification-toggle"
            />
            <label for="specification-toggle" class="collapse-label">
              <img src="./assets/collapse-icon.svg" alt="collapse icon"
            /></label>
            <div class="row-content specification">
              <div class="spec-item">
                <p class="spec-key">Wood Type | Finish</p>
                <p class="spec-value">${data.wood_type} | ${data.finish} Finish</p>
              </div>
              <div class="spec-item">
                <p class="spec-key">Dimension</p>
                <p class="spec-value">D${data.dimensions.depth} x W${data.dimensions.width} x H${data.dimensions.height}</p>
              </div>
              <div class="spec-item">
                <p class="spec-key">Weight</p>
                <p class="spec-value">${data.weight}</p>
              </div>
            </div>
          </div>
          <!-- bottom ----------------------------->
          <div class="bottom-bar">
            <div class="quantity-selector">
              <button class="decrease-btn">–</button>
              <input
                type="number"
                id="quantity-input"
                class="quantity-input"
                value="1"
                min="1"
              />
              <button class="increase-btn">+</button>
            </div>
            <button class="add-to-cart-modal-btn">ADD TO CART</button>
          </div>
        </div>
      `;
	productModalMain_HTML.innerHTML = resultHTML;

	// Add event listener for "ADD TO CART" button
	const addToCartBtn = document.querySelector(".add-to-cart-modal-btn");
	const quantityInput = document.querySelector("#quantity-input");

	addToCartBtn.addEventListener("click", async () => {
		const quantity = parseInt(quantityInput.value) || 1;

		// Prepare cart product data based on the product
		const cartProductData = {
			productId: data.id,
			name: data.name,
			price: data.price,
			qty: quantity,
			img: data.image_path,
			materialAndSize: `${data.wood_type} | D${data.dimensions.depth} x W${data.dimensions.width} x H${data.dimensions.height}`,
			link: `#product/${data.id}`,
			deliveryAvailability: true,
			pickupAvailability: true,
			addedDate: new Date().toISOString(),
			editedDate: new Date().toISOString()
		};

		try {
			const result = await createData(cartProductData);
			if (result) {
				console.log("Product added to cart:", result);
				alert("Product added to cart successfully!");
				closeModal();
			}
		} catch (error) {
			console.error("Error adding product to cart:", error);
			alert("Failed to add product to cart. Please try again.");
		}
	});

	return;
};

const closeModal = () => {
	const productModal_HTML = document.querySelector(".product-modal");
	productModal_HTML.style.display = "none";
};

export { createModal, closeModal };
