// Currency Formatter in Indian Lakh / Crore
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  if (typeof amount === 'string' && amount.startsWith('₹')) return amount;
  
  const num = Number(amount);
  if (isNaN(num)) return '₹0';

  if (num >= 10000000) {
    const crore = (num / 10000000).toFixed(2);
    return `₹${crore} Cr`;
  }
  if (num >= 100000) {
    const lakh = (num / 100000).toFixed(2);
    return `₹${lakh} Lakh`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatAcre = (acre) => {
  if (acre === undefined || acre === null) return '0 Acre';
  const num = Number(acre);
  return `${num.toFixed(1)} Acre (${(num * 0.404686).toFixed(2)} Ha)`;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

// Calculate polygon centroid from coordinates [[lat, lng], ...]
export const getPolygonCentroid = (coords) => {
  if (!coords || coords.length === 0) return [27.1767, 78.0081]; // Default Agra
  let totalLat = 0;
  let totalLng = 0;
  coords.forEach(([lat, lng]) => {
    totalLat += lat;
    totalLng += lng;
  });
  return [totalLat / coords.length, totalLng / coords.length];
};
