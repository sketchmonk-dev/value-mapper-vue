# Value Mapper Vue

A headless Vue 3 component library for creating interactive value mapping interfaces. Draw connections between stationary source and target nodes with customizable styling and behavior.

## Features

- 🎯 **Headless Components** - Complete control over styling and layout
- 🖱️ **Connection Drawing** - Intuitive connection creation with mouse and touch support
- 📱 **Mobile Friendly** - Touch events support for mobile devices
- 🎨 **Customizable Paths** - Bezier curves and smooth step connections
- ⚡ **Vue 3 Composition API** - Built with modern Vue patterns
- 🔗 **Reactive Connections** - Real-time updates with v-model binding
- 🪝 **Composable Utilities** - Reusable logic for custom implementations

## Installation

```bash
npm install @sketchmonk/value-mapper-vue
```

## Quick Start

```vue
<script setup lang="ts">
import {
  ValueMapperRoot,
  ValueMapperNode,
  ValueMapperConnection,
  ValueMapperConnectionPreview
} from '@sketchmonk/value-mapper-vue';

const mapping = ref<Record<string, string>>({});

const sourceItems = [
  { id: 'item1', label: 'Source 1' },
  { id: 'item2', label: 'Source 2' }
];

const targetItems = [
  { id: 'target1', label: 'Target 1' },
  { id: 'target2', label: 'Target 2' }
];
</script>

<template>
  <ValueMapperRoot v-model="mapping" class="w-full h-96">
    <template #connections="{ connections }">
      <ValueMapperConnection
        v-for="connection in connections"
        :key="connection.id"
        :connection="connection"
        v-slot="{ getBezierPath }"
      >
        <path
          :d="getBezierPath()"
          fill="none"
          stroke="#10b981"
          stroke-width="2"
        />
      </ValueMapperConnection>
      
      <ValueMapperConnectionPreview v-slot="{ getBezierPath }">
        <path
          :d="getBezierPath()"
          fill="none"
          stroke="#6b7280"
          stroke-dasharray="5,5"
          stroke-width="1"
        />
      </ValueMapperConnectionPreview>
    </template>

    <div class="flex justify-between items-center h-full">
      <!-- Source nodes -->
      <div class="flex flex-col gap-4">
        <ValueMapperNode
          v-for="item in sourceItems"
          :key="item.id"
          :identifier="item.id"
          type="source"
        >
          <div class="px-4 py-2 bg-blue-100 rounded border">
            {{ item.label }}
          </div>
          <template #handle>
            <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
          </template>
        </ValueMapperNode>
      </div>

      <!-- Target nodes -->
      <div class="flex flex-col gap-4">
        <ValueMapperNode
          v-for="item in targetItems"
          :key="item.id"
          :identifier="item.id"
          type="target"
        >
          <div class="px-4 py-2 bg-green-100 rounded border">
            {{ item.label }}
          </div>
          <template #handle>
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
          </template>
        </ValueMapperNode>
      </div>
    </div>
  </ValueMapperRoot>
</template>
```

## Components

### ValueMapperRoot

The root container component that manages the overall state and provides context to child components.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `Record<string, string>` | `{}` | The mapping object where keys are source IDs and values are target IDs |
| `class` | `string` | `undefined` | CSS class for the root element |
| `style` | `object` | `undefined` | Inline styles for the root element |

#### Slots

| Slot | Props | Description |
|------|-------|-------------|
| `default` | `{ isDragging: boolean }` | Main content area for nodes |
| `connections` | `{ connections: Connection[] }` | SVG overlay for rendering connections |

#### Example

```vue
<ValueMapperRoot v-model="mapping" class="relative w-full h-96">
  <template #connections="{ connections }">
    <!-- Connection rendering -->
  </template>
  
  <template #default="{ isDragging }">
    <!-- Your nodes here -->
    <div :class="{ 'pointer-events-none': isDragging }">
      <!-- Node content -->
    </div>
  </template>
</ValueMapperRoot>
```

### ValueMapperNode

Represents a stationary node in the mapping interface that can be connected to other nodes.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `identifier` | `string` | ✅ | Unique identifier for the node |
| `type` | `"source" \| "target"` | ✅ | Whether this is a source or target node |
| `class` | `string` | ❌ | CSS class for the node element |
| `style` | `object` | ❌ | Inline styles for the node element |

#### Slots

| Slot | Props | Description |
|------|-------|-------------|
| `default` | `{ isConnected: boolean, isConnecting: boolean }` | Main node content |
| `handle` | `{ isConnected: boolean, isConnecting: boolean }` | Connection handle (positioned automatically) |

#### Example

