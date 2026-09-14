const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

export const getLogoUrl = (logoUrl) => {
  if (!logoUrl) {
    return null;
  }

  if (
    logoUrl.startsWith("http://") ||
    logoUrl.startsWith("https://")
  ) {
    return logoUrl;
  }

  return `${SERVER_BASE_URL}${
    logoUrl.startsWith("/") ? "" : "/"
  }${logoUrl}`;
};