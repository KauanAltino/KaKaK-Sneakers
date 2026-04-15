const urlParams = new URLSearchParams(window.location.search);

const STORE_CONFIG = {
  whatsappNumber: document.body.dataset.whatsappNumber || "5511999999999",
  productId: urlParams.get("id") || document.body.dataset.productId || "",
  productsPath: document.body.dataset.productsPath || "products.json",
  assetPrefix: document.body.dataset.assetPrefix || "",
};

const detailElements = {
  name: document.getElementById("detail-name"),
  tag: document.getElementById("detail-tag"),
  oldPrice: document.getElementById("detail-old-price"),
  price: document.getElementById("detail-price"),
  description: document.getElementById("detail-description"),
  story: document.getElementById("detail-story"),
  image: document.getElementById("detail-image"),
  sizes: document.getElementById("detail-sizes"),
  styleTips: document.getElementById("detail-style-tips"),
  highlights: document.getElementById("detail-highlights"),
  whatsapp: document.getElementById("detail-whatsapp"),
};

document.addEventListener("DOMContentLoaded", async () => {
  await loadProduct();
});

async function loadProduct() {
  try {
    const response = await fetch(STORE_CONFIG.productsPath);

    if (!response.ok) {
      throw new Error("Nao foi possivel carregar o produto.");
    }

    const payload = await response.json();
    const products = payload.products || [];
    const product = products.find((item) => item.id === STORE_CONFIG.productId);

    if (!product) {
      throw new Error("Produto nao encontrado.");
    }

    renderProduct(product);
  } catch (error) {
    detailElements.name.textContent = "Produto indisponivel";
    detailElements.description.textContent =
      "Nao foi possivel carregar as informacoes deste item.";
    detailElements.story.textContent =
      "Volte ao catalogo principal e selecione outro modelo.";
    detailElements.whatsapp.removeAttribute("href");
    console.error(error);
  }
}

function renderProduct(product) {
  document.title = `${product.name} | KakaKTW Sneakers`;
  detailElements.name.textContent = product.name;
  detailElements.tag.textContent = product.tag || "Colecao";
  detailElements.oldPrice.textContent = formatPrice(
    getOriginalPrice(product.price, product.brand)
  );
  detailElements.price.textContent = formatPrice(product.price);
  detailElements.description.textContent = product.description;
  detailElements.story.textContent = product.story;
  detailElements.image.src = resolveAssetPath(product.image);
  detailElements.image.alt = product.name;
  detailElements.whatsapp.href = createWhatsAppUrl(product.name);

  detailElements.sizes.innerHTML = product.sizes
    .map((size) => `<span class="size-chip">${size}</span>`)
    .join("");

  detailElements.styleTips.innerHTML = product.styleTips
    .map((tip) => `<li>${tip}</li>`)
    .join("");

  detailElements.highlights.innerHTML = product.highlights
    .map((highlight) => `<li>${highlight}</li>`)
    .join("");
}

function createWhatsAppUrl(productName) {
  const message = `Ola, vi o produto ${productName} no site. Esta disponivel?`;
  return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function formatPrice(price) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(price) || 0);
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

function resolveAssetPath(path) {
  if (!path || /^(https?:)?\/\//.test(path)) {
    return path;
  }

  return `${STORE_CONFIG.assetPrefix}${path}`;
}