import React, { useEffect, useState } from 'react';
import { LIVE_TICKER_FEED } from '../data/marketplaceData';
import { loadSite } from '../api';

export default function MarketTicker() {
  const [feed, setFeed] = useState(LIVE_TICKER_FEED);

  useEffect(() => {
    loadSite()
      .then((site) => {
        if (Array.isArray(site.ticker) && site.ticker.length > 0) setFeed(site.ticker);
      })
      .catch(() => {});
  }, []);

  const loopFeed = [...feed, ...feed];

  return (
    <div className="top-ticker">
      <div className="ticker-track">
        {loopFeed.map((item, index) => (
          <div key={index} className="ticker-node">
            <span className="live-dot" />
            <span className={item.highlight ? 'highlight' : ''}>{item.text}</span>
            <span className="timestamp">• {item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
