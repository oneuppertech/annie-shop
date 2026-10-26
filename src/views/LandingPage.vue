<template>
  <div class="shop-page">
    <div class="announcement-bar">
      <span>Thoughtfully made. Beautifully worn.</span>
      <span class="announcement-desktop">Discover pieces made for your moments <i class="fa-solid fa-arrow-right"></i></span>
    </div>

    <header class="site-header">
      <button class="icon-button mobile-menu-toggle" aria-label="Open menu" @click="mobileMenuOpen = !mobileMenuOpen">
        <i :class="mobileMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'"></i>
      </button>
      <RouterLink to="/" class="brand-mark" aria-label="Annie Petars home">
        <span class="brand-name">ANNIE PETARS</span>
        <span class="brand-subtitle">STYLE WITH INTENTION</span>
      </RouterLink>
      <nav class="desktop-nav" aria-label="Main navigation">
        <a href="#new-arrivals">New Arrivals</a>
        <a href="#collections">Collections</a>
        <a href="#made-for-you">Made for You</a>
        <a href="#our-story">Our Story</a>
      </nav>
      <div class="header-actions">
        <button class="icon-button" aria-label="Search products" @click="searchOpen = !searchOpen"><i class="fa-solid fa-magnifying-glass"></i></button>
        <button class="icon-button account-button" aria-label="My account" @click="accountNotice"><i class="fa-regular fa-user"></i></button>
        <button class="bag-button" aria-label="Shopping bag" @click="cartOpen = true">
          <i class="fa-solid fa-bag-shopping"></i><span class="bag-label">Bag</span><span class="bag-count">{{ cartCount }}</span>
        </button>
      </div>
    </header>

    <transition name="slide-down">
      <div v-if="searchOpen" class="search-panel">
        <div class="search-inner">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input v-model="searchQuery" autofocus type="search" placeholder="Search pieces, collections, occasions..." aria-label="Search products" />
          <button class="icon-button" aria-label="Close search" @click="searchOpen = false"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <p v-if="searchQuery" class="search-hint">{{ filteredProducts.length }} piece(s) found</p>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="mobileMenuOpen" class="mobile-menu">
        <a href="#new-arrivals" @click="mobileMenuOpen = false">New Arrivals <i class="fa-solid fa-arrow-right"></i></a>
        <a href="#collections" @click="mobileMenuOpen = false">Collections <i class="fa-solid fa-arrow-right"></i></a>
        <a href="#made-for-you" @click="mobileMenuOpen = false">Made for You <i class="fa-solid fa-arrow-right"></i></a>
        <a href="#our-story" @click="mobileMenuOpen = false">Our Story <i class="fa-solid fa-arrow-right"></i></a>
      </div>
    </transition>

    <main>
      <section class="hero-section">
        <div class="hero-copy" data-aos="fade-up" data-aos-duration="900">
          <p class="eyebrow"><span></span> THE ANNIE PETARS EDIT</p>
          <h1>Wear your story.<br /><em>Own your moment.</em></h1>
          <p class="hero-description">Considered silhouettes, beautiful details, and expressive pieces designed to make every entrance feel like your own.</p>
          <div class="hero-cta-row">
            <a class="button button-dark" href="#new-arrivals">Shop the collection <i class="fa-solid fa-arrow-right"></i></a>
            <a class="text-link" href="#our-story">Discover our world <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
          </div>
          <div class="hero-footnote"><span class="hero-line"></span><span>Made for the way you show up.</span></div>
        </div>
        <div class="hero-visual" data-aos="fade-left" data-aos-duration="1100">
          <div class="hero-image-wrap">
            <img :src="heroImage" alt="Annie Petars contemporary fashion editorial" />
            <div class="hero-image-caption"><span>01 / THE NEW SEASON</span><i class="fa-solid fa-arrow-down-long"></i></div>
          </div>
          <div class="hero-sticker"><span>STYLE</span><strong>is a<br />feeling.</strong><i class="fa-solid fa-asterisk"></i></div>
          <div class="hero-side-note">AN EXPRESSION OF YOU — ALWAYS</div>
        </div>
      </section>

      <section class="trust-strip" aria-label="Annie Petars values">
        <div><i class="fa-solid fa-scissors"></i><span>Thoughtful design</span></div>
        <div><i class="fa-solid fa-heart"></i><span>Made with care</span></div>
        <div><i class="fa-solid fa-star"></i><span>Made for your moments</span></div>
        <div><i class="fa-solid fa-ruler-combined"></i><span>Custom-fit options</span></div>
      </section>

      <section id="collections" class="section collections-section">
        <div class="section-heading" data-aos="fade-up">
          <div><p class="eyebrow">FIND YOUR EXPRESSION</p><h2>Explore the <em>collections.</em></h2></div>
          <a class="text-link desktop-only" href="#new-arrivals">Shop all pieces <i class="fa-solid fa-arrow-right"></i></a>
        </div>
        <div class="collection-grid">
          <a v-for="(collection, index) in collections" :key="collection.slug" class="collection-card" :class="`collection-card-${index + 1}`" :href="`#new-arrivals`" @click="selectCollection(collection.slug)" data-aos="fade-up" :data-aos-delay="index * 70">
            <img :src="collection.image" :alt="collection.name" loading="lazy" />
            <span class="collection-overlay"></span>
            <span class="collection-index">0{{ index + 1 }}</span>
            <span class="collection-info"><span>{{ collection.kicker }}</span><strong>{{ collection.name }}</strong><span class="collection-link">Explore <i class="fa-solid fa-arrow-right"></i></span></span>
          </a>
        </div>
      </section>

      <section id="new-arrivals" class="section products-section">
        <div class="section-heading product-heading" data-aos="fade-up">
          <div><p class="eyebrow">THE PIECES YOU CAME FOR</p><h2>{{ activeCollectionName || 'New & noteworthy.' }}</h2></div>
          <div class="product-tools">
            <label class="sort-control"><span>Sort by</span><select v-model="sortBy" aria-label="Sort products"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name</option></select></label>
            <button v-if="activeCollection" class="clear-filter" @click="activeCollection = ''">Clear filter <i class="fa-solid fa-xmark"></i></button>
          </div>
        </div>
        <div v-if="loading" class="product-grid">
          <div v-for="n in 4" :key="n" class="product-skeleton"><div class="skeleton-image"></div><div class="skeleton-line"></div><div class="skeleton-line short"></div></div>
        </div>
        <div v-else-if="filteredProducts.length" class="product-grid">
          <article v-for="(product, index) in filteredProducts" :key="product.id" class="product-card" data-aos="fade-up" :data-aos-delay="(index % 4) * 70">
            <div class="product-image-wrap" @click="openProduct(product)">
              <img :src="product.image" :alt="product.name" loading="lazy" />
              <span v-if="product.badge" class="product-badge">{{ product.badge }}</span>
              <button class="quick-view" @click.stop="openProduct(product)">Quick view <i class="fa-solid fa-arrow-up-right-from-square"></i></button>
              <button class="wishlist-button" :aria-label="isWishlisted(product.id) ? 'Remove from wishlist' : 'Add to wishlist'" @click.stop="toggleWishlist(product.id)"><i :class="isWishlisted(product.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i></button>
            </div>
            <div class="product-details">
              <div class="product-name-row"><h3>{{ product.name }}</h3><span v-if="product.colorCount" class="color-count">{{ product.colorCount }} colors</span></div>
              <p class="product-category">{{ product.category }}</p>
              <div class="product-bottom"><span class="product-price">{{ formatPrice(product.price) }}</span><button class="add-button" aria-label="Add to bag" @click="addToCart(product)"><i class="fa-solid fa-plus"></i></button></div>
            </div>
          </article>
        </div>
        <div v-else class="empty-products"><i class="fa-solid fa-shirt"></i><h3>No pieces found just yet.</h3><p>Try another search or explore the full collection.</p><button class="button button-dark" @click="resetFilters">View all pieces</button></div>
        <div class="center-cta" data-aos="fade-up"><button class="button button-outline" @click="resetFilters">Explore all pieces <i class="fa-solid fa-arrow-right"></i></button></div>
      </section>

      <section class="editorial-banner" data-aos="fade-up">
        <img :src="editorialImage" alt="Contemporary African-inspired fashion" loading="lazy" />
        <div class="editorial-shade"></div>
        <div class="editorial-content"><p class="eyebrow light">ROOTED IN EXPRESSION</p><h2>Modern design.<br /><em>Unmistakably you.</em></h2><p>Pieces that bring together confident style, thoughtful craft, and the beauty of individual expression.</p><a href="#collections" class="button button-light">Find your piece <i class="fa-solid fa-arrow-right"></i></a></div>
        <span class="editorial-number">ANNIE PETARS — EST. WITH INTENTION</span>
      </section>

      <section id="made-for-you" class="section made-to-measure">
        <div class="made-image" data-aos="fade-right"><img :src="madeToMeasureImage" alt="Custom-made garment details" loading="lazy" /><span class="image-stamp">MADE<br />FOR YOU <i class="fa-solid fa-asterisk"></i></span></div>
        <div class="made-copy" data-aos="fade-left"><p class="eyebrow">YOUR VISION, OUR CRAFT</p><h2>Some moments call for <em>something personal.</em></h2><p>From special celebrations to a look you've imagined for a long time, our made-to-measure service helps bring your idea to life with care and attention to detail.</p><ul><li><i class="fa-solid fa-check"></i> A conversation about your vision</li><li><i class="fa-solid fa-check"></i> Thoughtful style and fabric guidance</li><li><i class="fa-solid fa-check"></i> A look shaped around you</li></ul><a class="button button-dark" href="#custom-request" @click.prevent="customRequestOpen = true">Start a custom request <i class="fa-solid fa-arrow-right"></i></a><span class="made-note">For weddings, celebrations, and your one-of-a-kind moments.</span></div>
      </section>

      <section id="our-story" class="story-section">
        <div class="story-inner" data-aos="fade-up"><span class="story-asterisk"><i class="fa-solid fa-asterisk"></i></span><p class="eyebrow">A NOTE FROM ANNIE PETARS</p><h2>Fashion is more than what you wear.<br /><em>It's how you arrive.</em></h2><p>We believe the right piece does more than complete a look. It helps you feel present, expressive, and entirely yourself. That's the feeling we design for.</p><a href="#collections" class="text-link">Explore our point of view <i class="fa-solid fa-arrow-right"></i></a></div>
      </section>

      <section class="newsletter-section">
        <div class="newsletter-copy" data-aos="fade-right"><p class="eyebrow">A LITTLE NOTE FROM US</p><h2>Good style.<br /><em>In your inbox.</em></h2><p>Be first to hear about new arrivals, collection stories, and special updates from Annie Petars.</p></div>
        <form class="newsletter-form" @submit.prevent="subscribeNewsletter" data-aos="fade-left">
          <label for="newsletter-email">Your email address</label>
          <div class="newsletter-input-row"><input id="newsletter-email" v-model.trim="newsletterEmail" type="email" placeholder="you@example.com" required /><button type="submit" aria-label="Subscribe to newsletter" :disabled="newsletterLoading"><i :class="newsletterLoading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-arrow-right'"></i></button></div>
          <p class="form-note" :class="{ success: newsletterMessageType === 'success', error: newsletterMessageType === 'error' }">{{ newsletterMessage || 'By subscribing, you agree to receive updates from Annie Petars.' }}</p>
        </form>
      </section>
    </main>

    <footer class="site-footer">
      <div class="footer-main">
        <div class="footer-brand"><RouterLink to="/" class="brand-mark"><span class="brand-name">ANNIE PETARS</span><span class="brand-subtitle">STYLE WITH INTENTION</span></RouterLink><p>Considered style for the moments that matter — and all the moments in between.</p><div class="social-links"><a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a><a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a><a href="#" aria-label="TikTok"><i class="fa-brands fa-tiktok"></i></a></div></div>
        <div class="footer-column"><h4>Explore</h4><a href="#new-arrivals">New Arrivals</a><a href="#collections">Shop Collections</a><a href="#made-for-you">Made to Measure</a><a href="#our-story">Our Story</a></div>
        <div class="footer-column"><h4>Customer care</h4><a href="#contact" @click.prevent="contactOpen = true">Contact Us</a><a href="#shipping">Shipping & Delivery</a><a href="#returns">Returns & Exchanges</a><a href="#faq">FAQs</a></div>
        <div class="footer-contact"><h4>Let's connect</h4><p>Questions about a piece or a custom order? We'd love to hear from you.</p><a href="mailto:hello@anniepetars.com">hello@anniepetars.com <i class="fa-solid fa-arrow-up-right-from-square"></i></a></div>
      </div>
      <div class="footer-bottom"><span>© {{ new Date().getFullYear() }} Annie Petars. All rights reserved.</span><span>Designed to be worn. Made to be remembered.</span><div><a href="#privacy">Privacy</a><a href="#terms">Terms</a></div></div>
    </footer>

    <transition name="drawer">
      <div v-if="cartOpen" class="drawer-backdrop" @click.self="cartOpen = false">
        <aside class="cart-drawer" aria-label="Shopping bag">
          <div class="drawer-header"><div><p class="eyebrow">YOUR SELECTION</p><h2>Your bag <span>({{ cartCount }})</span></h2></div><button class="icon-button" aria-label="Close bag" @click="cartOpen = false"><i class="fa-solid fa-xmark"></i></button></div>
          <div v-if="cart.length" class="cart-items">
            <article v-for="item in cart" :key="item.product.id" class="cart-item"><img :src="item.product.image" :alt="item.product.name" /><div class="cart-item-info"><h3>{{ item.product.name }}</h3><p>{{ formatPrice(item.product.price) }}</p><div class="quantity-control"><button aria-label="Decrease quantity" @click="changeQuantity(item.product.id, -1)">−</button><span>{{ item.quantity }}</span><button aria-label="Increase quantity" @click="changeQuantity(item.product.id, 1)">+</button></div></div><button class="remove-item" aria-label="Remove item" @click="removeFromCart(item.product.id)"><i class="fa-regular fa-trash-can"></i></button></article>
          </div>
          <div v-else class="cart-empty"><i class="fa-solid fa-bag-shopping"></i><h3>Your bag is taking a little break.</h3><p>Find something that feels like you.</p><button class="button button-dark" @click="cartOpen = false">Explore the shop</button></div>
          <div v-if="cart.length" class="cart-summary"><p><span>Subtotal</span><strong>{{ formatPrice(cartSubtotal) }}</strong></p><small>Shipping and any applicable fees are calculated at checkout.</small><button class="button button-dark checkout-button" @click="beginCheckout">Continue to checkout <i class="fa-solid fa-arrow-right"></i></button><button class="continue-shopping" @click="cartOpen = false">Continue shopping</button></div>
        </aside>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="selectedProduct" class="modal-backdrop" @click.self="selectedProduct = null">
        <section class="product-modal" role="dialog" aria-modal="true" :aria-label="selectedProduct.name">
          <button class="modal-close icon-button" aria-label="Close product details" @click="selectedProduct = null"><i class="fa-solid fa-xmark"></i></button>
          <div class="modal-image"><img :src="selectedProduct.image" :alt="selectedProduct.name" /></div>
          <div class="modal-copy"><p class="eyebrow">{{ selectedProduct.category }}</p><h2>{{ selectedProduct.name }}</h2><p class="modal-price">{{ formatPrice(selectedProduct.price) }}</p><p class="modal-description">{{ selectedProduct.description || 'A considered piece from Annie Petars, designed to bring confidence and character to your wardrobe.' }}</p><div v-if="selectedProduct.sizes?.length" class="size-selector"><span>Choose a size</span><div><button v-for="size in selectedProduct.sizes" :key="size" :class="{ selected: selectedSize === size }" @click="selectedSize = size">{{ size }}</button></div></div><p v-if="modalError" class="form-note error">{{ modalError }}</p><button class="button button-dark modal-add" @click="addSelectedProduct">Add to bag <i class="fa-solid fa-arrow-right"></i></button><p class="modal-help"><i class="fa-solid fa-ruler-combined"></i> Need a different fit? <a href="#made-for-you" @click="selectedProduct = null">Explore made to measure.</a></p></div>
        </section>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="customRequestOpen || contactOpen" class="modal-backdrop" @click.self="closeForms">
        <section class="request-modal" role="dialog" aria-modal="true" :aria-label="customRequestOpen ? 'Custom request' : 'Contact Annie Petars'">
          <button class="modal-close icon-button" aria-label="Close form" @click="closeForms"><i class="fa-solid fa-xmark"></i></button>
          <p class="eyebrow">{{ customRequestOpen ? 'MADE FOR YOU' : 'WE ARE HERE TO HELP' }}</p>
          <h2>{{ customRequestOpen ? 'Tell us what you have in mind.' : 'Let’s start a conversation.' }}</h2>
          <p class="request-intro">{{ customRequestOpen ? 'Share a few details and our team will follow up about your custom piece.' : 'Send us a note and our team will get back to you as soon as possible.' }}</p>
          <form @submit.prevent="submitContactForm">
            <div class="form-two-col"><label>Your name<input v-model.trim="contactForm.name" required placeholder="Full name" /></label><label>Email address<input v-model.trim="contactForm.email" required type="email" placeholder="you@example.com" /></label></div>
            <label v-if="customRequestOpen">Occasion or type of piece<input v-model.trim="contactForm.subject" placeholder="Wedding, celebration, everyday..." /></label>
            <label>Tell us a little more<textarea v-model.trim="contactForm.message" required rows="4" placeholder="Share your ideas, questions, or details here..."></textarea></label>
            <p v-if="contactMessage" class="form-note" :class="{ success: contactMessageType === 'success', error: contactMessageType === 'error' }">{{ contactMessage }}</p>
            <button class="button button-dark" type="submit" :disabled="contactLoading">{{ contactLoading ? 'Sending...' : 'Send your message' }} <i :class="contactLoading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-arrow-right'"></i></button>
          </form>
        </section>
      </div>
    </transition>

    <transition name="toast"><div v-if="toastMessage" class="shop-toast"><i class="fa-solid fa-circle-check"></i>{{ toastMessage }}</div></transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import AOS from 'aos'
