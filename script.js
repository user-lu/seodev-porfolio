document.addEventListener("DOMContentLoaded", () => {
  // --- Active Navbar Link Highlighting on Scroll ---
  const allSections = document.querySelectorAll("section[id]");
  const navLinkEls = document.querySelectorAll('.nav-links a[href^="#"]');

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute("id");

          navLinkEls.forEach((link) => {
            // Check if the link's href matches the visible section's ID
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
      /*
    rootMargin creates a thin detection strip in the upper-middle 
    portion of the viewport so the highlight shifts smoothly.
  */
      rootMargin: "-30% 0px -60% 0px",
      threshold: 0,
    },
  );

  allSections.forEach((section) => {
    navObserver.observe(section);
  });

  // Hides sections until scrolled further
  const sections = document.querySelectorAll(".section:not(.hero-section)");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        // Reveal section when 15% of it enters the viewport
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal");
          // Stop observing once revealed so it stays visible
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null, // viewport
      threshold: 0.15, // triggers when 15% of section is visible
    },
  );

  sections.forEach((section) => {
    revealObserver.observe(section);
  });

  // 1. Dynamic Footer Year
  document.getElementById("year").textContent = new Date().getFullYear();

  // 2. Dark / Light Mode Toggle with Boxicons
  const themeToggleBtn = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const savedTheme = localStorage.getItem("theme");

  // Helper function to update the Boxicon class safely
  function updateIcon(theme) {
    if (themeIcon) {
      if (theme === "dark") {
        themeIcon.className = "bx bx-sun"; // Show sun icon when in dark mode
      } else {
        themeIcon.className = "bx bx-moon"; // Show moon icon when in light mode
      }
    }
  }

  // ALWAYS apply saved theme to <html> regardless of whether the toggle button exists on this page
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateIcon(savedTheme);
  }

  // Only attach the click event if the button actually exists on the page
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      updateIcon(newTheme);
    });
  }

  // 3. Mobile Navigation Toggle
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  // Close nav on link click in mobile view
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });

  // 4. Skills Category Filtering (DOM Manipulation)
  const filterBtns = document.querySelectorAll(".filter-btn");
  const skillCards = document.querySelectorAll(".skill-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      skillCards.forEach((card) => {
        if (
          filterValue === "all" ||
          card.getAttribute("data-category") === filterValue
        ) {
          card.classList.remove("hide");
        } else {
          card.classList.add("hide");
        }
      });
    });
  });

  // 5. Contact Form Client-Side Validation & Netlify Submission
  const contactForm = document.getElementById("contactForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const formFeedback = document.getElementById("formFeedback");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset errors
    document
      .querySelectorAll(".error-message")
      .forEach((el) => (el.textContent = ""));
    formFeedback.textContent = "";

    // Validate Name
    if (nameInput.value.trim() === "") {
      document.getElementById("nameError").textContent = "Name is required.";
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      document.getElementById("emailError").textContent =
        "Please enter a valid email address.";
      isValid = false;
    }

    // Validate Message
    if (messageInput.value.trim().length < 10) {
      document.getElementById("messageError").textContent =
        "Message must be at least 10 characters long.";
      isValid = false;
    }

    // Real Netlify Form Submission
    if (isValid) {
      // Optional: Give instant visual feedback while request processes
      formFeedback.style.color = "var(--text-color, #6b7280)";
      formFeedback.textContent = "Sending your message...";

      const formData = new FormData(contactForm);

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      })
        .then((response) => {
          if (response.ok) {
            formFeedback.style.color = "#10b981";
            formFeedback.textContent = "Thank you! Your message has been sent.";
            contactForm.reset();
          } else {
            throw new Error("Form submission network response was not ok.");
          }
        })
        .catch((error) => {
          formFeedback.style.color = "#ef4444";
          formFeedback.textContent =
            "Oops! There was a problem sending your message. Please try again.";
          console.error("Netlify form submission error:", error);
        });
    }
  });
});
