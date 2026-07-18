(function () {
  const body = document.body;

  /* mobile nav toggle */
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = body.classList.toggle("menu-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        body.classList.remove("menu-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* active link highlighting for one-page scroll (index only) */
  const sectionLinks = navLinks
    ? [...navLinks.querySelectorAll("a[href^='#']")]
    : [];

  function setActiveLink() {
    if (!sectionLinks.length) return;
    const fromTop = window.scrollY + 150;
    sectionLinks.forEach((link) => {
      const section = document.querySelector(link.getAttribute("href"));
      if (!section) return;
      const inSection =
        section.offsetTop <= fromTop &&
        section.offsetTop + section.offsetHeight > fromTop;
      link.classList.toggle("active", inSection);
    });
  }

  if (sectionLinks.length) {
    window.addEventListener("scroll", setActiveLink, { passive: true });
    setActiveLink();
  }

  /* scroll reveal */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* rotating word in the hero */
  const swapWord = document.querySelector(".swap-word");
  if (swapWord) {
    const words = JSON.parse(swapWord.dataset.words || "[]");
    let index = 0;
    if (words.length > 1) {
      setInterval(() => {
        swapWord.classList.add("is-out");
        setTimeout(() => {
          index = (index + 1) % words.length;
          swapWord.textContent = words[index];
          swapWord.classList.remove("is-out");
        }, 300);
      }, 2600);
    }
  }

  /* contact form + toast */
  const contactForm = document.getElementById("contact-form");
  const toast = document.getElementById("toast");
  let toastTimer;

  function showToast(message, isError = false) {
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.toggle("error", isError);
    toast.classList.add("show");
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
  }

  if (contactForm) {
    const submitButton = contactForm.querySelector("button[type='submit']");

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { Accept: "application/json" }
        });

        if (!response.ok) throw new Error("Form request failed");

        contactForm.reset();
        showToast("Message sent — thanks for reaching out!");
      } catch (error) {
        showToast("Could not send message. Please try again.", true);
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Send Message";
      }
    });
  }
})();
