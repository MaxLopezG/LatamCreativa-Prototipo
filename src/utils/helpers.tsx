import React from 'react';

export const timeAgo = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return "hace " + Math.floor(interval) + " años";
    interval = seconds / 2592000;
    if (interval > 1) return "hace " + Math.floor(interval) + " meses";
    interval = seconds / 86400;
    if (interval > 1) return "hace " + Math.floor(interval) + " días";
    interval = seconds / 3600;
    if (interval > 1) return "hace " + Math.floor(interval) + " horas";
    interval = seconds / 60;
    if (interval > 1) return "hace " + Math.floor(interval) + " min";
    return "hace un momento";
};

export const getYoutubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

/**
 * Extrae el ID del modelo de una URL de Sketchfab.
 * Soporta formatos:
 * - https://sketchfab.com/3d-models/model-name-{MODEL_ID}
 * - https://sketchfab.com/models/{MODEL_ID}
 * - https://sketchfab.com/models/{MODEL_ID}/embed
 */
export const getSketchfabModelId = (url: string): string | null => {
    if (!url) return null;

    // Pattern: Extract the ID from common Sketchfab URL formats
    // IDs can be alphanumeric (both 32-char hex and shorter base62-like IDs)
    // Note: .*- is greedy, so it captures everything up to the LAST hyphen before the ID
    const pattern = /sketchfab\.com\/(?:3d-models\/.*-|models\/)([a-zA-Z0-9]+)/i;
    const match = url.match(pattern);
    if (match && match[1]) return match[1];

    return null;
};

export const renderDescriptionWithLinks = (text: string) => {
    const urlRegex = /((?:https?:\/\/|www\.)[^\s]+)/g;
    return text.split(urlRegex).map((part, index) => {
        if (part.match(urlRegex)) {
            const href = part.startsWith('www.') ? `https://${part}` : part;
            return (
                <a
                    key={index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-500 hover:underline break-all"
                >
                    {part}
                </a>
            );
        }
        return part;
    });
};
