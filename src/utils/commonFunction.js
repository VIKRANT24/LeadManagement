export const getStatusColor = (status) => {
  const normalizedStatus = status?.toUpperCase().replace(/[-\s]/g, "_"); // Converts "DE-ACTIVE" -> "DE_ACTIVE"
  const statusColors = {
    PENDING: "#FFA500", // Orange
    ACTIVE: "#28a745", // Green
    DE_ACTIVE: "#dc3545", // Red
    IN_PROGRESS: "#17a2b8", // Blue
    COMPLETED: "#6c757d", // Gray
    CANCELLED: "#d9534f", // Dark Red
  };

  return statusColors[normalizedStatus] || "#000000"; // Default Black if status not found
};

export const getFollowupStatusColor = (status) => {
  const normalizedStatus = status?.toUpperCase().replace(/[-\s]/g, "_"); // Normalizes "EMAIL SENT" -> "EMAIL_SENT"

  const statusColors = {
    RECEIVED: "#28a745", // Green
    SWITCH_OFF: "#FFA500", // Orange
    OUT_OF_COVERAGE: "#FF6347", // Tomato Red
    WRONG_NO: "#dc3545", // Red
    NOT_RECEIVED: "#6c757d", // Gray
    WAIT: "#17a2b8", // Blue
    EMAIL_SENT: "#007bff", // Bright Blue
    WHATSAPP_SEND: "#25D366", // WhatsApp Green
    EMAIL_WHATSAPP_SEND: "#8E44AD", // Purple
  };

  return statusColors[normalizedStatus] || "#000000"; // Default Black if status not found
};

export const formatUrl = (url) => {
  // Check if the URL already starts with http:// or https://
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
};
