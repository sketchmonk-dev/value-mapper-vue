import { createInjectionState, useElementBounding, useElementSize, useMouseInElement } from "@vueuse/core";
import { computed, type MaybeRefOrGetter, type Ref, ref, type ShallowRef, toRef } from "vue";
import { type Connection, type NodeType } from "./common";
import { generateBezierPath, generateSmoothStepPath, omit } from "./utils";

export const [useProvideValueMapperStore, useInjectValueMapperStore] = createInjectionState((root: ShallowRef<HTMLDivElement|null>, mapping: Ref<Record<string, string>>) => {
    const { width, height } = useElementSize(root);

    const nodes = ref<Record<string, HTMLElement>>({});
    const getNodeEl = (id: string): HTMLElement | null => {
        return nodes.value[id] || null;
    }

    const connections = computed<Connection[]>(() => {
        return Object.entries(mapping.value).map(([source, target]) => {
            return {
                id: `${source}->${target}`,
                source,
                target,
            }
        })
    });
    const addConnection = (source: string, target: string) => {
        mapping.value = {
            ...mapping.value,
            [source]: target
        }
    }
    const removeConnection = (source: string) => {
        mapping.value = omit(mapping.value, [source]);
    }

    // dragging connections
    const isDragging = ref(false);
    const dragSource = ref<string | null>(null);

    const startConnection = (sourceId: string) => {
        isDragging.value = true;
        dragSource.value = sourceId;
    }
    const endConnection = (targetId: string) => {
        if (dragSource.value) {
            addConnection(dragSource.value, targetId);
        }
        isDragging.value = false;
        dragSource.value = null;
    }
    const cancelConnection = () => {
        isDragging.value = false;
        dragSource.value = null;
    }
    const hasConnection = (nodeId: string, nodeType: NodeType = "source") => {
        if (nodeType === "source") {
            return Object.keys(mapping.value).includes(nodeId);
        } else {
            return Object.values(mapping.value).includes(nodeId);
        }
    }

    return {
        root,
        width,
        height,
        mapping,
        connections,
        isDragging,
        dragSource,
        startConnection,
        endConnection,
        hasConnection,
        addConnection,
        removeConnection,
        cancelConnection,
        nodes,
        getNodeEl,
    }
})

/**
 * Gets the value mapper store from the current injection context, or creates and provides 
 * a new store if none exists.
 * 
 * This function first attempts to inject an existing value mapper store from the current
 * context. If no store is found, it creates a new store and provides it to the context
 * for use by child components.
 * 
 * @returns The value mapper store instance from injection context or a newly created store
 */
export function useValueMapperStore() {
    const store = useInjectValueMapperStore();
    if (!store) {
        throw new Error("useValueMapperStore can only be used in components that are children of a ValueMapperRoot component.");
    }
    return store;
}

/**
 * A composable function that manages DOM element references and calculates their bounding rectangles
 * relative to a root container element.
 * 
 * @param id - The unique identifier for the DOM element, can be a string, ref, or getter function
 * @returns An object containing:
 *   - `el`: A computed ref that gets/sets the DOM element in the nodes store
 *   - `rect`: A computed ref that returns the element's bounding rectangle relative to the root element,
 *     or undefined if no root element exists
 * 
 * @example
 * ```typescript
 * const { el, rect } = useNode('my-element-id');
 * 
 * // Set the element reference
 * el.value = document.getElementById('my-element');
 * 
 * // Access relative positioning
 * console.log(rect.value?.left, rect.value?.top);
 * ```
 */
