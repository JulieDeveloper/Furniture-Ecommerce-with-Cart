// Code References:
// https://github.com/ixd-system-design/API-Endpoints-for-Publishing-and-Searching/blob/main/routes/api.js

// Express will listen for API requests and respond accordingly
import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient(); //import and initialize the Prisma client

const model_CartProduct = "cartProduct"; // match with Prisma schema model name
const model_promoCode = "promoCode"; // match with Prisma schema model name

// --------------------------------------------------------------------------------------------------------------
// Cart Product API Endpoints -----------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------

// CREATE: add a product into cart
router.post("/cartProduct", async (req, res) => {
	try {
		console.log(req.body);
		const cartList = await prisma[model_CartProduct].create({
			data: req.body
		});
		res.send(cartList);
		// console.log("Api.js ––– Created cart product:", cartList);
	} catch (err) {
		res.status(500).send(err);
	}
});

// READ: Get product list in cart
router.get("/cartProducts", async (req, res) => {
	try {
		// fetch first 10 records from the database with no filter
		const result = await prisma[model_CartProduct].findMany();
		res.send(result);
		// console.log("Api.js ––– Fetched cart products:", result);
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
});

// Update: edit particular product in the cart
router.put("/cartProduct/:id", async (req, res) => {
	try {
		// console.log("Api.js ––– Update request - ID:", req.params.id);
		// console.log("Api.js ––– Update request - Body:", req.body);

		const result = await prisma[model_CartProduct].update({
			where: { id: req.params.id },
			data: req.body
		});
		res.send(result);
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
});

// DELETE: remove a product from the cart
router.delete("/cartProduct/:id", async (req, res) => {
	try {
		const result = await prisma[model_CartProduct].delete({
			where: { id: req.params.id }
		});
		// console.log("Api.js ––– Delete - ID:", req.params.id);

		res.send(result);
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
});

// --------------------------------------------------------------------------------------------------------------
// promoCode API Endpoints -----------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------

// READ one promo code by code
router.get("/promoCode/:code", async (req, res) => {
	try {
		console.log("Api.js ––– read promo code:", req.params.code);
		console.log("Api.js ––– read promo req:", req.body);

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

// export the api routes for use elsewhere in our app
// (e.g. in index.js )
export default router;
