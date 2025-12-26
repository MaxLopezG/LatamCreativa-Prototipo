/**
 * VirtualizedList Component
 * 
 * A reusable virtualized list component using @tanstack/react-virtual.
 * Renders only visible items for optimal performance with large datasets.
 * 
 * @example
 * <VirtualizedList
 *   items={comments}
 *   renderItem={(comment) => <CommentCard comment={comment} />}
 *   estimateSize={() => 120}
 * />
 */
import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface VirtualizedListProps<T> {
    /** Array of items to render */
    items: T[];
    /** Render function for each item */
    renderItem: (item: T, index: number) => React.ReactNode;
    /** Estimated height of each item in pixels */
    estimateSize: () => number;
    /** Container className */
    className?: string;
    /** Overscan count (items to render above/below visible area) */
    overscan?: number;
}

export function VirtualizedList<T>({
    items,
    renderItem,
    estimateSize,
    className = '',
    overscan = 5,
}: VirtualizedListProps<T>) {
    const parentRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => parentRef.current,
        estimateSize,
        overscan,
    });

    const virtualItems = virtualizer.getVirtualItems();

    if (items.length === 0) {
        return null;
    }

    return (
        <div
            ref={parentRef}
            className={`overflow-auto ${className}`}
            style={{ contain: 'strict' }}
        >
            <div
                style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                }}
            >
                {virtualItems.map((virtualItem) => (
                    <div
                        key={virtualItem.key}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            transform: `translateY(${virtualItem.start}px)`,
                        }}
                        data-index={virtualItem.index}
                    >
                        {renderItem(items[virtualItem.index], virtualItem.index)}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default VirtualizedList;