export function useNode(id: MaybeRefOrGetter<string>, type: MaybeRefOrGetter<NodeType>) {
    const id$ = toRef(id);
    const type$ = toRef(type);
    const store = useValueMapperStore();
    const { nodes, root } = store;
    const el = computed({
        get: () => nodes.value[id$.value],
        set: (el: HTMLElement | null) => {
            if (el) {
                nodes.value = {
                    ...nodes.value,
                    [id$.value]: el
                }
            } else {
                nodes.value = omit(nodes.value, [id$.value]);
            }
        }
    })

    const { width, height, left, right, top, bottom } = useElementBounding(el);
    const rect = computed(() => {
        if (root.value) {
            const offset = root.value.getBoundingClientRect();
            return {
                width: width.value,
                height: height.value,
                left: left.value - offset.left,
                right: right.value - offset.left,
                top: top.value - offset.top,
                bottom: bottom.value - offset.top
            }
        }
    })

    const isConnected = computed(() => {
        return store.hasConnection(id$.value, type$.value)
    })

    const isDragSource = computed(() => {
        return store.isDragging.value && store.dragSource.value === id$.value;
    })

    const onMouseDown = (event: MouseEvent) => {
        event.preventDefault();
        if (type$.value === "source" && !store.hasConnection(id$.value, "source")) {
            event.stopPropagation();
            store.startConnection(id$.value);
        }
    }

    const onMouseUp = (event: MouseEvent) => {
        event.preventDefault();
        if (type$.value === 'target') {
            store.endConnection(id$.value);
        }
    }

    const onTouchEnd = (event: TouchEvent) => {
        event.preventDefault();
        if (type$.value === 'source') {
            const touch = event.changedTouches[0];
            const target = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement;
            const targetName = target.dataset.target;
            if (targetName) {
                event.stopPropagation();
                store.endConnection(targetName);
            }
        } else if (type$.value === 'target') {
            if (store.hasConnection(id$.value, "source")) {
                store.endConnection(id$.value);
            }
        }
    }

    const onClick = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (type$.value === 'source') {
            // If the source node is clicked, we can start a new connection
            store.startConnection(id$.value);
        } else if (type$.value === 'target') {
            // If the target node is clicked, we can end the connection
            store.endConnection(id$.value);
        }
    }

    return { el, rect, isConnected, isDragSource, onMouseDown, onMouseUp, onTouchEnd, onClick };
}


/**
 * Hook for managing connection preview functionality during drag operations.
 * 
 * Provides utilities to create visual connection paths between a source node and the current mouse position
 * while dragging. Returns null if no drag operation is in progress or if required elements are not available.
 * 
 * @returns An object containing path generation functions and coordinates, or null if not dragging
 * 
 * @example
 * ```typescript
 * const preview = useConnectionPreview();
 * if (preview) {
 *   const bezierPath = preview.getBezierPath();
 *   const arrowPath = preview.getArrowPath(6);
 * }
 * ```
 */
export function useConnectionPreview() {
    const { isDragging, dragSource, root, nodes } = useValueMapperStore();
    const sourceRect = computed(() => {
        if (!dragSource.value || !root.value || !isDragging) return null;
        const el = nodes.value[dragSource.value];
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        const offset = root.value.getBoundingClientRect();
        return {
            width: rect.width,
            height: rect.height,
            left: rect.left - offset.left,
            right: rect.right - offset.left,
            top: rect.top - offset.top,
            bottom: rect.bottom - offset.top
        }
    })
    const { elementX, elementY } = useMouseInElement(root);
    
    const coords = computed(() => {
        if (!sourceRect.value || !elementX.value || !elementY.value) return null;
        return {
            source: {
                x: sourceRect.value.right,
                y: sourceRect.value.top + (sourceRect.value.height / 2)
            },
            target: {
                x: elementX.value,
                y: elementY.value
            }
        }
    })

    const getBezierPath = () => {
        if (!coords.value) return '';
        // start path from right-middle of source node
        const sx = coords.value.source.x;
        const sy = coords.value.source.y;
        // end path at mouse position
        const tx = coords.value.target.x;
        const ty = coords.value.target.y;
        // create a bezier curve path
        return generateBezierPath(sx, sy, tx, ty);
    }

    const getSmoothStepPath = (radius = 2) => {
        if (!coords.value) return '';
        // start path from right-middle of source node
        const sx = coords.value.source.x;
        const sy = coords.value.source.y;
        // end path at mouse position
        const tx = coords.value.target.x;
        const ty = coords.value.target.y;
        // create a smooth step path
        return generateSmoothStepPath(sx, sy, tx, ty, radius);
    }

    const getArrowPath = (size = 4, offset = 0) => {
        if (!coords.value) return '';
        // arrow is a triangle with one corner pointing to the target
        // we call this point the "tip" of the arrow
        const tx = coords.value.target.x - offset;
        const ty = coords.value.target.y;
        // calculate the other two corners of the triangle
        // we'll use the right side of the target node as the base
        const ax = tx - size; // left corner of the arrow
        const ay = ty - (size / 2); // top corner of the arrow
        const bx = tx - size; // right corner of the arrow
        const by = ty + (size / 2); // bottom corner of the arrow
        // create a path that draws the triangle
        return `M ${tx} ${ty} L ${ax} ${ay} L ${bx} ${by} Z`; // Z closes the path
    }

    return {
        getBezierPath,
        getSmoothStepPath,
        getArrowPath,
        coords,
    }
}

