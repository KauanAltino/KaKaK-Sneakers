const STORE_CONFIG = {
  // Altere para o numero oficial da loja no formato internacional.
  whatsappNumber: document.body.dataset.whatsappNumber || "5511999999999",
};

const state = {
  search: "",
  brand: "",
  size: "",
  maxPrice: Infinity,
};

const productsEndpoint = "products.json";

const elements = {
  grid: document.getElementById("product-grid"),
  feedback: document.getElementById("feedback-message"),
  searchInput: document.getElementById("search-input"),
  brandFilter: document.getElementById("brand-filter"),
  sizeFilter: document.getElementById("size-filter"),
  priceFilter: document.getElementById("price-filter"),
  priceValue: document.getElementById("price-value"),
  resetFilters: document.getElementById("reset-filters"),
  brandButtons: Array.from(document.querySelectorAll(".brand-chip")),
  catalogCount: document.getElementById("catalog-count"),
  priceRange: document.getElementById("price-range"),
  resultsCount: document.getElementById("results-count"),
};

let allProducts = [];

document.addEventListener("DOMContentLoaded", async () => {
  populateSizeOptions();
  bindFilters();
  await loadProducts();
});

function populateSizeOptions() {
  for (let size = 34; size <= 43; size += 1) {
    const option = document.createElement("option");
    option.value = String(size);
    option.textContent = size;
    elements.sizeFilter.append(option);
  }
}

function bindFilters() {
  elements.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value.trim().toLowerCase();
    renderProducts();
  });

  elements.brandFilter.addEventListener("change", (event) => {
    state.brand = event.target.value;
    syncBrandButtons();
    renderProducts();
  });

  elements.sizeFilter.addEventListener("change", (event) => {
    state.size = event.target.value;
    renderProducts();
  });

  elements.brandButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.brand = button.dataset.brand || "";
      elements.brandFilter.value = state.brand;
      syncBrandButtons();
      renderProducts();
    });
  });

  elements.priceFilter.addEventListener("input", (event) => {
    state.maxPrice = Number(event.target.value);
    elements.priceValue.textContent = `Ate ${formatPrice(state.maxPrice)}`;
    renderProducts();
  });

  elements.resetFilters.addEventListener("click", () => {
    requestAnimationFrame(() => {
      state.search = "";
      state.brand = "";
      state.size = "";
      state.maxPrice = Number(elements.priceFilter.max);
      elements.brandFilter.value = "";
      elements.priceValue.textContent = `Ate ${formatPrice(state.maxPrice)}`;
      syncBrandButtons();
      renderProducts();
    });
  });
}

async function loadProducts() {
  try {
    const response = await fetch(productsEndpoint);

    if (!response.ok) {
      throw new Error("Nao foi possivel carregar os produtos.");
    }

    const payload = await response.json();
    allProducts = (payload.products || []).map(normalizeProduct);

    configurePriceFilter(allProducts);
    updateSummary(allProducts);
    renderProducts();
  } catch (error) {
    elements.feedback.textContent =
      "Falha ao carregar o catalogo. Verifique se o arquivo products.json esta disponivel.";
    elements.grid.innerHTML = "";
    console.error(error);
  }
}

function normalizeProduct(product) {
  return {
    ...product,
    brand: product.brand || "Sem marca",
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    styleTips: Array.isArray(product.styleTips) ? product.styleTips : [],
    highlights: Array.isArray(product.highlights) ? product.highlights : [],
    price: Number(product.price) || 0,
  };
}

function configurePriceFilter(products) {
  const highestPrice = Math.max(...products.map((product) => product.price), 0);
  const adjustedMax = Math.max(100, Math.ceil(highestPrice / 10) * 10);

  elements.priceFilter.max = String(adjustedMax);
  elements.priceFilter.value = String(adjustedMax);
  state.maxPrice = adjustedMax;
  elements.priceValue.textContent = `Ate ${formatPrice(adjustedMax)}`;
}

function renderProducts() {
  const filteredProducts = getFilteredProducts();

  if (elements.resultsCount) {
    elements.resultsCount.textContent = String(filteredProducts.length);
  }
  elements.grid.innerHTML = "";

  if (filteredProducts.length === 0) {
    elements.feedback.textContent =
      "Nenhum produto encontrado com os filtros atuais.";
    return;
  }

  elements.feedback.textContent = `${filteredProducts.length} produto(s) exibido(s).`;

  filteredProducts.forEach((product) => {
    elements.grid.append(createProductCard(product));
  });
}

function getFilteredProducts() {
  return allProducts
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(state.search);
      const matchesBrand = !state.brand || product.brand === state.brand;
      const matchesSize = !state.size || product.sizes.includes(Number(state.size));
      const matchesPrice = product.price <= state.maxPrice;

      return matchesSearch && matchesBrand && matchesSize && matchesPrice;
    })
    .sort((first, second) => first.price - second.price);
}

function createProductCard(product) {
  const article = document.createElement("article");
  article.className = "product-card";
  const originalPrice = getOriginalPrice(product.price, product.brand);

  article.innerHTML = `
    <div class="product-image-wrap">
      <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy" />
    </div>
    <div class="product-meta">
      <div>
        <div class="product-badges">
          <p class="product-tag">${product.brand}</p>
          <p class="product-tag product-tag-muted">${product.tag || "Catalogo"}</p>
        </div>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-old-price">${formatPrice(originalPrice)}</p>
        <p class="product-price">${formatPrice(product.price)}</p>
      </div>
    </div>
    <div class="product-actions">
      <a class="secondary-button" href="${product.page}">Ver detalhes</a>
      <a class="buy-button" href="${createWhatsAppUrl(product.name)}" target="_blank" rel="noreferrer">Comprar</a>
    </div>
  `;

  return article;
}

function updateSummary(products) {
  const prices = products.map((product) => product.price);
  const lowestPrice = Math.min(...prices);
  const highestPrice = Math.max(...prices);

  if (elements.catalogCount) {
    elements.catalogCount.textContent = String(products.length);
  }

  if (elements.priceRange) {
    elements.priceRange.textContent = `${formatPrice(lowestPrice)} - ${formatPrice(highestPrice)}`;
  }

  if (elements.resultsCount) {
    elements.resultsCount.textContent = String(products.length);
  }
}

function createWhatsAppUrl(productName) {
  const message = `Ola, vi o produto ${productName} no site. Esta disponivel?`;
  return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function formatPrice(price) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

function getOriginalPrice(price, brand) {
  return Number(price) + getDiscountByBrand(brand);
}

function getDiscountByBrand(brand) {
  const discounts = {
    NIKE: 80,
    "New Balance": 80,
    Vans: 80,
    Lacoste: 90,
    Adidas: 90,
    Reserva: 90,
    "Soft Ever": 60,
    Sandalias: 60,
    Havaianas: 60,
  };

  return discounts[brand] || 70;
}

function syncBrandButtons() {
  elements.brandButtons.forEach((button) => {
    const isActive = (button.dataset.brand || "") === state.brand;
    button.classList.toggle("is-active", isActive);
  });
}