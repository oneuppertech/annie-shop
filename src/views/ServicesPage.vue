<template>
      <!-- SERVICES -->
    
<!-- SERVICES -->
<section id="services" class="py-24 px-5 bg-slate-50">
  <div class="max-w-7xl mx-auto">

    <!-- Main services heading -->
    <div class="text-center max-w-2xl mx-auto" data-aos="fade-up">
      <p :class="eyebrow">What We Do</p>
      <h2 :class="h2">
        Accommodation and support, built around the individual
      </h2>
      <p class="mt-4 text-slate-600">
        Person-centred, strengths-based and goal-focused support,
        helping individuals build confidence and independence.
      </p>
    </div>

    <!-- First six services -->
    <div class="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
      <div
        v-for="(s, i) in services.slice(0, 6)"
        :key="s.title"
        data-aos="fade-up"
        :data-aos-delay="(i % 3) * 120"
        class="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
      >
        <div
          class="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-[#A8E80F]/20 group-hover:scale-[3] transition-transform duration-700"
        ></div>

        <span
          class="relative w-14 h-14 rounded-2xl bg-[#0A2A5C] text-[#A8E80F] flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform"
        >
          <i :class="s.icon"></i>
        </span>

        <h3 class="relative mt-6 text-xl font-bold text-[#0A2A5C]">
          {{ s.title }}
        </h3>

        <p class="relative mt-3 text-slate-600 text-sm leading-relaxed">
          {{ s.text }}
        </p>

        <a
          href="#contact"
          class="relative mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0A2A5C] group-hover:gap-3 transition-all"
        >
          Enquire <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    </div>

  </div>
</section>

<!-- OPERATING FRAMEWORK -->
<section id="safeguarding" class="relative py-24 px-5 bg-white overflow-hidden">
  <!-- Decorative background -->
  <div class="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#A8E80F]/10 blur-3xl"></div>
  <div class="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#0A2A5C]/5 blur-3xl"></div>

  <div class="relative max-w-7xl mx-auto">

    <!-- Framework heading -->
    <div class="text-center max-w-3xl mx-auto" data-aos="fade-up">
      <p class="text-sm font-bold tracking-widest uppercase text-[#8fcf0a]">
        Safety, Standards & Accountability
      </p>

      <h2 class="mt-3 text-3xl lg:text-4xl font-extrabold text-[#0A2A5C] leading-tight">
        Operating Framework
      </h2>

      <p class="mt-5 text-slate-600 leading-relaxed">
        Our approach to supported accommodation is underpinned by
        safeguarding procedures, health and safety measures, and
        housing compliance practices designed to support safe,
        well-managed living environments.
      </p>
    </div>

    <!-- Three framework cards -->
    <div class="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-7">
      <div
        v-for="(s, i) in services.slice(6, 9)"
        :key="s.title"
        data-aos="fade-up"
        :data-aos-delay="i * 120"
        class="group relative bg-[#0A2A5C] rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
      >
        <div
          class="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-[#A8E80F]/10 group-hover:scale-150 transition-transform duration-700"
        ></div>

        <span
          class="relative w-16 h-16 rounded-2xl bg-[#A8E80F] text-[#0A2A5C] flex items-center justify-center text-2xl"
        >
          <i :class="s.icon"></i>
        </span>

        <h3 class="relative mt-6 text-xl font-bold text-white">
          {{ s.title }}
        </h3>

        <p class="relative mt-3 text-sm text-slate-300 leading-relaxed">
          {{ s.text }}
        </p>

        <a
          href="#contact"
          class="relative mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#A8E80F] group-hover:gap-3 transition-all"
        >
          Enquire about our approach
          <i class="fa-solid fa-arrow-right"></i>
        </a>

        <div class="relative mt-7 h-1 w-12 rounded-full bg-[#A8E80F] group-hover:w-20 transition-all duration-300"></div>
      </div>
    </div>

  </div>
</section>

</template>

<script setup>
import FooterView from '@/components/FooterView.vue'
import HeaderView from '@/components/HeaderView.vue'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import AboutPage from './AboutPage.vue'

