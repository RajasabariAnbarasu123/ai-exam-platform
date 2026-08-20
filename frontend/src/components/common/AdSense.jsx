import React, { useEffect } from 'react';

/**
 * Reusable Google AdSense Ad Component
 * 
 * Usage:
 * <AdSense slot="1234567890" format="auto" responsive="true" />
 */
const AdSense = ({
    client = 'ca-pub-6567377051605195',
    slot,
    format = 'auto',
    responsive = 'true',
    style = { display: 'block' },
    className = 'my-4 text-center overflow-hidden'
}) => {
    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (err) {
            // Suppress duplicate push warnings in dev mode
            console.debug('AdSense tag initialized', err);
        }
    }, []);

    return (
        <div className={`adsense-container ${className}`}>
            <ins
                className="adsbygoogle"
                style={style}
                data-ad-client={client}
                data-ad-slot={slot || '1234567890'}
                data-ad-format={format}
                data-full-width-responsive={responsive}
            />
        </div>
    );
};

export default AdSense;
