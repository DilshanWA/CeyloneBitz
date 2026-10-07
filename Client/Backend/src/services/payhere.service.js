import md5 from "crypto-js/md5.js";

export function generatePayHereHash({
  merchantId,
  merchantSecret,
  orderId,
  amount,
  currency,
}) {
  const formattedAmount = Number(amount).toFixed(2);

  const hashedSecret = md5(merchantSecret)
    .toString()
    .toUpperCase();

  return md5(
    merchantId +
      orderId +
      formattedAmount +
      currency +
      hashedSecret
  )
    .toString()
    .toUpperCase();
}