import 'aos/dist/aos.css'
import ApiService from '@/services/api'

interface ShopProduct {
  id: string
  name: string
  slug?: string
  description?: string
  price: number
  currency?: string
  image: string
  category: string
  collectionSlug?: string
  badge?: string
  colorCount?: number
  sizes?: string[]
}
interface ShopCollection {
  slug: string
  name: string
  kicker: string
  image: string
}
interface CartItem {
  product: ShopProduct
  quantity: number
  size?: string
}
interface CatalogResponse {
  collections?: Array<Record<string, unknown>>
  products?: Array<Record<string, unknown>>
  data?: { collections?: Array<Record<string, unknown>>; products?: Array<Record<string, unknown>> }
}

const fallbackImages = {
  hero: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1500&q=85',
  editorial: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1800&q=85',
  made: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=1200&q=85',
  ready: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=850&q=85',
  suits: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=850&q=85',
  bride: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=850&q=85',
  asoebi: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=850&q=85',
  measure: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=850&q=85',
  official: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=850&q=85',
  girlchild: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=850&q=85',
  arrivals: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=850&q=85',
}
const heroImage = fallbackImages.hero
const editorialImage = fallbackImages.editorial
const madeToMeasureImage = fallbackImages.made

const collections = ref<ShopCollection[]>([
  { slug: 'annies-ready-to-wear', name: 'Annie’s Ready-to-Wear', kicker: 'Easy, elevated essentials', image: fallbackImages.ready },
  { slug: 'contemporary-african-suits', name: 'Contemporary African Suits', kicker: 'Tradition, reimagined', image: fallbackImages.suits },
  { slug: 'focus-on-the-bride', name: 'Focus on the Bride', kicker: 'For your unforgettable day', image: fallbackImages.bride },
  { slug: 'aso-ebi-special', name: 'Aso Ebi Special', kicker: 'Arrive together, stand apart', image: fallbackImages.asoebi },
  { slug: 'made-to-measure-designs', name: 'Made-to-Measure Designs', kicker: 'Created around you', image: fallbackImages.measure },
  { slug: 'stand-official-001', name: 'Stand Official 001', kicker: 'Make an entrance', image: fallbackImages.official },
  { slug: 'the-girl-child-love', name: 'The Girl Child Love', kicker: 'Style with purpose', image: fallbackImages.girlchild },
  { slug: 'new-arrivals', name: 'New Arrivals', kicker: 'Fresh from the atelier', image: fallbackImages.arrivals },
])
const products = ref<ShopProduct[]>([])
const loading = ref(true)
const searchOpen = ref(false)
const searchQuery = ref('')
const mobileMenuOpen = ref(false)
const cartOpen = ref(false)
const customRequestOpen = ref(false)
const contactOpen = ref(false)
const selectedProduct = ref<ShopProduct | null>(null)
const selectedSize = ref('')
const modalError = ref('')
const activeCollection = ref('')
const sortBy = ref('featured')
const cart = ref<CartItem[]>([])
const wishlist = ref<string[]>([])
const newsletterEmail = ref('')
const newsletterLoading = ref(false)
const newsletterMessage = ref('')
const newsletterMessageType = ref<'success' | 'error' | ''>('')
const contactLoading = ref(false)
const contactMessage = ref('')
const contactMessageType = ref<'success' | 'error' | ''>('')
const toastMessage = ref('')
let toastTimer: ReturnType<typeof setTimeout> | undefined

