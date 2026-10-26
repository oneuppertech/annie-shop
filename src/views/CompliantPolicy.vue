<script setup>
import FooterView from '@/components/FooterView.vue'
import HeaderView from '@/components/HeaderView.vue'

const EMAIL = 'compliance@paratusdwellings.co.uk'
const WEBSITE = 'https://paratusdwellings.co.uk'
</script>

<template>
  <div class="font-sans text-slate-700 bg-white overflow-x-hidden scroll-smooth">

    <!-- PAGE HEADER -->
    <section class="relative bg-gradient-to-br from-[#061a3a] via-[#0A2A5C] to-[#12418a] pt-40 pb-16 px-5 overflow-hidden">
      <div class="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#A8E80F]/20 blur-3xl"></div>
      <div class="relative max-w-3xl mx-auto">
        <a href="/" class="text-sm font-semibold text-[#A8E80F] hover:underline"><i class="fa-solid fa-arrow-left mr-2"></i>Back to Home</a>
        <h1 data-aos="fade-up" class="mt-5 text-4xl sm:text-5xl font-extrabold text-white leading-tight">Complaints Policy</h1>
        <p data-aos="fade-up" data-aos-delay="100" class="mt-4 text-slate-300">Paratus Dwellings · Last updated: 16 October 2026</p>
      </div>
    </section>

    <!-- CONTENT -->
    <section class="py-16 px-5">
      <article class="policy max-w-3xl mx-auto" data-aos="fade-up">
        <h2>Our commitment</h2>
        <p>Paratus Dwellings welcomes feedback and takes complaints seriously. We aim to provide accommodation and housing-related support in a respectful, safe and professional manner.</p>
        <p>We treat complaints fairly and aim to resolve concerns promptly, consistently and without discrimination.</p>
        <p>Making a complaint will not, in itself, result in retaliation or unfair treatment.</p>

        <h2>What you can complain about</h2>
        <p>You may raise concerns about:</p>
        <ul>
          <li>The quality of accommodation or housing-related support.</li>
          <li>Repairs, maintenance or property safety.</li>
          <li>Staff conduct or communication.</li>
          <li>Respect, dignity or discrimination.</li>
          <li>Privacy and handling of personal information.</li>
          <li>Safeguarding concerns.</li>
          <li>Delays, service failures or other matters relating to our service.</li>
        </ul>

        <h2>How to make a complaint</h2>
        <p>You may submit a complaint by email or through the contact details published on our website.</p>
        <p>Email: <a :href="`mailto:${EMAIL}`">{{ EMAIL }}</a></p>
        <p>Please provide:</p>
        <ul>
          <li>Your name and preferred contact details.</li>
          <li>A clear description of your concern.</li>
          <li>Relevant dates and details.</li>
          <li>Any supporting information.</li>
          <li>The outcome you would like us to consider.</li>
        </ul>
        <p>You may request assistance to submit a complaint if you have difficulty writing or communicating your concerns.</p>

        <h2>How we handle complaints</h2>

        <h3>Step 1: Acknowledgement</h3>
        <p>We will acknowledge receipt of your complaint within five working days as our service target.</p>

        <h3>Step 2: Investigation</h3>
        <p>We will review the concerns, gather relevant information and seek clarification where necessary. An appropriate person will investigate the matter fairly and objectively.</p>

        <h3>Step 3: Response</h3>
        <p>We aim to provide a written response within 20 working days of receiving the complaint. If more time is required, we will explain the reason and provide an updated response date.</p>

        <h3>Step 4: Review</h3>
        <p>If you are dissatisfied with the outcome, you may request an internal review. We will arrange for an appropriate person who was not directly responsible for the original decision to review the complaint where practicable.</p>
        <p>We will explain the outcome of the review and any further relevant options.</p>

        <h2>Safeguarding and urgent concerns</h2>
        <p>A safeguarding concern or immediate threat to someone's safety will be handled urgently and will not be delayed while the standard complaints process takes place.</p>
        <p>Call 999 if someone is in immediate danger.</p>

        <h2>Confidentiality and records</h2>
        <p>Complaints will be handled sensitively. Information will be shared only with those who need it to investigate or resolve the concern, meet legal obligations or protect someone from harm.</p>
        <p>We will keep appropriate records of complaints, investigations, decisions and actions taken.</p>

        <h2>External escalation</h2>
        <p>Where a complaint concerns a landlord or housing arrangement, the appropriate external route depends on the legal status of the landlord, the accommodation agreement and the nature of the complaint.</p>
        <p>If the Housing Ombudsman or another independent body has jurisdiction over the matter, we will provide relevant information about how to contact it.</p>
        <p>Housing Ombudsman website: <a href="https://www.housing-ombudsman.org.uk/" target="_blank" rel="noopener noreferrer">https://www.housing-ombudsman.org.uk/</a></p>
        <p>For complaints about personal information, you may contact the Information Commissioner's Office at <a href="https://ico.org.uk/" target="_blank" rel="noopener noreferrer">https://ico.org.uk/</a>.</p>

        <!-- CONTACT CARD -->
        <div class="mt-14 rounded-3xl bg-slate-50 border-t-4 border-[#A8E80F] p-8">
          <h2 class="!mt-0">Contact Paratus Dwellings</h2>
          <p>For safeguarding concerns, privacy requests, cookie enquiries, complaints or general information, contact:</p>
          <p class="!mt-3">
            <strong class="text-[#0A2A5C]">Paratus Dwellings</strong><br />
            Email: <a :href="`mailto:${EMAIL}`">{{ EMAIL }}</a><br />
            Website: <a :href="WEBSITE" target="_blank" rel="noopener noreferrer">{{ WEBSITE }}</a>
          </p>
          <p>We are committed to protecting privacy, promoting safety and treating everyone who engages with our services fairly and respectfully.</p>
        </div>

        <p class="mt-8 text-sm text-slate-500">Document review: These policies should be reviewed regularly and updated whenever our services, legal obligations or website technologies change.</p>
      </article>
    </section>

  </div>
</template>

<style scoped>
.policy h2 { margin-top: 2.5rem; font-size: 1.5rem; font-weight: 800; line-height: 1.3; color: #0A2A5C; }
.policy h2:first-child { margin-top: 0; }
.policy h3 { margin-top: 1.75rem; font-size: 1.15rem; font-weight: 800; color: #0A2A5C; }
.policy p { margin-top: 1rem; line-height: 1.75; }
.policy ul { margin-top: 1rem; display: grid; gap: 0.6rem; }
.policy li { position: relative; padding-left: 1.75rem; line-height: 1.7; }
.policy li::before { content: ''; position: absolute; left: 0; top: 0.65rem; width: 0.6rem; height: 0.6rem; border-radius: 9999px; background: #A8E80F; }
.policy a { color: #0A2A5C; font-weight: 700; text-decoration: underline; text-decoration-color: #A8E80F; text-underline-offset: 3px; word-break: break-word; }
.policy a:hover { background: #A8E80F; }
</style>