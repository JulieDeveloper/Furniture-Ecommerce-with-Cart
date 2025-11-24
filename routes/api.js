// Code References:
// https://github.com/ixd-system-design/API-Endpoints-for-Publishing-and-Searching/blob/main/routes/api.js

// Express will listen for API requests and respond accordingly
import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient(); //import and initialize the Prisma client

const model = "cartProduct"; // match with Prisma schema model name

// ----- basic findMany() -------
// This endpoint uses the Prisma schema defined in /prisma/schema.prisma
// This gives us a cleaner data structure to work with.
router.get("/cartProduct", async (req, res) => {
	try {
		// fetch first 10 records from the database with no filter
		const result = await prisma[model].findMany({
			take: 10
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
