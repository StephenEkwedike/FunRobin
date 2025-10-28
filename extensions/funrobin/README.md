# FunRobin Chrome Extension

This Chrome extension enables seamless autofill of Robinhood order tickets from FunRobin.

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `extensions/funrobin` directory
5. The extension is now installed and active

## How It Works

1. User clicks "Execute Trade" in FunRobin
2. FunRobin creates a one-time autofill code and opens Robinhood with `?fr=CODE` in the URL
3. The extension detects the code, fetches the order details from FunRobin's API
4. The extension fills in the order form fields (quantity, limit price, etc.)
5. User reviews and manually submits the order

## Development

- `manifest.json` - Extension configuration
- `content.js` - Content script that runs on Robinhood pages

## Security

- One-time use codes expire after 2 minutes
- No auto-submission - user must manually review and submit
- Minimal permissions required
