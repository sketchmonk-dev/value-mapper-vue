<script setup lang="ts">
import { useConnectionPreview } from '../context';

const { coords, getBezierPath, getSmoothStepPath, getArrowPath } = useConnectionPreview();
</script>
<template>
    <slot
        v-if="coords"
        :coords="coords"
        :get-bezier-path="getBezierPath"
        :get-smooth-step-path="getSmoothStepPath"
        :get-arrow-path="getArrowPath"
    />
</template>