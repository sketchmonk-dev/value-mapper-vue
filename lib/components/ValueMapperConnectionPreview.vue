<script setup lang="ts">
import { useConnectionPreview } from '../context';

const { coords, isConnected, getBezierPath, getSmoothStepPath, getArrowPath } = useConnectionPreview();
</script>
<template>
    <slot
        v-if="coords"
        :coords="coords"
        :is-connected="isConnected"
        :get-bezier-path="getBezierPath"
        :get-smooth-step-path="getSmoothStepPath"
        :get-arrow-path="getArrowPath"
    />
</template>