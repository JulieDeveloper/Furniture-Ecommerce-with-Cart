// Code References:https://github.com/ixd-system-design/todo-mongo-prisma/blob/main/public/script.js

// CREATE: Add a product to the shopping cart
// productData should contain all required fields from the cartProduct schema
const createData = async (productData) => {
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
const readData = async () => {
	return fetch("/cartProducts", { method: "GET" })
		.then(async (response) => {
			if (!response.ok) {
				// turn on an error notice in case of any server error
				document.querySelector("#notices").style.display = "block";
				return [];
			}
			return response.json();
		})
		.catch((err) => {
			console.log(err);
			document.querySelector("#notices").style.display = "block";
			return [];
		});
};

// UPDATE: Update an existing product in the shopping cart
// productData should contain the fields to update from the cartProduct schema
const updateData = async (productId, productData) => {
	return fetch("/cartProduct/" + productId, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			...(productData.deliveryAvailability !== undefined && {
				deliveryAvailability: productData.deliveryAvailability
			}),
			editedDate: new Date().toISOString(),
			...(productData.img && { img: productData.img }),
			...(productData.link && { link: productData.link }),
			...(productData.materialAndSize && {
				materialAndSize: productData.materialAndSize
			}),
			...(productData.name && { name: productData.name }),
			...(productData.pickupAvailability !== undefined && {
				pickupAvailability: productData.pickupAvailability
			}),
			...(productData.price !== undefined && { price: productData.price }),
			...(productData.productId && { productId: productData.productId }),
			...(productData.qty !== undefined && { qty: productData.qty })
		})
	})
		.then((response) => {
			if (!response.ok) throw new Error("Failed to update cart product");
			return response.json();
		})
		.catch((err) => console.log(err));
};

// DELETE: Remove a product from the shopping cart
const deleteData = async (productId) => {
	return fetch("/cartProduct/" + productId, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" }
	})
		.then((response) => {
			if (!response.ok) throw new Error("Failed to delete cart product");
			return response.json();
		})
		.catch((err) => console.log(err));
};

export { createData, readData, updateData, deleteData };
