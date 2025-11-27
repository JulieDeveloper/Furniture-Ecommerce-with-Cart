import { readPromoCode } from "./crud.js";

const verifyPromoCode = async (code) => {
	const promoResponse = document.getElementById("promo-apply-response");
	console.log("Verifying promo code:", code);
	const data = await readPromoCode(code);
	console.log("Promo code data:", data);

	if (data && data.active) {
		// console.log("Valid promo code found:", data);
		promoResponse.innerHTML = `Promo code applied!<br>${data.description}`;
		return data;
	} else {
		// console.log("Invalid or not found promo code");
		promoResponse.innerHTML = `Invalid promo code. Please try again.`;
		return null;
	}
};

export { verifyPromoCode };
