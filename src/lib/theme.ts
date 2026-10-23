/**
 * Runs in <head> before first paint: marks the page as able to run scroll animations, and
 * tags phones and tablets as `ios` or `android` (the visit counter reports the device type).
 * Lives outside a client component so the server can inline it as a string.
 */
export const headScript = `var d=document.documentElement;d.classList.add("js-motion");var u=navigator.userAgent;if(/iPhone|iPad|iPod/.test(u)||(/Macintosh/.test(u)&&navigator.maxTouchPoints>1))d.dataset.platform="ios";else if(/Android/i.test(u))d.dataset.platform="android"`;
