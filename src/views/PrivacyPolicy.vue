<script setup>
import PolicyLayout from '@/components/PolicyLayout.vue'

const intro =
  'AnniePetars respects customer privacy and handles personal information responsibly. This policy explains what information is collected, why it is used, how it is shared and how people can exercise their rights.'

const sections = [
  {
    id: 'information-we-collect',
    title: 'Information we collect',
    icon: 'fa-solid fa-database',
    blocks: [
      {
        type: 'ul',
        items: [
          'Name, email address, telephone number, billing and delivery address.',
          'Order history, payment status, customer service messages and product preferences.',
          'Measurements, garment requirements, design instructions and files submitted for custom orders.',
          'Information submitted through contact, partnership, press and newsletter forms.',
          'Website usage information collected through cookies or similar technologies, where enabled.'
        ]
      }
    ]
  },
  {
    id: 'how-we-use-information',
    title: 'How we use information',
    icon: 'fa-solid fa-list-check',
    blocks: [
      {
        type: 'ul',
        items: [
          'Process, make and deliver orders, including made-to-measure requests.',
          'Respond to customer, press, partnership and support enquiries.',
          'Provide order updates and after-sales service.',
          'Send marketing updates where we have the required permission or other lawful basis.',
          'Maintain business records, prevent fraud, protect the website and meet legal obligations.'
        ]
      }
    ]
  },
  {
    id: 'sharing-security-retention',
    title: 'Sharing, security and retention',
    icon: 'fa-solid fa-shield-halved',
    blocks: [
      {
        type: 'p',
        text: 'We share information only where needed with service providers such as payment processors, delivery companies, website hosting providers, form and email services, and professional advisers. AnniePetars does not sell customer personal information. We retain records for only as long as needed for the stated purposes, legal obligations and dispute handling. Access to customer measurements and uploaded files should be restricted to authorised personnel. The live website must use secure transmission, controlled access, retention limits and appropriate deletion processes.'
      }
    ]
  },
  {
    id: 'international-transfers-rights',
    title: 'International transfers and your rights',
    icon: 'fa-solid fa-globe',
    blocks: [
      {
        type: 'p',
        text: 'Where personal information is transferred outside the UK, appropriate safeguards must be assessed and implemented under applicable data protection law. Depending on the circumstances, individuals may have rights to access, correct or erase information, restrict or object to processing, request portability, and withdraw consent where consent is the basis for processing. A complaint may be made to the UK Information Commissioner’s Office where applicable.'
      }
    ]
  }
]

const closing =
  'Privacy contact:  fashion@anniepetars.com. Legal entity: ANNIE - PETARS. Business address:  3 Dafemola Afuye. Ifako Ijaye. Lagos Nigeria,  UK: Luton, United Kingdom. This policy must be updated to identify the actual data controller, lawful bases for processing and service providers used.'
</script>

<template>
  <PolicyLayout
    title="Privacy Policy"
    icon="fa-solid fa-lock"
    :intro="intro"
    :sections="sections"
    :closing="closing"
  />
</template>