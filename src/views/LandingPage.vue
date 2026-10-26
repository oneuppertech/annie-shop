<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import ApiService from '@/services/api'

/* ---------- Config ---------- */
const LANDING_URL = 'https://anniepetars.com' // your landing page
const WHATSAPP = 'https://wa.me/2348084903580'
const PAGE_SIZE = 24
const LS_CART = 'ap_cart_v1'
const LS_WISH = 'ap_wish_v1'

/* ---------- State ---------- */
const collections = ref([])
const products = ref([])
const loading = ref(true)
const loadingMore = ref(false)
const loadError = ref(false)
const hasMore = ref(false)
const offset = ref(0)

const searchOpen = ref(false)
const searchQuery = ref('')
const activeCollection = ref('')
const featuredOnly = ref(false)
const newOnly = ref(false)
const sortBy = ref('featured')

const cartOpen = ref(false)
const wishOpen = ref(false)
const cart = ref([])
const wishlist = ref([])

const selected = ref(null)
const activeImage = ref(0)
const pickSize = ref('')
const pickColour = ref('')
const pickQty = ref(1)
const modalError = ref('')

const toast = ref('')
let toastTimer
let searchTimer
let requestId = 0

/* ---------- Helpers ---------- */
const formatKobo = (kobo) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format((kobo || 0) / 100)

const text = (row, ...keys) => {
  for (const k of keys) {
    const v = row?.[k]
    if (typeof v === 'string' && v.trim()) return v
  }
  return ''
}
const num = (row, ...keys) => {
  for (const k of keys) {
    const v = row?.[k]
    if (v !== null && v !== undefined && v !== '' && Number.isFinite(Number(v))) return Number(v)
  }
  return null
}
const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

function normalizeImages(row) {
  const raw = row.images || row.product_images || []
  const list = Array.isArray(raw) ? raw : []
  const mapped = list
    .map((i) =>
      typeof i === 'string'
        ? { url: i, primary: false, order: 0 }
        : {
            url: text(i, 'image_url', 'url'),
            primary: !!i.is_primary,
            order: Number(i.sort_order || 0)
          }
    )
    .filter((i) => i.url)
    .sort((a, b) => Number(b.primary) - Number(a.primary) || a.order - b.order)
    .map((i) => i.url)
  const single = text(row, 'image_url', 'image', 'primary_image')
  if (!mapped.length && single) mapped.push(single)
  return mapped
}

function normalizeProduct(row, index) {
  const variantsRaw = row.variants || row.product_variants || []
  const variants = (Array.isArray(variantsRaw) ? variantsRaw : [])
    .filter((v) => v.is_active !== false)
    .map((v) => ({
      id: v.id,
      size: v.size || '',
      colour: v.colour || v.color || '',
      price: num(v, 'price_kobo'),
      stock: num(v, 'stock_quantity') ?? 0
    }))
  const col = row.collection && typeof row.collection === 'object' ? row.collection : {}
  const colName = text(col, 'name') || text(row, 'collection_name')
  const images = normalizeImages(row)
  return {
    id: row.id || `p-${index}`,
    name: text(row, 'name', 'title') || 'AnniePetars piece',
    slug: text(row, 'slug') || slugify(text(row, 'name')),
    short: text(row, 'short_description'),
    description: text(row, 'description'),
    fabric: text(row, 'fabric'),
    care: text(row, 'care_instructions'),
    price: num(row, 'price_kobo') ?? Math.round((num(row, 'price') || 0) * 100),
    compareAt: num(row, 'compare_at_price_kobo'),
    images,
    image: images[0] || '',
    collectionName: colName,
    collectionSlug: text(col, 'slug') || text(row, 'collection_slug') || slugify(colName),
    featured: !!row.is_featured,
    isNew: !!row.is_new_arrival,
    customisable: !!row.is_customisable,
    backorder: !!row.allow_backorder,
    variants,
    publishedAt: row.published_at || row.created_at || ''
  }
}

const hasVariants = (p) => p.variants.length > 0
const productInStock = (p) =>
  !hasVariants(p) || p.backorder || p.variants.some((v) => v.stock > 0)
const onSale = (p) => p.compareAt && p.compareAt > p.price

/* ---------- Data ---------- */
function buildQuery(extraOffset = 0) {
  const params = new URLSearchParams()
  if (activeCollection.value) params.set('collection', activeCollection.value)
  if (searchQuery.value.trim()) params.set('q', searchQuery.value.trim())
  if (featuredOnly.value) params.set('featured', 'true')
  params.set('limit', String(PAGE_SIZE))
  params.set('offset', String(extraOffset))
  return params.toString()
}

async function loadCatalog({ append = false } = {}) {
  const id = ++requestId
  if (append) loadingMore.value = true
  else {
    loading.value = true
    offset.value = 0
  }
  loadError.value = false
  try {
    const res = await ApiService.get(`/catalog-public?${buildQuery(append ? offset.value : 0)}`)
    if (id !== requestId) return
    const root = Array.isArray(res) ? { products: res } : res?.data || res || {}
    if (Array.isArray(root.collections) && root.collections.length) {
      collections.value = root.collections.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        tagline: c.tagline || c.description || '',
        image: c.image_url || ''
      }))
    }
    const rows = (root.products || []).map(normalizeProduct)
    products.value = append ? [...products.value, ...rows] : rows
    offset.value = products.value.length
    hasMore.value = rows.length === PAGE_SIZE
  } catch (e) {
    if (id !== requestId) return
    console.error('Unable to load catalogue:', e)
    loadError.value = true
    if (!append) products.value = []
    hasMore.value = false
  } finally {
    if (id === requestId) {
      loading.value = false
      loadingMore.value = false
    }
  }
}