```vue
<ValueMapperNode identifier="node1" type="source" class="group">
  <template #default="{ isConnected, isConnecting }">
    <div :class="[
      'px-4 py-2 rounded border',
      { 'border-blue-500': isConnecting, 'border-green-500': isConnected }
    ]">
      Node Content
    </div>
  </template>
  
  <template #handle="{ isConnected }">
    <div :class="[
      'w-3 h-3 rounded-full',
      isConnected ? 'bg-green-500' : 'bg-gray-300'
    ]"></div>
  </template>
</ValueMapperNode>
```

### ValueMapperConnection

Renders individual connections between nodes.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `connection` | `Connection` | ✅ | Connection object with source and target IDs |

#### Slots

| Slot | Props | Description |
|------|-------|-------------|
| `default` | See below | Slot for rendering the connection path |

#### Slot Props

```typescript
{
  source: string;
  target: string;
  coords: { source: { x: number, y: number }, target: { x: number, y: number } } | null;
  removeConnection: () => void;
  getBezierPath: () => string;
  getSmoothStepPath: (radius?: number) => string;
  getArrowPath: (size?: number, offset?: number) => string;
}
```

#### Example

```vue
<ValueMapperConnection :connection="connection" v-slot="{ getBezierPath, getArrowPath, removeConnection }">
  <g @click="removeConnection">
    <path
      :d="getBezierPath()"
      fill="none"
      stroke="#10b981"
      stroke-width="2"
      class="cursor-pointer hover:stroke-red-500"
    />
    <path
      :d="getArrowPath(8, 4)"
      fill="#10b981"
      class="cursor-pointer hover:fill-red-500"
    />
  </g>
</ValueMapperConnection>
```

### ValueMapperConnectionPreview

Shows a preview of the connection being drawn.

#### Slots

| Slot | Props | Description |
|------|-------|-------------|
| `default` | See below | Slot for rendering the preview path |

#### Slot Props

```typescript
{
  coords: { source: { x: number, y: number }, target: { x: number, y: number } } | null;
  getBezierPath: () => string;
  getSmoothStepPath: (radius?: number) => string;
  getArrowPath: (size?: number, offset?: number) => string;
}
```

#### Example

```vue
<ValueMapperConnectionPreview v-slot="{ getBezierPath, getArrowPath }">
  <path
    :d="getBezierPath()"
    fill="none"
    stroke="#6b7280"
    stroke-dasharray="5,5"
    stroke-width="1"
  />
  <path
    :d="getArrowPath(8)"
    fill="#6b7280"
    opacity="0.7"
  />
</ValueMapperConnectionPreview>
```

## Composables

### useValueMapperStore()

Access the value mapper store from within child components.

```typescript
const {
  mapping,
  connections,
  isDragging,
  dragSource,
  addConnection,
  removeConnection,
  startConnection,
  endConnection,
  cancelConnection,
  hasConnection
} = useValueMapperStore();
```

### useNode(id, type)

Manage individual node state and interactions.

```typescript
const {
  el,
  rect,
  isConnected,
  isDragSource,
  onMouseDown,
  onMouseUp,
  onTouchEnd,
  onClick
} = useNode('node-id', 'source');
```

### useConnectionUtils(source, target)

Utilities for managing connections between specific nodes.

```typescript
const {
  removeConnection,
  getBezierPath,
  getSmoothStepPath,
  getArrowPath,
  coords
} = useConnectionUtils('source-id', 'target-id');
```

### useConnectionPreview()

Manage connection preview during drawing operations.

```typescript
const {
  getBezierPath,
  getSmoothStepPath,
  getArrowPath,
  coords
} = useConnectionPreview();
```

## Types

```typescript
export type NodeType = "source" | "target";

export interface Connection {
  id: string;
  source: string;
  target: string;
}
```

## Advanced Usage

### Custom Path Styles

You can create different connection styles using the provided path generators:

```vue
<!-- Bezier curves -->
<path :d="getBezierPath()" />

<!-- Smooth step paths -->
<path :d="getSmoothStepPath(5)" />

<!-- Custom arrows -->
<path :d="getArrowPath(12, 6)" />
```

### Dynamic Styling

Use the slot props to create dynamic styles based on connection state:

```vue
<ValueMapperNode identifier="node1" type="source">
  <template #default="{ isConnected, isConnecting }">
    <div :class="{
      'border-blue-500': isConnecting,
      'border-green-500': isConnected,
      'border-gray-300': !isConnected && !isConnecting
    }">
      <!-- Node content -->
    </div>
  </template>
</ValueMapperNode>
```

### Touch Support

The components automatically handle touch events for mobile devices. The connection drawing behavior works seamlessly across desktop and mobile platforms.

## Browser Support

- Modern browsers with ES2015+ support
- Vue 3.x
- Touch-enabled devices

## License

MIT License

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to the repository.