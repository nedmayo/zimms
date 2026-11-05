document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const excelGrid = document.querySelector(".excel-grid");
  const mobileMenuItems = document.querySelectorAll(".mobile-menu-item");
  const mobilePageLabel = document.getElementById("mobile-current-page-label");
  const PAGE_LABELS = {
    home: "Menu",
    history: "About Us",
    "our-work": "Our Work",
    contact: "Contact+Order",
    storefront: "Storefront",
  };
  let activeTabId = "home";

  applyRandomTheme();
  applyRandomFabric();

  function updateMobilePageLabel(tabId = activeTabId) {
    if (!mobilePageLabel) return;
    if (excelGrid && excelGrid.classList.contains("menu-open")) {
      mobilePageLabel.textContent = "Menu";
      return;
    }
    mobilePageLabel.textContent = PAGE_LABELS[tabId] || "Menu";
  }

  function closeMobileMenu() {
    if (excelGrid) excelGrid.classList.remove("menu-open");
    if (hamburgerBtn) hamburgerBtn.classList.remove("active");
  }

  function activateTab(tabId) {
    activeTabId = tabId;
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabContents.forEach((content) => content.classList.remove("active"));

    const matchingBtn = document.querySelector(
      `.tab-cell[data-tab="${tabId}"] .tab-button`,
    );
    if (matchingBtn) matchingBtn.classList.add("active");

    const targetContent = document.getElementById(tabId);
    if (targetContent) targetContent.classList.add("active");

    applyRandomTheme();
    closeMobileMenu();
    updateMobilePageLabel(tabId);
    scheduleGridRedraw();
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.closest(".tab-cell").dataset.tab;
      activateTab(tabId);
    });
  });

  if (hamburgerBtn && excelGrid) {
    hamburgerBtn.addEventListener("click", function () {
      excelGrid.classList.toggle("menu-open");
      this.classList.toggle("active");
      updateMobilePageLabel(activeTabId);
    });
  }

  const activeButton = document.querySelector(".tab-cell .tab-button.active");
  const activeCell = activeButton ? activeButton.closest(".tab-cell") : null;
  if (activeCell && activeCell.dataset.tab) {
    activeTabId = activeCell.dataset.tab;
  }
  updateMobilePageLabel(activeTabId);

  mobileMenuItems.forEach((item) => {
    item.addEventListener("click", function () {
      activateTab(item.dataset.tab);
    });
  });

  function drawGridLines() {
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const grid = document.querySelector(".excel-grid");
    const svg = document.querySelector(".grid-overlay");
    if (!grid || !svg) return;
    const cells = grid.querySelectorAll(".cell");
    if (cells.length === 0) return;

    svg.innerHTML =
      "<defs><style>.grid-line { stroke: var(--text); stroke-width: 3; vector-effect: non-scaling-stroke; }</style></defs>";

    const gridRect = grid.getBoundingClientRect();
    const gridTop = gridRect.top;
    const gridLeft = gridRect.left;

    const cellPositions = Array.from(cells).map((cell) => {
      const rect = cell.getBoundingClientRect();
      return {
        top: rect.top - gridTop,
        left: rect.left - gridLeft,
        right: rect.right - gridLeft,
        bottom: rect.bottom - gridTop,
        width: rect.width,
        height: rect.height,
        element: cell,
      };
    });

    const mergedCells = cellPositions.filter((pos) => {
      return (
        pos.element.classList.contains("cell-merged-2") ||
        pos.element.classList.contains("cell-merged-3")
      );
    });

    function getMergedCellAtX(x, mergedCells) {
      for (const merged of mergedCells) {
        const tolerance = 1;
        if (x > merged.left + tolerance && x < merged.right - tolerance) {
          return merged;
        }
      }
      return null;
    }

    const edgeTolerance = 2;

    const verticalPositions = new Set();
    cellPositions.forEach((pos) => {
      const isAtRightEdge = Math.abs(pos.right - gridRect.width) < 1;
      if (
        !pos.element.classList.contains("cell-no-right-border") &&
        !isAtRightEdge
      ) {
        verticalPositions.add(Math.round(pos.right));
      }
    });

    verticalPositions.forEach((x) => {
      if (x <= edgeTolerance || x >= gridRect.width - edgeTolerance) return;

      const mergedCell = getMergedCellAtX(x, mergedCells);

      if (mergedCell) {
        if (mergedCell.top > edgeTolerance) {
          const topLine = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line",
          );
          topLine.setAttribute("class", "grid-line");
          topLine.setAttribute("x1", x);
          topLine.setAttribute("y1", 0);
          topLine.setAttribute("x2", x);
          topLine.setAttribute("y2", Math.round(mergedCell.top));
          svg.appendChild(topLine);
        }
        if (mergedCell.bottom < gridRect.height - edgeTolerance) {
          const bottomLine = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line",
          );
          bottomLine.setAttribute("class", "grid-line");
          bottomLine.setAttribute("x1", x);
          bottomLine.setAttribute("y1", Math.round(mergedCell.bottom));
          bottomLine.setAttribute("x2", x);
          bottomLine.setAttribute("y2", gridRect.height);
          svg.appendChild(bottomLine);
        }
      } else {
        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line",
        );
        line.setAttribute("class", "grid-line");
        line.setAttribute("x1", x);
        line.setAttribute("y1", 0);
        line.setAttribute("x2", x);
        line.setAttribute("y2", gridRect.height);
        svg.appendChild(line);
      }
    });

    const horizontalPositions = new Set();
    cellPositions.forEach((pos) => {
      if (pos.bottom < gridRect.height - 1) {
        horizontalPositions.add(Math.round(pos.bottom));
      }
    });

    horizontalPositions.forEach((y) => {
      if (y <= edgeTolerance || y >= gridRect.height - edgeTolerance) return;

      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line",
      );
      line.setAttribute("class", "grid-line");
      line.setAttribute("x1", 0);
      line.setAttribute("y1", y);
      line.setAttribute("x2", gridRect.width);
      line.setAttribute("y2", y);
      svg.appendChild(line);
    });
  }

  drawGridLines();
  window.addEventListener("resize", drawGridLines);
  setTimeout(drawGridLines, 100);

  function scheduleGridRedraw() {
    requestAnimationFrame(() => {
      drawGridLines();
      requestAnimationFrame(drawGridLines);
    });
  }

  const contentCell = document.querySelector(".cell-content");
  if (contentCell && typeof ResizeObserver !== "undefined") {
    new ResizeObserver(() => {
      if (!window.matchMedia("(max-width: 768px)").matches) {
        scheduleGridRedraw();
      }
    }).observe(contentCell);
  }

  const contactForm = document.getElementById("contact-form");
  const contactFormStatus = document.getElementById("contact-form-status");

  if (contactForm && contactFormStatus) {
    contactForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      if (!contactForm.reportValidity()) {
        return;
      }

      const submitButton = contactForm.querySelector(".contact-form-submit");
      submitButton.disabled = true;
      contactFormStatus.hidden = true;
      contactFormStatus.classList.remove("is-success", "is-error");

      const formData = new FormData(contactForm);
      const rawName = formData.get("name");
      const requesterName = typeof rawName === "string" ? rawName.trim() : "";
      const rawEmail = formData.get("email");
      const requesterEmail =
        typeof rawEmail === "string" ? rawEmail.trim() : "";
      formData.append("_subject", `Request: ${requesterName || "Unknown"}`);
      if (requesterEmail) {
        formData.append("_replyto", requesterEmail);
      }
      formData.append("_template", "table");

      try {
        const response = await fetch(
          "https://formsubmit.co/ajax/zimmdrygoods@gmail.com",
          {
            method: "POST",
            body: formData,
            headers: { Accept: "application/json" },
          },
        );

        if (!response.ok) {
          throw new Error("Request failed");
        }

        contactForm.reset();
        contactFormStatus.textContent =
          "Thanks — your message was sent. We'll be in touch soon.";
        contactFormStatus.classList.add("is-success");
        contactFormStatus.hidden = false;
      } catch {
        contactFormStatus.textContent =
          "Something went wrong. Please email us directly at zimmdrygoods@gmail.com.";
        contactFormStatus.classList.add("is-error");
        contactFormStatus.hidden = false;
      } finally {
        submitButton.disabled = false;
      }
    });
  }
});
