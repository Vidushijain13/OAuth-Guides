// Live-generated guides are shared as a link that carries the guide itself in the #hash (no database needed).
export const encodeGuide = (g) =>
  btoa(unescape(encodeURIComponent(JSON.stringify(g)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
export const decodeGuide = (s) => {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return JSON.parse(decodeURIComponent(escape(atob(s))));
};
