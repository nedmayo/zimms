document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuItems = document.querySelectorAll(".mobile-menu-item");

  // Background colors for each tab
  const tabColors = {
    home: "#000000",
    history: "#841717",
    "our-work": "rgb(181, 128, 12)",
    faq: "#008141",
    contact: "#5475e7",
  };

  function setBackgroundColor(tabId) {
    document.body.style.backgroundColor = tabColors[tabId] || "#000000";
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.closest(".tab-cell").dataset.tab;

      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      this.classList.add("active");

      const targetContent = document.getElementById(tabId);
      if (targetContent) {
        targetContent.classList.add("active");
      }

      setBackgroundColor(tabId);
    });
  });

  // Hamburger menu toggle
  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener("click", function () {
      this.classList.toggle("active");
      mobileMenu.classList.toggle("active");
    });
  }

  // Mobile menu items
  mobileMenuItems.forEach((item) => {
    item.addEventListener("click", function () {
      const tabId = this.dataset.tab;

      // Remove active from all mobile items
      mobileMenuItems.forEach((i) => i.classList.remove("active"));
      this.classList.add("active");

      // Sync with desktop tabs
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Find matching desktop button and activate
      const matchingDesktopBtn = document.querySelector(
        `.tab-cell[data-tab="${tabId}"] .tab-button`,
      );
      if (matchingDesktopBtn) {
        matchingDesktopBtn.classList.add("active");
      }

      // Show content if applicable
      const targetContent = document.getElementById(tabId);
      if (targetContent) {
        targetContent.classList.add("active");
      }

      setBackgroundColor(tabId);

      // Close menu
      hamburgerBtn.classList.remove("active");
      mobileMenu.classList.remove("active");
    });
  });

  function drawGridLines() {
    const grid = document.querySelector(".excel-grid");
    const svg = document.querySelector(".grid-overlay");
    const cells = grid.querySelectorAll(".cell");

    if (!grid || !svg || cells.length === 0) return;

    svg.innerHTML =
      "<defs><style>.grid-line { stroke: white; stroke-width: 3; vector-effect: non-scaling-stroke; }</style></defs>";

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
      const mergedCell = getMergedCellAtX(x, mergedCells);

      if (mergedCell) {
        if (mergedCell.top > 0) {
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
        if (mergedCell.bottom < gridRect.height) {
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

  // Order form: submit via fetch so we get JSON and can show feedback
  const orderForm = document.getElementById("order-form");
  const formFeedback = document.getElementById("form-feedback");
  if (orderForm && formFeedback) {
    orderForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = orderForm.querySelector(".order-form-submit");
      submitBtn.disabled = true;
      formFeedback.textContent = "";
      formFeedback.className = "form-feedback";

      const formData = new FormData(orderForm);
      try {
        const res = await fetch("/api/submit", {
          method: "POST",
          body: formData,
        });
        const data = await res.json().catch(() => ({}));

        if (res.ok) {
          formFeedback.textContent = "Thanks — we'll be in touch soon.";
          formFeedback.className = "form-feedback success";
          orderForm.reset();
        } else {
          formFeedback.textContent =
            data.message ||
            "Something went wrong. Please try again or email us.";
          formFeedback.className = "form-feedback error";
        }
      } catch (_) {
        formFeedback.textContent =
          "Network error. Please check your connection or email us directly.";
        formFeedback.className = "form-feedback error";
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
});
