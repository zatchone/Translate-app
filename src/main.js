import { createApp } from 'vue';
import App from './App.vue';

// Define Vue feature flags and mount directly
createApp(App, {
  __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false // Explicitly define the flag
}).mount('#app');