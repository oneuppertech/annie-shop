<script setup>
import PolicyLayout from '@/components/PolicyLayout.vue'

const sections = [
  {
    id: 'business-details',
    title: 'Business details',
    icon: 'fa-solid fa-building',
    blocks: [
      {
        type: 'p',
        text: 'Legal business name: ANNIE - PETARS. Trading name: AnniePetars. Business address:  3 Dafemola Afuye. Ifako Ijaye. Lagos Nigeria,  UK: Luton, United Kingdom. Contact email: fashion@anniepetars.com.'
      }
    ]
  },
  {
    id: 'products-prices-orders',
    title: 'Products, prices and orders',
    icon: 'fa-solid fa-bag-shopping',
    blocks: [
      {
        type: 'p',
        text: 'Product descriptions, photographs, prices, sizes, fabric details and availability should be presented accurately. Only list fabric composition, manufacturing, sustainability or limited-edition claims when verified. Prices, delivery charges, applicable taxes and other payable amounts should be shown before purchase. An order is subject to acceptance. The live checkout must explain when a binding contract is formed and provide an order confirmation.'
      }
    ]
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual property and site use',
    icon: 'fa-solid fa-copyright',
    blocks: [
      {
        type: 'p',
        text: 'Original designs, photographs, logos, written content and other brand assets may be protected by intellectual property rights. Visitors must not copy or commercially exploit protected content without permission or another lawful basis. AnniePetars aims to keep the website available and accurate but does not guarantee uninterrupted access.'
      }
    ]
  },
  {
    id: 'applicable-law',
    title: 'Applicable law',
    icon: 'fa-solid fa-scale-balanced',
    blocks: [
      {
        type: 'p',
        text: 'Specify the governing law and dispute provisions after reviewing the business’s legal structure, location and customer markets. Nothing in these terms should remove consumer rights that cannot lawfully be excluded.'
      }
    ]
  }
]
</script>

<template>
  <PolicyLayout
    title="Website Terms and Conditions"
    icon="fa-solid fa-file-contract"
    :sections="sections"
  />
</template>