const contactForm = ref({ name: '', email: '', subject: '', message: '' })
const cartCount = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0))
const cartSubtotal = computed(() => cart.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0))
const activeCollectionName = computed(() => collections.value.find(c => c.slug === activeCollection.value)?.name || '')
const filteredProducts = computed(() => {
  let result = [...products.value]
  if (activeCollection.value) result = result.filter(p => p.collectionSlug === activeCollection.value)
  const q = searchQuery.value.trim().toLowerCase()
  if (q) result = result.filter(p => `${p.name} ${p.category} ${p.description || ''}`.toLowerCase().includes(q))
  if (sortBy.value === 'price-low') result.sort((a, b) => a.price - b.price)
  if (sortBy.value === 'price-high') result.sort((a, b) => b.price - a.price)
  if (sortBy.value === 'name') result.sort((a, b) => a.name.localeCompare(b.name))
  return result
})

function textValue(row: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = row[key]
    if (typeof value === 'string' && value.trim()) return value
  }
  return ''
}
function numberValue(row: Record<string, unknown>, ...keys: string[]): number {
  for (const key of keys) {
    const value = row[key]
    if (typeof value === 'number' && Number.isFinite(value)) return value
    if (typeof value === 'string' && value.trim() && Number.isFinite(Number(value))) return Number(value)
  }
  return 0
}
function normalizeImage(row: Record<string, unknown>, fallback: string): string {
  const direct = textValue(row, 'image_url', 'image', 'cover_image', 'thumbnail_url', 'url')
  if (direct) return direct
  const images = row.images
  if (Array.isArray(images) && images.length) {
    const first = images[0]
    if (typeof first === 'string') return first
    if (first && typeof first === 'object') return textValue(first as Record<string, unknown>, 'image_url', 'url', 'public_url') || fallback
  }
  return fallback
}
function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount)
}
function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
function fallbackProductRows(): ShopProduct[] {
  return [
    { id: 'sample-1', name: 'The Signature Set', price: 85000, image: fallbackImages.ready, category: 'Ready-to-Wear', collectionSlug: 'annies-ready-to-wear', badge: 'Bestseller', colorCount: 3, sizes: ['S', 'M', 'L', 'XL'] },
    { id: 'sample-2', name: 'The Modern Muse', price: 72000, image: fallbackImages.suits, category: 'Contemporary African Suits', collectionSlug: 'contemporary-african-suits', badge: 'New', colorCount: 2, sizes: ['S', 'M', 'L', 'XL'] },
    { id: 'sample-3', name: 'The Celebration Edit', price: 98000, image: fallbackImages.asoebi, category: 'Aso Ebi Special', collectionSlug: 'aso-ebi-special', colorCount: 4, sizes: ['S', 'M', 'L', 'XL'] },
    { id: 'sample-4', name: 'The Occasion Look', price: 125000, image: fallbackImages.bride, category: 'Focus on the Bride', collectionSlug: 'focus-on-the-bride', badge: 'Limited edit', sizes: ['S', 'M', 'L', 'XL'] },
  ]
}
async function loadCatalog() {
  loading.value = true
  try {
    // Expected endpoint: /catalog-public. The mapper accepts the common API field names.
    const response = await ApiService.get<CatalogResponse | Array<Record<string, unknown>>>('/catalog-public')
    const root = Array.isArray(response) ? { products: response } : response
    const payload = root.data || root
    if (Array.isArray(payload.collections) && payload.collections.length) {
      const fallbackCollectionImages = collections.value
      collections.value = payload.collections.map((raw, index) => {
        const row = raw as Record<string, unknown>
        const name = textValue(row, 'name', 'title')
        const slug = textValue(row, 'slug') || slugify(name)
        return {
          slug,
          name: name || 'Collection',
          kicker: textValue(row, 'description', 'subtitle') || fallbackCollectionImages[index % fallbackCollectionImages.length].kicker,
          image: normalizeImage(row, fallbackCollectionImages[index % fallbackCollectionImages.length].image),
        }
      })
    }
    if (Array.isArray(payload.products) && payload.products.length) {
      products.value = payload.products.map((raw, index) => {
        const row = raw as Record<string, unknown>
        const collectionName = textValue(row, 'collection_name', 'collection', 'category')
        const collectionSlug = textValue(row, 'collection_slug') || slugify(collectionName)
        const name = textValue(row, 'name', 'title') || `Annie Petars Piece ${index + 1}`
        const amount = numberValue(row, 'price', 'price_naira', 'amount')
        // If backend returns integer kobo, convert it to naira.
        const price = textValue(row, 'price_unit') === 'kobo' || (amount > 1000000) ? amount / 100 : amount
        const sizesRaw = row.sizes
        const sizes = Array.isArray(sizesRaw) ? sizesRaw.map(String) : ['S', 'M', 'L', 'XL']
        return {
          id: textValue(row, 'id') || `product-${index}`,
          name,
          slug: textValue(row, 'slug') || slugify(name),
          description: textValue(row, 'description'),
          price,
          currency: 'NGN',
          image: normalizeImage(row, [fallbackImages.ready, fallbackImages.suits, fallbackImages.asoebi, fallbackImages.bride][index % 4]),
          category: collectionName || 'Annie Petars',
          collectionSlug,
          badge: textValue(row, 'badge', 'label'),
          colorCount: numberValue(row, 'color_count') || undefined,
          sizes,
        }
      })
    } else {
      products.value = fallbackProductRows()
    }
  } catch (error) {
    console.error('Unable to load public catalogue:', error)
    products.value = fallbackProductRows()
  } finally {
    loading.value = false
    setTimeout(() => AOS.refreshHard(), 50)
  }
}
function selectCollection(slug: string) {
  activeCollection.value = slug
  searchQuery.value = ''
}
function resetFilters() {
  activeCollection.value = ''
  searchQuery.value = ''
  sortBy.value = 'featured'
}
function openProduct(product: ShopProduct) {
  selectedProduct.value = product
  selectedSize.value = product.sizes?.[0] || ''
  modalError.value = ''
}
function addToCart(product: ShopProduct) {
  if (product.sizes?.length) {
    openProduct(product)
    return
  }
  addCartItem(product)
}
function addSelectedProduct() {
  if (!selectedProduct.value) return
  if (selectedProduct.value.sizes?.length && !selectedSize.value) {
    modalError.value = 'Please choose a size before adding this piece to your bag.'
    return
  }
  addCartItem(selectedProduct.value, selectedSize.value)
  selectedProduct.value = null
}
function addCartItem(product: ShopProduct, size?: string) {
  const existing = cart.value.find(item => item.product.id === product.id && item.size === size)
  if (existing) existing.quantity += 1
  else cart.value.push({ product, quantity: 1, size })
  showToast(`${product.name} added to your bag`)
}
function changeQuantity(productId: string, amount: number) {
  const item = cart.value.find(entry => entry.product.id === productId)
  if (!item) return
  item.quantity += amount
  if (item.quantity <= 0) cart.value = cart.value.filter(entry => entry !== item)
}
function removeFromCart(productId: string) {
  cart.value = cart.value.filter(item => item.product.id !== productId)
}
function isWishlisted(id: string) {
  return wishlist.value.includes(id)
}
function toggleWishlist(id: string) {
  wishlist.value = isWishlisted(id) ? wishlist.value.filter(item => item !== id) : [...wishlist.value, id]
  showToast(isWishlisted(id) ? 'Added to your wishlist' : 'Removed from your wishlist')
}
function showToast(message: string) {
  toastMessage.value = message
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastMessage.value = '' }, 2600)
}
function accountNotice() {
  showToast('Customer accounts are coming soon.')
}
function beginCheckout() {
  showToast('Checkout needs to be connected to your payment provider.')
  // Connect this action to a server-created order + payment session before going live.
}
async function subscribeNewsletter() {
  newsletterLoading.value = true
  newsletterMessage.value = ''
  try {
    await ApiService.post('/newsletter-subscribe', { email: newsletterEmail.value })
    newsletterMessage.value = 'You’re on the list. Thank you for joining us!'
    newsletterMessageType.value = 'success'
    newsletterEmail.value = ''
  } catch (error) {
    console.error('Newsletter subscription failed:', error)
    newsletterMessage.value = 'We could not subscribe you right now. Please try again shortly.'
    newsletterMessageType.value = 'error'
  } finally {
    newsletterLoading.value = false
  }
}
async function submitContactForm() {
  contactLoading.value = true
  contactMessage.value = ''
  try {
    const endpoint = customRequestOpen ? '/custom-request' : '/contact-submit'
    await ApiService.post(endpoint, {
      name: contactForm.value.name,
      email: contactForm.value.email,
      subject: contactForm.value.subject || (customRequestOpen ? 'Made-to-measure request' : 'Website enquiry'),
      message: contactForm.value.message,
    })
    contactMessage.value = customRequestOpen ? 'Your request has been sent. Our team will be in touch.' : 'Your message has been sent. Thank you for reaching out.'
    contactMessageType.value = 'success'
    contactForm.value = { name: '', email: '', subject: '', message: '' }
  } catch (error) {
    console.error('Form submission failed:', error)
    contactMessage.value = 'We could not send your message just now. Please try again shortly.'
    contactMessageType.value = 'error'
  } finally {
    contactLoading.value = false
  }
}
function closeForms() {
  customRequestOpen.value = false
  contactOpen.value = false
  contactMessage.value = ''
}
function onEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    searchOpen.value = false
    mobileMenuOpen.value = false
    cartOpen.value = false
    selectedProduct.value = null
    closeForms()
  }
}
watch([searchOpen, cartOpen, selectedProduct, customRequestOpen, contactOpen], ([search, cartShown, product, custom, contact]) => {
  document.body.style.overflow = (search || cartShown || !!product || custom || contact) ? 'hidden' : ''
})
onMounted(() => {
  AOS.init({ duration: 750, easing: 'ease-out-cubic', once: true, offset: 70, mirror: false })
  window.addEventListener('keydown', onEscape)
  void loadCatalog()
})
onUnmounted(() => {
  window.removeEventListener('keydown', onEscape)
  document.body.style.overflow = ''
  if (toastTimer) clearTimeout(toastTimer)
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap');

:root {
  --ap-ink: #211c1a;
  --ap-muted: #827873;
  --ap-paper: #fbf8f4;
  --ap-white: #fffdfa;
  --ap-accent: #9c6556;
  --ap-accent-dark: #71483d;
  --ap-blush: #ead8cf;
  --ap-line: #e8dfd8;
  --ap-font: 'DM Sans', sans-serif;
  --ap-display: 'Playfair Display', Georgia, serif;
}
.shop-page { color: var(--ap-ink); background: var(--ap-white); font-family: var(--ap-font); font-size: 14px; overflow: clip; }
.shop-page * { box-sizing: border-box; }
.shop-page a { color: inherit; text-decoration: none; }
.shop-page button, .shop-page input, .shop-page select, .shop-page textarea { font: inherit; }
.shop-page button { cursor: pointer; }
.shop-page button:disabled { opacity: .6; cursor: not-allowed; }
.announcement-bar { min-height: 35px; padding: 8px 5.5%; display: flex; align-items: center; justify-content: space-between; background: var(--ap-ink); color: #fff8f2; font-size: 10px; letter-spacing: .09em; text-transform: uppercase; }
.announcement-bar i { margin-left: 8px; }
.site-header { height: 91px; padding: 0 5.5%; display: flex; align-items: center; justify-content: space-between; gap: 28px; background: rgba(255,253,250,.96); position: sticky; top: 0; z-index: 30; border-bottom: 1px solid rgba(33,28,26,.07); backdrop-filter: blur(16px); }
.brand-mark { display: flex; flex-direction: column; align-items: center; gap: 5px; flex-shrink: 0; }
.brand-name { font-family: var(--ap-display); font-size: 22px; letter-spacing: .17em; font-weight: 600; white-space: nowrap; }
.brand-subtitle { font-size: 8px; letter-spacing: .31em; color: var(--ap-muted); }
.desktop-nav { display: flex; align-items: center; gap: clamp(18px, 3vw, 43px); margin-left: auto; margin-right: auto; }
.desktop-nav a, .footer-column a { font-size: 11px; color: #554c47; transition: color .25s; }
.desktop-nav a:hover, .footer-column a:hover { color: var(--ap-accent); }
.header-actions { display: flex; align-items: center; gap: 18px; }
.icon-button { border: 0; background: transparent; color: var(--ap-ink); display: inline-grid; place-items: center; width: 35px; height: 35px; font-size: 16px; transition: background .2s, transform .2s; border-radius: 50%; }
.icon-button:hover { background: var(--ap-paper); transform: translateY(-1px); }
.bag-button { display: flex; align-items: center; gap: 9px; border: 0; background: transparent; font-size: 11px; }
.bag-button i { font-size: 16px; }
.bag-count { display: grid; place-items: center; width: 20px; height: 20px; border-radius: 50%; color: white; background: var(--ap-accent); font-size: 10px; }
.mobile-menu-toggle { display: none; }
.search-panel { position: sticky; top: 91px; z-index: 29; padding: 18px 5.5% 14px; background: var(--ap-paper); border-bottom: 1px solid var(--ap-line); }
.search-inner { display: flex; align-items: center; gap: 14px; max-width: 850px; margin: auto; }
.search-inner > i { color: var(--ap-accent); }
.search-inner input { border: 0; background: transparent; outline: none; flex: 1; min-width: 0; padding: 12px 0; font-size: 15px; }
.search-hint { max-width: 850px; margin: 0 auto; color: var(--ap-muted); font-size: 11px; }
.mobile-menu { display: none; }
.hero-section { display: grid; grid-template-columns: .9fr 1.1fr; min-height: 620px; background: var(--ap-paper); padding: 55px 5.5% 50px; gap: 6%; align-items: center; position: relative; }
.hero-copy { padding: 30px 0 20px 4%; max-width: 550px; position: relative; z-index: 2; }
.eyebrow { margin: 0 0 18px; color: var(--ap-accent); font-size: 9px; font-weight: 700; letter-spacing: .21em; text-transform: uppercase; }
.eyebrow > span { display: inline-block; width: 24px; height: 1px; margin: 0 8px 3px 0; background: var(--ap-accent); }
.hero-copy h1 { font-family: var(--ap-display); font-size: clamp(48px, 5.3vw, 78px); font-weight: 500; line-height: 1.07; letter-spacing: -.045em; margin: 0; }
.hero-copy h1 em, .section-heading h2 em, .editorial-content h2 em, .made-copy h2 em, .story-inner h2 em, .newsletter-copy h2 em { color: var(--ap-accent); font-weight: 500; }
.hero-description { max-width: 405px; color: var(--ap-muted); font-size: 13px; line-height: 1.95; margin: 25px 0 29px; }
.hero-cta-row { display: flex; align-items: center; gap: 25px; flex-wrap: wrap; }
.button { min-height: 48px; padding: 0 22px; display: inline-flex; align-items: center; justify-content: center; gap: 15px; border: 1px solid transparent; font-size: 10px; letter-spacing: .04em; transition: transform .25s, background .25s, color .25s, box-shadow .25s; }
.button:hover { transform: translateY(-3px); box-shadow: 0 10px 22px rgba(38,27,22,.12); }
.button-dark { background: var(--ap-ink); color: white !important; }
.button-dark:hover { background: var(--ap-accent-dark); }
.button-light { background: var(--ap-white); color: var(--ap-ink) !important; }
.button-outline { background: transparent; color: var(--ap-ink); border-color: #cfc1b8; }
.button-outline:hover { background: var(--ap-ink); color: white; }
.text-link { display: inline-flex; align-items: center; gap: 10px; font-size: 10px; font-weight: 600; border-bottom: 1px solid #b6a49a; padding-bottom: 7px; transition: gap .2s, color .2s; }
.text-link:hover { gap: 15px; color: var(--ap-accent); }
.hero-footnote { display: flex; align-items: center; gap: 12px; margin-top: 64px; color: var(--ap-muted); font-size: 10px; letter-spacing: .04em; }
.hero-line { width: 37px; height: 1px; background: var(--ap-accent); }
.hero-visual { position: relative; padding: 0 5% 0 0; }
.hero-image-wrap { height: clamp(400px, 43vw, 570px); position: relative; overflow: hidden; }
.hero-image-wrap img, .collection-card img, .product-image-wrap img, .editorial-banner > img, .made-image > img, .modal-image img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .8s cubic-bezier(.2,.7,.2,1); }
.hero-image-wrap img { object-position: center 35%; }
.hero-image-wrap:hover img, .collection-card:hover img, .product-card:hover .product-image-wrap img { transform: scale(1.035); }
.hero-image-caption { position: absolute; left: 22px; right: 22px; bottom: 20px; color: white; display: flex; align-items: center; justify-content: space-between; font-size: 8px; letter-spacing: .16em; }
.hero-sticker { position: absolute; right: -7px; top: 50px; width: 112px; height: 112px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--ap-blush); border-radius: 50%; transform: rotate(9deg); box-shadow: 0 8px 30px #4c2d211a; }
.hero-sticker span { font-size: 8px; letter-spacing: .23em; }
.hero-sticker strong { font-family: var(--ap-display); font-size: 20px; line-height: 1.02; text-align: center; font-weight: 500; }
.hero-sticker i { font-size: 10px; margin-top: 7px; color: var(--ap-accent); }
.hero-side-note { position: absolute; right: -18px; bottom: 30px; writing-mode: vertical-rl; transform: rotate(180deg); letter-spacing: .2em; font-size: 8px; color: var(--ap-muted); }
.trust-strip { min-height: 87px; padding: 20px 8%; display: flex; align-items: center; justify-content: space-between; gap: 24px; border-bottom: 1px solid var(--ap-line); border-top: 1px solid var(--ap-line); }
.trust-strip > div { display: flex; align-items: center; gap: 12px; color: #635952; font-size: 10px; letter-spacing: .02em; }
.trust-strip i { color: var(--ap-accent); font-size: 16px; }
.section { padding: 105px 7%; }
.section-heading { display: flex; align-items: end; justify-content: space-between; gap: 30px; margin-bottom: 38px; }
.section-heading .eyebrow { margin-bottom: 12px; }
.section-heading h2, .made-copy h2, .newsletter-copy h2 { font-family: var(--ap-display); font-size: clamp(36px, 4vw, 52px); font-weight: 500; line-height: 1.12; letter-spacing: -.035em; margin: 0; }
.collection-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 15px; }
.collection-card { display: block; height: 360px; position: relative; overflow: hidden; background: var(--ap-paper); color: white !important; }
.collection-card:nth-child(2n) { margin-top: 30px; }
.collection-card img { object-position: center; }
.collection-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, #170f0b15 20%, #170f0b9c 100%); transition: background .3s; }
.collection-card:hover .collection-overlay { background: linear-gradient(180deg, #170f0b05 0%, #170f0bd1 100%); }
.collection-index { position: absolute; top: 17px; left: 17px; font-size: 9px; letter-spacing: .12em; }
.collection-info { position: absolute; left: 20px; right: 18px; bottom: 22px; display: flex; flex-direction: column; gap: 8px; }
.collection-info > span:first-child { font-size: 8px; text-transform: uppercase; letter-spacing: .15em; opacity: .8; }
.collection-info strong { font-family: var(--ap-display); font-size: clamp(18px, 1.7vw, 24px); line-height: 1.12; font-weight: 500; }
.collection-link { display: flex; align-items: center; gap: 9px; font-size: 9px; margin-top: 5px; text-transform: uppercase; letter-spacing: .13em; }
.collection-link i { transition: transform .25s; }
.collection-card:hover .collection-link i { transform: translateX(5px); }
.products-section { background: var(--ap-paper); }
.product-heading { margin-bottom: 32px; }
.product-tools { display: flex; align-items: center; gap: 18px; }
.sort-control { display: flex; align-items: center; gap: 10px; color: var(--ap-muted); font-size: 10px; }
.sort-control select { border: 0; border-bottom: 1px solid var(--ap-line); background: transparent; padding: 9px 2px; outline: none; color: var(--ap-ink); font-size: 10px; }
.clear-filter { border: 0; background: transparent; color: var(--ap-accent); font-size: 10px; }
.product-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 32px 18px; }
.product-card { min-width: 0; }
.product-image-wrap { position: relative; overflow: hidden; aspect-ratio: 3 / 4; background: #eee5dd; cursor: pointer; }
.product-image-wrap img { object-position: center 28%; }
.product-badge { position: absolute; top: 13px; left: 13px; background: var(--ap-white); padding: 7px 10px; font-size: 8px; letter-spacing: .1em; text-transform: uppercase; }
.wishlist-button { position: absolute; top: 10px; right: 10px; border: 0; border-radius: 50%; width: 33px; height: 33px; display: grid; place-items: center; background: #fffdfae8; color: var(--ap-ink); transition: color .2s, transform .2s; }
.wishlist-button:hover { color: var(--ap-accent); transform: scale(1.08); }
.quick-view { position: absolute; bottom: 12px; left: 12px; right: 12px; height: 39px; display: flex; align-items: center; justify-content: center; gap: 10px; border: 0; background: #fffdfaf2; color: var(--ap-ink); font-size: 10px; transform: translateY(150%); transition: transform .3s; }
.product-card:hover .quick-view, .quick-view:focus { transform: translateY(0); }
.product-details { padding-top: 15px; }
.product-name-row { display: flex; align-items: start; justify-content: space-between; gap: 8px; }
.product-name-row h3 { font-size: 12px; line-height: 1.5; font-weight: 600; margin: 0; }
.color-count { color: var(--ap-muted); font-size: 9px; white-space: nowrap; padding-top: 2px; }
.product-category { color: var(--ap-muted); font-size: 10px; margin: 5px 0 13px; }
.product-bottom { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--ap-line); padding-top: 11px; }
.product-price { font-size: 12px; font-weight: 600; }
.add-button { width: 31px; height: 31px; border: 1px solid #d7c8bf; background: transparent; border-radius: 50%; display: grid; place-items: center; transition: background .2s, color .2s; }
.add-button:hover { background: var(--ap-ink); color: white; border-color: var(--ap-ink); }
.center-cta { display: flex; justify-content: center; margin-top: 52px; }
.empty-products { text-align: center; padding: 65px 20px; }
.empty-products > i { font-size: 28px; color: var(--ap-accent); }
.empty-products h3 { font-family: var(--ap-display); font-size: 28px; font-weight: 500; margin: 16px 0 8px; }
.empty-products p { color: var(--ap-muted); margin-bottom: 22px; }
.product-skeleton { animation: pulse 1.4s ease-in-out infinite; }
.skeleton-image { aspect-ratio: 3/4; background: #e9e0d9; }
.skeleton-line { height: 10px; width: 70%; background: #e9e0d9; margin-top: 14px; }
.skeleton-line.short { width: 42%; margin-top: 8px; }
@keyframes pulse { 50% { opacity: .55; } }
.editorial-banner { min-height: 530px; position: relative; overflow: hidden; color: white; display: flex; align-items: center; padding: 80px 10%; }
.editorial-banner > img { position: absolute; inset: 0; object-position: center 40%; }
.editorial-shade { position: absolute; inset: 0; background: linear-gradient(90deg, #20130ed9 0%, #20130e9c 42%, #20130e10 100%); }
.editorial-content { position: relative; max-width: 480px; }
.eyebrow.light { color: #f1d9ce; }
.eyebrow.light > span { background: #f1d9ce; }
.editorial-content h2 { font-family: var(--ap-display); font-size: clamp(42px, 5vw, 65px); line-height: 1.08; font-weight: 500; letter-spacing: -.03em; margin: 0; }
.editorial-content h2 em { color: #edcbbd; }
.editorial-content > p:not(.eyebrow) { max-width: 380px; color: #f2e8e2; font-size: 12px; line-height: 1.9; margin: 20px 0 26px; }
.editorial-number { position: absolute; bottom: 24px; right: 6%; font-size: 8px; letter-spacing: .2em; color: #fff9; }
.made-to-measure { display: grid; grid-template-columns: 1fr 1fr; gap: 11%; align-items: center; padding-top: 115px; padding-bottom: 115px; }
.made-image { position: relative; height: 550px; }
.made-image > img { object-position: center; }
.image-stamp { position: absolute; bottom: 25px; right: -25px; width: 115px; height: 115px; border-radius: 50%; background: var(--ap-blush); display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 9px; letter-spacing: .12em; line-height: 1.5; text-align: center; transform: rotate(7deg); }
.image-stamp i { color: var(--ap-accent); margin-top: 5px; }
.made-copy h2 { max-width: 480px; }
.made-copy > p:not(.eyebrow) { color: var(--ap-muted); line-height: 1.9; font-size: 12px; margin: 22px 0; max-width: 470px; }
.made-copy ul { padding: 0; list-style: none; display: grid; gap: 15px; margin: 25px 0 30px; }
.made-copy li { display: flex; align-items: center; gap: 11px; font-size: 11px; color: #554c47; }
.made-copy li i { color: var(--ap-accent); font-size: 11px; }
.made-note { display: block; margin-top: 17px; color: var(--ap-muted); font-size: 10px; }
.story-section { background: var(--ap-paper); padding: 100px 7%; text-align: center; }
.story-inner { max-width: 800px; margin: auto; }
.story-asterisk { display: grid; place-items: center; width: 42px; height: 42px; border: 1px solid var(--ap-blush); border-radius: 50%; color: var(--ap-accent); margin: 0 auto 28px; font-size: 13px; }
.story-inner h2 { font-family: var(--ap-display); font-size: clamp(34px, 4.2vw, 53px); font-weight: 500; line-height: 1.2; letter-spacing: -.03em; margin: 0; }
.story-inner > p:not(.eyebrow) { max-width: 600px; margin: 23px auto 25px; color: var(--ap-muted); font-size: 12px; line-height: 2; }
.story-inner .text-link { margin-top: 7px; }
.newsletter-section { padding: 80px 10%; display: grid; grid-template-columns: 1fr 1fr; gap: 12%; align-items: center; background: #efe3dc; }
.newsletter-copy .eyebrow { margin-bottom: 12px; }
.newsletter-copy h2 { font-size: clamp(38px, 4vw, 50px); }
.newsletter-copy > p:not(.eyebrow) { color: #75665f; max-width: 380px; font-size: 11px; line-height: 1.8; margin: 15px 0 0; }
.newsletter-form label, .request-modal form label { display: block; color: #665851; font-size: 10px; margin-bottom: 9px; }
.newsletter-input-row { display: flex; align-items: center; border-bottom: 1px solid #a99488; }
.newsletter-input-row input { flex: 1; min-width: 0; border: 0; background: transparent; outline: 0; padding: 13px 0; font-size: 13px; }
.newsletter-input-row button { width: 42px; height: 42px; border: 0; background: var(--ap-ink); color: white; transition: background .2s; }
.newsletter-input-row button:hover { background: var(--ap-accent); }
.form-note { font-size: 10px; color: #897a72; line-height: 1.6; margin: 12px 0 0; }
.form-note.success { color: #2b7653; }
.form-note.error { color: #b63c34; }
.site-footer { padding: 68px 7% 20px; background: #211c1a; color: #f9f0ea; }
.footer-main { display: grid; grid-template-columns: 1.45fr .8fr .9fr 1.2fr; gap: 6%; padding-bottom: 55px; }
.footer-brand .brand-mark { align-items: flex-start; }
.footer-brand .brand-name { font-size: 20px; color: #fffaf6; }
.footer-brand .brand-subtitle { color: #b8a49a; }
.footer-brand > p, .footer-contact > p { color: #bbaea6; font-size: 10px; line-height: 1.9; max-width: 250px; margin: 20px 0; }
.social-links { display: flex; gap: 10px; margin-top: 22px; }
.social-links a { width: 32px; height: 32px; display: grid; place-items: center; border: 1px solid #51443d; border-radius: 50%; color: #f5e9e2; transition: background .2s; }
.social-links a:hover { background: var(--ap-accent); }
.footer-column, .footer-contact { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; }
.footer-column h4, .footer-contact h4 { font-size: 10px; text-transform: uppercase; letter-spacing: .16em; margin: 3px 0 8px; color: #fff6ef; }
.footer-column a { color: #bbaea6; font-size: 10px; }
.footer-contact > p { margin: 0 0 2px; }
.footer-contact > a { font-size: 10px; color: #f4d5c8; }
.footer-contact > a i { margin-left: 5px; font-size: 9px; }
.footer-bottom { border-top: 1px solid #493e38; padding-top: 20px; display: flex; align-items: center; justify-content: space-between; gap: 18px; color: #9f9189; font-size: 9px; }
.footer-bottom > div { display: flex; gap: 18px; }
.footer-bottom a:hover { color: white; }
.drawer-backdrop, .modal-backdrop { position: fixed; z-index: 80; inset: 0; background: #17110ec0; backdrop-filter: blur(4px); display: flex; justify-content: flex-end; }
.cart-drawer { width: min(480px, 100%); height: 100%; background: var(--ap-white); padding: 30px; display: flex; flex-direction: column; overflow: auto; box-shadow: -15px 0 60px #0002; }
.drawer-header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 22px; border-bottom: 1px solid var(--ap-line); }
.drawer-header .eyebrow { margin-bottom: 8px; }
.drawer-header h2 { font-family: var(--ap-display); font-size: 32px; font-weight: 500; margin: 0; }
.drawer-header h2 span { color: var(--ap-muted); font-family: var(--ap-font); font-size: 13px; }
.cart-items { flex: 1; overflow-y: auto; }
.cart-item { display: grid; grid-template-columns: 88px 1fr 25px; gap: 15px; padding: 20px 0; border-bottom: 1px solid var(--ap-line); }
.cart-item > img { width: 88px; height: 112px; object-fit: cover; }
.cart-item-info h3 { margin: 2px 0 7px; font-size: 12px; }
.cart-item-info > p { margin: 0 0 12px; color: var(--ap-muted); font-size: 11px; }
.quantity-control { display: inline-flex; align-items: center; gap: 14px; border: 1px solid var(--ap-line); padding: 4px 7px; }
.quantity-control button { border: 0; background: transparent; font-size: 15px; padding: 0 3px; }
.quantity-control span { font-size: 10px; }
.remove-item { border: 0; background: transparent; color: var(--ap-muted); align-self: start; padding: 5px; }
.cart-summary { padding-top: 22px; }
.cart-summary > p { display: flex; justify-content: space-between; font-size: 12px; margin: 0 0 9px; }
.cart-summary > p strong { font-size: 15px; }
.cart-summary > small { display: block; color: var(--ap-muted); font-size: 10px; line-height: 1.6; margin-bottom: 20px; }
.checkout-button { width: 100%; justify-content: space-between; }
.continue-shopping { width: 100%; border: 0; background: transparent; padding: 16px 0 0; font-size: 10px; color: var(--ap-muted); }
.cart-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.cart-empty > i { color: var(--ap-accent); font-size: 28px; }
.cart-empty h3 { font-family: var(--ap-display); font-size: 25px; font-weight: 500; margin: 18px 0 5px; }
.cart-empty p { color: var(--ap-muted); font-size: 11px; margin-bottom: 22px; }
.modal-backdrop { justify-content: center; align-items: center; padding: 24px; overflow-y: auto; }
.product-modal { position: relative; display: grid; grid-template-columns: 1fr 1fr; max-width: 900px; width: 100%; max-height: min(680px, 90vh); overflow: auto; background: var(--ap-white); }
.modal-close { position: absolute; top: 12px; right: 12px; z-index: 3; background: #fffdfae8; }
.modal-image { min-height: 450px; background: var(--ap-paper); }
.modal-copy { padding: 60px 45px 35px; align-self: center; }
.modal-copy .eyebrow { margin-bottom: 12px; }
.modal-copy h2, .request-modal h2 { font-family: var(--ap-display); font-size: 34px; line-height: 1.15; font-weight: 500; margin: 0; }
.modal-price { font-size: 15px; font-weight: 600; margin: 18px 0; }
.modal-description { color: var(--ap-muted); font-size: 11px; line-height: 1.9; }
.size-selector { margin: 25px 0; }
.size-selector > span { display: block; font-size: 10px; margin-bottom: 11px; }
.size-selector > div { display: flex; gap: 8px; flex-wrap: wrap; }
.size-selector button { min-width: 40px; height: 38px; border: 1px solid var(--ap-line); background: transparent; font-size: 10px; }
.size-selector button.selected, .size-selector button:hover { background: var(--ap-ink); color: white; border-color: var(--ap-ink); }
.modal-add { width: 100%; justify-content: space-between; margin-top: 12px; }
.modal-help { color: var(--ap-muted); font-size: 10px; line-height: 1.7; margin-top: 18px; }
.modal-help i { color: var(--ap-accent); margin-right: 5px; }
.modal-help a { color: var(--ap-accent-dark); text-decoration: underline; }
.request-modal { position: relative; background: var(--ap-white); width: min(620px, 100%); padding: 48px; max-height: 90vh; overflow: auto; }
.request-modal .eyebrow { margin-bottom: 12px; }
.request-modal h2 { max-width: 460px; font-size: 39px; }
.request-intro { color: var(--ap-muted); font-size: 11px; line-height: 1.8; margin: 15px 0 26px; }
.request-modal form { display: grid; gap: 18px; }
.request-modal form label { margin: 0; }
.request-modal input, .request-modal textarea { display: block; width: 100%; margin-top: 8px; border: 1px solid var(--ap-line); padding: 13px 12px; outline: none; background: #fffdfa; font-size: 11px; resize: vertical; }
.request-modal input:focus, .request-modal textarea:focus { border-color: var(--ap-accent); }
.form-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.request-modal .button { justify-self: start; }
.shop-toast { position: fixed; z-index: 100; bottom: 25px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 10px; background: var(--ap-ink); color: white; padding: 14px 20px; box-shadow: 0 10px 30px #0002; font-size: 11px; max-width: calc(100% - 30px); }
.shop-toast i { color: #c6e2ce; }
.fade-enter-active, .fade-leave-active, .slide-down-enter-active, .slide-down-leave-active, .drawer-enter-active, .drawer-leave-active, .toast-enter-active, .toast-leave-active { transition: all .28s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
.drawer-enter-from .cart-drawer, .drawer-leave-to .cart-drawer { transform: translateX(100%); }
.drawer-backdrop .cart-drawer { transition: transform .32s cubic-bezier(.2,.7,.2,1); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, 12px); }
@media (max-width: 1100px) {
  .desktop-nav { gap: 17px; }
  .desktop-nav a { font-size: 10px; }
  .hero-section { gap: 4%; }
  .collection-grid { grid-template-columns: repeat(4, minmax(0,1fr)); }
  .collection-card { height: 310px; }
  .section { padding-left: 5.5%; padding-right: 5.5%; }
  .product-grid { gap: 28px 14px; }
  .made-to-measure { gap: 8%; }
}
@media (max-width: 800px) {
  .announcement-bar { justify-content: center; text-align: center; font-size: 9px; }
  .announcement-desktop { display: none; }
  .site-header { height: 75px; padding: 0 5%; gap: 12px; }
  .mobile-menu-toggle { display: inline-grid; }
  .desktop-nav { display: none; }
  .brand-mark { margin-right: auto; }
  .brand-name { font-size: 18px; }
  .brand-subtitle { font-size: 7px; }
  .header-actions { gap: 6px; }
  .account-button, .bag-label { display: none; }
  .mobile-menu { display: flex; flex-direction: column; position: fixed; z-index: 28; top: 110px; left: 0; right: 0; background: var(--ap-white); padding: 15px 6% 24px; box-shadow: 0 15px 25px #211c1a12; }
  .mobile-menu a { padding: 15px 0; display: flex; justify-content: space-between; border-bottom: 1px solid var(--ap-line); font-family: var(--ap-display); font-size: 21px; }
  .mobile-menu a i { font-size: 12px; align-self: center; color: var(--ap-accent); }
  .search-panel { top: 75px; }
  .hero-section { grid-template-columns: 1fr; padding: 44px 6% 35px; gap: 32px; }
  .hero-copy { padding: 0; }
  .hero-copy h1 { font-size: clamp(48px, 10vw, 68px); }
  .hero-description { margin: 19px 0 24px; }
  .hero-footnote { margin-top: 28px; }
  .hero-visual { padding: 0 4% 0 0; }
  .hero-image-wrap { height: min(115vw, 560px); }
  .hero-sticker { width: 95px; height: 95px; right: -9px; top: 25px; }
  .hero-sticker strong { font-size: 17px; }
  .hero-side-note { right: -15px; }
  .trust-strip { padding: 22px 6%; display: grid; grid-template-columns: 1fr 1fr; gap: 20px 15px; }
  .trust-strip > div { font-size: 9px; }
  .section { padding: 72px 6%; }
  .section-heading { align-items: flex-start; margin-bottom: 25px; }
  .section-heading h2, .made-copy h2 { font-size: 38px; }
  .collection-grid { grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; }
  .collection-card { height: 310px; }
  .collection-card:nth-child(2n) { margin-top: 20px; }
  .collection-info { left: 14px; right: 12px; bottom: 17px; }
  .collection-info strong { font-size: 20px; }
  .collection-info > span:first-child { font-size: 7px; }
  .product-heading { display: block; }
  .product-tools { justify-content: space-between; margin-top: 20px; }
  .product-grid { grid-template-columns: repeat(2, minmax(0,1fr)); gap: 28px 13px; }
  .product-name-row { display: block; }
  .color-count { display: block; margin-top: 3px; }
  .quick-view { transform: translateY(0); height: 34px; font-size: 9px; }
  .editorial-banner { min-height: 500px; padding: 60px 7%; }
  .editorial-shade { background: linear-gradient(90deg, #20130edb 0%, #20130e9e 65%, #20130e42 100%); }
  .editorial-content h2 { font-size: 48px; }
  .made-to-measure { grid-template-columns: 1fr; gap: 48px; padding-top: 75px; padding-bottom: 75px; }
  .made-image { height: 420px; margin-right: 18px; }
  .image-stamp { right: -17px; width: 95px; height: 95px; }
  .story-section { padding: 75px 7%; }
  .story-inner h2 { font-size: 37px; }
  .newsletter-section { padding: 62px 7%; grid-template-columns: 1fr; gap: 35px; }
  .footer-main { grid-template-columns: 1fr 1fr; gap: 40px 25px; }
  .footer-bottom { flex-wrap: wrap; line-height: 1.6; }
  .footer-bottom > span:nth-child(2) { display: none; }
  .product-modal { grid-template-columns: 1fr; max-width: 500px; max-height: 90vh; }
  .modal-image { min-height: 300px; height: 42vh; }
  .modal-copy { padding: 28px 25px 25px; }
  .modal-copy h2 { font-size: 29px; }
  .request-modal { padding: 38px 25px 28px; }
  .request-modal h2 { font-size: 32px; }
}
@media (max-width: 420px) {
  .hero-cta-row { align-items: flex-start; flex-direction: column; gap: 18px; }
  .hero-copy h1 { font-size: 46px; }
  .collection-card { height: 250px; }
  .collection-info strong { font-size: 18px; }
  .section-heading h2, .made-copy h2 { font-size: 34px; }
  .sort-control { gap: 5px; }
  .sort-control select { max-width: 132px; }
  .footer-main { gap: 35px 18px; }
  .footer-contact > a { overflow-wrap: anywhere; }
  .form-two-col { grid-template-columns: 1fr; gap: 18px; }
  .cart-drawer { padding: 22px 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .shop-page *, .shop-page *::before, .shop-page *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}
</style>