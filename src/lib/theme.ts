export const THEME_STORAGE_KEY = "theme";

/**
 * Runs in <head> before first paint: applies a saved theme choice and marks the page
 * as able to run scroll animations. Lives outside the client component so the server
 * can inline it as a string.
 */
export const headScript = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}document.documentElement.classList.add("js-motion")`;
