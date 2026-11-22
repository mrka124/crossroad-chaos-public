import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js';
import {
  getRemoteConfig,
  fetchAndActivate,
  getValue,
} from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-remote-config.js';

/**
 * Set window.FIREBASE_WEB_CONFIG in index.html (or firebase-config.js) to enable
 * live Remote Config updates for landing_crossroads_chaos.
 */
async function syncLandingFromRemoteConfig() {
  const config = window.FIREBASE_WEB_CONFIG;
  if (!config || !config.apiKey || !config.appId) {
    return;
  }

  try {
    const app = initializeApp(config);
    const rc = getRemoteConfig(app);
    rc.settings.minimumFetchIntervalMillis = 60_000;
    await fetchAndActivate(rc);

    const raw = getValue(rc, 'landing_crossroads_chaos').asString();
    if (!raw) return;

    const data = JSON.parse(raw);

    const titleEl = document.querySelector('.hero-title');
    if (titleEl && data.heroTitle) {
      titleEl.textContent = data.heroTitle;
    }

    const subtitleEl = document.querySelector('.hero-tagline');
    if (subtitleEl && data.heroSubtitle) {
      subtitleEl.textContent = data.heroSubtitle;
    }

    const webBtn = document.querySelector('.play-now-btn');
    if (webBtn) {
      if (data.showWebPlayButton === false) {
        webBtn.style.display = 'none';
      } else {
        webBtn.style.display = '';
        if (data.webPlayUrl) webBtn.setAttribute('href', data.webPlayUrl);
      }
    }

    if (data.maintenanceBanner && data.maintenanceMessage) {
      let banner = document.getElementById('rc-maintenance-banner');
      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'rc-maintenance-banner';
        banner.style.cssText =
          'background:#93000a;color:#ffdad6;text-align:center;padding:10px 16px;font-size:14px;font-weight:600;position:relative;z-index:100;';
        document.body.prepend(banner);
      }
      banner.textContent = data.maintenanceMessage;
    }
  } catch (err) {
    console.warn('[RemoteConfig] Landing sync skipped:', err);
  }
}

syncLandingFromRemoteConfig();
