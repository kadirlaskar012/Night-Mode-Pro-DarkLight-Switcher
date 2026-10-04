import { defineConfig } from 'wxt';
import react from '@vitejs/plugin-react';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  manifest: {
    name: '__MSG_extName__',
    description: '__MSG_extDescription__',
    default_locale: 'en',
    permissions: [
      'storage',
      'activeTab',
      'alarms',
      'scripting',
      'tabs',
    ],
    optional_permissions: [
      'geolocation',
    ],
    options_page: 'options.html',
    options_ui: {
      page: 'options.html',
      open_in_tab: true,
    },
    host_permissions: [
      '<all_urls>',
      'https://api.lemonsqueezy.com/*',
      'https://api.gumroad.com/*',
    ],
    commands: {
      toggle_mode: {
        suggested_key: {
          default: 'Alt+Shift+D',
          mac: 'Alt+Shift+D',
        },
        description: 'Toggle Dark/Light Mode on current tab',
      },
      toggle_global: {
        suggested_key: {
          default: 'Alt+Shift+N',
          mac: 'Alt+Shift+N',
        },
        description: 'Toggle Dark/Light Mode globally (Pro)',
      },
      brightness_up: {
        suggested_key: {
          default: 'Alt+Shift+Up',
          mac: 'Alt+Shift+Up',
        },
        description: 'Increase Brightness by 5% (Pro)',
      },
      brightness_down: {
        suggested_key: {
          default: 'Alt+Shift+Down',
          mac: 'Alt+Shift+Down',
        },
        description: 'Decrease Brightness by 5% (Pro)',
      },
    },
    action: {
      default_title: 'Night Mode Pro',
      default_popup: 'popup.html',
      default_icon: {
        '16': 'icons/icon-16.png',
        '32': 'icons/icon-32.png',
        '48': 'icons/icon-48.png',
        '128': 'icons/icon-128.png',
      },
    },
    icons: {
      '16': 'icons/icon-16.png',
      '32': 'icons/icon-32.png',
      '48': 'icons/icon-48.png',
      '128': 'icons/icon-128.png',
    },
  },
  vite: () => ({
    plugins: [react()],
  }),
});
