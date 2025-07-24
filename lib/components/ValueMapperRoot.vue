<script setup lang="ts">
import { type HTMLAttributes, useTemplateRef } from 'vue';
import { useProvideValueMapperStore } from '../context';

const props = defineProps<{
    class?: HTMLAttributes['class'];
    style?: HTMLAttributes['style'];
}>();

const mapping = defineModel<Record<string, string>>({
    default: () => ({}),
});
const root = useTemplateRef<HTMLDivElement>("root");
const { width, height, connections, cancelConnection, isDragging } = useProvideValueMapperStore(root, mapping);
</script>
<template>
    <div ref="root" @click="cancelConnection" :class="props.class" :style="[{ position: 'relative' }, props.style]">
        <svg :view-box="`0 0 ${width} ${height}`" :width="width" :height="height" :style="{ position: 'absolute', width, height, left: 0, top: 0 }">
            <slot name="connections" :connections="connections" />
        </svg>
        <slot :is-dragging="isDragging" />
    </div>
</template>