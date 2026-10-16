import React, { useEffect, useState } from 'react';
import { loadSite } from '../api';

export default function MarketTicker() {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    loadSite()
      .then((site) => {
        if (Array.isArray(site.ticker)) setFeed(site.ticker);
      })
      .catch(() => setFeed([]));
  }, []);

  if (feed.length === 0) return null;

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
