// RSS Website config
//
// This site can be opened in two modes:
//  1) Hosted under http(s) (recommended): links like /viewer/ work as normal.
//  2) Opened from local disk (file://): absolute paths like /viewer/ will not exist.
//
// Set these to point to your RSS Platform deployment (no trailing slash).
// Examples:
//   window.RSS_PLATFORM_BASE_URL = "http://localhost:8080";
//   window.RSS_PLATFORM_BASE_URL = "https://rss.example.com";
//
// Compatibility alias (older builds used RSS_API_BASE)
window.RSS_API_BASE = window.RSS_API_BASE || "";

// Preferred base URL
window.RSS_PLATFORM_BASE_URL = window.RSS_PLATFORM_BASE_URL || window.RSS_API_BASE || "";

// Optional overrides (defaults to platform base)
window.RSS_VIEWER_BASE_URL = window.RSS_VIEWER_BASE_URL || window.RSS_PLATFORM_BASE_URL || "";
window.RSS_PUBLIC_BASE_URL = window.RSS_PUBLIC_BASE_URL || window.RSS_PLATFORM_BASE_URL || "";
