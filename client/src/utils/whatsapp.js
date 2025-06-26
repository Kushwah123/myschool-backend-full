// utils/whatsapp.js
export const sendWhatsAppSMS = (number, message) => {
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${number}?text=${encodedMessage}`;
  window.open(url, "_blank");
};
