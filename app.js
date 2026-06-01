(function () {
  const body = document.body;
  const header = document.querySelector("[data-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  const form = document.querySelector("[data-lead-form]");
  const status = document.querySelector("[data-form-status]");

  function setHeaderState() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const counters = document.querySelectorAll("[data-count]");
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.45 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  function animateCounter(element) {
    const target = Number(element.getAttribute("data-count") || 0);
    const duration = 1000;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  if (form && status) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      status.classList.remove("is-error");
      status.textContent = "Sending your request...";

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      try {
        const response = await fetch("/.netlify/functions/submit-lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Lead endpoint unavailable");

        form.reset();
        status.textContent = "Request received. We will contact you with the diagnostic route.";
      } catch (error) {
        savePreviewLead(payload);
        form.reset();
        status.textContent =
          "Preview mode: request saved locally. Deploy with Netlify/Supabase to store live leads.";
      }
    });
  }

  function savePreviewLead(payload) {
    const key = "westbridge-olympiad-preview-leads";
    const leads = JSON.parse(localStorage.getItem(key) || "[]");
    leads.push({
      ...payload,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem(key, JSON.stringify(leads.slice(-25)));
  }
})();
