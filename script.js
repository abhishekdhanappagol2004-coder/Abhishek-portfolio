// ---------- Theme toggle (remembers choice) ----------
const root = document.documentElement;
const themeBtn = document.getElementById("themeToggle");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeBtn.textContent = theme === "dark" ? "🌙" : "☀️";
}
let savedTheme = "dark";
try { savedTheme = localStorage.getItem("theme") || "dark"; } catch (e) {}
applyTheme(savedTheme);

themeBtn.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// ---------- Mobile menu ----------
const navLinks = document.getElementById("navLinks");
document.getElementById("menuToggle").addEventListener("click", () => {
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => navLinks.classList.remove("open"))
);

// ---------- Typing effect ----------
const words = ["React.js apps", "responsive UIs", "full stack projects", "clean code"];
const typedEl = document.getElementById("typed");
let w = 0, c = 0, deleting = false;

function type() {
  const word = words[w];
  typedEl.textContent = word.substring(0, c);
  if (!deleting && c < word.length) { c++; setTimeout(type, 90); }
  else if (!deleting) { deleting = true; setTimeout(type, 1200); }
  else if (c > 0) { c--; setTimeout(type, 45); }
  else { deleting = false; w = (w + 1) % words.length; setTimeout(type, 300); }
}
type();

// ---------- Scroll reveal ----------
const observer = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); }
  }),
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// ---------- Active nav link on scroll ----------
const sections = document.querySelectorAll("main section[id]");
const links = document.querySelectorAll(".nav-links a");
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((s) => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
  document.getElementById("toTop").classList.toggle("show", window.scrollY > 500);
});

document.getElementById("toTop").addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

// ---------- Contact form ----------
// 1) Tries to deliver the message to my inbox through FormSubmit.
// 2) If that does not work (not activated, offline, blocked), it shows a button
//    that opens Gmail with the message already written, so nothing is lost.
const CONTACT_EMAIL = "abhishekdhanappagol2004@gmail.com";
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");
const sendBtn = document.getElementById("sendBtn");

function setStatus(text, ok) {
  statusEl.textContent = text;
  statusEl.className = "form-status " + (ok ? "ok" : "err");
}

function showFallback(name, email, message) {
  const subject = "Portfolio enquiry from " + name;
  const body = message + "\n\nFrom: " + name + " (" + email + ")";
  const gmail = "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(CONTACT_EMAIL) +
    "&su=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  const mailto = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(subject) +
    "&body=" + encodeURIComponent(body);

  statusEl.className = "form-status err";
  statusEl.textContent = "Could not send automatically. Please send it with one click: ";
  const a = document.createElement("a");
  a.href = gmail; a.target = "_blank"; a.rel = "noopener"; a.className = "fallback-link";
  a.textContent = "Open in Gmail";
  const sep = document.createTextNode(" or ");
  const b = document.createElement("a");
  b.href = mailto; b.className = "fallback-link"; b.textContent = "Open in my mail app";
  statusEl.append(a, sep, b);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("cname").value.trim();
  const email = document.getElementById("cemail").value.trim();
  const message = document.getElementById("cmsg").value.trim();

  if (!name || !email || !message) { setStatus("Please fill in all the fields.", false); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setStatus("Please enter a valid email address.", false); return; }

  sendBtn.disabled = true;
  sendBtn.textContent = "Sending...";
  setStatus("", true);

  let delivered = false;
  try {
    const res = await fetch("https://formsubmit.co/ajax/" + CONTACT_EMAIL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        name: name, email: email, message: message,
        _subject: "New message from your portfolio website",
        _replyto: email, _template: "table", _captcha: "false"
      })
    });
    const data = await res.json();
    delivered = res.ok && (data.success === true || data.success === "true");
  } catch (err) {
    delivered = false;
  }

  if (delivered) {
    setStatus("Thank you, " + name + "! Your message has been sent. I'll reply soon.", true);
    form.reset();
  } else {
    showFallback(name, email, message);
  }
  sendBtn.disabled = false;
  sendBtn.textContent = "Send Message";
});

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();
