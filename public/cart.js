import { readProduct, updateProduct, deleteProduct } from "./crud.js";
import { verifyPromoCode } from "./promo.js";

let cartProducts = {};
const cartList_HTML = document.getElementById("cart-products-list");
let subtotalAmount = 0;
let taxAmount = 0;
let totalBeforeTax = 0;
let totalAfterTax = 0;
let deliveryFee = 120;
let subtotalAfterDiscount = 0;
let promoDiscount = 0;
let promoDiscountRate = 0;

const displayAmounts = () => {
	const itemsSubtotal_HTML = document.getElementById("itemSubtotal_HTML");
	const subtotal_HTML = document.getElementById("subtotal-value_HTML");
	const discount_HTML = document.getElementById("discount_HTML");
	const deliveryOption_HTML = document.getElementById("shipping-label_HTML");
	const deliveryFee_HTML = document.getElementById("delivery-fee_HTML");
	const totalBeforeTax_HTML = document.getElementById("total-before-tax_HTML");
	const tax_HTML = document.getElementById("tax-value_HTML");
	const totalAfterTax_HTML = document.getElementById("total-after-tax_HTML");

	// Subtotal
	itemsSubtotal_HTML.innerText = `$${subtotalAmount.toFixed(2)}`;
	subtotal_HTML.innerText = `$${subtotalAmount.toFixed(2)}`;

	// Delivery Fee
	console.log("Delivery Fee:", deliveryFee);
	if (deliveryFee === 120 && subtotalAmount > 0) {
		deliveryFee_HTML.innerText = `+ $${deliveryFee.toFixed(2)}`;
	} else if (subtotalAmount < 1) {
		deliveryFee_HTML.innerText = `–`;
	} else {
		deliveryFee_HTML.innerText = `Free`;
	}

	// Promo Discount
	if (promoDiscount) {
		discount_HTML.innerText = `– $${promoDiscount.toFixed(2)}`;
	} else {
		discount_HTML.innerText = "–";
	}

	// Before Tax Totals
	if (subtotalAmount < 1) {
		totalBeforeTax_HTML.innerText = `–`;
	} else {
		totalBeforeTax_HTML.innerText = `$${totalBeforeTax.toFixed(2)}`;
	}

	// Tax
	if (subtotalAmount < 1) {
		tax_HTML.innerText = `–`;
	} else {
		tax_HTML.innerText = `$${taxAmount.toFixed(2)}`;
	}

	// After Tax Totals
	if (subtotalAmount < 1) {
		totalAfterTax_HTML.innerText = `–`;
	} else {
		totalAfterTax_HTML.innerText = `$${totalAfterTax.toFixed(2)}`;
	}
};

// Calculate promoDiscount
const calculatePromoDiscount = () => {
	if (promoDiscountRate) {
		promoDiscount = subtotalAmount * (1 - promoDiscountRate);
	} else {
		promoDiscount = 0;
	}

	return promoDiscount;
};

const calculateTotals = () => {
	// Promo Discount
	calculatePromoDiscount();
	subtotalAfterDiscount = subtotalAmount + promoDiscount;
	discount_HTML.innerText = `– $${promoDiscount.toFixed(2)}`;
	console.log("Subtotal after discount:", subtotalAfterDiscount);

	// Before Tax Totals
	totalBeforeTax = subtotalAfterDiscount + deliveryFee;
	console.log("Total before tax:", totalBeforeTax);

	// Tax
	taxAmount = totalBeforeTax * 0.13;

	// After Tax Totals
	totalAfterTax = totalBeforeTax + taxAmount;

	displayAmounts();
};

