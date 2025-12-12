// Code References: https://github.com/ixd-system-design/API-Endpoints-for-Publishing-and-Searching/blob/main/server.js

// Express is a framework for building APIs and web apps
// See also: https://expressjs.com/
import express from "express";
// Initialize Express app
const app = express();

// import path module to help with file paths
import path from "path";

// Serve static files from /public folder (useful when running Node locally, optional on Vercel).
app.use(express.static("public"));

// On Vercel, point the root url (/) to index.html explicitly
if (process.env.VERCEL) {
	app.get("/", (req, res) => {
		res.sendFile(path.join(process.cwd(), "public", "index.html"));
	});
}

// Define index.html as the root explicitly (useful on Vercel, optional when running Node locally).
app.get("/", (req, res) => {
	res.redirect("/index.html");
});

// Enable express to parse JSON data
app.use(express.json());

// Import the OpenID Connect Library (maintained by Auth0)
// See also: https://github.com/auth0/express-openid-connect
import auth0 from "express-openid-connect";
const { auth, requiresAuth } = auth0;

// Auth0 Configuration
// Make sure add the following environment variables are set:
// SECRET, BASE_URL, CLIENT_ID, ISSUER_BASE_URL
const config = {
	authRequired: false,
	auth0Logout: true,
	secret: process.env.SECRET,
	baseURL: process.env.BASE_URL,
	clientID: process.env.CLIENT_ID,
	issuerBaseURL: process.env.ISSUER_BASE_URL
};

// Show an error if any environment variables are missing
if (Object.keys(config).some((key) => config[key] == null)) {
	console.error("Error: Auth0 environment variable(s) are missing.");
	process.exit(1);
}

// Enable auth in our Express app.
// This will automatically setup /login, /logout, /callback endpoints
app.use(auth(config));

// NOTE: OpenIdConnect attaches user data to all incoming requests
// We can find this data at "req.oidc"

// REMOVED: /api/user endpoint - now in routes/api.js

// the private vault page
app.get("/vault", requiresAuth(), (req, res) => {
	res.sendFile(path.join(process.cwd(), "private", "vault.html"));
});

app.get("/api/secrets", async (req, res) => {
	try {
		// If the user is logged in, send secret data
		if (req.oidc?.isAuthenticated()) {
			res.send([
				{
					name: "Cookie Recipe",
					url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
				},
				{
					name: "Secret Sauce",
					url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
				},
				{
					name: "Inside Information",
					url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
				}
			]);
		}
		// If the user is not logged in,
		// return an error message
		else {
			return res.status(401).json({ error: "Authentication required" });
		}
	} catch {
		res.status(500).json({ error: "Failed to send data" });
	}
});

// Our API is defined in a separate module to keep things tidy.
// Let's import our API endpoints and activate them.
import apiRoutes from "./routes/api.js";
app.use("/", apiRoutes);

const port = 3000;
app.listen(port, () => {
	console.log(`Express is live at http://localhost:${port}`);
});
