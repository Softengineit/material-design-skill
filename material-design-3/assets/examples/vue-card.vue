<script setup>
// Material 3 card in Vue 3. Tokens come from material-tokens.css imported in main.ts.
defineProps({
  variant: {
    type: String,
    default: 'elevated',
    validator: (v) => ['elevated', 'filled', 'outlined'].includes(v),
  },
  title: { type: String, required: true },
  subtitle: String,
  media: String, // image URL
  mediaAlt: { type: String, default: '' },
});
</script>

<template>
  <article class="md-card" :class="`md-card--${variant}`">
    <img v-if="media" class="md-card__media" :src="media" :alt="mediaAlt" />
    <div class="md-card__body">
      <h3 class="md-card__title">{{ title }}</h3>
      <p v-if="subtitle" class="md-card__subtitle">{{ subtitle }}</p>
      <div v-if="$slots.default" class="md-card__text"><slot /></div>
    </div>
    <div v-if="$slots.actions" class="md-card__actions"><slot name="actions" /></div>
  </article>
</template>

<style scoped>
.md-card {
  display: flex; flex-direction: column; overflow: hidden;
  border-radius: var(--md-sys-shape-corner-medium);
  color: var(--md-sys-color-on-surface);
}
.md-card--elevated { background: var(--md-sys-color-surface-container-low); box-shadow: var(--md-sys-elevation-level1); }
.md-card--filled { background: var(--md-sys-color-surface-container-highest); }
.md-card--outlined { background: var(--md-sys-color-surface); border: 1px solid var(--md-sys-color-outline-variant); }
.md-card__media { display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; }
.md-card__body { padding: 16px; display: grid; gap: 4px; }
.md-card__title {
  margin: 0;
  font-size: var(--md-sys-typescale-title-medium-size);
  line-height: var(--md-sys-typescale-title-medium-line-height);
  font-weight: var(--md-sys-typescale-title-medium-weight);
  letter-spacing: var(--md-sys-typescale-title-medium-tracking);
}
.md-card__subtitle, .md-card__text {
  margin: 0; color: var(--md-sys-color-on-surface-variant);
  font-size: var(--md-sys-typescale-body-medium-size);
  line-height: var(--md-sys-typescale-body-medium-line-height);
  letter-spacing: var(--md-sys-typescale-body-medium-tracking);
}
.md-card__actions { display: flex; justify-content: flex-end; gap: 8px; padding: 0 16px 16px; }
</style>

<!-- Usage
<MdCard variant="outlined" title="Trip to Douala" subtitle="12 to 15 December" media="/img/douala.jpg" media-alt="Douala waterfront">
  Three nights, two meetings, one free afternoon.
  <template #actions>
    <MdButton variant="text">Share</MdButton>
    <MdButton variant="filled">Open</MdButton>
  </template>
</MdCard>
-->