// Attach event listeners to buttons
const attachEventListeners = () => {
	// Decrease cart Quantity
	const decreaseQtyButtons = document.querySelectorAll(".decrease-qty-btn");
	decreaseQtyButtons.forEach((button) => {
		button.addEventListener("click", async (e) => {
			const productId = e.target.dataset.id;
			const productQty = e.target.dataset.qty;
			console.log(`click "–"`);

			const newQty = Number(productQty) > 1 ? Number(productQty) - 1 : 1;
			await updateProduct(productId, newQty);

			renderCartProduct(await readProduct());
		});
	});

	// Increase cart Quantity
	const increaseQtyButtons = document.querySelectorAll(".increase-qty-btn");
	increaseQtyButtons.forEach((button) => {
		button.addEventListener("click", async (e) => {
			const productId = e.target.dataset.id;
			const productQty = e.target.dataset.qty;
			console.log(`click "+"`);

			const newQty = Number(productQty) + 1;
			await updateProduct(productId, newQty);
			calculateTotals();
			renderCartProduct(await readProduct());
		});
	});

	// Remove product from cart
	const removeButtons = document.querySelectorAll(".remove-btn");
	removeButtons.forEach((button) => {
		button.addEventListener("click", async (e) => {
			const productId = e.target.dataset.id;
			console.log(`click "Remove"`);
			console.log(`remove dataset id: ${productId}`);

			await deleteProduct(productId);
			calculateTotals();
			renderCartProduct(await readProduct());
		});
	});

	// Apply Promo Code
	const promoApplyBtn = document.getElementById("apply-promo-btn");
	promoApplyBtn.addEventListener("click", async () => {
		const promoCodeInput = document.getElementById("promo-code-input").value;
		const verifyResult = await verifyPromoCode(promoCodeInput);
		console.log("Promo code verify result:", verifyResult);

		// Apply discount if valid
		if (verifyResult) {
			promoDiscountRate = verifyResult.discount;
			calculatePromoDiscount();
			subtotalAfterDiscount = subtotalAmount - promoDiscount || 0;
			console.log("Applied promo discount:", promoDiscount);
			calculateTotals();
		}
	});

	// Change Delivery Option
	const deliveryRadios = document.querySelectorAll(
		'input[name="delivery-option-inputs"]'
	);
	const deliveryOption_HTML = document.getElementById("shipping-label_HTML");

	deliveryRadios.forEach((radio) => {
		radio.addEventListener("click", () => {
			console.log("Selected:", radio.value);
			if (radio.value === "delivery") {
				deliveryOption_HTML.innerText = "Home Delivery";
				deliveryFee = Number(120);
			} else if (radio.value === "pickup") {
				deliveryOption_HTML.innerText = "Store Pickup";
				deliveryFee = Number(0);
			}
			calculateTotals();
		});
	});
};

// Render cart products
const renderCartProduct = (data) => {
	let cartProductHTML = data.length ? `` : "no items in cart";
	let returnSubtotal = 0;

	// update nav cart number
	const navCartNum_HTML = document.getElementById("nav-cart-num");
	const cartFooter_HTML = document.getElementById("cart-footer_HTML");

	if (data.length < 1) {
		navCartNum_HTML.innerText = ``;
		cartList_HTML.style = "padding-top: 20px; padding-left: 20px;";
		cartFooter_HTML.style.display = "none";
	} else {
		navCartNum_HTML.innerText = `(${data.length})`;
		cartFooter_HTML.style.display = "block";
	}

	data.forEach((product) => {
		returnSubtotal += product.price * product.qty;

		const deliveryAvailability = product.deliveryAvailability
			? `<div class="available-status-circle green"></div>
            <p class="content">Available For Delivery</p>`
			: `<div class="available-status-circle red"></div>
            <p class="content">Not Available For Delivery</p>`;

		const pickupAvailability = product.pickupAvailability
			? `<div class="available-status-circle green"></div>
            <p class="content">Available For Store Pickup</p>`
			: `<div class="available-status-circle red"></div>
            <p class="content">Not Available For Store Pickup</p>`;

		cartProductHTML += `
    <div data-id="${product.id}" class="cart-product-card">
      <div class="cart-product-img">
        <img 
          src="${product.img}"></img>
      </div>
        <!-- product info -->
        <div class="cart-product-info">
          <p class="cart-product-name">${product.name}</p>
          <p class="cart-product-des">${product.materialAndSize}</p>
          <div class="cart-product-delivery">
          ${deliveryAvailability}            
          </div>  
          <div class="cart-product-pickup">
          ${pickupAvailability}
          </div>
          <p class="cart-product-price">$${product.price}</p>

          <!-- control flex -->
          <div class="flex-control">
            <!-- quantity controls -->
            <div class="cart-product-quantity">
              <div class="decrease-qty-btn" data-qty="${product.qty}" data-id="${product.id}">–</div>
              <span class="quantity-value">${product.qty}</span>
              <div class="increase-qty-btn" data-qty="${product.qty}" data-id="${product.id}">+</div>
            </div>
            <!-- Remove & Save for Later BTNs -->
            <div class="controls-btns">
              <div class="control-btn remove-btn" data-id="${product.id}">Remove</div>
              <div class="control-btn save-for-later-btn">Save for Later</div>
            </div>
          </div>
        </div>

      </div>
    `;
	});

	cartList_HTML.innerHTML = cartProductHTML;
	attachEventListeners();
	subtotalAmount = returnSubtotal;
	calculateTotals();
};

// Initial render
renderCartProduct(await readProduct());

export { renderCartProduct };
