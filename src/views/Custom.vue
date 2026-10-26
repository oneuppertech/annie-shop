<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

onMounted(() => {
  AOS.init({
    duration: 900,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
    disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
})

const steps = [
  { icon: 'fa-solid fa-pen-ruler', title: 'Tell us your idea', text: 'Share the outfit, occasion, fabric and the date you need it.' },
  { icon: 'fa-solid fa-ruler-combined', title: 'Send measurements', text: 'Use the form below. Same unit throughout.' },
  { icon: 'fa-solid fa-image', title: 'Add references', text: 'Photos or sketches that show the style you want.' },
  { icon: 'fa-solid fa-handshake', title: 'Agree and confirm', text: 'We confirm design, price, payment terms and timeline before production starts.' }
]

/* ---------- Measurement form ---------- */
const unit = ref('cm')
const garment = ref('dress')
const fields = {
  dress: ['Bust', 'Underbust', 'Waist', 'Hips', 'Shoulder width', 'Across back', 'Sleeve length', 'Upper arm', 'Wrist', 'Garment length', 'Height'],
  trouser: ['Waist', 'Hips', 'Thigh', 'Inside leg', 'Outside leg', 'Knee', 'Ankle / hem', 'Garment length']
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

/* ---------- Date picker (Vuetify) ---------- */
const dateMenu = ref(false)
const needByDate = ref(null)
const today = new Date()
today.setHours(0, 0, 0, 0)

const needByLabel = computed(() =>
  needByDate.value
    ? needByDate.value.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''
)

function onDatePick(d) {
  needByDate.value = d
  // local yyyy-mm-dd, avoids timezone shifting the day
  form.needBy = d
    ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    : ''
  dateMenu.value = false
}

/* ---------- Files + submit ---------- */
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
</script>

<template>
  <div class="ap">
    <!-- CUSTOM PROCESS + FORM -->
    <section id="custom" class="bg-[#FFE6D6] py-28">
      <div class="mx-auto max-w-7xl px-6">
        <div class="mx-auto max-w-3xl text-center" data-aos="fade-up">
          <h2 class="font-display text-5xl leading-tight md:text-6xl">
            Your style. Your measurements.
          </h2>
          <p class="mt-5 text-[#5A413A]">
            Submitting the form is an enquiry only. It does not confirm an order. We review every
            request and agree the details with you first.
          </p>
        </div>

        <ol class="mt-14 grid gap-5 md:grid-cols-4">
          <li
            v-for="(s, i) in steps"
            :key="s.title"
            class="rounded-3xl bg-[#FFF7F1] p-6"
            data-aos="fade-up"
            :data-aos-delay="i * 100"
          >
            <span
              class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#F59A6C] text-lg"
              ><i :class="s.icon"></i
            ></span>
            <h3 class="font-display text-xl">{{ i + 1 }}. {{ s.title }}</h3>
            <p class="mt-1 text-sm text-[#5A413A]">{{ s.text }}</p>
          </li>
        </ol>

        <div
          class="mx-auto mt-14 max-w-4xl rounded-[2rem] bg-white p-6 shadow-xl md:p-10"
          data-aos="fade-up"
        >
          <Transition name="swap" mode="out-in">
            <div v-if="status === 'done'" key="ok" class="py-16 text-center">
              <span
                class="pop mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#FFC4A3] text-3xl"
                ><i class="fa-solid fa-check"></i
              ></span>
              <h3 class="font-display text-3xl">Request received</h3>
              <p class="mx-auto mt-2 max-w-md text-[#5A413A]">
                Our team will review your design and measurements and contact you to confirm
                feasibility, price and timing.
              </p>
            </div>

            <form v-else key="form" class="space-y-10" novalidate @submit.prevent="submitCustom">
              <fieldset class="grid gap-4 md:grid-cols-2">
                <legend class="mb-4 font-display text-2xl">Tell us about your design</legend>
                <input v-model="form.name" class="field" placeholder="Full name *" autocomplete="name" />
                <input v-model="form.email" type="email" class="field" placeholder="Email address *" autocomplete="email" />
                <input v-model="form.phone" class="field" placeholder="Telephone with country code" autocomplete="tel" />
                <input v-model="form.country" class="field" placeholder="Delivery country" />
                <input v-model="form.outfit" class="field" placeholder="Outfit type or product reference *" />

                <!-- Vuetify date picker -->
                <v-menu v-model="dateMenu" :close-on-content-click="false" location="bottom start">
                  <template #activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      :model-value="needByLabel"
                      label="Date needed"
                      readonly
                      hide-details
                      variant="solo-filled"
                      flat
                      class="peach-field"
                    >
                      <template #append-inner>
                        <i class="fa-regular fa-calendar text-[#E2784A]"></i>
                      </template>
                    </v-text-field>
                  </template>
                  <v-date-picker
                    :model-value="needByDate"
                    :min="today"
                    show-adjacent-months
                    hide-header
                    class="peach-picker"
                    @update:model-value="onDatePick"
                  />
                </v-menu>

                <input v-model="form.fabric" class="field" placeholder="Preferred fabric" />
                <input v-model="form.colour" class="field" placeholder="Preferred colour" />
                <textarea
                  v-model="form.notes"
                  rows="3"
                  class="field md:col-span-2"
                  placeholder="Design details, fit preferences, event date and location"
                ></textarea>
              </fieldset>

              <fieldset>
                <div class="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <legend class="font-display text-2xl">Your measurements</legend>

                  <div class="flex flex-col gap-3 min-[400px]:flex-row sm:items-center">
                    <div class="seg flex w-full min-w-0 sm:w-auto" role="group" aria-label="Garment type">
                      <button
                        type="button"
                        class="flex-1 whitespace-nowrap text-center sm:flex-none"
                        :class="{ on: garment === 'dress' }"
                        @click="garment = 'dress'"
                      >
                        Dresses and fitted
                      </button>
                      <button
                        type="button"
                        class="flex-1 whitespace-nowrap text-center sm:flex-none"
                        :class="{ on: garment === 'trouser' }"
                        @click="garment = 'trouser'"
                      >
                        Trousers and skirts
                      </button>
                    </div>

                    <div class="seg flex w-full sm:w-auto" role="group" aria-label="Unit">
                      <button type="button" class="flex-1 sm:flex-none" :class="{ on: unit === 'cm' }" @click="unit = 'cm'">cm</button>
                      <button type="button" class="flex-1 sm:flex-none" :class="{ on: unit === 'in' }" @click="unit = 'in'">in</button>
                    </div>
                  </div>
                </div>

                <p class="mb-5 text-sm text-[#5A413A]">
                  <i class="fa-solid fa-circle-info mr-2 text-[#E2784A]"></i>Use a flexible tape,
                  ideally with a helper. Keep it snug, not tight. Fill only what applies to your
                  garment.
                </p>
                <TransitionGroup name="fld" tag="div" class="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <label v-for="f in currentFields" :key="garment + f" class="block text-sm">
                    <span class="mb-1 block text-[#5A413A]">{{ f }}</span>
                    <span class="relative block">
                      <input
                        v-model="measures[garment + '-' + f]"
                        type="number"
                        min="0"
                        step="0.1"
                        inputmode="decimal"
                        class="field pr-10"
                      />
                      <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9B7A6E]">{{ unit }}</span>
                    </span>
                  </label>
                </TransitionGroup>
              </fieldset>

              <fieldset>
                <legend class="mb-4 font-display text-2xl">Reference material</legend>
                <label
                  class="flex cursor-pointer flex-col items-center rounded-3xl border-2 border-dashed border-[#F59A6C] bg-[#FFF7F1] p-8 text-center transition hover:bg-[#FFE6D6]"
                >
                  <i class="fa-solid fa-cloud-arrow-up mb-3 text-3xl text-[#E2784A]"></i>
                  <span>Upload photos, sketches or PDFs</span>
                  <span class="text-xs text-[#9B7A6E]"
                    >Up to 5 files, {{ MAX_MB }}MB each. References guide the design and do not
                    guarantee an exact copy.</span
                  >
                  <input type="file" class="sr-only" multiple accept="image/*,application/pdf" @change="onFiles" />
                </label>
                <ul v-if="files.length" class="mt-4 flex flex-wrap gap-2 text-sm">
                  <li v-for="f in files" :key="f.name" class="rounded-full bg-[#FFE6D6] px-3 py-1">
                    <i class="fa-regular fa-file mr-2"></i>{{ f.name }}
                  </li>
                </ul>
              </fieldset>

              <div class="space-y-3 text-sm">
                <label class="flex items-start gap-3"
                  ><input v-model="form.accurate" type="checkbox" class="mt-1 accent-[#E2784A]" /> I
                  confirm that the measurements supplied are accurate to the best of my
                  knowledge.</label
                >
                <label class="flex items-start gap-3"
                  ><input v-model="form.terms" type="checkbox" class="mt-1 accent-[#E2784A]" /> I
                  have read the <a href="/privacy-policy" class="underline">Privacy Policy</a> and
                  <a href="/customisation-terms" class="underline">Customisation Terms</a>.</label
                >
              </div>

              <p
                v-if="errorMsg"
                class="rounded-xl bg-[#FFE0D6] px-4 py-3 text-sm text-[#9A3412]"
                role="alert"
              >
                <i class="fa-solid fa-triangle-exclamation mr-2"></i>{{ errorMsg }}
              </p>

              <button class="btn-peach w-full justify-center py-4" :disabled="status === 'sending'">
                <i v-if="status === 'sending'" class="fa-solid fa-circle-notch fa-spin mr-2"></i>
                {{ status === 'sending' ? 'Sending...' : 'Submit customisation request' }}
              </button>
            </form>
          </Transition>
        </div>
      </div>
    </section>
  </div>
</template>

<style>
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

/* Buttons */
.ap .btn-peach {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.85rem 1.6rem;
  font-weight: 600;
  font-size: 0.9rem;
  background: #f59a6c;
  color: #2a1b16;
  box-shadow: 0 10px 30px -10px rgba(226, 120, 74, 0.7);
  transition:
    transform 0.3s,
    background 0.3s,
    box-shadow 0.3s;
}
.ap .btn-peach:hover {
  background: #ffc4a3;
  transform: translateY(-3px);
}
.ap .btn-peach:disabled {
  opacity: 0.6;
  pointer-events: none;
}

/* Fields */
.ap .field {
  width: 100%;
  border-radius: 1rem;
  padding: 0.85rem 1rem;
  background: #fff7f1;
  border: 1.5px solid transparent;
  transition:
    box-shadow 0.25s,
    border-color 0.25s;
}
.ap .field:focus {
  border-color: #f59a6c;
  box-shadow: 0 0 0 4px rgba(245, 154, 108, 0.25);
  outline: none;
}

/* Segmented toggles */
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

.ap .pop {
  animation: apPop 0.6s cubic-bezier(0.3, 1.6, 0.5, 1);
}
@keyframes apPop {
  from {
    transform: scale(0);
  }
}

/* Vue transitions */
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

/* Vuetify date field (global: the menu renders outside this component) */
.peach-field .v-field {
  background: #fff7f1;
  border: 1.5px solid transparent;
  border-radius: 1rem;
  box-shadow: none;
  transition:
    border-color 0.25s,
    box-shadow 0.25s;
}
.peach-field .v-field--focused {
  border-color: #f59a6c;
  box-shadow: 0 0 0 4px rgba(245, 154, 108, 0.25);
}
.peach-field .v-label,
.peach-field .v-field--focused .v-label {
  color: #5a413a;
  opacity: 1;
}

/* Vuetify date picker */
.peach-picker {
  background: #fff7f1;
  color: #2a1b16;
  border-radius: 1.5rem;
  box-shadow: 0 20px 50px -20px rgba(42, 27, 22, 0.35);
}
.peach-picker .v-date-picker-month__day--selected .v-btn {
  background: #f59a6c !important;
  color: #2a1b16 !important;
}
.peach-picker .v-date-picker-month__day--today .v-btn {
  border-color: #f59a6c;
  color: #c4623a;
}
.peach-picker .v-date-picker-month__day .v-btn:hover {
  background: #ffe6d6;
}
.peach-picker .v-date-picker-controls .v-btn,
.peach-picker .v-date-picker-controls .v-btn .v-icon {
  color: #2a1b16;
}
.peach-picker .v-date-picker-years .v-btn--active,
.peach-picker .v-date-picker-months .v-btn--active {
  background: #f59a6c !important;
  color: #2a1b16 !important;
}

@media (prefers-reduced-motion: reduce) {
  .ap *,
  .ap *::before,
  .ap *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>