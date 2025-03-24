const BACKEND_URL = import.meta.env.VITE_APP_BASE_URL_WHATSAPP;

export const postWhatsApp = async (phone, text) => {
  const url = `${BACKEND_URL}?phone=${phone}&text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener,noreferrer");
};
