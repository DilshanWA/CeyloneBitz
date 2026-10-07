const DELIVERY_FEE = 300;
const TAX_RATE = 0.0;

export function calculateOrderPricing(subtotal) {
  const deliveryFee = DELIVERY_FEE;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + deliveryFee + tax;

  return {
    deliveryFee,
    tax,
    total,
  };
}