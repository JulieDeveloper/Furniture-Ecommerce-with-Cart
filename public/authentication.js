const checkAuth = async () => {
	const response = await fetch("/api/user");
	const data = await response.json();
	console.log("Authentication data:", data);
	return data.isAuthenticated; //return true/false
};

const renderAuthBtn = async () => {
	const authBtn_HTML = document.getElementById("login-out-button");
	const isAuthenticated = await checkAuth();
	const authButton = isAuthenticated
		? '<a class="button" href="/logout">Logout</a>'
		: "";
	authBtn_HTML.innerHTML = authButton;
};

const renderProfile = async () => {
	const profile_HTML = document.getElementById("user-profile");
	const response = await fetch("/api/user");
	const data = await response.json();
	console.log("Profile data:", data);

	const displayName = data.given_name
		? `Hi! ${data.given_name}`
		: `<a class="button" href="/login">Login/SignUp</a>`;
	const profilePicture = data.picture || "./assets/user.svg";
	console.log("displayName:", displayName);
	console.log("profilePicture:", profilePicture);

	profile_HTML.innerHTML = `
    <a class="button" href="/vault">
        <img class="avatar" src="${profilePicture}" alt="Profile" onerror="this.onerror=null;this.src='/assets/user.svg';" />
        <p>${displayName}</p>
    </a>
    `;
};

const authentication = async () => {
	const isLandingPage = document.getElementById("landing") ? true : false;
	const isVaultPage = document.getElementById("vault") ? true : false;

	const profile = document.getElementById("user-profile");
	const content = document.getElementById("content");
	const logo = document.getElementById("logo");

	const response = await fetch("/api/user");
	const data = await response.json();
	console.log("Authentication data:", data);

	const isAuthenticated = data.isAuthenticated;
	const displayName = data.name;
	const profilePicture = data.picture;

	// if (isLandingPage) {
	// content.innerHTML = isAuthenticated
	// 	? `<span class="secret-sauce">
	//                 Your <a href="/vault">secret sauce</a> is ready.
	//            </span>`
	// 	: `<span class="secret-sauce">
	//                 Have you tried our <a href="/vault">secret sauce</a>?
	//            </span>`;

	// }

	if (isAuthenticated) {
		// the vault endpoint only works for logged in users
		// see also, the /api/secrets endpoint in ./server.js
		try {
			console.log("Rendering profile section for authenticated user.");
			profile.innerHTML = `
	<a class="button" href="/vault">
        <img src="${profilePicture}" onerror="this.onerror=null;this.src='user.svg';">
        <div>
            <h4>${displayName}</h4>
        </div>
  </a>
    `;
			// const response = await fetch("/api/secrets");
			// const data = await response.json();
			// const vaultHTML = `<span class="secret-sauce">
			//       Here you go.
			//       </span>
			//       <ul class="items">
			//           ${data
			// 						.map(
			// 							(item) =>
			// 								`<li>
			//               <a class="sauce" target="_blank" href="${item.url}">
			//                   <span>${item.name}</span>
			//               </a>
			//           </li>`
			// 						)
			// 						.join("")}
			//       </ul>`;

			// content.innerHTML = DOMPurify.sanitize(vaultHTML);
			console.log("render cart data here!!!!");
		} catch (e) {
			console.log(e);
		}
	}

	if (logo) {
		logo.addEventListener("click", () => {
			window.location.href = "/";
		});
	}
};

export { checkAuth, authentication, renderAuthBtn, renderProfile };
