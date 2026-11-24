(function () {
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
        showToast("Message sent. Thanks for reaching out!");
      } catch (error) {
        showToast("Could not send message. Please try again.", true);
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Send message";
      }
    });
  }
})();