const visibleProducts = computed(() => {
  let list = [...products.value]
  if (newOnly.value) list = list.filter((p) => p.isNew)
  if (sortBy.value === 'price-low') list.sort((a, b) => a.price - b.price)
  else if (sortBy.value === 'price-high') list.sort((a, b) => b.price - a.price)
  else if (sortBy.value === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
  else if (sortBy.value === 'newest')
    list.sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)))
  return list
})

const activeCollectionData = computed(() =>
  collections.value.find((c) => c.slug === activeCollection.value)
)
const headingTitle = computed(() => activeCollectionData.value?.name || 'All pieces')
const filtersActive = computed(
  () => !!(activeCollection.value || searchQuery.value || featuredOnly.value || newOnly.value)
)

watch(searchQuery, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => loadCatalog(), 350)
})
watch([activeCollection, featuredOnly], () => loadCatalog())

function resetFilters() {
  activeCollection.value = ''
  searchQuery.value = ''
  featuredOnly.value = false
  newOnly.value = false
  sortBy.value = 'featured'
}

/* ---------- Product modal ---------- */
const sizes = computed(() =>
  selected.value ? [...new Set(selected.value.variants.map((v) => v.size).filter(Boolean))] : []
)
const colours = computed(() =>
  selected.value ? [...new Set(selected.value.variants.map((v) => v.colour).filter(Boolean))] : []
)
const matchedVariant = computed(() => {
  const p = selected.value
  if (!p || !hasVariants(p)) return null
  return (
    p.variants.find(
      (v) =>
        (!sizes.value.length || v.size === pickSize.value) &&
        (!colours.value.length || v.colour === pickColour.value)
    ) || null
  )
})
const modalPrice = computed(() => matchedVariant.value?.price ?? selected.value?.price ?? 0)
const modalStock = computed(() => {
  const p = selected.value
  if (!p) return 0
  if (!hasVariants(p)) return 99
  return matchedVariant.value ? matchedVariant.value.stock : 0
})
const modalSoldOut = computed(() => {
  const p = selected.value
  if (!p || p.backorder) return false
  return hasVariants(p) && !!matchedVariant.value && matchedVariant.value.stock <= 0
})
const sizeAvailable = (s) => {
  const p = selected.value
  if (p.backorder) return true
  return p.variants.some(
    (v) => v.size === s && v.stock > 0 && (!pickColour.value || v.colour === pickColour.value)
  )
}
const colourAvailable = (c) => {
  const p = selected.value
  if (p.backorder) return true
  return p.variants.some(
    (v) => v.colour === c && v.stock > 0 && (!pickSize.value || v.size === pickSize.value)
  )
}

function openProduct(p) {
  selected.value = p
  activeImage.value = 0
  pickQty.value = 1
  modalError.value = ''
  const firstInStock = p.variants.find((v) => v.stock > 0) || p.variants[0]
  pickSize.value = firstInStock?.size || ''
  pickColour.value = firstInStock?.colour || ''
}
function closeProduct() {
  selected.value = null
}

function quickAdd(p) {
  if (hasVariants(p) && (p.variants.length > 1 || p.variants[0].size || p.variants[0].colour)) {
    openProduct(p)
    return
  }
  if (!productInStock(p)) return
  addToCart(p, p.variants[0] || null, 1)
}

/* ---------- Cart ---------- */
const cartCount = computed(() => cart.value.reduce((s, i) => s + i.qty, 0))
const cartSubtotal = computed(() => cart.value.reduce((s, i) => s + i.price * i.qty, 0))

function addToCart(p, variant, qty) {
  const key = `${p.id}:${variant?.id || 'base'}`
  const max = p.backorder || !variant ? 99 : Math.max(variant.stock, 0)
  const existing = cart.value.find((i) => i.key === key)
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, max || existing.qty + qty)
  } else {
    cart.value.push({
      key,
      productId: p.id,
      variantId: variant?.id || null,
      name: p.name,
      image: p.image,
      size: variant?.size || '',
      colour: variant?.colour || '',
      price: variant?.price ?? p.price,
      qty,
      max
    })
  }
  showToast(`${p.name} added to your bag`)
}

function addFromModal() {
  const p = selected.value
  if (!p) return
  if (hasVariants(p)) {
    if ((sizes.value.length && !pickSize.value) || (colours.value.length && !pickColour.value)) {
      modalError.value = 'Choose your size and colour first.'
      return
    }
    if (!matchedVariant.value) {
      modalError.value = 'That combination is not available.'
      return
    }
    if (modalSoldOut.value) {
      modalError.value = 'That option is sold out.'
      return
    }
  }
  addToCart(p, matchedVariant.value, pickQty.value)
  closeProduct()
  cartOpen.value = true
}

