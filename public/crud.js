// Code References:https://github.com/ixd-system-design/todo-mongo-prisma/blob/main/public/script.js

let currentUser = {
	isAuthenticated: false,
	sub: null,
	cart: []
};

// Load user info from backend
const loadUser = async () => {
	try {
		const res = await fetch("/api/user");
		if (!res.ok) {
			throw new Error("Failed to load user");
		}
		const data = await res.json();
		currentUser = {
			isAuthenticated: !!data.isAuthenticated,
			sub: data.sub || null,
			cart: data.cart || []
		};
	} catch (err) {
		console.error("Error loading user:", err);
	}
};

// CREATE: Add a product to the user's cart
const createProduct = async (productData) => {
	try {
		const response = await fetch("/api/userCart", {
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
		});

		if (!response.ok) throw new Error("Failed to add product to cart");
		return await response.json();
	} catch (err) {
		console.error(err);
		return null;
	}
};

// READ: Retrieve all products from the user's cart
const readProduct = async () => {
	try {
		const response = await fetch("/api/userCart", { method: "GET" });

		if (!response.ok) {
			console.error("Failed to fetch cart - status:", response.status);
			return [];
		}

		const data = await response.json();
		console.log("Fetch user cart response:", data.cart);
		return data.cart || [];
	} catch (err) {
		console.error("Error fetching cart:", err);
		return [];
	}
};

// UPDATE: Update a product's quantity in the user's cart
const updateProduct = async (productId, newQty) => {
	try {
		console.log(
			`Updating product ID ${productId} with new quantity: ${newQty}`
		);

		const response = await fetch(`/api/userCart/${productId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				qty: Number(newQty),
				editedDate: new Date().toISOString()
			})
		});

		if (!response.ok) throw new Error("Failed to update cart product");
		return await response.json();
	} catch (err) {
		console.error(err);
		return null;
	}
};

// DELETE: Remove a product from the user's cart
const deleteProduct = async (productId) => {
	try {
		const response = await fetch(`/api/userCart/${productId}`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" }
		});

		if (!response.ok) throw new Error("Failed to delete cart product");
		return await response.json();
	} catch (err) {
		console.error(err);
		return null;
	}
};

// Read: Retrieve promo code details
const readPromoCode = async (enteredCode) => {
	try {
		const url = `/promoCode/${enteredCode}`;
		const response = await fetch(url);

		if (!response.ok) return null;

		const data = await response.json();
		if (data === false) return null;

		return data;
	} catch (err) {
		console.error("Error fetching promo code:", err);
		return null;
	}
};

export {
	loadUser,
	currentUser,
	createProduct,
	readProduct,
	updateProduct,
	deleteProduct,
	readPromoCode
};
