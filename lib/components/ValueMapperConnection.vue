<script setup lang="ts">
import { computed } from 'vue';
import { type Connection } from '../common';
import { useConnectionUtils } from '../context';

const props = defineProps<{
    connection: Connection;
}>();

const source = computed(() => props.connection.source);
const target = computed(() => props.connection.target);
const { removeConnection, getArrowPath, getBezierPath, getSmoothStepPath, coords  } = useConnectionUtils(source, target);
</script>
<template>
    <slot
        v-if="coords"
        :source="source"
        :target="target"
        :coords="coords"
        :remove-connection="removeConnection"
        :get-arrow-path="getArrowPath"
        :get-bezier-path="getBezierPath"
        :get-smooth-step-path="getSmoothStepPath"
    />
</template>