function changeQty(key, delta) {
  const item = cart.value.find((i) => i.key === key)
  if (!item) return
  const next = item.qty + delta
  if (next <= 0) return removeItem(key)
  if (item.max && next > item.max) {
    showToast('That is all we have in stock')
    return
  }
  item.qty = next
}
const removeItem = (key) => (cart.value = cart.value.filter((i) => i.key !== key))

function beginCheckout() {
  // TODO: POST cart (variant ids + quantities only, never prices) to a create-order edge function.
  // The server should re-price from the database, create the order + payment session,
  // and return a payment URL to redirect to.
  showToast('Checkout is not connected yet')
}

/* ---------- Wishlist ---------- */
const isWished = (id) => wishlist.value.includes(id)
function toggleWish(id) {
  const adding = !isWished(id)
  wishlist.value = adding ? [...wishlist.value, id] : wishlist.value.filter((x) => x !== id)
  showToast(adding ? 'Saved to your wishlist' : 'Removed from your wishlist')
}
const wishedProducts = computed(() => products.value.filter((p) => wishlist.value.includes(p.id)))

/* ---------- UI plumbing ---------- */
function showToast(msg) {
  toast.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = ''), 2400)
}

function safeLoad(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}
watch(cart, (v) => { try { localStorage.setItem(LS_CART, JSON.stringify(v)) } catch {} }, { deep: true })
watch(wishlist, (v) => { try { localStorage.setItem(LS_WISH, JSON.stringify(v)) } catch {} }, { deep: true })

watch([cartOpen, wishOpen, selected], ([c, w, s]) => {
  document.body.style.overflow = c || w || s ? 'hidden' : ''
})

const onKey = (e) => {
  if (e.key !== 'Escape') return
  cartOpen.value = false
  wishOpen.value = false
  searchOpen.value = false
  selected.value = null
}

onMounted(() => {
  cart.value = safeLoad(LS_CART)
  wishlist.value = safeLoad(LS_WISH)
  window.addEventListener('keydown', onKey)
  loadCatalog()
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
  clearTimeout(toastTimer)
  clearTimeout(searchTimer)
})
</script>

