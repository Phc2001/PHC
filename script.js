// ======================
// Paracha Honey - Advanced Interactive Script
// Performance Optimized | Smooth Animations | Enhanced UX
// ======================

document.addEventListener('DOMContentLoaded', () => {
  // ======================
  // PRODUCT DATA & STATE
  // ======================
  const variants = {
    250: { price: 1250, oldPrice: 1499, stock: 24, weight: 250, perGram: 5.00, image: '250g.png' },
    500: { price: 2250, oldPrice: 2750, stock: 18, weight: 500, perGram: 4.50, image: '500g.png' },
    1000: { price: 4200, oldPrice: 5200, stock: 9, weight: 1000, perGram: 4.20, image: '1000g.png' }
  };

  let currentWeight = 500;
  let quantity = 1;
  let countdownInterval = null;
  let notificationInterval = null;

  // DOM Elements - Cached for performance
  const elements = {
    variantBtns: document.querySelectorAll('#variantGroup button'),
    displayPrice: document.getElementById('displayPrice'),
    oldPrice: document.getElementById('oldPrice'),
    discountBadge: document.getElementById('discountBadge'),
    perGramInfo: document.getElementById('perGramInfo'),
    stockCount: document.getElementById('stockCount'),
    stockAlert: document.getElementById('stockAlert'),
    qtyValue: document.getElementById('qtyValue'),
    totalPriceSpan: document.getElementById('totalPrice'),
    shippingMsg: document.getElementById('shippingMsg'),
    progressFill: document.getElementById('progressFill'),
    qtyMinus: document.getElementById('qtyMinus'),
    qtyPlus: document.getElementById('qtyPlus'),
    orderBtn: document.getElementById('orderNowBtn'),
    mainImage: document.getElementById('productImage'),
    thumbs: document.querySelectorAll('.gallery-thumbs img'),
    timerSpan: document.getElementById('timer'),
    liveNotification: document.getElementById('liveNotification'),
    mobileBtn: document.querySelector('.mobile-menu-btn'),
    navLinks: document.querySelector('.nav-links'),
    newsletterForm: document.getElementById('newsletterForm'),
    whatsappFloat: document.getElementById('whatsappFloat'),
    header: document.querySelector('.main-header'),
    allSections: document.querySelectorAll('section')
  };

  // ======================
  // PERFORMANCE: Intersection Observer for Scroll Animations
  // ======================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // Add appropriate animation class based on data attribute or position
        if (el.classList.contains('benefit-card')) {
          el.classList.add('scale-in');
        } else if (el.classList.contains('testimonial-card')) {
          el.classList.add('fade-in-up');
        } else if (el.classList.contains('blog-card')) {
          el.classList.add('fade-in-up');
        } else if (el.classList.contains('science-card')) {
          el.classList.add('fade-in-left');
        } else {
          el.classList.add('fade-in-up');
        }
        revealObserver.unobserve(el);
      }
    });
  }, observerOptions);

  // Observe all sections and cards for reveal animations
  document.querySelectorAll('.benefit-card, .testimonial-card, .blog-card, .science-card, .faq-item').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // ======================
  // UI UPDATE FUNCTION (Optimized with RAF)
  // ======================
  function updateUI() {
    const variant = variants[currentWeight];
    if (!variant) return;

    // Clamp quantity within stock limits
    if (quantity > variant.stock) quantity = variant.stock;
    if (quantity < 1) quantity = 1;

    // Update quantity display
    if (elements.qtyValue) elements.qtyValue.innerText = quantity;

    // Price and discount updates
    if (elements.displayPrice) elements.displayPrice.innerText = `Rs. ${variant.price.toLocaleString()}`;
    if (elements.oldPrice) elements.oldPrice.innerText = `Rs. ${variant.oldPrice.toLocaleString()}`;
    
    const discountPercent = Math.round(((variant.oldPrice - variant.price) / variant.oldPrice) * 100);
    if (elements.discountBadge) elements.discountBadge.innerText = `Save ${discountPercent}%`;
    if (elements.perGramInfo) elements.perGramInfo.innerText = `Rs. ${variant.perGram.toFixed(2)} per gram`;

    // Stock status with urgency styling
    if (elements.stockCount) elements.stockCount.innerText = variant.stock;
    if (elements.stockAlert) {
      if (variant.stock <= 5) {
        elements.stockAlert.innerHTML = `<i class="fas fa-exclamation-triangle"></i> 🔥 Only ${variant.stock} left! Order soon.`;
        elements.stockAlert.style.animation = 'pulse 0.8s infinite';
      } else if (variant.stock <= 10) {
        elements.stockAlert.innerHTML = `<i class="fas fa-clock"></i> ⚡ Only ${variant.stock} units remaining!`;
        elements.stockAlert.style.animation = 'none';
      } else {
        elements.stockAlert.innerHTML = `<i class="fas fa-check-circle"></i> In Stock: ${variant.stock} units ready to ship`;
        elements.stockAlert.style.animation = 'none';
      }
    }

    // Calculate total and update
    const total = variant.price * quantity;
    if (elements.totalPriceSpan) elements.totalPriceSpan.innerText = total.toLocaleString();

    // Free shipping progress bar
    const FREE_THRESHOLD = 2500;
    if (total >= FREE_THRESHOLD) {
      if (elements.shippingMsg) elements.shippingMsg.innerHTML = '<i class="fas fa-check-circle"></i> 🎉 You qualify for FREE express shipping!';
      if (elements.progressFill) elements.progressFill.style.width = '100%';
    } else {
      const remaining = FREE_THRESHOLD - total;
      if (elements.shippingMsg) elements.shippingMsg.innerHTML = `<i class="fas fa-truck"></i> Add Rs. ${remaining.toLocaleString()} more for FREE delivery`;
      const percent = (total / FREE_THRESHOLD) * 100;
      if (elements.progressFill) elements.progressFill.style.width = Math.min(percent, 99) + '%';
    }

    // Enable/disable plus button based on stock
    if (elements.qtyPlus) elements.qtyPlus.disabled = quantity >= variant.stock;
    if (elements.qtyPlus) {
      if (quantity >= variant.stock) {
        elements.qtyPlus.style.opacity = '0.5';
        elements.qtyPlus.style.cursor = 'not-allowed';
      } else {
        elements.qtyPlus.style.opacity = '1';
        elements.qtyPlus.style.cursor = 'pointer';
      }
    }

    // Update main image
    if (elements.mainImage && variant.image) {
      // Add smooth crossfade effect
      elements.mainImage.style.opacity = '0.5';
      setTimeout(() => {
        elements.mainImage.src = variant.image;
        elements.mainImage.alt = `Paracha Honey ${variant.weight}g Jar`;
        setTimeout(() => {
          elements.mainImage.style.opacity = '1';
        }, 50);
      }, 100);
    }

    // Update thumbnail active states
    if (elements.thumbs.length) {
      elements.thumbs.forEach(thumb => {
        const thumbWeight = parseInt(thumb.getAttribute('data-weight') || thumb.src.match(/(\d+)g/)?.[1]);
        if (thumbWeight === currentWeight) {
          thumb.classList.add('active');
        } else {
          thumb.classList.remove('active');
        }
      });
    }

    // Update variant buttons active states
    if (elements.variantBtns.length) {
      elements.variantBtns.forEach(btn => {
        const weight = parseInt(btn.getAttribute('data-weight'));
        if (weight === currentWeight) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
  }

  // ======================
  // VARIANT SELECTION
  // ======================
  function selectVariant(weight) {
    if (!variants[weight]) return;
    
    // Add click animation
    const btn = Array.from(elements.variantBtns).find(b => parseInt(b.getAttribute('data-weight')) === weight);
    if (btn) {
      btn.style.transform = 'scale(0.95)';
      setTimeout(() => { if (btn) btn.style.transform = ''; }, 150);
    }
    
    currentWeight = weight;
    quantity = 1;
    updateUI();
  }

  // ======================
  // QUANTITY MANAGEMENT
  // ======================
  function changeQuantity(delta) {
    const variant = variants[currentWeight];
    let newQty = quantity + delta;
    if (newQty < 1) newQty = 1;
    if (newQty > variant.stock) newQty = variant.stock;
    
    if (newQty !== quantity) {
      quantity = newQty;
      // Add subtle animation to quantity display
      if (elements.qtyValue) {
        elements.qtyValue.style.transform = 'scale(1.1)';
        setTimeout(() => {
          if (elements.qtyValue) elements.qtyValue.style.transform = '';
        }, 150);
      }
      updateUI();
    }
  }

  // ======================
  // WHATSAPP ORDER MESSAGE (Enhanced with product details)
  // ======================
  function generateWhatsAppOrder() {
    const variant = variants[currentWeight];
    const total = variant.price * quantity;
    const date = new Date().toLocaleDateString('en-PK');
    
    const message = `🍯 *PARACHA HONEY ORDER* 🍯%0A%0A` +
                    `━━━━━━━━━━━━━━━━━━━━%0A` +
                    `*Product:* 100% Pure Wild Honey%0A` +
                    `*Size:* ${variant.weight}g Glass Jar%0A` +
                    `*Quantity:* ${quantity} jar(s)%0A` +
                    `*Unit Price:* Rs. ${variant.price.toLocaleString()}%0A` +
                    `*Total:* Rs. ${total.toLocaleString()}%0A` +
                    `━━━━━━━━━━━━━━━━━━━━%0A` +
                    `*Shipping:* ${total >= 2500 ? 'FREE Express Delivery 🚚' : `Rs. 200 (Add Rs. ${(2500 - total).toLocaleString()} for free)`}%0A` +
                    `*Payment:* Cash on Delivery / Bank Transfer%0A` +
                    `*Order Date:* ${date}%0A` +
                    `━━━━━━━━━━━━━━━━━━━━%0A` +
                    `📍 *Delivery Address:* %0A` +
                    `👤 *Full Name:* %0A` +
                    `📞 *Phone:* %0A%0A` +
                    `Please confirm my order. Thank you! 🙏`;
    
    return message;
  }

  function openWhatsApp() {
    const message = generateWhatsAppOrder();
    const whatsappUrl = `https://wa.me/923125262317?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  // ======================
  // COUNTDOWN TIMER (Flash Sale)
  // ======================
  function initCountdown() {
    // Set end time to 2 hours from page load (or use stored value)
    let timeLeft = 2 * 3600; // 2 hours in seconds
    
    function updateTimer() {
      if (timeLeft <= 0) {
        if (elements.timerSpan) elements.timerSpan.innerText = "SALE ENDED";
        if (countdownInterval) clearInterval(countdownInterval);
        // Optionally hide discount badge or show message
        return;
      }
      const hours = Math.floor(timeLeft / 3600);
      const minutes = Math.floor((timeLeft % 3600) / 60);
      const seconds = timeLeft % 60;
      if (elements.timerSpan) {
        elements.timerSpan.innerText = `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
      }
      timeLeft--;
    }
    
    updateTimer();
    countdownInterval = setInterval(updateTimer, 1000);
  }

  // ======================
  // LIVE NOTIFICATION ROTATION (Dynamic & Engaging)
  // ======================
  function initLiveNotifications() {
    const messages = [
      "🔥 3 people from Karachi just ordered 500g honey",
      "⭐ New review: 'Best honey in Pakistan' by Hamza L.",
      "🚚 Free shipping active on orders > Rs.2500",
      "🍯 Only 9 units left of 1kg family pack!",
      "📦 Recent order: 250g shipped to Islamabad",
      "💚 Verified purity: 98%+ in latest lab test",
      "🏔️ Fresh harvest from Chargulli mountains just arrived!",
      "🎁 Order now and get free honey dipper"
    ];
    
    let msgIndex = 0;
    notificationInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      if (elements.liveNotification) {
        elements.liveNotification.style.opacity = '0.7';
        setTimeout(() => {
          if (elements.liveNotification) {
            elements.liveNotification.innerHTML = `<i class="fas fa-shopping-cart"></i> ${messages[msgIndex]}`;
            elements.liveNotification.style.opacity = '1';
          }
        }, 150);
      }
    }, 5000);
  }

  // ======================
  // HEADER SCROLL EFFECT (Sticky + Shadow)
  // ======================
  function initScrollEffects() {
    window.addEventListener('scroll', () => {
      if (elements.header) {
        if (window.scrollY > 50) {
          elements.header.classList.add('scrolled');
        } else {
          elements.header.classList.remove('scrolled');
        }
      }
    });
  }

  // ======================
  // MOBILE MENU TOGGLE
  // ======================
  function initMobileMenu() {
    if (elements.mobileBtn && elements.navLinks) {
      elements.mobileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.navLinks.classList.toggle('active');
        // Change icon animation
        const icon = elements.mobileBtn.querySelector('i');
        if (elements.navLinks.classList.contains('active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-times');
        } else {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      });
      
      // Close mobile menu when clicking a link
      const navItems = elements.navLinks.querySelectorAll('a');
      navItems.forEach(link => {
        link.addEventListener('click', () => {
          elements.navLinks.classList.remove('active');
          const icon = elements.mobileBtn.querySelector('i');
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        });
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (elements.navLinks && elements.navLinks.classList.contains('active')) {
          if (!elements.navLinks.contains(e.target) && !elements.mobileBtn.contains(e.target)) {
            elements.navLinks.classList.remove('active');
            const icon = elements.mobileBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
          }
        }
      });
    }
  }

  // ======================
  // NEWSLETTER SUBSCRIPTION
  // ======================
  function initNewsletter() {
    if (elements.newsletterForm) {
      elements.newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = elements.newsletterForm.querySelector('input[type="email"]');
        const email = emailInput?.value;
        
        if (email) {
          // Show success message with animation
          const btn = elements.newsletterForm.querySelector('button');
          const originalText = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
          btn.disabled = true;
          
          // Simulate API call (replace with actual endpoint)
          setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
            btn.style.background = '#2c3e2f';
            
            setTimeout(() => {
              btn.innerHTML = originalText;
              btn.disabled = false;
              btn.style.background = '';
            }, 2000);
            
            alert('🎉 Thank you for subscribing! You\'ll receive exclusive offers and honey tips.');
            emailInput.value = '';
          }, 800);
        }
      });
    }
  }

  // ======================
  // SMOOTH SCROLLING FOR NAVIGATION
  // ======================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offset = 80; // Header height offset
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ======================
  // GALLERY THUMBNAIL CLICK HANDLER
  // ======================
  function initGalleryThumbs() {
    if (elements.thumbs.length) {
      elements.thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
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
  }

  // ======================
  // LAZY LOAD IMAGES (Performance)
  // ======================
  function initLazyLoad() {
    if ('IntersectionObserver' in window) {
      const lazyImages = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });
      
      lazyImages.forEach(img => imageObserver.observe(img));
    }
  }

  // ======================
  // ADD TO CART ANIMATION (Optional UX)
  // ======================
  function initAddToCartAnimation() {
    if (elements.orderBtn) {
      elements.orderBtn.addEventListener('click', () => {
        // Ripple effect on button
        const btn = elements.orderBtn;
        btn.style.transform = 'scale(0.98)';
        setTimeout(() => {
          btn.style.transform = '';
        }, 150);
        
        // Open WhatsApp after subtle delay
        setTimeout(() => {
          openWhatsApp();
        }, 100);
      });
    }
  }

  // ======================
  // FLOATING WHATSAPP CLICK
  // ======================
  function initWhatsappFloat() {
    if (elements.whatsappFloat) {
      elements.whatsappFloat.addEventListener('click', (e) => {
        e.preventDefault();
        openWhatsApp();
      });
    }
  }

  // ======================
  // STORAGE: Save cart state (optional)
  // ======================
  function saveCartState() {
    const cartState = {
      weight: currentWeight,
      quantity: quantity,
      timestamp: Date.now()
    };
    localStorage.setItem('parachaCart', JSON.stringify(cartState));
  }
  
  function loadCartState() {
    const saved = localStorage.getItem('parachaCart');
    if (saved) {
      try {
        const { weight, quantity: savedQty, timestamp } = JSON.parse(saved);
        // Only restore if less than 30 minutes old
        if (Date.now() - timestamp < 30 * 60 * 1000) {
          if (weight && variants[weight]) {
            currentWeight = weight;
            quantity = Math.min(savedQty, variants[weight].stock);
            updateUI();
          }
        }
      } catch (e) {}
    }
  }

  // ======================
  // EVENT LISTENERS FOR INTERACTIONS
  // ======================
  function bindEventListeners() {
    // Variant buttons
    if (elements.variantBtns.length) {
      elements.variantBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const weight = parseInt(btn.getAttribute('data-weight'));
          selectVariant(weight);
          saveCartState();
        });
      });
    }
    
    // Quantity controls
    if (elements.qtyMinus) elements.qtyMinus.addEventListener('click', () => { changeQuantity(-1); saveCartState(); });
    if (elements.qtyPlus) elements.qtyPlus.addEventListener('click', () => { changeQuantity(1); saveCartState(); });
  }

  // ======================
  // INITIALIZE ALL
  // ======================
  function init() {
    // Load saved cart state
    loadCartState();
    
    // Update UI with initial values
    updateUI();
    
    // Initialize all features
    initCountdown();
    initLiveNotifications();
    initScrollEffects();
    initMobileMenu();
    initNewsletter();
    initSmoothScroll();
    initGalleryThumbs();
    initLazyLoad();
    initAddToCartAnimation();
    initWhatsappFloat();
    bindEventListeners();
    
    // Add reveal class to hero content for initial animation
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) heroContent.classList.add('reveal', 'fade-in-left');
    const heroImg = document.querySelector('.hero-image');
    if (heroImg) heroImg.classList.add('reveal', 'fade-in-right');
    
    // Observe hero elements
    if (heroContent) revealObserver.observe(heroContent);
    if (heroImg) revealObserver.observe(heroImg);
    
    console.log('Paracha Honey — Fully Loaded 🍯');
  }
  
  // Start the application
  init();
});

// ======================
// PERFORMANCE: Clean up intervals on page unload
// ======================
window.addEventListener('beforeunload', () => {
  if (window.countdownInterval) clearInterval(window.countdownInterval);
  if (window.notificationInterval) clearInterval(window.notificationInterval);
});
