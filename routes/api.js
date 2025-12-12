// Code References:
// https://github.com/ixd-system-design/API-Endpoints-for-Publishing-and-Searching/blob/main/routes/api.js

// Express will listen for API requests and respond accordingly
import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient(); //import and initialize the Prisma client

const model_CartProduct = "cartProduct"; // match with Prisma schema model name
const model_promoCode = "promoCode"; // match with Prisma schema model name
const model_user = "promoCode"; // match with Prisma schema model name

// User lifecycle helper
async function ensureUser(oidcUser) {
	if (!oidcUser || !oidcUser.sub) {
		throw new Error("Cannot ensure user without a valid Auth0 sub");
	}
	const { sub, email, name, given_name, family_name, picture } = oidcUser;

	const user = await prisma.user.upsert({
		where: { sub },
		update: {
			email: email || "",
			givenName: given_name || "",
			lastName: family_name || "",
			picture: picture || ""
		},
		create: {
			sub,
			email: email || "",
			givenName: given_name || "",
			lastName: family_name || "",
			picture: picture || "",
			createdAt: new Date()
		}
	});
	return user;
}

// --------------------------------------------------------------------------------------------------------------
// Cart Product API Endpoints -----------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------

// // CREATE: add a product into cart
// router.post("/cartProduct", async (req, res) => {
// 	try {
// 		// console.log(req.body);
// 		const cartList = await prisma[model_CartProduct].create({
// 			data: req.body
// 		});
// 		res.send(cartList);
// 		// console.log("Api.js ––– Created cart product:", cartList);
// 	} catch (err) {
// 		res.status(500).send(err);
// 	}
// });

// // READ: Get product list in cart
// router.get("/cartProducts", async (req, res) => {
// 	try {
// 		// fetch first 10 records from the database with no filter
// 		const result = await prisma[model_CartProduct].findMany();
// 		res.send(result);
// 		// console.log("Api.js ––– Fetched cart products:", result);
// 	} catch (err) {
// 		console.log(err);
// 		res.status(500).send(err);
// 	}
// });

// // Update: edit particular product in the cart
// router.put("/cartProduct/:id", async (req, res) => {
// 	try {
// 		// console.log("Api.js ––– Update request - ID:", req.params.id);
// 		// console.log("Api.js ––– Update request - Body:", req.body);

// 		const result = await prisma[model_CartProduct].update({
// 			where: { id: req.params.id },
// 			data: req.body
// 		});
// 		res.send(result);
// 	} catch (err) {
// 		console.log(err);
// 		res.status(500).send(err);
// 	}
// });

// // DELETE: remove a product from the cart
// router.delete("/cartProduct/:id", async (req, res) => {
// 	try {
// 		const result = await prisma[model_CartProduct].delete({
// 			where: { id: req.params.id }
// 		});
// 		// console.log("Api.js ––– Delete - ID:", req.params.id);

// 		res.send(result);
// 	} catch (err) {
// 		console.log(err);
// 		res.status(500).send(err);
// 	}
// });

// --------------------------------------------------------------------------------------------------------------
// promoCode API Endpoints -----------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------

