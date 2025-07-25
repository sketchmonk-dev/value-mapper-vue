<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { useNode } from '../context';
import { type NodeType } from '../common';

const props = defineProps<{
    identifier: string;
    class?: HTMLAttributes['class'];
    style?: HTMLAttributes['style'];
    type: NodeType;
}>();

const { el, onMouseDown, onMouseUp, onTouchEnd, onClick, onMouseEnter, onMouseLeave, isConnected, isDragSource, isDragTarget } = useNode(props.identifier, props.type);

const handleStyle = computed(() => {
    let style: HTMLAttributes['style'] = {
        position: 'absolute',
        top: '50%',
    }
    if (props.type === 'source') {
        style = {
            ...style,
            right: '0px',
            transform: 'translateY(-50%) translateX(50%)',
        }
    } else {
        style = {
            ...style,
            left: '0px',
            transform: 'translateY(-50%) translateX(-50%)',
        }
    }
    return style;
})
</script>
<template>
    <div
        @mousedown="onMouseDown"
        @mouseup="onMouseUp"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        @touchend="onTouchEnd"
        @click.stop="onClick"
        ref="el" 
        :data-node="props.identifier" 
        :class="props.class" 
        :style="[{ position: 'relative' }, props.style]">
        <slot :is-connected="isConnected" :is-connecting="isDragSource || isDragTarget" />
        <div
            @mousedown="onMouseDown"
            @mouseup="onMouseUp"
            @mouseenter="onMouseEnter"
            @mouseleave="onMouseLeave"
            @touchend="onTouchEnd"
            :data-node="props.identifier" :style="handleStyle">
            <slot :is-connected="isConnected" :is-connecting="isDragSource" name="handle" />
        </div>
    </div>
</template>