<template>
  <div class="ap min-h-screen bg-[#FFF7F1] text-[#2A1B16] antialiased overflow-x-hidden">
    <!-- ANNOUNCEMENT -->
    <div class="bg-[#2A1B16] px-6 py-2 text-center text-xs text-[#FFF7F1]">
      Worldwide delivery to Nigeria, the UK, the USA and Ghana. Made-to-measure available on selected pieces.
    </div>

    <!-- HEADER -->
    <header class="sticky top-0 z-40 border-b border-[#2A1B16]/10 bg-[#FFF7F1]/90 backdrop-blur-md">
      <div class="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-6">
        <a :href="LANDING_URL" class="flex flex-col leading-none" aria-label="AnniePetars home">
          <span class="font-display text-2xl tracking-tight">AnniePetars</span>
          <span class="mt-1 text-[10px] tracking-[.28em] text-[#5A413A]">THE SHOP</span>
        </a>

        <nav class="hidden items-center gap-8 text-sm md:flex" aria-label="Shop navigation">
          <a href="#shop" class="link-u">Shop all</a>
          <a :href="`${LANDING_URL}#custom`" class="link-u">Custom outfits</a>
          <a :href="LANDING_URL" class="link-u"><i class="fa-solid fa-arrow-left mr-1 text-xs"></i> Back to site</a>
        </nav>

        <div class="flex items-center gap-1">
          <button class="icon-btn" aria-label="Search" @click="searchOpen = !searchOpen">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
          <button class="icon-btn relative" aria-label="Wishlist" @click="wishOpen = true">
            <i class="fa-regular fa-heart"></i>
            <span v-if="wishlist.length" class="count-dot">{{ wishlist.length }}</span>
          </button>
          <button class="icon-btn relative" aria-label="Shopping bag" @click="cartOpen = true">
            <i class="fa-solid fa-bag-shopping"></i>
            <span v-if="cartCount" class="count-dot pop">{{ cartCount }}</span>
          </button>
        </div>
      </div>

      <transition name="drop">
        <div v-if="searchOpen" class="border-t border-[#2A1B16]/10 bg-[#FFE6D6]">
          <div class="mx-auto flex max-w-3xl items-center gap-3 px-6 py-4">
            <i class="fa-solid fa-magnifying-glass text-[#C4623A]"></i>
            <input
              v-model="searchQuery"
              type="search"
              autofocus
              placeholder="Search by name, fabric or occasion"
              aria-label="Search products"
              class="field !bg-transparent !py-2"
            />
            <button class="icon-btn" aria-label="Close search" @click="searchOpen = false">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      </transition>
    </header>

    <main id="shop">
      <!-- INTRO BANNER -->
      <section class="relative overflow-hidden">
        <div class="blob blob-a"></div>
        <div class="blob blob-b"></div>
        <div class="relative mx-auto max-w-7xl px-6 pb-10 pt-14 md:pt-20">
          <div class="flex flex-wrap items-end justify-between gap-8">
            <div class="max-w-2xl">
              <h1 class="font-display text-[clamp(2.6rem,6vw,5rem)] leading-[1] tracking-tight">
                Pieces made to be <span class="italic text-[#E2784A]">worn</span> and remembered.
              </h1>
              <p class="mt-5 max-w-xl text-lg leading-relaxed text-[#5A413A]">
                Ready-to-wear, bridal, Aso Ebi and more. Choose a ready piece, or ask us to make it to your measurements.
              </p>
            </div>
            <a :href="`${LANDING_URL}#custom`" class="btn-ghost">Request a custom outfit</a>
          </div>

          <ul class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <li v-for="t in [
              { i: 'fa-truck-fast', t: 'Worldwide delivery' },
              { i: 'fa-ruler-combined', t: 'Made-to-measure options' },
              { i: 'fa-rotate-left', t: 'Easy returns on eligible pieces' },
              { i: 'fa-lock', t: 'Secure checkout' }
            ]" :key="t.t" class="flex items-center gap-3 text-sm">
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFC4A3]">
                <i :class="`fa-solid ${t.i}`"></i>
              </span>
              {{ t.t }}
            </li>
          </ul>
        </div>
      </section>

      <!-- COLLECTION RAIL -->
      <section class="border-y border-[#2A1B16]/10 bg-[#FFD9C2]/60" aria-label="Collections">
        <div class="mx-auto max-w-7xl px-6 py-5">
          <div class="no-scrollbar flex gap-3 overflow-x-auto pb-1">
            <button class="chip" :class="{ on: !activeCollection }" @click="activeCollection = ''">
              All pieces
            </button>
            <button
              v-for="c in collections"
              :key="c.slug"
              class="chip"
              :class="{ on: activeCollection === c.slug }"
              @click="activeCollection = c.slug"
            >
              <img v-if="c.image" :src="c.image" alt="" class="h-7 w-7 rounded-full object-cover" />
              {{ c.name }}
            </button>
          </div>
        </div>
      </section>

      <!-- PRODUCTS -->
      <section class="mx-auto max-w-7xl px-6 py-14">
        <div class="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 class="font-display text-4xl leading-tight md:text-5xl">{{ headingTitle }}</h2>
            <p v-if="activeCollectionData?.tagline" class="mt-2 max-w-xl text-[#5A413A]">
              {{ activeCollectionData.tagline }}
            </p>
            <p v-else class="mt-2 text-sm text-[#5A413A]">
              <template v-if="!loading">{{ visibleProducts.length }} {{ visibleProducts.length === 1 ? 'piece' : 'pieces' }}</template>
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <div class="seg">
              <button :class="{ on: featuredOnly }" @click="featuredOnly = !featuredOnly">Featured</button>
              <button :class="{ on: newOnly }" @click="newOnly = !newOnly">New arrivals</button>
            </div>
            <label class="flex items-center gap-2 text-sm">
              <span class="text-[#5A413A]">Sort</span>
              <select v-model="sortBy" aria-label="Sort products" class="field !w-auto !py-2 !pr-8">
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="name">Name</option>
              </select>
            </label>
            <button v-if="filtersActive" class="link-u text-sm" @click="resetFilters">Clear filters</button>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          <div v-for="n in 8" :key="n" class="skeleton">
            <div class="aspect-[3/4] rounded-3xl bg-[#FFE6D6]"></div>
            <div class="mt-4 h-4 w-3/4 rounded-full bg-[#FFE6D6]"></div>
            <div class="mt-2 h-3 w-1/3 rounded-full bg-[#FFE6D6]"></div>
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="loadError" class="rounded-[2rem] bg-white/60 px-6 py-20 text-center">
          <i class="fa-solid fa-triangle-exclamation text-3xl text-[#E2784A]"></i>
          <h3 class="mt-4 font-display text-3xl">We could not load the shop</h3>
          <p class="mx-auto mt-2 max-w-md text-[#5A413A]">Check your connection and try again.</p>
          <button class="btn-peach mt-6" @click="loadCatalog()">Try again</button>
        </div>

        <!-- Empty -->
        <div v-else-if="!visibleProducts.length" class="rounded-[2rem] bg-white/60 px-6 py-20 text-center">
          <i class="fa-solid fa-shirt text-3xl text-[#E2784A]"></i>
          <h3 class="mt-4 font-display text-3xl">No pieces match yet</h3>
          <p class="mx-auto mt-2 max-w-md text-[#5A413A]">
            Try a different search or collection. Looking for something specific? We can make it for you.
          </p>
          <div class="mt-6 flex flex-wrap justify-center gap-3">
            <button class="btn-peach" @click="resetFilters">Show all pieces</button>
            <a :href="`${LANDING_URL}#custom`" class="btn-ghost">Request a custom outfit</a>
          </div>
        </div>

        <!-- Grid -->
        <div v-else class="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          <article v-for="p in visibleProducts" :key="p.id" class="group">
            <div class="relative aspect-[3/4] cursor-pointer overflow-hidden rounded-3xl bg-[#FFE6D6]" @click="openProduct(p)">
              <img v-if="p.image" :src="p.image" :alt="p.name" loading="lazy"
                class="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div v-else class="flex h-full items-center justify-center text-[#C4623A]/50">
                <i class="fa-solid fa-image text-4xl"></i>
              </div>

              <div class="absolute left-3 top-3 flex flex-col items-start gap-1.5">
                <span v-if="!productInStock(p)" class="badge bg-[#2A1B16] text-[#FFF7F1]">Sold out</span>
                <span v-else-if="onSale(p)" class="badge bg-[#E2784A] text-white">Sale</span>
                <span v-if="p.isNew" class="badge bg-white">New</span>
                <span v-if="p.customisable" class="badge bg-[#FFC4A3]">Customisable</span>
              </div>

              <button class="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 transition hover:scale-110"
                :aria-label="isWished(p.id) ? 'Remove from wishlist' : 'Add to wishlist'"
                @click.stop="toggleWish(p.id)">
                <i :class="isWished(p.id) ? 'fa-solid fa-heart text-[#E2784A]' : 'fa-regular fa-heart'"></i>
              </button>

              <button v-if="productInStock(p)"
                class="absolute inset-x-3 bottom-3 translate-y-0 rounded-full bg-[#2A1B16] py-3 text-sm font-semibold text-[#FFF7F1] transition hover:bg-[#E2784A] md:translate-y-[150%] md:group-hover:translate-y-0 md:focus:translate-y-0"
                @click.stop="quickAdd(p)">
                Add to bag
              </button>
            </div>

            <div class="px-1 pt-4">
              <h3 class="font-display text-xl leading-snug">{{ p.name }}</h3>
              <p v-if="p.collectionName" class="mt-0.5 text-xs text-[#5A413A]">{{ p.collectionName }}</p>
              <p class="mt-2 flex items-baseline gap-2">
                <span class="font-semibold">{{ formatKobo(p.price) }}</span>
                <span v-if="onSale(p)" class="text-xs text-[#5A413A] line-through">{{ formatKobo(p.compareAt) }}</span>
              </p>
            </div>
          </article>
        </div>

        <div v-if="hasMore && !loading" class="mt-14 flex justify-center">
          <button class="btn-ghost" :disabled="loadingMore" @click="loadCatalog({ append: true })">
            {{ loadingMore ? 'Loading...' : 'Load more pieces' }}
          </button>
        </div>
      </section>

      <!-- CUSTOM CTA -->
      <section class="mx-auto max-w-7xl px-6 pb-24">
        <div class="rounded-[2rem] bg-[#F59A6C] px-8 py-14 text-center md:py-16">
          <h2 class="mx-auto max-w-2xl font-display text-3xl leading-tight md:text-5xl">
            Can’t find your fit or style?
          </h2>
          <p class="mx-auto mt-3 max-w-lg">Send us your measurements and a reference photo. We confirm the design, price and timeline before we start.</p>
          <div class="mt-7 flex flex-wrap justify-center gap-4">
            <a :href="`${LANDING_URL}#custom`" class="btn-dark">Request a custom outfit</a>
            <a :href="WHATSAPP" target="_blank" rel="noopener" class="btn-ghost">Chat on WhatsApp</a>
          </div>
        </div>
      </section>
    </main>

    <!-- FOOTER -->
    <footer class="bg-[#2A1B16] px-6 py-10 text-sm text-[#FFF7F1]">
      <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <p>© {{ new Date().getFullYear() }} AnniePetars. All rights reserved.</p>
        <div class="flex flex-wrap gap-6 text-[#FFC4A3]">
          <a :href="LANDING_URL" class="hover:text-white">Main site</a>
          <a :href="`${LANDING_URL}#contact`" class="hover:text-white">Contact</a>
          <a :href="WHATSAPP" target="_blank" rel="noopener" class="hover:text-white">WhatsApp</a>
        </div>
      </div>
    </footer>

    <!-- CART DRAWER -->
    <transition name="drawer">
      <div v-if="cartOpen" class="backdrop justify-end" @click.self="cartOpen = false">
        <aside class="flex h-full w-full max-w-md flex-col bg-[#FFF7F1] shadow-2xl" aria-label="Shopping bag">
          <div class="flex items-center justify-between border-b border-[#2A1B16]/10 px-6 py-5">
            <h2 class="font-display text-3xl">Your bag <span class="font-sans text-sm text-[#5A413A]">({{ cartCount }})</span></h2>
            <button class="icon-btn" aria-label="Close bag" @click="cartOpen = false"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div v-if="cart.length" class="flex-1 overflow-y-auto px-6">
            <article v-for="i in cart" :key="i.key" class="grid grid-cols-[84px_1fr_auto] gap-4 border-b border-[#2A1B16]/10 py-5">
              <img v-if="i.image" :src="i.image" :alt="i.name" class="h-28 w-[84px] rounded-2xl object-cover" />
              <div v-else class="h-28 w-[84px] rounded-2xl bg-[#FFE6D6]"></div>
              <div>
                <h3 class="font-display text-lg leading-snug">{{ i.name }}</h3>
                <p v-if="i.size || i.colour" class="mt-0.5 text-xs text-[#5A413A]">
                  {{ [i.size && `Size ${i.size}`, i.colour].filter(Boolean).join(', ') }}
                </p>
                <p class="mt-1 text-sm font-semibold">{{ formatKobo(i.price) }}</p>
                <div class="mt-3 inline-flex items-center rounded-full border border-[#2A1B16]/20">
                  <button class="qty-btn" aria-label="Decrease quantity" @click="changeQty(i.key, -1)">−</button>
                  <span class="w-6 text-center text-sm">{{ i.qty }}</span>
                  <button class="qty-btn" aria-label="Increase quantity" @click="changeQty(i.key, 1)">+</button>
                </div>
              </div>
              <button class="self-start p-1 text-[#5A413A] hover:text-[#E2784A]" aria-label="Remove item" @click="removeItem(i.key)">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </article>
          </div>

          <div v-else class="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <span class="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFC4A3] text-2xl"><i class="fa-solid fa-bag-shopping"></i></span>
            <h3 class="mt-5 font-display text-3xl">Your bag is empty</h3>
            <p class="mt-2 text-[#5A413A]">Pick a piece you love and it will wait for you here.</p>
            <button class="btn-peach mt-6" @click="cartOpen = false">Continue shopping</button>
          </div>

          <div v-if="cart.length" class="border-t border-[#2A1B16]/10 bg-white/60 px-6 py-6">
            <p class="flex items-center justify-between">
              <span>Subtotal</span><strong class="text-xl">{{ formatKobo(cartSubtotal) }}</strong>
            </p>
            <p class="mt-1 text-xs text-[#5A413A]">Shipping and any fees are calculated at checkout.</p>
            <button class="btn-dark mt-5 w-full justify-center" @click="beginCheckout">Checkout</button>
            <button class="mt-3 w-full text-sm link-u" @click="cartOpen = false">Continue shopping</button>
          </div>
        </aside>
      </div>
    </transition>

    <!-- WISHLIST DRAWER -->
    <transition name="drawer">
      <div v-if="wishOpen" class="backdrop justify-end" @click.self="wishOpen = false">
        <aside class="flex h-full w-full max-w-md flex-col bg-[#FFF7F1] shadow-2xl" aria-label="Wishlist">
          <div class="flex items-center justify-between border-b border-[#2A1B16]/10 px-6 py-5">
            <h2 class="font-display text-3xl">Wishlist <span class="font-sans text-sm text-[#5A413A]">({{ wishlist.length }})</span></h2>
            <button class="icon-btn" aria-label="Close wishlist" @click="wishOpen = false"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div v-if="wishedProducts.length" class="flex-1 overflow-y-auto px-6">
            <article v-for="p in wishedProducts" :key="p.id" class="grid grid-cols-[72px_1fr_auto] items-center gap-4 border-b border-[#2A1B16]/10 py-4">
              <img v-if="p.image" :src="p.image" :alt="p.name" class="h-24 w-[72px] rounded-2xl object-cover" />
              <div v-else class="h-24 w-[72px] rounded-2xl bg-[#FFE6D6]"></div>
              <div>
                <h3 class="font-display text-lg leading-snug">{{ p.name }}</h3>
                <p class="text-sm font-semibold">{{ formatKobo(p.price) }}</p>
                <button class="link-u mt-2 text-sm" @click="wishOpen = false; openProduct(p)">View piece</button>
              </div>
              <button class="p-1 text-[#5A413A] hover:text-[#E2784A]" aria-label="Remove from wishlist" @click="toggleWish(p.id)">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </article>
          </div>
          <div v-else class="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <span class="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFC4A3] text-2xl"><i class="fa-regular fa-heart"></i></span>
            <h3 class="mt-5 font-display text-3xl">Nothing saved yet</h3>
            <p class="mt-2 text-[#5A413A]">Tap the heart on any piece to save it for later.</p>
            <button class="btn-peach mt-6" @click="wishOpen = false">Browse pieces</button>
          </div>
        </aside>
      </div>
    </transition>

    <!-- PRODUCT MODAL -->
    <transition name="swap">
      <div v-if="selected" class="backdrop items-center justify-center p-4" @click.self="closeProduct">
        <section class="relative grid max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[2rem] bg-[#FFF7F1] shadow-2xl md:grid-cols-2"
          role="dialog" aria-modal="true" :aria-label="selected.name">
          <button class="icon-btn absolute right-3 top-3 z-10 bg-white/90" aria-label="Close" @click="closeProduct">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <div class="bg-[#FFE6D6] md:max-h-[92vh] md:overflow-y-auto">
            <div class="aspect-[3/4] w-full">
              <img v-if="selected.images[activeImage]" :src="selected.images[activeImage]" :alt="selected.name" class="h-full w-full object-cover" />
              <div v-else class="flex h-full items-center justify-center text-[#C4623A]/50"><i class="fa-solid fa-image text-5xl"></i></div>
            </div>
            <div v-if="selected.images.length > 1" class="flex gap-2 overflow-x-auto p-3">
              <button v-for="(img, idx) in selected.images" :key="img + idx"
                class="h-16 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition"
                :class="idx === activeImage ? 'border-[#E2784A]' : 'border-transparent opacity-70'"
                :aria-label="`Show image ${idx + 1}`" @click="activeImage = idx">
                <img :src="img" alt="" class="h-full w-full object-cover" />
              </button>
            </div>
          </div>

          <div class="overflow-y-auto p-7 md:max-h-[92vh] md:p-10">
            <p v-if="selected.collectionName" class="text-sm text-[#5A413A]">{{ selected.collectionName }}</p>
            <h2 class="mt-1 font-display text-4xl leading-tight">{{ selected.name }}</h2>
            <p class="mt-3 flex items-baseline gap-3">
              <span class="text-2xl font-semibold">{{ formatKobo(modalPrice) }}</span>
              <span v-if="onSale(selected)" class="text-sm text-[#5A413A] line-through">{{ formatKobo(selected.compareAt) }}</span>
            </p>
            <p v-if="selected.short || selected.description" class="mt-4 leading-relaxed text-[#5A413A]">
              {{ selected.description || selected.short }}
            </p>

            <div v-if="sizes.length" class="mt-6">
              <p class="mb-2 text-sm font-semibold">Size</p>
              <div class="flex flex-wrap gap-2">
                <button v-for="s in sizes" :key="s" class="opt" :class="{ on: pickSize === s }" :disabled="!sizeAvailable(s)"
                  @click="pickSize = s; modalError = ''">{{ s }}</button>
              </div>
            </div>

            <div v-if="colours.length" class="mt-5">
              <p class="mb-2 text-sm font-semibold">Colour</p>
              <div class="flex flex-wrap gap-2">
                <button v-for="c in colours" :key="c" class="opt" :class="{ on: pickColour === c }" :disabled="!colourAvailable(c)"
                  @click="pickColour = c; modalError = ''">{{ c }}</button>
              </div>
            </div>

            <p v-if="hasVariants(selected) && matchedVariant && !selected.backorder" class="mt-4 text-xs"
              :class="modalStock <= 0 ? 'text-[#B63C34]' : modalStock <= 3 ? 'text-[#C4623A]' : 'text-[#5A413A]'">
              {{ modalStock <= 0 ? 'Sold out' : modalStock <= 3 ? `Only ${modalStock} left` : 'In stock' }}
            </p>

            <div class="mt-6 flex items-center gap-4">
              <div class="inline-flex items-center rounded-full border border-[#2A1B16]/20">
                <button class="qty-btn" aria-label="Decrease quantity" @click="pickQty = Math.max(1, pickQty - 1)">−</button>
                <span class="w-8 text-center">{{ pickQty }}</span>
                <button class="qty-btn" aria-label="Increase quantity" @click="pickQty = Math.min(pickQty + 1, selected.backorder ? 99 : Math.max(modalStock, 1))">+</button>
              </div>
              <button class="btn-peach flex-1 justify-center" :disabled="modalSoldOut" @click="addFromModal">
                {{ modalSoldOut ? 'Sold out' : 'Add to bag' }}
              </button>
            </div>
            <p v-if="modalError" class="mt-3 text-sm text-[#B63C34]">{{ modalError }}</p>

            <div v-if="selected.fabric || selected.care" class="mt-8 grid gap-4 border-t border-[#2A1B16]/10 pt-6 text-sm">
              <div v-if="selected.fabric"><p class="font-semibold">Fabric</p><p class="mt-1 text-[#5A413A]">{{ selected.fabric }}</p></div>
              <div v-if="selected.care"><p class="font-semibold">Care</p><p class="mt-1 text-[#5A413A]">{{ selected.care }}</p></div>
            </div>

            <div v-if="selected.customisable" class="mt-6 rounded-2xl bg-[#FFE6D6] p-4 text-sm">
              Want a different fit? This piece can be made to your measurements.
              <a :href="`${LANDING_URL}#custom`" class="link-u font-semibold">Request a custom version</a>
            </div>

            <button class="mt-6 text-sm link-u" @click="toggleWish(selected.id)">
              <i :class="isWished(selected.id) ? 'fa-solid fa-heart text-[#E2784A]' : 'fa-regular fa-heart'"></i>
              {{ isWished(selected.id) ? 'Saved to wishlist' : 'Save to wishlist' }}
            </button>
          </div>
        </section>
      </div>
    </transition>

    <!-- TOAST -->
    <transition name="drop">
      <div v-if="toast" class="fixed bottom-6 left-1/2 z-[120] flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-3 rounded-full bg-[#2A1B16] px-5 py-3 text-sm text-[#FFF7F1] shadow-xl" role="status">
        <i class="fa-solid fa-circle-check text-[#FFC4A3]"></i>{{ toast }}
      </div>
    </transition>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&family=Manrope:wght@400;500;600&display=swap');

