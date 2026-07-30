document.addEventListener("DOMContentLoaded", () => {
  // DYNAMIC FOOTER YEAR
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // DARK / LIGHT MODE TOGGLE
  const themeToggleBtn = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    if (themeIcon) {
      themeIcon.className = theme === "dark" ? "bx bx-sun" : "bx bx-moon";
    }
  }

  // Sync icon state on page load based on active theme
  const currentSavedTheme = localStorage.getItem("theme") || "light";
  if (themeIcon) {
    themeIcon.className =
      currentSavedTheme === "dark" ? "bx bx-sun" : "bx bx-moon";
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const activeTheme = document.documentElement.getAttribute("data-theme");
      const nextTheme = activeTheme === "dark" ? "light" : "dark";
      setTheme(nextTheme);
    });
  }

  // MOBILE NAVIGATION TOGGLE
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });

    // Close mobile nav menu when a link is clicked
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
      });
    });
  }

  // NAVBAR ACTIVE LINK HIGHLIGHTING WHEN SCROLLING
  const allSections = document.querySelectorAll("section[id]");
  const navLinkEls = document.querySelectorAll('.nav-links a[href^="#"]');

  if (allSections.length > 0 && navLinkEls.length > 0) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute("id");

            navLinkEls.forEach((link) => {
              if (link.getAttribute("href") === `#${currentId}`) {
                link.classList.add("active");
              } else {
                link.classList.remove("active");
              }
            });
          }
        });
      },
      {
        rootMargin: "-30% 0px -60% 0px",
        threshold: 0,
      },
    );

    allSections.forEach((section) => navObserver.observe(section));
  }

  // SCROLL REVEAL ANIMATIONS
  const revealSections = document.querySelectorAll(
    ".section:not(.hero-section)",
  );

  if (revealSections.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.15,
      },
    );

    revealSections.forEach((section) => revealObserver.observe(section));
  }

  // SKILLS CATEGORY FILTERING
  const filterBtns = document.querySelectorAll(".filter-btn");
  const skillCards = document.querySelectorAll(".skill-card");

  if (filterBtns.length > 0 && skillCards.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filterValue = btn.getAttribute("data-filter");

        skillCards.forEach((card) => {
          const category = card.getAttribute("data-category");
          if (filterValue === "all" || category === filterValue) {
            card.classList.remove("hide");
          } else {
            card.classList.add("hide");
          }
        });
      });
    });
  }

  //CONTACT FORM VALIDATION & AJAX SUBMISSION
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const formFeedback = document.getElementById("formFeedback");

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;

      // Reset error messages and field attributes
      document
        .querySelectorAll(".error-message")
        .forEach((el) => (el.textContent = ""));
      [nameInput, emailInput, messageInput].forEach((input) => {
        if (input) input.removeAttribute("aria-invalid");
      });
      if (formFeedback) formFeedback.textContent = "";

      // Validate Name
      if (!nameInput || nameInput.value.trim() === "") {
        document.getElementById("nameError").textContent = "Name is required.";
        if (nameInput) nameInput.setAttribute("aria-invalid", "true");
        isValid = false;
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
        document.getElementById("emailError").textContent =
          "Please enter a valid email address.";
        if (emailInput) emailInput.setAttribute("aria-invalid", "true");
        isValid = false;
      }

      // Validate Message
      if (!messageInput || messageInput.value.trim().length < 10) {
        document.getElementById("messageError").textContent =
          "Message must be at least 10 characters long.";
        if (messageInput) messageInput.setAttribute("aria-invalid", "true");
        isValid = false;
      }

      // Netlify Form Submission
      if (isValid) {
        if (formFeedback) {
          formFeedback.style.color = "var(--text-color, #6b7280)";
          formFeedback.textContent = "Sending your message...";
        }

        const formData = new FormData(contactForm);

        fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(formData).toString(),
        })
          .then((response) => {
            if (response.ok) {
              if (formFeedback) {
                formFeedback.style.color = "#10b981";
                formFeedback.textContent =
                  "Thank you! Your message has been sent.";
              }
              contactForm.reset();
            } else {
              throw new Error("Form submission network response was not ok.");
            }
          })
          .catch((error) => {
            if (formFeedback) {
              formFeedback.style.color = "#ef4444";
              formFeedback.textContent =
                "Oops! There was a problem sending your message. Please try again.";
            }
            console.error("Netlify form submission error:", error);
          });
      }
    });
  }
});
