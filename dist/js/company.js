let url = new URL(window.location.href);
let dataSearch = {
  special: JSON.parse(url.searchParams.get("special")) || [],
  typeWork: JSON.parse(url.searchParams.get("typeWork")) || [],
  skills: JSON.parse(url.searchParams.get("skills")) || [],
  hard: JSON.parse(url.searchParams.get("hard")) || [],
  city: JSON.parse(url.searchParams.get("city")) || [],
  experience: JSON.parse(url.searchParams.get("experience")) || [],
  price: {
    minPrice: url.searchParams.get("price_min") || 0,
    maxPrice: url.searchParams.get("price_max") || 0,
  },
};
