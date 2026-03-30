// ======================
// Paracha Honey - Main Script (Enhanced)
// ======================

document.addEventListener('DOMContentLoaded', () => {
  // Product data
  const variants = {
    250: { price: 1250, oldPrice: 1499, stock: 24, weight: 250, perGram: 5.00, image: '250g.png' },
    500: { price: 2250, oldPrice: 2750, stock: 18, weight: 500, perGram: 4.50, image: '500g.png' },
    1000: { price: 4200, oldPrice: 5200, stock: 9, weight: 1000, perGram: 4.20, image: '1000g.png' }
  };

  let currentWeight = 500;
  let quantity = 1;

  // DOM elements
  const variantBtns = document.querySelectorAll('#variantGroup button');
  const displayPrice = document.getElementById('displayPrice');
  const oldPrice = document.getElementById('oldPrice');
  const discountBadge = document.getElementById('discountBadge');
  const perGramInfo = document.getElementById('perGramInfo');
  const stockCount = document.getElementById('stockCount');
  const stockAlert = document.getElementById('stockAlert');
  const qtyValue = document.getElementById('qtyValue');
  const totalPriceSpan = document.getElementById('totalPrice');
  const shippingMsg = document.getElementById('shippingMsg');
  const progressFill = document.getElementById('progressFill');
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');
  const orderBtn = document.getElementById('orderNowBtn');
  const mainImage = document.getElementById('productImage');
  const thumbs = document.querySelectorAll('.gallery-thumbs img');

  // Helper: Update UI based on current selection
  function updateUI() {
    const variant = variants[currentWeight];
    if (!variant) return;

    if (quantity > variant.stock) quantity = variant.stock;
    if (quantity < 1) quantity = 1;

    qtyValue.innerText = quantity;

    displayPrice.innerText = `Rs. ${variant.price}`;
    oldPrice.innerText = `Rs. ${variant.oldPrice}`;
    const discountPercent = Math.round(((variant.oldPrice - variant.price) / variant.oldPrice) * 100);
    discountBadge.innerText = `Save ${discountPercent}%`;
    perGramInfo.innerText = `Rs. ${variant.perGram.toFixed(2)} per gram`;

    stockCount.innerText = variant.stock;
    if (variant.stock <= 5) {
      stockAlert.innerHTML = `<i class="fas fa-exclamation-triangle"></i> 🔥 Only ${variant.stock} left! Order soon.`;
    } else {
      stockAlert.innerHTML = `<i class="fas fa-check-circle"></i> In Stock: ${variant.stock} units`;
    }

    const total = variant.price * quantity;
    totalPriceSpan.innerText = total;

    const FREE_THRESHOLD = 2500;
    if (total >= FREE_THRESHOLD) {
      shippingMsg.innerHTML = '<i class="fas fa-check-circle"></i> 🎉 You qualify for FREE express shipping!';
      progressFill.style.width = '100%';
    } else {
      const remaining = FREE_THRESHOLD - total;
      shippingMsg.innerHTML = `<i class="fas fa-truck"></i> Add Rs. ${remaining} more for FREE delivery`;
      const percent = (total / FREE_THRESHOLD) * 100;
      progressFill.style.width = Math.min(percent, 99) + '%';
    }

    qtyPlus.disabled = quantity >= variant.stock;

    // Update main image and thumbnail active state based on current weight
    if (mainImage) {
      mainImage.src = variant.image;
    }
    if (thumbs.length) {
      thumbs.forEach(thumb => {
        const thumbWeight = parseInt(thumb.getAttribute('data-weight') || thumb.src.match(/(\d+)g/)?.[1]);
        if (thumbWeight === currentWeight) {
          thumb.classList.add('active');
        } else {
          thumb.classList.remove('active');
        }
      });
    }
  }

  // Change variant
  function selectVariant(weight) {
    currentWeight = weight;
    quantity = 1;
    // Update active class on variant buttons
    variantBtns.forEach(btn => {
      const w = parseInt(btn.getAttribute('data-weight'));
      if (w === weight) btn.classList.add('active');
      else btn.classList.remove('active');
    });
    updateUI();
  }

  // Change quantity
  function changeQty(delta) {
    const variant = variants[currentWeight];
    let newQty = quantity + delta;
    if (newQty < 1) newQty = 1;
    if (newQty > variant.stock) newQty = variant.stock;
    quantity = newQty;
    updateUI();
  }

  // Generate rich WhatsApp message with product details and image URL
  function generateWhatsAppMessage() {
    const variant = variants[currentWeight];
    const total = variant.price * quantity;
    // Use absolute URL for image (adjust domain as needed)
    // For local testing, we use relative path; in production, replace with full URL
    const imageUrl = `${window.location.origin}/` + variant.image;
    // Rich message with emojis, product name, weight, quantity, price breakdown, and link
    const message = `🍯 *Paracha Honey Order* 🍯%0A%0A` +
                    `*Product:* 100% Pure Wild Honey (${variant.weight}g Jar)%0A` +
                    `*Quantity:* ${quantity} jar(s)%0A` +
                    `*Unit Price:* Rs. ${variant.price}%0A` +
                    `*Total:* Rs. ${total}%0A` +
                    `*Shipping:* ${total >= 2500 ? 'FREE 🚚' : 'Paid (add Rs. ' + (2500 - total) + ' for free)'}%0A` +
                    `*Payment:* Cash on Delivery / EasyPaisa / JazzCash%0A%0A` +
                    `*Image:* ${imageUrl}%0A` +
                    `*Order Now:* [Click to confirm](${window.location.href})%0A%0A` +
                    `Thank you! 🙏`;
    return message;
  }

  // Event listeners
  variantBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const weight = parseInt(btn.getAttribute('data-weight'));
      selectVariant(weight);
    });
  });

  qtyMinus.addEventListener('click', () => changeQty(-1));
  qtyPlus.addEventListener('click', () => changeQty(1));

  orderBtn.addEventListener('click', () => {
    const variant = variants[currentWeight];
    const total = variant.price * quantity;
    // Build a comprehensive WhatsApp message
    const message = `🍯 *Paracha Honey Order* 🍯%0A%0A` +
                    `*Product:* 100% Pure Wild Honey (${variant.weight}g Jar)%0A` +
                    `*Quantity:* ${quantity} jar(s)%0A` +
                    `*Unit Price:* Rs. ${variant.price}%0A` +
                    `*Total:* Rs. ${total}%0A` +
                    `*Shipping:* ${total >= 2500 ? 'FREE 🚚' : 'Paid (add Rs. ' + (2500 - total) + ' for free)'}%0A%0A` +
                    `Please confirm availability and share payment details. Thank you! 🙏`;
    const whatsappUrl = `https://wa.me/923125262317?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  });

  // Countdown timer
  let timeLeft = 2 * 3600;
  const timerSpan = document.getElementById('timer');
  function updateTimer() {
    if (timeLeft <= 0) {
      timerSpan.innerText = "00:00:00";
      return;
    }
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    timerSpan.innerText = `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
    timeLeft--;
  }
  setInterval(updateTimer, 1000);

  // Live notification rotation
  const ticker = document.getElementById('liveNotification');
  const messages = [
    "🔥 3 people from Karachi just ordered 500g honey",
    "⭐ New review: 'Best honey in Pakistan' by Hamza L.",
    "🚚 Free shipping active on orders > Rs.2500",
    "🍯 Only 9 units left of 1kg family pack!",
    "📦 Recent order: 250g shipped to Islamabad"
  ];
  let msgIndex = 0;
  setInterval(() => {
    msgIndex = (msgIndex + 1) % messages.length;
    if (ticker) ticker.innerHTML = `<i class="fas fa-shopping-cart"></i> ${messages[msgIndex]}`;
  }, 6000);

  // Mobile menu toggle
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Gallery thumbnails: update main image and variant selection when thumb clicked
  if (thumbs.length && mainImage) {
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        // Get weight from thumb's data-weight attribute or extract from src filename
        let weight = parseInt(thumb.getAttribute('data-weight'));
        if (!weight) {
          const match = thumb.src.match(/(\d+)g/);
          if (match) weight = parseInt(match[1]);
        }
        if (weight && variants[weight]) {
          selectVariant(weight);
        }
      });
    });
  }

  // Newsletter form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for subscribing! You’ll receive exclusive offers soon.');
      newsletterForm.reset();
    });
  }

  // Initial load
  selectVariant(500);
});