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
        <h1 data-aos="fade-up" class="mt-5 text-4xl sm:text-5xl font-extrabold text-white leading-tight">Safeguarding Policy</h1>
        <p data-aos="fade-up" data-aos-delay="100" class="mt-4 text-slate-300">Paratus Dwellings · Last updated: 16 October 2026</p>
      </div>
    </section>

    <!-- CONTENT -->
    <section class="py-16 px-5">
      <article class="policy max-w-3xl mx-auto" data-aos="fade-up">
        <h2>Our commitment</h2>
        <p>Paratus Dwellings is committed to providing safe, respectful and supportive accommodation for young adults aged 18 to 25, including care leavers, young people experiencing homelessness and vulnerable adults transitioning towards independent living.</p>
        <p>We aim to protect the safety, dignity, rights and wellbeing of every resident. Our approach promotes independence, personal responsibility, inclusion and access to appropriate support.</p>
        <p>Our service focuses on accommodation, housing-related support, key-work sessions, life skills and digital skills development. We do not provide personal care or clinical care as part of our proposed service model.</p>

        <h2>Our safeguarding principles</h2>
        <p>We are committed to:</p>
        <ul>
          <li>Treating every resident with dignity, fairness and respect.</li>
          <li>Protecting residents from abuse, neglect, exploitation, discrimination and harassment.</li>
          <li>Promoting safe living environments and responsible property management.</li>
          <li>Maintaining appropriate professional boundaries.</li>
          <li>Supporting residents to understand their rights and responsibilities.</li>
          <li>Responding promptly to safeguarding concerns.</li>
          <li>Working with relevant local authorities, safeguarding services and emergency services where appropriate.</li>
          <li>Maintaining confidentiality while recognising circumstances where information must be shared to protect someone from harm.</li>
        </ul>

        <h2>Recognising safeguarding concerns</h2>
        <p>Safeguarding concerns might include physical, emotional, sexual or financial abuse, neglect, domestic abuse, exploitation, coercion, discrimination, self-neglect or risks to personal safety.</p>
        <p>Staff and representatives are expected to take concerns seriously, record relevant information accurately and report concerns through the appropriate procedures.</p>

        <h2>Reporting a safeguarding concern</h2>
        <p>If someone is in immediate danger, call 999.</p>
        <p>For non-emergency safeguarding concerns, contact Paratus Dwellings at <a :href="`mailto:${EMAIL}`">{{ EMAIL }}</a>. Where appropriate, concerns should also be reported to the relevant local authority safeguarding team or another responsible professional.</p>
        <p>Reports will be handled sensitively and shared only with individuals or organisations who need the information for a legitimate safeguarding purpose.</p>

        <h2>Confidentiality and safeguarding records</h2>
        <p>Safeguarding information will be handled securely. Access will be restricted to authorised individuals.</p>
        <p>We will retain appropriate records of concerns, actions taken and referrals made in accordance with our safeguarding and data retention procedures.</p>

        <h2>Our responsibilities</h2>
        <p>Paratus Dwellings will maintain appropriate safeguarding procedures, staff guidance, risk assessment processes and referral arrangements for the services it provides.</p>
        <p>We will review this policy as our services develop and in response to changes in applicable legal requirements.</p>

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