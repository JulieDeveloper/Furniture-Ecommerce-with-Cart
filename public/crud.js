// Code References:https://github.com/ixd-system-design/todo-mongo-prisma/blob/main/public/script.js

// CREATE: Add a product to the shopping cart
// productData should contain all required fields from the cartProduct schema
const createProduct = async (productData) => {
	return fetch("/cartProduct", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			addedDate: productData.addedDate || new Date().toISOString(),
			deliveryAvailability: productData.deliveryAvailability || false,
			editedDate: productData.editedDate || new Date().toISOString(),
			img: productData.img || "",
			link: productData.link || "",
			materialAndSize: productData.materialAndSize || "",
			name: productData.name || "",
			pickupAvailability: productData.pickupAvailability || false,
			price: productData.price || 0,
			productId: productData.productId || "",
			qty: productData.qty || 1
		})
	})
		.then((response) => {
			if (!response.ok) throw new Error("Failed to create cart product");
			return response.json();
		})
		.catch((err) => console.log(err));
};

// READ: Retrieve all products from the shopping cart
const readProduct = async () => {
	return fetch("/cartProducts", { method: "GET" })
		.then(async (response) => {
			if (!response.ok) {
				console.error("Failed to fetch cart products - status:", response.status);
				return [];
			}
			console.log("Fetch cart products response:", response);
			return response.json();
		})
		.catch((err) => {
			console.error("Error fetching cart products:", err);
			return [];
		});
};

// UPDATE: Update an existing product in the shopping cart
const updateProduct = async (productId, newQty) => {
	try {
		console.log(
			`Updating product ID ${productId} with new quantity: ${newQty}`
		);
		const response = await fetch(`/cartProduct/${productId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				qty: Number(newQty),
				editedDate: new Date()
			})
		});

		if (!response.ok) {
			throw new Error("Failed to update cart product");
		}
		return await response.json();
	} catch (err) {
		console.error(err);
	}
};

// DELETE: Remove a product from the shopping cart
const deleteProduct = async (productId) => {
	return fetch(`/cartProduct/${productId}`, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" }
	})
		.then((response) => {
			if (!response.ok) throw new Error("Failed to delete cart product");
			return response.json();
		})
		.catch((err) => console.log(err));
};

// Read: Retrieve promo code details
const readPromoCode = async (enteredCode) => {
	// console.log("1. Starting readPromoCode with code:", enteredCode);
	// console.log(
	// 	"1a. Code type:",
	// 	typeof enteredCode,
	// 	"Length:",
	// 	enteredCode.length
	// );

	try {
		const url = `/promoCode/${enteredCode}`;
		// console.log("2. About to fetch:", url);

		const response = await fetch(url);

		// console.log("3. Fetch promo code response:", response);
		// console.log("4. Response status:", response.status, "OK:", response.ok);

		if (!response.ok) {
			// console.log("5. Invalid promo code response");
			return null;
		}

		// console.log("6. About to parse JSON");
		const data = await response.json();
		// console.log("7. Fetch promo code result:", data);

		// Check if API returned false for invalid code
		if (data === false) {
			// console.log("8. Promo code not found");
			return null;
		}

		// console.log("9. Returning valid promo data");
		return data;
	} catch (err) {
		// console.error("10. Network error:", err);
		// console.error("10a. Error details:", err.message, err.stack);
		return null;
	}
};

export {
	createProduct,
	readProduct,
	updateProduct,
	deleteProduct,
	readPromoCode
};
