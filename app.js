(function () {
  const body = document.body;
  const menu = document.querySelector("[data-menu]");
  const nav = document.querySelector("[data-nav]");
  const introGate = document.querySelector("[data-intro-gate]");
  const counters = document.querySelectorAll("[data-count]");
  const forms = document.querySelectorAll("[data-lead-form]");
  const orbitRing = document.querySelector("[data-orbit-ring]");
  const orbitButtons = document.querySelectorAll("[data-orbit]");
  const revealItems = document.querySelectorAll(
    ".section, .card, .loop-step, .subject-card, .tutor-card, .quote, .stat, .medal-card, .podium-chart, .file-row, .ladder-row, .price-panel, .decision-card"
  );

  if (introGate) {
    setupIntroGate(introGate);
  }

  if (menu && nav) {
    menu.addEventListener("click", () => {
      const open = body.classList.toggle("nav-open");
      menu.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        body.classList.remove("nav-open");
        menu.setAttribute("aria-expanded", "false");
      }
    });
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.45 }
  );

  counters.forEach((counter) => observer.observe(counter));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );

  revealItems.forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 55}ms`);
    revealObserver.observe(item);
  });

  function revealOnScroll() {
    revealItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
        item.classList.add("is-visible");
      }
    });
  }

  revealOnScroll();
  window.addEventListener("scroll", revealOnScroll, { passive: true });
  window.addEventListener("resize", revealOnScroll);

  function countUp(element) {
    const target = Number(element.getAttribute("data-count") || "0");
    const duration = 900;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased).toLocaleString("en-US");
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function setupIntroGate(gate) {
    const storageKey = "westbridgeIntroSeen";
    let shouldSkip = document.documentElement.classList.contains("intro-skipped");

    try {
      shouldSkip = shouldSkip || sessionStorage.getItem(storageKey) === "1";
      sessionStorage.setItem(storageKey, "1");
    } catch (error) {
      shouldSkip = true;
    }

    if (shouldSkip || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gate.remove();
      body.classList.remove("intro-active");
      document.documentElement.classList.add("intro-skipped");
      return;
    }

    body.classList.add("intro-active");

    const start = () => {
      if (gate.classList.contains("is-taking")) return;
      gate.classList.add("is-taking");
      window.setTimeout(() => {
        gate.classList.add("is-done");
        body.classList.remove("intro-active");
      }, 2600);
      window.setTimeout(() => {
        gate.remove();
      }, 3300);
    };

    gate.addEventListener("click", start);
    gate.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        start();
      }
    });
  }

  forms.forEach((form) => {
    const status = form.querySelector("[data-form-status]");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (status) status.textContent = "Sending application...";

      const payload = Object.fromEntries(new FormData(form).entries());

      try {
        const response = await fetch("/.netlify/functions/submit-application", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Application endpoint unavailable");

        form.reset();
        if (status) {
          status.textContent = "Application received. We will contact you with the test slot and payment details.";
        }
      } catch (error) {
        const key = "westbridge-olympiad-preview-applications";
        const stored = JSON.parse(localStorage.getItem(key) || "[]");
        stored.push({ ...payload, createdAt: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(stored.slice(-30)));
        form.reset();
        if (status) {
          status.textContent = "Preview mode: saved locally. Netlify and Supabase will store live applications after deployment.";
        }
      }
    });
  });

  if (orbitRing && orbitButtons.length) {
    let offset = 0;

    orbitButtons.forEach((button) => {
      button.addEventListener("click", () => {
        offset += button.getAttribute("data-orbit") === "next" ? -1 : 1;
        orbitRing.style.setProperty("--orbit-offset", String(offset));
      });
    });
  }
})();
