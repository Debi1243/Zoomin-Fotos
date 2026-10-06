export const THEME_STORAGE_KEY = "theme";

/**
 * Runs in <head> before first paint: applies a saved theme choice, marks the page as
 * able to run scroll animations, and tags phones and tablets as `ios` or `android` so
 * the mobile layout can take on that platform's look without a flash. Lives outside
 * the client component so the server can inline it as a string.
 */
export const headScript = `var d=document.documentElement;try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")d.dataset.theme=t}catch(e){}d.classList.add("js-motion");var u=navigator.userAgent;if(/iPhone|iPad|iPod/.test(u)||(/Macintosh/.test(u)&&navigator.maxTouchPoints>1))d.dataset.platform="ios";else if(/Android/i.test(u))d.dataset.platform="android";if(navigator.standalone||matchMedia("(display-mode: standalone)").matches)d.dataset.standalone=""`;