/* ---------- ASSETS (same filenames as before; missing images hide themselves) ---------- */
const asset = (name) => new URL(`../assets/${name}`, import.meta.url).href
const images = {
  logo: asset('paratus-dwellings-logo.png'),
  hero: asset('hero.jpg'),
  about: asset('about.jpg'),
  cleaning: asset('cleaning.jpg'),
  training: asset('training.jpg'),
  p1: asset('project-1.jpg'),
  p2: asset('project-2.jpg'),
  p3: asset('project-3.jpg'),
  p4: asset('project-4.jpg'),
  p5: asset('project-5.jpg'),
  p6: asset('project-6.jpg')
}
const hideBroken = (e) => (e.target.style.display = 'none')
const PHONE = '07350 154705'
const TEL = 'tel:07350154705'
const EMAIL = 'info@paratusdwellings.co.uk'

/* shared class strings */
const eyebrow = 'text-sm font-bold tracking-widest uppercase text-[#8fcf0a]'
const h2 = 'mt-3 text-3xl lg:text-4xl font-extrabold text-[#0A2A5C] leading-tight'
const input =
  'w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#A8E80F]'

/* ---------- NAV / UI STATE ---------- */
const scrolled = ref(false)
const progress = ref(0)
const menuOpen = ref(false)
const cookies = ref(true)
const onScroll = () => {
  scrolled.value = window.scrollY > 40
  const h = document.documentElement.scrollHeight - window.innerHeight
  progress.value = h > 0 ? (window.scrollY / h) * 100 : 0
}
const links = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Day & Evening', href: '#support' },
  { label: 'Safeguarding', href: '#safeguarding' },
  { label: 'Referrals', href: '#contact' }
]

