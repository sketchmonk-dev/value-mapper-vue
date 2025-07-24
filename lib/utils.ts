/**
 * Creates a new object by omitting specified keys from the original object.
 * 
 * @template T - The type of the input object, extending Record<string, any>
 * @template K - The type of keys to omit, extending keyof T
 * @param obj - The source object from which to omit properties
 * @param keys - An array of keys to remove from the object
 * @returns A new object with the specified keys removed
 * 
 * @example
 * ```typescript
 * const user = { id: 1, name: 'John', email: 'john@example.com', password: 'secret' };
 * const publicUser = omit(user, ['password']);
 * // Result: { id: 1, name: 'John', email: 'john@example.com' }
 * ```
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keys: K[]
): Omit<T, K> {
    const result = { ...obj };
    keys.forEach(key => {
        delete result[key];
    });
    return result as Omit<T, K>;
}

/**
 * Generates an SVG path string for a cubic Bezier curve between two points.
 * 
 * The function creates a smooth horizontal curve by placing control points
 * at a distance equal to half the horizontal distance between the start and end points.
 * Control points maintain the same Y coordinates as their respective endpoints.
 * 
 * @param sx - The x-coordinate of the starting point
 * @param sy - The y-coordinate of the starting point
 * @param tx - The x-coordinate of the target/ending point
 * @param ty - The y-coordinate of the target/ending point
 * @returns An SVG path string in the format "M sx sy C cx1 cy1, cx2 cy2, tx ty"
 * 
 * @example
 * ```typescript
 * const path = generateBezierPath(0, 0, 100, 50);
 * // Returns: "M 0 0 C 50 0, 50 50, 100 50"
 * ```
 */
export function generateBezierPath(sx: number, sy: number, tx: number, ty: number): string {
    const controlPointDistance = Math.abs(tx - sx) * 0.5;
    const cx1 = sx + controlPointDistance;
    const cy1 = sy;
    const cx2 = tx - controlPointDistance;
    const cy2 = ty;
    return `M ${sx} ${sy} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${tx} ${ty}`;
}

/**
 * Generates an SVG path string for a smooth step connection between two points.
 * 
 * Creates a path that moves horizontally from the start point to the middle,
 * then smoothly transitions vertically using quadratic curves, and finally
 * moves horizontally to the end point.
 * 
 * @param sx - The x-coordinate of the starting point
 * @param sy - The y-coordinate of the starting point
 * @param tx - The x-coordinate of the target/end point
 * @param ty - The y-coordinate of the target/end point
 * @param radius - The radius for the curved transitions at corners (default: 2)
 * @returns An SVG path string representing the smooth step path
 * 
 * @example
 * ```typescript
 * const pathString = generateSmoothStepPath(10, 20, 100, 80, 5);
 * // Returns: "M 10 20 H 50 Q 55,20 55,25 V 75 Q 55,80 60,80 H 100"
 * ```
 */
export function generateSmoothStepPath(sx: number, sy: number, tx: number, ty: number, radius = 2): string {
    // create a smooth step path
    const midX = (sx + tx) / 2;
    const direction = sy < ty ? 1 : -1; // determine if we need to go up or down
    return [
        `M ${sx} ${sy}`,
        `H ${midX - radius}`,
        `Q ${midX},${sy} ${midX},${sy + (direction * radius)}`,
        `V ${ty - (direction * radius)}`,
        `Q ${midX},${ty} ${midX + radius},${ty}`,
        `H ${tx}`
    ].join(' ');
}