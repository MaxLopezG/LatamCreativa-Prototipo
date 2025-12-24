import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'profile';
    author?: string;
    publishedTime?: string;
    keywords?: string[];
}

const DEFAULT_TITLE = 'Latam Creativa — Plataforma para Creativos Latinoamericanos';
const DEFAULT_DESCRIPTION = 'Descubre, comparte y conecta con artistas 3D, diseñadores, animadores y creativos de toda Latinoamérica.';
const DEFAULT_IMAGE = 'https://latamcreativa.com/og-image.jpg';
const SITE_URL = 'https://latamcreativa.com';

export const SEOHead: React.FC<SEOHeadProps> = ({
    title,
    description = DEFAULT_DESCRIPTION,
    image = DEFAULT_IMAGE,
    url,
    type = 'website',
    author,
    publishedTime,
    keywords = []
}) => {
    const fullTitle = title ? `${title} | Latam Creativa` : DEFAULT_TITLE;
    const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            {keywords.length > 0 && (
                <meta name="keywords" content={keywords.join(', ')} />
            )}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:locale" content="es_LA" />
            <meta property="og:site_name" content="Latam Creativa" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={fullUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Article-specific */}
            {type === 'article' && author && (
                <meta property="article:author" content={author} />
            )}
            {type === 'article' && publishedTime && (
                <meta property="article:published_time" content={publishedTime} />
            )}

            {/* Canonical URL */}
            <link rel="canonical" href={fullUrl} />
        </Helmet>
    );
};
