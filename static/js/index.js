// Prevent VideoJS hints (safe even if VideoJS isn't used)
window.HELP_IMPROVE_VIDEOJS = false;

/* -----------------------------
   Helpers for carousel videos
----------------------------- */
function pauseAllVideosIn(el) {
  el.querySelectorAll("video").forEach((v) => {
    try { v.pause(); } catch (e) {}
  });
}

function loadVideosIn(el) {
  el.querySelectorAll("video").forEach((v) => {
    try { v.load(); } catch (e) {}
  });
}

/* -----------------------------
   More Works Dropdown
----------------------------- */
function toggleMoreWorks() {
  const dropdown = document.getElementById("moreWorksDropdown");
  const button = document.querySelector(".more-works-btn");
  if (!dropdown || !button) return;

  const isOpen = dropdown.classList.contains("show");
  dropdown.classList.toggle("show", !isOpen);
  button.classList.toggle("active", !isOpen);
}

// Close dropdown when clicking outside
document.addEventListener("click", (event) => {
  const container = document.querySelector(".more-works-container");
  const dropdown = document.getElementById("moreWorksDropdown");
  const button = document.querySelector(".more-works-btn");
  if (!container || !dropdown || !button) return;

  if (!container.contains(event.target)) {
    dropdown.classList.remove("show");
    button.classList.remove("active");
  }
});

// Close dropdown on escape key
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const dropdown = document.getElementById("moreWorksDropdown");
  const button = document.querySelector(".more-works-btn");
  if (!dropdown || !button) return;

  dropdown.classList.remove("show");
  button.classList.remove("active");
});

/* -----------------------------
   Copy BibTeX
----------------------------- */
function copyBibTeX() {
  const bibtexElement = document.getElementById("bibtex-code");
  const button = document.querySelector(".copy-bibtex-btn");
  if (!bibtexElement || !button) return;

  const copyText = button.querySelector(".copy-text");
  const textToCopy = bibtexElement.textContent || "";

  function feedback() {
    button.classList.add("copied");
    if (copyText) copyText.textContent = "Copied";
    setTimeout(() => {
      button.classList.remove("copied");
      if (copyText) copyText.textContent = "Copy";
    }, 2000);
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textToCopy).then(feedback).catch(() => {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = textToCopy;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      feedback();
    });
  } else {
    // fallback
    const ta = document.createElement("textarea");
    ta.value = textToCopy;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    feedback();
  }
}

/* -----------------------------
   Scroll to top
----------------------------- */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.addEventListener("scroll", () => {
  const scrollButton = document.querySelector(".scroll-to-top");
  if (!scrollButton) return;
  scrollButton.classList.toggle("visible", window.pageYOffset > 300);
});

/* -----------------------------
   Carousel init (ONLY ONCE)
----------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  // Image carousel (if you have it)
  if (document.querySelector("#results-carousel")) {
    bulmaCarousel.attach("#results-carousel", {
      slidesToScroll: 1,
      slidesToShow: 1,
      loop: true,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 5000,
      navigation: true,
      pagination: true,
    });
  }

  // Video carousel (3 videos per slide)
  if (document.querySelector("#video-carousel")) {
    const videoCarousels = bulmaCarousel.attach("#video-carousel", {
      slidesToScroll: 1,
      slidesToShow: 1,
      loop: false,
      infinite: false,
      autoplay: false,
      navigation: true,
      pagination: true,
    });

    // Pause and reload videos on slide change
    videoCarousels.forEach((c) => {
      c.on("before:show", () => {
        const root = document.querySelector("#video-carousel");
        if (root) pauseAllVideosIn(root);
      });

      c.on("after:show", () => {
        const active =
          document.querySelector("#video-carousel .is-active") ||
          document.querySelector("#video-carousel");
        if (active) loadVideosIn(active);
      });
    });
  }

  // Sliders (if used)
  if (window.bulmaSlider) {
    bulmaSlider.attach();
  }
});