/**
 * A composable utility for managing connections between source and target nodes in a value mapper interface.
 * 
 * @param source - A reactive reference or getter for the source node identifier
 * @param target - A reactive reference or getter for the target node identifier
 * 
 * @returns An object containing:
 * - `removeConnection` - Function to remove the connection from the store
 * - `getBezierPath` - Function that generates a bezier curve SVG path between nodes
 * - `getSmoothStepPath` - Function that generates a smooth step SVG path with optional radius
 * - `getArrowPath` - Function that generates an arrow triangle SVG path at the target
 * - `coords` - Computed property containing source and target coordinates (x, y positions)
 * 
 * @example
 * ```typescript
 * const { getBezierPath, removeConnection, coords } = useConnectionUtils('node1', 'node2');
 * 
 * // Get bezier path for rendering
 * const pathData = getBezierPath();
 * 
 * // Remove the connection
 * removeConnection();
 * ```
 */
export function useConnectionUtils(source: MaybeRefOrGetter<string>, target: MaybeRefOrGetter<string>) {
    const source$ = toRef(source);
    const target$ = toRef(target);
    const store = useValueMapperStore();

    const { rect: sourceRect } = useNode(source$, "source");
    const { rect: targetRect } = useNode(target$, "target");

    const coords = computed(() => {
        if (!sourceRect.value || !targetRect.value) return null;
        return {
            source: {
                x: sourceRect.value.right,
                y: sourceRect.value.top + (sourceRect.value.height / 2)
            },
            target: {
                x: targetRect.value.left,
                y: targetRect.value.top + (targetRect.value.height / 2)
            }
        }
    })

    const removeConnection = () => {
        store.removeConnection(source$.value);
    }

    const getBezierPath = () => {
        if (!coords.value) return '';
        // start path from right-middle of source node
        const sx = coords.value.source.x;
        const sy = coords.value.source.y;
        // end path at left-middle of target node
        const tx = coords.value.target.x;
        const ty = coords.value.target.y;
        // create a bezier curve path
        return generateBezierPath(sx, sy, tx, ty);
    }

    const getSmoothStepPath = (radius = 2) => {
        if (!coords.value) return '';
        // start path from right-middle of source node
        const sx = coords.value.source.x;
        const sy = coords.value.source.y;
        // end path at left-middle of target node
        const tx = coords.value.target.x;
        const ty = coords.value.target.y;
        // create a smooth step path
        return generateSmoothStepPath(sx, sy, tx, ty, radius);
    }

    const getArrowPath = (size = 4, offset = 0) => {
        if (!coords.value) return '';
        // arrow is a triangle with one corner pointing to the target
        // we call this point the "tip" of the arrow
        const tx = coords.value.target.x - offset;
        const ty = coords.value.target.y;
        // calculate the other two corners of the triangle
        // we'll use the right side of the target node as the base
        const ax = tx - size; // left corner of the arrow
        const ay = ty - (size / 2); // top corner of the arrow
        const bx = tx - size; // right corner of the arrow
        const by = ty + (size / 2); // bottom corner of the arrow
        // create a path that draws the triangle
        return `M ${tx} ${ty} L ${ax} ${ay} L ${bx} ${by} Z`; // Z closes the path
    }

    return { removeConnection, getBezierPath, getSmoothStepPath, getArrowPath, coords };
}
