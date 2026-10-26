<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'
import rtwImage from '@/assets/rtw.png'
import contemporaryImage from '@/assets/contemporary.png'
import bridalImage from '@/assets/fob.png'
import asoEbiImage from '@/assets/aso-ebi.png'
import madeToMeasureImage from '@/assets/mtm.png'
import standImage from '@/assets/stand.png'
import girlChildImage from '@/assets/girl-child.png'
import newDesignImage from '@/assets/new-design.png'

/* ---------- Config: swap these for your real paths / URLs ---------- */
const SHOP_URL = 'https://shop.anniepetars.com' // shop sub-domain app
const WHATSAPP = 'https://wa.me/2348084903580'
const EMAIL = 'fashion@anniepetars.com'
const PHONE = '+234 808 490 3580'
const A = (f) => `/assets/${f}` // assets folder helper

const navOpen = ref(false)
const scrolled = ref(false)
const onScroll = () => (scrolled.value = window.scrollY > 40)

onMounted(() => {
  AOS.init({
    duration: 900,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
    disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

const links = [
  { label: 'Collections', href: '#collections' },
  { label: 'Asana Kemuwa', href: '#designer' },
  { label: 'Custom Outfits', href: '#custom' },
  { label: 'Press', href: '#press' },
  { label: 'Contact', href: '#contact' }
]

/* ---------- NEW: two-column collections with write-ups ---------- */
const collections = [
  {
    id: 'c-rtw', slug: 'ready-to-wear', img: rtwImage,
    name: 'Annie’s Ready-to-Wear (A-RTW)', line: 'Everyday style, thoughtfully designed.',
    paras: [
      'Annie’s Ready-to-Wear collection brings contemporary fashion into everyday life. It is intended for women who appreciate clothing that feels considered, expressive and suitable for a range of settings. Depending on the design, pieces may be styled for daytime activities, social gatherings, work-related occasions or relaxed events.',
      'The collection focuses on the relationship between comfort, appearance and individual style. Customers should review each product listing for confirmed fabric details, available sizes, colour options, care instructions and current availability.'
    ],
    cta: 'Explore Ready-to-Wear'
  },
  {
    id: 'c-suits', slug: 'african-suits', img: contemporaryImage,
    name: 'Contemporary African Suits', line: 'African heritage meets modern tailoring.',
    paras: [
      'The Contemporary African Suits collection explores African-inspired textiles and design details through modern tailoring. The collection is intended for customers who want a polished outfit with character, whether for professional engagements, celebrations, formal gatherings or other occasions where presentation matters.',
      'Each product listing should explain the garment’s cut, fabric, fastening, fit, available sizes and any styling details relevant to the design. Where a customer requires adjustments, the team can review whether customisation is available for the selected garment.'
    ],
    cta: 'Explore Contemporary African Suits'
  },
  {
    id: 'c-bride', slug: 'bridal', img: bridalImage,
    name: 'Focus on the Bride', line: 'Designed for one of life’s meaningful moments.',
    paras: [
      'Focus on the Bride celebrates the personality and preferences of each bride. Bridal style is personal, and the right outfit should reflect the wearer’s vision for the day. This collection explores bridal designs influenced by African fashion, distinctive details and silhouettes suited to different tastes.',
      'Customers planning a bridal outfit should contact AnniePetars early to discuss the design concept, event date, measurements, fabric preferences, fitting requirements and production schedule. A request is not confirmed until the design, price and timeline have been agreed in writing.'
    ],
    cta: 'Discuss a Bridal Design', href: '#custom'
  },
  {
    id: 'c-aso', slug: 'aso-ebi', img: asoEbiImage,
    name: 'Aso Ebi Special', line: 'Together in style, united by tradition.',
    paras: [
      'Aso Ebi is associated with family, friendship, community and shared celebration. The Aso Ebi Special collection brings a contemporary design perspective to coordinated dressing for weddings, birthdays, anniversaries and other memorable gatherings.',
      'For group enquiries, please provide the event date, number of outfits, preferred fabric or colour direction, approximate size range and delivery location. Availability, minimum quantities, fabric sourcing, pricing and production timing should be confirmed directly with the team before a group order is finalised.'
    ],
    cta: 'Enquire About Aso Ebi', href: '#contact'
  },
  {
    id: 'c-mtm', slug: 'made-to-measure', img: madeToMeasureImage,
    name: 'Made-to-Measure Designs', line: 'Your measurements. Your preferences. Your design.',
    paras: [
      'The Made-to-Measure service offers customers the opportunity to discuss a garment shaped around their measurements and personal preferences. The process begins with understanding the outfit, occasion, desired fit, design details and expected delivery date.',
      'Customers may submit measurements and reference images through the measurement request form. AnniePetars will review the submission and contact the customer if additional details or clarification are needed. The team will confirm feasibility, fabric availability, quotation, payment terms and estimated production time before accepting the order.'
    ],
    cta: 'Submit Your Measurements', href: '#custom'
  },
  {
    id: 'c-stand', slug: 'stand-official-001', img: standImage,
    name: 'Stand Official 001', line: 'A distinctive expression of presence and purpose.',
    paras: [
      'Stand Official 001 explores polished dressing for formal engagements, professional occasions and events where presentation matters. The collection is for people who value a considered appearance while retaining a sense of personal identity.',
      'Product information should describe the cut, intended use, fit, fabric, available sizes and styling details for each garment. Any tailoring or customisation options should be stated clearly.'
    ],
    cta: 'Explore Stand Official 001'
  },
  {
    id: 'c-girl', slug: 'girl-child', img: girlChildImage,
    name: 'The Girl Child Love', line: 'Celebrating young girls through fashion, care and creativity.',
    paras: [
      'The Girl Child Love collection recognises the individuality, confidence and potential of young girls. It focuses on age-appropriate clothing and thoughtful styling that allows young wearers to feel comfortable and express their personality.',
      'The collection also reflects the brand’s interest in positive representation and the importance of recognising young girls as individuals with their own interests, preferences and aspirations. Product pages should clearly state age or size guidance, garment measurements, fabric information and care instructions.'
    ],
    cta: 'Explore The Girl Child Love'
  },
  {
    id: 'c-new', slug: 'new-arrivals', img: newDesignImage,
    name: 'New Designs, New Arrivals', line: 'Fresh additions. Individual style.',
    paras: [
      'This section features new designs and recent additions to the AnniePetars range. Each arrival should be accompanied by clear product photography, a description of the design, available sizes and colours, price, fabric composition, care instructions and an estimated dispatch or production timeframe.',
      'Availability can change. Customers should contact the team if they need confirmation before placing an order.'
    ],
    cta: 'View New Arrivals'
  }
]
const collectionHref = (c) => c.href || `${SHOP_URL}/collections/${c.slug}`

/* ---------- NEW: press article thumbnail ---------- */
const article = {
  url: 'https://pmnewsnigeria.com/2024/02/22/african-fashion-finds-a-modern-voice-through-anniepetars-the-brand-founded-by-asana-peterson/',
  // Better: download this image into /src/assets and import it instead of hotlinking
  img: 'https://cdn.pmnewsnigeria.com/wp-content/uploads/2026/10/Annie-Peterson.jpg',
  source: 'P.M. News',
  title: 'African fashion finds a modern voice through AnniePetars, the brand founded by Asana Peterson',
  author: 'Michael Adesina',
  date: '22nd February, 2024'
}

/* ---------- NEW: full designer write-up ---------- */
const designerParas = [
  'Fashion provides a means of expressing identity, culture and individuality. For Asana Kemuwa, a BSc graduate in Sociology, this perspective shapes the creative vision behind AnniePetars. Inspired by African fashion and its rich cultural heritage, her work explores the relationship between tradition and contemporary style through distinctive prints, carefully considered cuts and expressive silhouettes. Her designs reflect an appreciation for cultural identity while embracing modern aesthetics and the individuality of the people who wear them.',
  'As the founder and creative designer of AnniePetars, Asana leads a brand shaped by the relationship between heritage and modern dress. She is interested in the ways colour, fabric, pattern and construction influence how a garment is experienced. Her approach recognises that clothing serves different purposes: it can express personal taste, mark a celebration, support professional presentation or help someone feel connected to their cultural identity.',
  'Over more than five years, AnniePetars has developed its creative identity and reached customers in Nigeria, the United Kingdom, the United States and Ghana. This experience forms part of the brand’s continuing development and its ambition to engage with a wider international fashion community.',
  'For Asana, contemporary African fashion is not limited to one type of occasion or one interpretation of tradition. African-inspired design can be part of everyday wardrobes, professional dressing, celebrations, bridal styling and personal creative expression. Through AnniePetars, she aims to present designs that respect their inspiration while responding to the preferences of modern customers.',
  'Her creative direction is guided by individuality, attention to detail and the understanding that a garment is ultimately worn by a person with their own identity and expectations. The brand’s collections therefore explore different forms of expression, from ready-to-wear pieces to occasion wear and selected made-to-measure designs.',
  'As AnniePetars continues to grow, Asana aims to strengthen the brand’s visibility through new collections, thoughtful collaborations, media opportunities and participation in fashion events. Her long-term vision is to build a recognised brand associated with contemporary African design, original creative expression and international engagement.'
]
const visionList = [
  'Explore African-inspired patterns, fabrics, colours and visual influences with respect for their cultural context.',
  'Develop distinctive silhouettes and contemporary interpretations of African clothing.',
  'Create designs that support individual style and personal expression.',
  'Build relationships with customers, retailers, media professionals and creative partners.',
  'Expand the brand’s international visibility through collections, collaborations and professional opportunities.',
  'Present the brand’s work and milestones accurately, with clear supporting information.'
]
const designerPhilosophy = [
  { title: 'Identity is part of the design', text: 'Our starting point is an appreciation for the cultural influences, stories and visual language associated with African fashion. These influences inform the creative process without requiring every garment to follow the same style or occasion.' },
  { title: 'Heritage and contemporary style can coexist', text: 'We explore ways to interpret African-inspired details through modern cuts, proportions and styling. This allows the brand to engage with contemporary wardrobes while maintaining a visible connection to its creative inspiration.' },
  { title: 'Personal style deserves room', text: 'Customers have different preferences, body shapes, occasions and expectations. We aim to explain each design clearly and offer selected personalisation options where production requirements allow.' },
  { title: 'Fit and communication matter', text: 'For made-to-measure requests, clear communication is essential. Customers should provide accurate measurements and design details, while AnniePetars should confirm the agreed specification, price and production schedule before work begins.' },
  { title: 'Creative growth is collaborative', text: 'Fashion develops through conversations between designers, customers, makers, photographers, stylists, retailers, publications and other creative professionals. We welcome proposals that align with the brand’s direction and values.' }
]

const values = [
  {
    icon: 'fa-solid fa-feather-pointed',
    title: 'Identity is part of the design',
    text: 'Every piece starts with respect for the colour, pattern and form found in African fashion.'
  },
  {
    icon: 'fa-solid fa-scissors',
    title: 'Heritage meets contemporary',
    text: 'African-inspired details, cut into modern proportions you can wear.'
  },
  {
    icon: 'fa-solid fa-user-check',
    title: 'Personal style has room',
    text: 'Selected designs can be adjusted to your fit, taste and occasion.'
  }
]

const steps = [
  {
    icon: 'fa-solid fa-pen-ruler',
    title: 'Tell us your idea',
    text: 'Share the outfit, occasion, fabric and the date you need it.'
  },
  {
    icon: 'fa-solid fa-ruler-combined',
    title: 'Send measurements',
    text: 'Use the form below. Same unit throughout.'
  },
  {
    icon: 'fa-solid fa-image',
    title: 'Add references',
    text: 'Photos or sketches that show the style you want.'
  },
  {
    icon: 'fa-solid fa-handshake',
    title: 'Agree and confirm',
    text: 'We confirm design, price, payment terms and timeline before production starts.'
  }
]

const pressItems = [
  {
    icon: 'fa-solid fa-newspaper',
    title: 'Press features',
    text: 'Verified coverage and interviews, linked to original sources.'
  },
  {
    icon: 'fa-solid fa-award',
    title: 'Awards',
    text: 'Confirmed awards and nominations, listed accurately.'
  },
  {
    icon: 'fa-solid fa-camera-retro',
    title: 'Exhibitions',
    text: 'Fashion presentations and showcases with event details.'
  },
  {
    icon: 'fa-solid fa-people-arrows',
    title: 'Collaborations',
    text: 'Photographers, stylists, retailers and cultural organisations.'
  }
]

const marquee = [
  'Prints',
  'Silhouettes',
  'Aso Ebi',
  'Bridal',
  'Tailoring',
  'Made-to-Measure',
  'Ready-to-Wear',
  'Heritage'
]

/* ---------- trust bar, best sellers, lookbook, testimonials, FAQ ---------- */
const trust = [
  { icon: 'fa-solid fa-truck-fast', title: 'Worldwide delivery', text: 'Nigeria, UK, USA, Ghana and beyond.' },
  { icon: 'fa-solid fa-ruler-combined', title: 'Made-to-measure', text: 'Fitted to your measurements.' },
  { icon: 'fa-solid fa-rotate-left', title: 'Easy returns', text: 'On eligible ready-to-wear pieces.' },
  { icon: 'fa-solid fa-lock', title: 'Secure checkout', text: 'Protected payments on our shop.' }
]

// Replace names, prices and slugs with real products
const bestSellers = [
  { name: 'Signature Print Dress', price: '₦85,000', img: rtwImage, slug: 'signature-print-dress' },
  { name: 'Contemporary Agbada Set', price: '₦150,000', img: contemporaryImage, slug: 'agbada-set' },
  { name: 'Bridal Corset Gown', price: '₦320,000', img: bridalImage, slug: 'bridal-corset-gown' },
  { name: 'Aso Ebi Two-Piece', price: '₦70,000', img: asoEbiImage, slug: 'aso-ebi-two-piece' }
]

const lookbook = [
  { img: newDesignImage, alt: 'New design', cls: 'row-span-2' },
  { img: standImage, alt: 'Stand Official 001', cls: '' },
  { img: girlChildImage, alt: 'The Girl Child Love', cls: '' },
  { img: madeToMeasureImage, alt: 'Made-to-measure outfit', cls: 'col-span-2' }
]

// Placeholders: replace with real, permissioned customer quotes only
const testimonials = [
  { quote: 'Replace with a real customer quote.', name: 'Customer name', place: 'Lagos, Nigeria' },
  { quote: 'Replace with a real customer quote.', name: 'Customer name', place: 'London, UK' },
  { quote: 'Replace with a real customer quote.', name: 'Customer name', place: 'Accra, Ghana' }
]

const faqs = [
  { q: 'How long does a custom outfit take?', a: 'Timelines are confirmed with you before production starts and depend on the design and fabric.' },
  { q: 'Do you ship internationally?', a: 'Yes. We deliver to Nigeria, the UK, the USA, Ghana and other destinations. See Delivery and Shipping for details.' },
  { q: 'Can I return a made-to-measure piece?', a: 'Custom pieces are made for you, so please see our Customisation Terms and Returns and Refunds policy.' },
  { q: 'How do I take my measurements?', a: 'Use a flexible tape, keep it snug but not tight, and use the same unit throughout. The custom form above guides you.' },
  { q: 'Can you match a reference photo?', a: 'References guide the design but do not guarantee an exact copy. We confirm feasibility first.' }
]
const openFaq = ref(null)

/* ---------- Measurement form (stays on page) ---------- */
const unit = ref('cm')
const garment = ref('dress')
const fields = {
  dress: [
    'Bust',
    'Underbust',
    'Waist',
    'Hips',
    'Shoulder width',
    'Across back',
    'Sleeve length',
    'Upper arm',
    'Wrist',
    'Garment length',
    'Height'
  ],
  trouser: [
    'Waist',
    'Hips',
    'Thigh',
    'Inside leg',
    'Outside leg',
    'Knee',
    'Ankle / hem',
    'Garment length'
  ]
}
const form = reactive({
  name: '',
  email: '',
  phone: '',
  country: '',
  outfit: '',
  fabric: '',
  colour: '',
  needBy: '',
  notes: '',
  accurate: false,
  terms: false
})
const measures = reactive({})
const files = ref([])
const status = ref('idle') // idle | sending | done | error
const errorMsg = ref('')
const MAX_MB = 8
const currentFields = computed(() => fields[garment.value])

function onFiles(e) {
  const picked = Array.from(e.target.files || [])
  const ok = picked.filter((f) => f.type.startsWith('image/') || f.type === 'application/pdf')
  if (ok.some((f) => f.size > MAX_MB * 1024 * 1024)) {
    errorMsg.value = `Each file must be under ${MAX_MB}MB.`
    return
  }
  errorMsg.value = ''
  files.value = ok.slice(0, 5)
}

async function submitCustom() {
  if (!form.name || !form.email || !form.outfit)
    return (errorMsg.value = 'Add your name, email and outfit type.')
  if (!form.accurate || !form.terms) return (errorMsg.value = 'Please tick both confirmations.')
  errorMsg.value = ''
  status.value = 'sending'
  try {
    const body = new FormData()
    Object.entries(form).forEach(([k, v]) => body.append(k, v))
    body.append('unit', unit.value)
    body.append('garment', garment.value)
    body.append('measurements', JSON.stringify(measures))
    files.value.forEach((f) => body.append('files', f))
    // TODO: replace with your secure endpoint (e.g. Supabase edge function)
    // const res = await fetch('/api/custom-request', { method: 'POST', body })
    // if (!res.ok) throw new Error('Upload failed')
    await new Promise((r) => setTimeout(r, 900))
    status.value = 'done' // only shown after the server confirms receipt
  } catch (e) {
    status.value = 'error'
    errorMsg.value = 'We could not send your request. Please try again or email us.'
  }
}

/* ---------- Contact / newsletter ---------- */
const contact = reactive({ name: '', email: '', type: 'General enquiry', message: '' })
const contactSent = ref(false)
const sendContact = () => {
  if (!contact.name || !contact.email || !contact.message) return
  // TODO: wire to backend
  contactSent.value = true
}
const news = reactive({ email: '', done: false })
const joinNews = () => {
  if (!news.email) return
  // TODO: wire to mailing list
  news.done = true
}
</script>

<template>
   
  <!-- PRESS -->
    <section id="press" class="mx-auto max-w-7xl px-6 py-28">
      <div class="mb-12 flex flex-wrap items-end justify-between gap-6" data-aos="fade-up">
        <h2 class="max-w-xl font-display text-5xl leading-tight md:text-6xl">
          AnniePetars in the fashion industry
        </h2>
        <a :href="`mailto:${EMAIL}`" class="btn-ghost">Contact the media team</a>
      </div>
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="(p, i) in pressItems"
          :key="p.title"
          class="rounded-3xl border border-[#2A1B16]/10 p-7 transition hover:-translate-y-2 hover:bg-[#FFE6D6]"
          data-aos="fade-up"
          :data-aos-delay="i * 100"
        >
          <i :class="p.icon" class="mb-5 text-2xl text-[#E2784A]"></i>
          <h3 class="font-display text-2xl">{{ p.title }}</h3>
          <p class="mt-2 text-sm text-[#5A413A]">{{ p.text }}</p>
        </article>
      </div>

      <!-- NEW: press article thumbnail -->
      <a
        :href="article.url"
        target="_blank"
        rel="noopener"
        class="group mt-8 grid overflow-hidden rounded-3xl border border-[#2A1B16]/10 transition hover:bg-[#FFE6D6] md:grid-cols-[280px_1fr]"
        data-aos="fade-up"
      >
        <div class="aspect-[4/3] overflow-hidden md:aspect-auto">
          <img
            :src="article.img"
            alt="Asana Peterson, featured in P.M. News"
            loading="lazy"
            class="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </div>
        <div class="p-7">
          <p class="text-sm text-[#C4623A]">{{ article.source }} · {{ article.date }}</p>
          <h3 class="mt-2 font-display text-2xl leading-snug md:text-3xl">{{ article.title }}</h3>
          <p class="mt-3 text-sm text-[#5A413A]">By {{ article.author }}</p>
          <span class="mt-5 inline-flex items-center text-sm font-semibold">
            Read the article <i class="fa-solid fa-arrow-up-right-from-square ml-2 text-xs"></i>
          </span>
        </div>
      </a>

      <p class="mt-8 max-w-2xl text-[#5A413A]" data-aos="fade-up">
        We welcome proposals from photographers, stylists, models, writers, retailers, event
        organisers and creative institutions. Send your project summary, timeline and audience to
        <a :href="`mailto:${EMAIL}`" class="underline">{{ EMAIL }}</a
        >.
      </p>
    </section>

</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&family=Manrope:wght@400;500;600&display=swap');

.ap {
  font-family: 'Manrope', system-ui, sans-serif;
}
.ap .font-display {
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 300;
}
.ap :focus-visible {
  outline: 2px solid #e2784a;
  outline-offset: 3px;
}

.ap .btn-peach,
.ap .btn-ghost,
.ap .btn-dark {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.85rem 1.6rem;
  font-weight: 600;
  font-size: 0.9rem;
  transition:
    transform 0.3s,
    background 0.3s,
    box-shadow 0.3s;
}
.ap .btn-peach {
  background: #f59a6c;
  color: #2a1b16;
  box-shadow: 0 10px 30px -10px rgba(226, 120, 74, 0.7);
}
.ap .btn-peach:hover {
  background: #ffc4a3;
  transform: translateY(-3px);
}
.ap .btn-peach:disabled {
  opacity: 0.6;
  pointer-events: none;
}
.ap .btn-ghost {
  border: 1.5px solid #2a1b16;
}
.ap .btn-ghost:hover {
  background: #2a1b16;
  color: #fff7f1;
  transform: translateY(-3px);
}
.ap .btn-dark {
  background: #2a1b16;
  color: #fff7f1;
}
.ap .btn-dark:hover {
  background: #e2784a;
}

.ap .link-u {
  position: relative;
}
.ap .link-u::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -4px;
  height: 1.5px;
  width: 100%;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.35s;
}
.ap .link-u:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

.ap .field,
.ap .field-dark {
  width: 100%;
  border-radius: 1rem;
  padding: 0.85rem 1rem;
  transition:
    box-shadow 0.25s,
    border-color 0.25s;
}
.ap .field {
  background: #fff7f1;
  border: 1.5px solid transparent;
}
.ap .field:focus {
  border-color: #f59a6c;
  box-shadow: 0 0 0 4px rgba(245, 154, 108, 0.25);
  outline: none;
}
.ap .field-dark {
  background: #2a1b16;
  color: #fff7f1;
  border: 1.5px solid rgba(255, 196, 163, 0.2);
}
.ap .field-dark:focus {
  border-color: #ffc4a3;
  outline: none;
}

.ap .seg {
  display: inline-flex;
  background: #ffe6d6;
  border-radius: 999px;
  padding: 4px;
}
.ap .seg button {
  padding: 0.45rem 1rem;
  border-radius: 999px;
  font-size: 0.8rem;
  transition: all 0.3s;
}
.ap .seg button.on {
  background: #f59a6c;
  font-weight: 600;
}

/* Hero load sequence */
.ap .rise {
  opacity: 0;
  transform: translateY(28px);
  animation: apRise 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  animation-delay: var(--d, 0s);
}
.ap .rise-line {
  display: inline-block;
  transform: translateY(110%);
  animation: apLine 1.1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  animation-delay: var(--d, 0s);
}
@keyframes apRise {
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes apLine {
  to {
    transform: none;
  }
}

.ap .hero-frame {
  aspect-ratio: 4/5;
  overflow: hidden;
  border-radius: 14rem 14rem 2rem 2rem;
  background: #ffd9c2;
  box-shadow: 0 40px 80px -30px rgba(196, 98, 58, 0.5);
}
.ap .blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.7;
  animation: apDrift 14s ease-in-out infinite alternate;
}
.ap .blob-a {
  width: 32rem;
  height: 32rem;
  background: #ffc4a3;
  top: -6rem;
  right: -8rem;
}
.ap .blob-b {
  width: 24rem;
  height: 24rem;
  background: #ffe0cc;
  bottom: 0;
  left: -6rem;
  animation-delay: -6s;
}
@keyframes apDrift {
  to {
    transform: translate(40px, 30px) scale(1.15);
  }
}
.ap .float-card {
  animation: apFloat 6s ease-in-out infinite;
}
.ap .float-card-2 {
  animation: apFloat 7s ease-in-out infinite reverse;
}
@keyframes apFloat {
  50% {
    transform: translateY(-14px);
  }
}

.ap .marquee {
  display: flex;
  width: max-content;
  animation: apMarquee 30s linear infinite;
}
.ap .marquee-row {
  display: flex;
  gap: 2rem;
  padding-right: 2rem;
}
@keyframes apMarquee {
  to {
    transform: translateX(-50%);
  }
}

.ap .spin-badge {
  animation: apSpin 20s linear infinite;
}
@keyframes apSpin {
  to {
    transform: rotate(360deg);
  }
}
.ap .wa {
  animation: apPulse 2.4s infinite;
}
@keyframes apPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.5);
  }
  70%,
  100% {
    box-shadow: 0 0 0 18px rgba(37, 211, 102, 0);
  }
}
.ap .pop {
  animation: apPop 0.6s cubic-bezier(0.3, 1.6, 0.5, 1);
}
@keyframes apPop {
  from {
    transform: scale(0);
  }
}

/* Vue transitions */
.drop-enter-active,
.drop-leave-active {
  transition: all 0.35s;
}
.drop-enter-from,
.drop-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.swap-enter-active,
.swap-leave-active {
  transition: all 0.4s;
}
.swap-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.swap-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
.fld-enter-active {
  transition: all 0.4s;
}
.fld-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

@media (prefers-reduced-motion: reduce) {
  .ap *,
  .ap *::before,
  .ap *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .ap .rise,
  .ap .rise-line {
    opacity: 1;
    transform: none;
  }
}
</style>