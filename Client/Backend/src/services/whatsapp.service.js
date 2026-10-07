export function generateWhatsAppMessage(order) {
  const lines = [];

  lines.push("🍔 CEYLONEBITZ ORDER");
  lines.push("");
  lines.push(`Order: ${order.orderNumber}`);
  lines.push("");

  lines.push("CUSTOMER");
  lines.push(`Name: ${order.customerName}`);
  lines.push(`Phone: ${order.customerPhone}`);

  if (order.customerEmail) {
    lines.push(`Email: ${order.customerEmail}`);
  }

  lines.push("");

  lines.push("DELIVERY");
  lines.push(`Address: ${order.deliveryAddress}`);
  lines.push(`City: ${order.city}`);

  if (order.postalCode) {
    lines.push(`Postal Code: ${order.postalCode}`);
  }

  if (order.deliveryNotes) {
    lines.push(`Notes: ${order.deliveryNotes}`);
  }

  lines.push("");

  lines.push("ITEMS");

  for (const item of order.items) {
    lines.push(
      `${item.productName} × ${item.quantity}`
    );

    lines.push(
      `LKR ${Number(item.subtotal).toFixed(2)}`
    );

    lines.push("");
  }

  lines.push(
    `Subtotal: LKR ${Number(order.subtotal).toFixed(2)}`
  );

  lines.push(
    `Delivery: LKR ${Number(order.deliveryFee).toFixed(2)}`
  );

  lines.push(
    `Tax: LKR ${Number(order.tax).toFixed(2)}`
  );

  lines.push(
    `TOTAL: LKR ${Number(order.total).toFixed(2)}`
  );

  return lines.join("\n");
}