<script setup lang="ts">
import {
    ValueMapperRoot,
    ValueMapperNode,
    ValueMapperConnection,
    ValueMapperConnectionPreview
} from '../../lib';

const source = [
    { id: 'france', display: 'France' },
    { id: 'germany', display: 'Germany' },
    { id: 'spain', display: 'Spain' },
    { id: 'italy', display: 'Italy' },
    { id: 'portugal', display: 'Portugal' },
    { id: 'uk', display: 'United Kingdom' },
]

const target = [
    { id: 'madrid', display: 'Madrid' },
    { id: 'london', display: 'London' },
    { id: 'rome', display: 'Rome' },
    { id: 'paris', display: 'Paris' },
    { id: 'lisbon', display: 'Lisbon' },
    { id: 'berlin', display: 'Berlin' },
]

const mapping = defineModel<Record<string, string>>({
    default: () => ({}),
});

</script>
<template>
    <div class="flex flex-col items-center justify-center h-screen gap-8 font-sans">
        <div class="flex items-center flex-col gap-2">
            <h1 class="text-2xl font-bold">Value Mapper Vue</h1>
            <p class="text-gray-500">This is a simple Vue application using Value Mapper components.</p>
        </div>
        <ValueMapperRoot v-model="mapping">
            <template #connections="{ connections }">
                <ValueMapperConnection
                    v-for="connection in connections"
                    :key="connection.id"
                    :connection="connection"
                    v-slot="{ getBezierPath, getArrowPath }"
                >
                    <path
                        :d="getBezierPath()"
                        class="text-green-500 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1"
                    />
                    <path
                        :d="getArrowPath(8, 4)"
                        class="text-green-500 pointer-events-none"
                        fill="currentColor"
                    />
                </ValueMapperConnection>
                <ValueMapperConnectionPreview v-slot="{ getBezierPath, getArrowPath }">
                    <path
                        :d="getBezierPath()"
                        class="text-gray-300 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        stroke-dasharray="5,5"
                        stroke-width="1"
                    />
                    <path
                        :d="getArrowPath(8)"
                        class="text-gray-300 pointer-events-none"
                        fill="currentColor"
                    />
                </ValueMapperConnectionPreview>
            </template>
            <template #default="{ isDragging }">
                <div class="w-[400px] flex items-center justify-between gap-4">
                    <div class="flex flex-col gap-2 items-end">
                        <ValueMapperNode
                            v-for="item in source"
                            :identifier="item.id"
                            :key="item.id"
                            type="source"
                            class="group"
                        >
                            <template #default="{ isConnected, isConnecting}">
                                <div :class="[
                                    'font-medium px-3 py-2 rounded border border-gray-300 cursor-crosshair whitespace-nowrap group-hover:border-blue-300',
                                    {
                                        'border-blue-500': isConnecting,
                                        'border-green-500': isConnected,
                                    }
                                ]">
                                    {{ item.display }}
                                </div>
                            </template>
                            <template #handle="{ isConnected, isConnecting}">
                                <div :class="[
                                    'w-2 h-2 bg-gray-200 border border-gray-300 rounded-full cursor-crosshair group-hover:bg-blue-200 group-hover:border-blue-300',
                                    {
                                        'bg-blue-300 border-blue-600': isConnecting,
                                        'bg-green-300 border-green-500': isConnected,
                                    }
                                ]"></div>
                            </template>
                        </ValueMapperNode>
                    </div>
                    <div class="flex flex-col gap-2 items-start">
                        <ValueMapperNode
                            v-for="item in target"
                            :identifier="item.id"
                            :key="item.id"
                            type="target"
                            class="group"
                        >
                            <template #default>
                                <div :class="[
                                    'font-medium px-3 py-2 rounded border border-gray-300 cursor-default whitespace-nowrap',
                                    {
                                        'group-hover:border-blue-300': isDragging,
                                    }
                                ]">
                                    {{ item.display }}
                                </div>
                            </template>
                            <template #handle>
                                <div :class="[
                                    'w-2 h-2 bg-gray-200 border border-gray-300 rounded-full',
                                    isDragging ? 'group-hover:bg-blue-200 group-hover:border-blue-300 cursor-crosshair' : 'cursor-default'
                                ]"></div>
                            </template>
                        </ValueMapperNode>
                    </div>
                </div>
            </template>
        </ValueMapperRoot>
    </div>
</template>
<style lang="css">

</style>