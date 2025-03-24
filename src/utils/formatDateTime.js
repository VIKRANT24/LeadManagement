export const formatDateTime = (utcDateString) => {
  const date = new Date(utcDateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const amPm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12; // Convert 0 (midnight) and 12 (noon) correctly

  return `${year}-${month}-${day} ${hours}:${minutes} ${amPm}`;
};