.ap { font-family: 'Manrope', system-ui, sans-serif; }
.ap .font-display { font-family: 'Fraunces', Georgia, serif; font-weight: 300; }
.ap :focus-visible { outline: 2px solid #e2784a; outline-offset: 3px; }
.ap button { cursor: pointer; }
.ap button:disabled { cursor: not-allowed; }

/* Buttons (same as landing page) */
.ap .btn-peach, .ap .btn-ghost, .ap .btn-dark {
  display: inline-flex; align-items: center; border-radius: 999px; padding: .85rem 1.6rem;
  font-weight: 600; font-size: .9rem; transition: transform .3s, background .3s, box-shadow .3s, color .3s;
}
.ap .btn-peach { background: #f59a6c; color: #2a1b16; box-shadow: 0 10px 30px -10px rgba(226,120,74,.7); }
.ap .btn-peach:hover { background: #ffc4a3; transform: translateY(-3px); }
.ap .btn-peach:disabled { opacity: .6; pointer-events: none; }
.ap .btn-ghost { border: 1.5px solid #2a1b16; }
.ap .btn-ghost:hover { background: #2a1b16; color: #fff7f1; transform: translateY(-3px); }
.ap .btn-ghost:disabled { opacity: .6; pointer-events: none; }
.ap .btn-dark { background: #2a1b16; color: #fff7f1; }
.ap .btn-dark:hover { background: #e2784a; }

.ap .link-u { position: relative; }
.ap .link-u::after {
  content: ''; position: absolute; left: 0; bottom: -4px; height: 1.5px; width: 100%;
  background: currentColor; transform: scaleX(0); transform-origin: right; transition: transform .35s;
}
.ap .link-u:hover::after { transform: scaleX(1); transform-origin: left; }

.ap .field {
  width: 100%; border-radius: 1rem; padding: .85rem 1rem; background: #fff7f1;
  border: 1.5px solid transparent; transition: box-shadow .25s, border-color .25s;
}
.ap .field:focus { border-color: #f59a6c; box-shadow: 0 0 0 4px rgba(245,154,108,.25); outline: none; }

.ap .seg { display: inline-flex; background: #ffe6d6; border-radius: 999px; padding: 4px; }
.ap .seg button { padding: .45rem 1rem; border-radius: 999px; font-size: .8rem; transition: all .3s; }
.ap .seg button.on { background: #f59a6c; font-weight: 600; }

/* Shop-specific */
.ap .icon-btn {
  display: inline-flex; align-items: center; justify-content: center; width: 42px; height: 42px;
  border-radius: 999px; transition: background .25s, transform .25s;
}
.ap .icon-btn:hover { background: #ffe6d6; transform: translateY(-1px); }
.ap .count-dot {
  position: absolute; top: 2px; right: 0; min-width: 18px; height: 18px; padding: 0 5px;
  border-radius: 999px; background: #e2784a; color: #fff; font-size: 10px; font-weight: 600;
  display: flex; align-items: center; justify-content: center;
}
.ap .chip {
  display: inline-flex; align-items: center; gap: .55rem; white-space: nowrap; border-radius: 999px;
  padding: .4rem 1rem .4rem .4rem; font-size: .85rem; border: 1.5px solid rgba(42,27,22,.15);
  background: #fff7f1; transition: all .3s;
}
.ap .chip:first-child { padding-left: 1rem; }
.ap .chip:hover { border-color: #2a1b16; }
.ap .chip.on { background: #f59a6c; border-color: #f59a6c; font-weight: 600; }
.ap .badge { border-radius: 999px; padding: .25rem .65rem; font-size: 11px; font-weight: 600; }
.ap .qty-btn { width: 36px; height: 36px; font-size: 1.1rem; border-radius: 999px; }
.ap .qty-btn:hover { background: #ffe6d6; }
.ap .opt {
  min-width: 44px; padding: .55rem 1rem; border-radius: 999px; border: 1.5px solid rgba(42,27,22,.2);
  font-size: .85rem; transition: all .25s;
}
.ap .opt:hover:not(:disabled) { border-color: #2a1b16; }
.ap .opt.on { background: #2a1b16; color: #fff7f1; border-color: #2a1b16; }
.ap .opt:disabled { opacity: .35; text-decoration: line-through; }
.ap .backdrop {
  position: fixed; inset: 0; z-index: 100; display: flex; background: rgba(42,27,22,.55); backdrop-filter: blur(4px);
}
.ap .no-scrollbar { scrollbar-width: none; }
.ap .no-scrollbar::-webkit-scrollbar { display: none; }
.ap .skeleton { animation: apPulse2 1.4s ease-in-out infinite; }
@keyframes apPulse2 { 50% { opacity: .55; } }

.ap .blob { position: absolute; border-radius: 50%; filter: blur(70px); opacity: .7; animation: apDrift 14s ease-in-out infinite alternate; pointer-events: none; }
.ap .blob-a { width: 28rem; height: 28rem; background: #ffc4a3; top: -8rem; right: -8rem; }
.ap .blob-b { width: 20rem; height: 20rem; background: #ffe0cc; bottom: -4rem; left: -6rem; animation-delay: -6s; }
@keyframes apDrift { to { transform: translate(40px, 30px) scale(1.15); } }
.ap .pop { animation: apPop .6s cubic-bezier(.3,1.6,.5,1); }
@keyframes apPop { from { transform: scale(0); } }

/* Vue transitions */
.drop-enter-active, .drop-leave-active { transition: all .35s; }
.drop-enter-from, .drop-leave-to { opacity: 0; transform: translateY(-10px); }
.swap-enter-active, .swap-leave-active { transition: all .35s; }
.swap-enter-from, .swap-leave-to { opacity: 0; transform: translateY(16px); }
.drawer-enter-active, .drawer-leave-active { transition: opacity .3s; }
.drawer-enter-active aside, .drawer-leave-active aside { transition: transform .35s cubic-bezier(.2,.8,.2,1); }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }
.drawer-enter-from aside, .drawer-leave-to aside { transform: translateX(100%); }

@media (prefers-reduced-motion: reduce) {
  .ap *, .ap *::before, .ap *::after {
    animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important;
  }
}
</style>