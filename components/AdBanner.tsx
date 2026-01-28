import React, { useEffect } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  layoutKey?: string;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const AdBanner: React.FC<AdBannerProps> = ({ 
  slot, 
  format = 'auto', 
  layoutKey, 
  className = "" 
}) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn("AdSense failed to load", e);
    }
  }, []);

  return (
    <div 
      className={`ad-container w-full overflow-hidden flex flex-col items-center justify-center my-6 ${className}`}
      aria-hidden="true"
    >
      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-2">
        Advertisement
      </span>
      <div className="bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-center w-full min-h-[100px]">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-YOUR_CLIENT_ID"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
          {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
        />
      </div>
    </div>
  );
};