/* ---------- DATA ---------- */
const stats = [
  { value: 18, suffix: '+', label: 'Adults Supported' },
  { value: 3, suffix: '+', label: 'Years Leadership Experience' },
  { value: 2, suffix: '', label: 'Support Windows: Day & Evening' },
  { value: 5, suffix: '', label: 'Step Individual Journey' }
]
const counts = ref(stats.map(() => 0))
const statsEl = ref(null)
let statsObserver = null
let counted = false
const runCounters = () => {
  if (counted) return
  counted = true
  const start = performance.now()
  const tick = (now) => {
    const p = Math.min((now - start) / 1600, 1)
    const e = 1 - Math.pow(1 - p, 3)
    counts.value = stats.map((s) => Math.round(s.value * e))
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

const reasons = [
  { icon: 'fa-solid fa-shield-heart', title: 'Safe Homes', text: 'Safeguarding-led, health and safety-checked, and compliant with local housing requirements.' },
  { icon: 'fa-solid fa-hands-holding-circle', title: 'Skilled People', text: 'Life skills, digital skills and employability support for confident independence.' },
  { icon: 'fa-solid fa-sun', title: 'Brighter Futures', text: 'Person-centred plans that turn goals into real next steps.' }
]

const services = [
  { icon: 'fa-solid fa-house-chimney-user', title: 'Supported Accommodation', text: 'A stable, safe and welcoming place to live for adults aged 18+ working towards independence.' },
  { icon: 'fa-solid fa-sun-bright', title: 'Day & Evening Support', text: 'Structured daytime support and a settled, supervised evening environment.' },
  { icon: 'fa-solid fa-person-walking-arrow-right', title: 'Independent Living Skills', text: 'Budgeting, cooking, shopping, time management and household routines.' },
  { icon: 'fa-solid fa-broom', title: 'Housekeeping & Cleaning', text: 'Clean, hygienic homes and shared spaces, plus practical cleaning skills for residents.' },
  { icon: 'fa-solid fa-briefcase', title: 'Employability Support', text: 'CVs, job searching, applications, interview practice and workplace readiness.' },
  { icon: 'fa-solid fa-laptop', title: 'Digital Skills', text: 'Everyday digital confidence, with certification pathways where approved providers are available.' },
  { icon: 'fa-solid fa-user-shield', title: 'Safeguarding', text: 'Clear procedures to protect adults, record concerns and escalate them appropriately.' },
  { icon: 'fa-solid fa-helmet-safety', title: 'Health & Safety', text: 'Risk assessments, fire safety and regular property and activity checks.' },
  { icon: 'fa-solid fa-clipboard-check', title: 'Local Housing Compliance', text: 'Working to meet local housing, licensing and landlord safety requirements.' }
]

const tab = ref('day')
const support = {
  day: {
    icon: 'fa-solid fa-sun',
    title: 'Day Support',
    items: [
      'Individual development planning and key-work sessions',
      'Budgeting, cooking and household routine coaching',
      'CV writing, job searching and interview practice',
      'Digital skills sessions and online applications',
      'Help attending appointments, education and training',
      'Tenancy, housing and property-related guidance'
    ]
  },
  evening: {
    icon: 'fa-solid fa-moon',
    title: 'Evening Support',
    items: [
      'A calm, safe and welcoming evening environment',
      'Support with meal routines, shared living and wind-down',
      'Prompt response to concerns, incidents and house issues',
      'Guided activities, social groups and peer connection',
      'Check-ins and awareness of well-being changes',
      'Escalation of safeguarding concerns through proper channels'
    ]
  }
}

const safeguarding = [
  { icon: 'fa-solid fa-user-lock', t: 'Designated Safeguarding Lead', d: 'A named lead who receives, records and acts on concerns.' },
  { icon: 'fa-solid fa-id-card-clip', t: 'Safer Recruitment', d: 'Robust recruitment checks, including DBS, references and induction.' },
  { icon: 'fa-solid fa-graduation-cap', t: 'Regular Training', d: 'Staff trained to spot abuse, neglect, exploitation and online harm.' },
  { icon: 'fa-solid fa-triangle-exclamation', t: 'Clear Escalation', d: 'Concerns are recorded and referred to the local authority safeguarding team.' },
  { icon: 'fa-solid fa-person-circle-question', t: 'Missing Person Protocol', d: 'A defined response when a resident is unexpectedly absent.' },
  { icon: 'fa-solid fa-scale-balanced', t: 'Boundaries & Dignity', d: 'Professional boundaries, equality and respect in every interaction.' },
  { icon: 'fa-solid fa-lock', t: 'Confidentiality', d: 'Personal information is protected and shared only when necessary.' },
  { icon: 'fa-solid fa-bullhorn', t: 'Feedback & Whistleblowing', d: 'Clear complaints and whistleblowing routes for residents and staff.' }
]

const ctab = ref('hs')
const compliance = {
  hs: {
    label: 'Health & Safety',
    icon: 'fa-solid fa-helmet-safety',
    items: [
      'Risk assessments for properties, residents and planned activities',
      'Fire risk assessment, working alarms, clear escape routes and regular fire drills',
      'Accident and incident recording with managed follow-up actions',
      'First aid awareness and emergency procedures',
      'Safe kitchen practice and food hygiene awareness',
      'Lone working and staff safety arrangements',
      'Scheduled property inspections and prompt repairs reporting'
    ]
  },
  housing: {
    label: 'Local Housing Compliance',
    icon: 'fa-solid fa-clipboard-check',
    items: [
      'Annual gas safety checks and valid certification',
      'Electrical installation condition checks within required timescales',
      'Smoke and carbon monoxide alarms, tested regularly',
      'Legionella risk awareness and water-safety checks',
      'HMO and supported-housing licensing, where applicable',
      'Properties kept free from hazards under the Housing Health and Safety Rating System',
      'Clear licence or tenancy agreements and Right to Rent checks',
      'Working with local authority housing and environmental health teams'
    ]
  },
  clean: {
    label: 'Cleaning & Hygiene',
    icon: 'fa-solid fa-spray-can-sparkles',
    items: [
      'Planned cleaning schedules for communal areas',
      'Deep cleans between residents and end-of-tenancy cleaning',
      'COSHH-aware cleaning products and safe storage',
      'Pest, damp and mould awareness with fast reporting',
      'Waste and recycling routines',
      'Resident housekeeping coaching and shared-space standards'
    ]
  }
}

const cleaning = [
  { icon: 'fa-solid fa-house-circle-check', t: 'Home & Communal Cleaning' },
  { icon: 'fa-solid fa-key', t: 'End-of-Tenancy Cleaning' },
  { icon: 'fa-solid fa-sparkles', t: 'Deep Cleans & Refresh' },
  { icon: 'fa-solid fa-hand-sparkles', t: 'Resident Housekeeping Skills' }
]

const steps = [
  { n: '01', title: 'Initial Assessment', text: 'We discuss circumstances, strengths, risks and support needs.' },
  { n: '02', title: 'Development Plan', text: 'Agree practical goals for living, learning and work.' },
  { n: '03', title: 'Skills Development', text: 'Structured life, digital and employability sessions.' },
  { n: '04', title: 'Education & Work', text: 'Support into training, job searches and interviews.' },
  { n: '05', title: 'Progress & Independence', text: 'Review achievements and plan the next step.' }
]

const filters = ['All', 'Accommodation', 'Learning', 'Community', 'Cleaning']
const activeFilter = ref('All')
const gallery = [
  { title: 'Shared Living Space', cat: 'Accommodation', img: images.p1 },
  { title: 'Private Bedroom', cat: 'Accommodation', img: images.p2 },
  { title: 'Cooking Session', cat: 'Learning', img: images.p3 },
  { title: 'Digital Skills Class', cat: 'Learning', img: images.training },
  { title: 'Community Outing', cat: 'Community', img: images.p4 },
  { title: 'Group Activity', cat: 'Community', img: images.p5 },
  { title: 'Communal Area Clean', cat: 'Cleaning', img: images.cleaning },
  { title: 'Welcoming Entrance', cat: 'Accommodation', img: images.p6 }
]
const visibleGallery = computed(() =>
  activeFilter.value === 'All' ? gallery : gallery.filter((p) => p.cat === activeFilter.value)
)

const skills = [
  'Budgeting & Money Management',
  'Cooking & Meal Planning',
  'Digital Skills & Online Safety',
  'CV, Applications & Interviews',
  'Time & Household Management',
  'Communication & Confidence'
]

const supportGroups = [
  'Care leavers preparing for independent living',
  'Adults transitioning into independent living',
  'Adults seeking education, training or work',
  'Adults facing housing instability'
]

const faqs = [
  { q: 'Who is your accommodation for?', a: 'Adults aged 18 and over who need a safe home and practical support to build independent living skills, including care leavers and those at risk of housing instability. Every placement is subject to assessment, suitability and availability.' },
  { q: 'What are your support hours?', a: 'We provide day and evening support. Exact hours depend on the placement and the service agreed with the referrer. Contact us to discuss.' },
  { q: 'How do you keep residents safe?', a: 'Through safeguarding procedures, trained staff, risk assessments, fire and property safety checks, and clear routes for raising concerns.' },
  { q: 'Do you provide personal care or nursing?', a: 'No. We do not provide personal care, nursing or clinical treatment. Our focus is accommodation, practical independence skills and employability.' },
  { q: 'Do you offer cleaning services?', a: 'Cleaning is part of how we keep homes safe and hygienic, including communal and end-of-tenancy cleaning, and we teach practical housekeeping skills. Ask us about wider cleaning enquiries.' },
  { q: 'Who can make a referral?', a: 'Local authorities, leaving-care teams, social workers, housing teams, personal advisers, education and employment providers, and adults or their representatives.' },
  { q: 'Is accommodation guaranteed after a referral?', a: 'No. Placements depend on assessment, suitability and availability.' },
  { q: 'Do you guarantee certificates or jobs?', a: 'No. We support residents towards relevant certificates and employment, but outcomes depend on provider arrangements, eligibility and individual progress.' }
]
const openFaq = ref(0)

const categories = ['Supported accommodation', 'Referral enquiry', 'Independent living support', 'Employability and training', 'Digital skills', 'Cleaning enquiry', 'Partnership', 'General enquiry']
const blank = () => ({ name: '', org: '', email: '', phone: '', category: '', contact: 'Email', message: '', consent: false, website: '' })
const form = ref(blank())
const sent = ref(false)
const submit = () => {
  if (form.value.website) return // honeypot spam trap
  // TODO: connect to your backend / secure email service
  sent.value = true
  setTimeout(() => (sent.value = false), 5000)
  form.value = blank()
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
  statsObserver = new IntersectionObserver((e) => e[0].isIntersecting && runCounters(), { threshold: 0.4 })
  if (statsEl.value) statsObserver.observe(statsEl.value)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  statsObserver && statsObserver.disconnect()
})
</script>


