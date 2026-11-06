
document.addEventListener("DOMContentLoaded", () => {

  const stage = document.getElementById("wheelStage");
  const track = document.getElementById("wheelTrack");
  const tooltip = document.getElementById("wheelTooltip");
  const counter = document.getElementById("projectCounter");
  const progress = document.getElementById("progressFill");

  const modal = document.getElementById("projectModal");
  const modalContent = document.getElementById("modalContent");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const closeButton = document.getElementById("closeModal");

  const total = projects.length;
  let activeIndex = 0;
  let pointerStartX = null;
  let pointerStartY = null;
  let pointerMoved = false;
  let lastFocused = null;
  let wheelLocked = false;

  const pad = (n) => String(n).padStart(2, "0");

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[c]);
  }

  function safeImage(path) {
    return /^assets\/images\/[\w-]+\.(jpg|jpeg|png|webp)$/i.test(path || "")
      ? path : "";
  }

  function shortestDistance(index, current) {
    let distance = index - current;
    if (distance > total / 2) distance -= total;
    if (distance < -total / 2) distance += total;
    return distance;
  }

  // =====================================
  // CREATE CARDS
  // =====================================

  track.innerHTML = projects.map((project, i) => {
    const image = safeImage(project.image);

    return `
      <article class="wheel-card"
               data-index="${i}"
               role="button"
               tabindex="0"
               aria-label="View ${escapeHTML(project.title)}">

        <span class="wheel-card-category">
          ${escapeHTML(project.category)}
        </span>

        <div class="wheel-card-image">
          ${image
            ? `<img src="${image}"
                    alt="${escapeHTML(project.title)}"
                    draggable="false"
                    onerror="this.style.display='none';this.nextElementSibling.hidden=false">
               <div class="wheel-placeholder" hidden>PROJECT IMAGE</div>`
            : `<div class="wheel-placeholder">PROJECT IMAGE</div>`
          }
        </div>

        <div class="wheel-card-content">
          <span class="wheel-card-index">${pad(i + 1)} / ${pad(total)}</span>
          <h3>${escapeHTML(project.title)}</h3>
          <p>${escapeHTML(project.year)} · EXPLORE PROJECT ↗</p>
        </div>
      </article>
    `;
  }).join("");

  const cards = [...track.querySelectorAll(".wheel-card")];

  // =====================================
  // POSITION CARDS IN 3D
  // =====================================

  function updateWheel() {
    const mobile = window.innerWidth <= 760;
    const radius = mobile
      ? (window.innerWidth <= 480 ? 185 : 235)
      : 340;

    cards.forEach((card, index) => {
      const d = shortestDistance(index, activeIndex);
      const angle = d * (360 / Math.max(total, 5)) * Math.PI / 180;

      const x = Math.sin(angle) * radius;
      const z = (Math.cos(angle) - 1) * radius;
      const rotateY = -d * 24;
      const scale = Math.max(.72, 1 - Math.abs(d) * .09);

      card.style.transform = `
        translate3d(${x}px, 0px, ${z}px)
        rotateY(${rotateY}deg)
        scale(${scale})
      `;

      card.style.opacity = Math.max(.28, 1 - Math.abs(d) * .27);
      card.style.filter = `brightness(${Math.max(.45, 1 - Math.abs(d) * .18)})`;
      card.style.zIndex = String(100 - Math.abs(d));
      card.classList.toggle("is-active", d === 0);
      card.setAttribute("aria-current", d === 0 ? "true" : "false");
    });

    counter.textContent = `${pad(activeIndex + 1)} / ${pad(total)}`;
    progress.style.width = `${((activeIndex + 1) / total) * 100}%`;
  }

  function rotate(direction) {
    activeIndex = (activeIndex + direction + total) % total;
    hideTooltip();
    updateWheel();
  }

  document.getElementById("prevProject").addEventListener("click", () => rotate(-1));
  document.getElementById("nextProject").addEventListener("click", () => rotate(1));

  // Mouse wheel / trackpad scroll.
  // Prevent page scrolling only when user scrolls inside the wheel.
  stage.addEventListener("wheel", (event) => {
    if (Math.abs(event.deltaY) < 3 && Math.abs(event.deltaX) < 3) return;

    event.preventDefault();

    if (wheelLocked) return;
    wheelLocked = true;

    rotate((event.deltaY || event.deltaX) > 0 ? 1 : -1);

    // Release after animation to avoid skipping many cards.
    window.setTimeout(() => {
      wheelLocked = false;
    }, 600);
  }, { passive: false });

  // Pointer drag
  stage.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    pointerStartX = event.clientX;
    pointerStartY = event.clientY;
    pointerMoved = false;
  });

  stage.addEventListener("pointermove", (event) => {
    if (pointerStartX === null) return;

    if (
      Math.abs(event.clientX - pointerStartX) > 12 ||
      Math.abs(event.clientY - pointerStartY) > 12
    ) {
      pointerMoved = true;
    }
  });

  stage.addEventListener("pointerup", (event) => {
    if (pointerStartX === null) return;

    const dx = event.clientX - pointerStartX;
    const dy = event.clientY - pointerStartY;

    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      rotate(dx < 0 ? 1 : -1);
    }

    pointerStartX = null;
    pointerStartY = null;

    // Clear drag flag after click event has had a chance to run.
    window.setTimeout(() => { pointerMoved = false; }, 0);
  });

  stage.addEventListener("pointercancel", () => {
    pointerStartX = null;
    pointerStartY = null;
    pointerMoved = false;
  });

  stage.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      rotate(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      rotate(-1);
    }
  });

  // =====================================
  // HOVER TOOLTIP
  // =====================================

  function hideTooltip() {
    tooltip.classList.remove("visible");
  }

  cards.forEach((card) => {
    card.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "touch") return;
      tooltip.classList.add("visible");
    });

    card.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;

      const rect = stage.getBoundingClientRect();
      tooltip.style.left = `${event.clientX - rect.left}px`;
      tooltip.style.top = `${event.clientY - rect.top}px`;
    });

    card.addEventListener("pointerleave", hideTooltip);

    card.addEventListener("click", () => {
      if (pointerMoved) return;

      const index = Number(card.dataset.index);

      if (index !== activeIndex) {
        activeIndex = index;
        updateWheel();
      } else {
        openProject(index);
      }
    });

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();

      const index = Number(card.dataset.index);

      if (index === activeIndex) {
        openProject(index);
      } else {
        activeIndex = index;
        updateWheel();
      }
    });
  });

  // =====================================
  // PROJECT DETAIL POPUP
  // =====================================

  function openProject(index) {
    const project = projects[index];
    if (!project) return;

    lastFocused = document.activeElement;
    hideTooltip();

    const image = safeImage(project.image);

    modalContent.innerHTML = `
      <span class="modal-category">
        ${escapeHTML(project.category)} / ${escapeHTML(project.year)}
      </span>

      <h2 id="modalTitle">${escapeHTML(project.title)}</h2>

      ${image
        ? `<img class="modal-image"
                src="${image}"
                alt="${escapeHTML(project.title)}"
                onerror="this.style.display='none'">`
        : ""
      }

      <p>${escapeHTML(project.description)}</p>

      <div class="modal-tags">
        ${project.tags.map(tag =>
          `<span>${escapeHTML(tag)}</span>`
        ).join("")}
      </div>
    `;

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    closeButton.focus();
  }

  function closeProject() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (lastFocused) lastFocused.focus();
  }

  closeButton.addEventListener("click", closeProject);
  modalBackdrop.addEventListener("click", closeProject);

  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("active")) return;

    if (event.key === "Escape") closeProject();

    if (event.key === "Tab") {
      const focusable = [...modal.querySelectorAll(
        'button, a[href], input, [tabindex]:not([tabindex="-1"])'
      )].filter(el => !el.disabled);

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // =====================================
  // MOBILE NAVIGATION
  // =====================================

  const menuToggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");

  menuToggle.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.textContent = open ? "✕" : "☰";
  });

  mobileNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    });
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  window.addEventListener("resize", updateWheel);

  updateWheel();
});
