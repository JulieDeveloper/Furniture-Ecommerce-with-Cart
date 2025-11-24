// Code References:
// https://github.com/ixd-system-design/API-Endpoints-for-Publishing-and-Searching/blob/main/routes/api.js

// Express will listen for API requests and respond accordingly
import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient(); //import and initialize the Prisma client

const model = "cartProduct"; // match with Prisma schema model name

// CREATE: add a product into cart
router.post("/cartProduct", async (req, res) => {
	try {
		console.log(req.body);
		const cartList = await prisma[model].create({
			data: req.body
		});
		res.send(cartList);
	} catch (err) {
		res.status(500).send(err);
	}
});

// READ: Get product list in cart
router.get("/cartProducts", async (req, res) => {
	try {
		// fetch first 10 records from the database with no filter
		const result = await prisma[model].findMany();
		res.send(result);
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
});

// Update: edit particular product in the cart
router.put("/cartProduct/:id", async (req, res) => {
	try {
		// fetch first 10 records from the database with no filter
		const result = await prisma[model].update({
			where: { id: parseInt(req.params.id) },
			data: req.body
		});
		res.send(result);
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
});

// DELETE: remove particular product from cart
router.delete("/cartProduct/:id", async (req, res) => {
	try {
		const result = await prisma[model].delete({
			where: { id: parseInt(req.params.id) }
		});
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
		const results = await prisma[model].findRaw({ options });
		res.send(results);
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
});

// export the api routes for use elsewhere in our app
// (e.g. in index.js )
export default router;
