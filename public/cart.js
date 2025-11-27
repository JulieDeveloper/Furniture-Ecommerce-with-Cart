import { readProduct, updateProduct, deleteProduct } from "./crud.js";
import { verifyPromoCode } from "./promo.js";

const cartList_HTML = document.getElementById("cart-products-list");

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
			promoDiscount = subtotalAmount - verifyResult.discount || 0;
			calculateTotals();
		}
	});
};

const renderCartProduct = (data) => {
	let cartProductHTML = data.length ? `` : "no items in cart";
	data.forEach((product) => {
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
};

// Initial render
renderCartProduct(await readProduct());

export { renderCartProduct };
