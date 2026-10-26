<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import WhatsAppButton from '@/components/WhatsappButton.vue'
</script>

<template>
  <div class="ap">
    <AppHeader />
    <main>
      <RouterView />
    </main>
    <AppFooter />
    <WhatsAppButton />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&family=Manrope:wght@400;500;600&display=swap');

.v-btn {
  text-transform: none;
}
</style>