// READ one promo code by code
router.get("/promoCode/:code", async (req, res) => {
	try {
		// console.log("Api.js ––– read promo code:", req.params.code);
		// console.log("Api.js ––– read promo req:", req.body);

		const result = await prisma[model_promoCode].findFirst({
			where: { promoCode: req.params.code }
		});
		console.log("result:", result);
		if (!result) {
			console.log("*** Promo code not found:", req.params.code);

			return res.json(false);
		}

		res.send(result);
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
});

// --------------------------------------------------------------------------------------------------------------
// USER (GET) -----------------------------------------------------------------------------------
// Publish user data and auth state to the frontend
// --------------------------------------------------------------------------------------------------------------

router.get("/api/user", async (req, res) => {
	try {
		if (req.oidc?.isAuthenticated()) {
			const user = await ensureUser(req.oidc.user);
			res.send({
				...req.oidc.user,
				id: user.id,
				isAuthenticated: true
			});
		} else {
			res.send({
				name: "Guest",
				isAuthenticated: false
			});
		}
	} catch (err) {
		console.error("GET /api/user error:", err);
		res
			.status(500)
			.send({ error: "Failed to fetch user", details: err.message || err });
	}
});

// ----- findRaw() -------
// Returning Raw records from MongoDB
// This endpoint does not use any schema.
// This is can be useful for testing and debugging.
router.get("/raw", async (req, res) => {
	try {
		// raw queries use native MongoDB query syntax
		// e.g. "limit" instead of "take"
		const options = { limit: 10 };
		const results = await prisma[model_CartProduct].findRaw({ options });
		res.send(results);
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
});

// --------------------------------------------------------------------------------------------------------------
// User Cart API Endpoints
// --------------------------------------------------------------------------------------------------------------

// READ: Get user's cart
router.get("/api/userCart", async (req, res) => {
	// Changed from /userCart:userId
	try {
		if (!req.oidc?.isAuthenticated()) {
			return res.status(401).json({ error: "Not authenticated" });
		}

		const user = await prisma.user.findUnique({
			where: { sub: req.oidc.user.sub }
		});

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.json({ cart: user.cart || [] });
	} catch (err) {
		console.error("GET /api/userCart error:", err);
		res.status(500).json({ error: "Failed to fetch cart" });
	}
});

// CREATE: Add product to user's cart
router.post("/api/userCart", async (req, res) => {
	try {
		if (!req.oidc?.isAuthenticated()) {
			return res.status(401).json({ error: "Not authenticated" });
		}

		const newCartItem = {
			id: req.body.productId, // Use the product ID from the request
			addedDate: new Date(req.body.addedDate || new Date()),
			deliveryAvailability: req.body.deliveryAvailability || false,
			editedDate: new Date(req.body.editedDate || new Date()),
			img: req.body.img || "",
			link: req.body.link || "",
			materialAndSize: req.body.materialAndSize || "",
			name: req.body.name || "",
			pickupAvailability: req.body.pickupAvailability || false,
			price: req.body.price || 0,
			productId: req.body.productId || "",
			qty: req.body.qty || 1
		};

		const user = await prisma.user.update({
			where: { sub: req.oidc.user.sub }, // Fixed: was req.oidc.user.cart
			data: {
				cart: {
					push: newCartItem
				}
			}
		});

		res.json({ cart: user.cart });
	} catch (err) {
		console.error("POST /api/userCart error:", err);
		res
			.status(500)
			.json({ error: "Failed to add to cart", details: err.message });
	}
});

// UPDATE: Update product quantity in user's cart
router.put("/api/userCart/:productId", async (req, res) => {
	// Changed from /userCart:userId/:productId
	try {
		if (!req.oidc?.isAuthenticated()) {
			return res.status(401).json({ error: "Not authenticated" });
		}

		const { productId } = req.params;
		const { qty, editedDate } = req.body;

		const user = await prisma.user.findUnique({
			where: { sub: req.oidc.user.sub }
		});

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const updatedCart = (user.cart || []).map((item) => {
			if (item.id === productId || item.productId === productId) {
				return {
					...item,
					qty: Number(qty),
					editedDate: new Date(editedDate || new Date())
				};
			}
			return item;
		});

		const updatedUser = await prisma.user.update({
			where: { sub: req.oidc.user.sub },
			data: { cart: updatedCart }
		});

		res.json({ cart: updatedUser.cart });
	} catch (err) {
		console.error("PUT /api/userCart error:", err);
		res
			.status(500)
			.json({ error: "Failed to update cart", details: err.message });
	}
});

// DELETE: Remove product from user's cart
router.delete("/api/userCart/:productId", async (req, res) => {
	// Changed from /userCart:userId/:productId
	try {
		if (!req.oidc?.isAuthenticated()) {
			return res.status(401).json({ error: "Not authenticated" });
		}

		const { productId } = req.params;

		const user = await prisma.user.findUnique({
			where: { sub: req.oidc.user.sub }
		});

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const updatedCart = (user.cart || []).filter(
			(item) => item.id !== productId && item.productId !== productId
		);

		const updatedUser = await prisma.user.update({
			where: { sub: req.oidc.user.sub },
			data: { cart: updatedCart }
		});

		res.json({ cart: updatedUser.cart });
	} catch (err) {
		console.error("DELETE /api/userCart error:", err);
		res
			.status(500)
			.json({ error: "Failed to delete from cart", details: err.message });
	}
});

// export the api routes for use elsewhere in our app
// (e.g. in index.js )
export default router;
