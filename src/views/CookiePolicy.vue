<script setup>
import PolicyLayout from '@/components/PolicyLayout.vue'

const intro =
  'Cookies and similar technologies may support essential website functions, remember preferences, measure site use and support marketing where enabled.'

const sections = [
  {
    id: 'cookie-categories',
    title: 'Cookie categories',
    icon: 'fa-solid fa-sliders',
    blocks: [
      {
        type: 'ul',
        lead: true,
        items: [
          'Strictly necessary cookies: support essential functions such as baskets, checkout and security.',
          'Preference cookies: remember settings such as language or display preferences.',
          'Analytics cookies: help understand site use and improve the website.',
          'Marketing cookies: where implemented, help measure advertising or support relevant marketing.'
        ]
      },
      {
        type: 'p',
        text: 'Non-essential cookies should not be activated until the required consent has been obtained. Visitors should have a clear way to accept or reject non-essential cookies and later change their preferences. Browser settings also provide cookie controls, although disabling some cookies may affect site functions. Cookie/privacy contact: fashion@anniepetars.com.'
      }
    ]
  }
]
</script>

<template>
  <PolicyLayout title="Cookie Policy" icon="fa-solid fa-cookie-bite" :intro="intro" :sections="sections" />
</template>