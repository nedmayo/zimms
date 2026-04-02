document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuItems = document.querySelectorAll(".mobile-menu-item");

  /** Apparel-blank style swatches — random on load and whenever you open a tab */
  const APPAREL_PALETTE = [
    { name: "White", hex: "#FFFFFF" },
    { name: "Black", hex: "#141414" },
    { name: "Ash Grey", hex: "#8B8B8B" },
    { name: "Athletic Heather", hex: "#A7A9AC" },
    { name: "Banana Cream", hex: "#F5E6B8" },
    { name: "Berry", hex: "#8E4585" },
    { name: "Bright Coral", hex: "#FF6B6B" },
    { name: "Brown", hex: "#5D4037" },
    { name: "Burgundy", hex: "#722F37" },
    { name: "Cardinal", hex: "#C41E3A" },
    { name: "Celadon", hex: "#A8C3A0" },
    { name: "Charcoal", hex: "#3D3D3D" },
    { name: "Chocolate", hex: "#4E342E" },
    { name: "Copper", hex: "#B87333" },
    { name: "Cream", hex: "#F5F0DC" },
    { name: "Dark Chocolate", hex: "#3E2723" },
    { name: "Dark Grey Heather", hex: "#4A4A4A" },
    { name: "Dark Olive", hex: "#556B2F" },
    { name: "Dust", hex: "#E8DCD0" },
    { name: "Dusty Blue", hex: "#6B8EAD" },
    { name: "Dusty Rose", hex: "#C4A4A4" },
    { name: "Forest", hex: "#2D4A32" },
    { name: "Gold", hex: "#D4AF37" },
    { name: "Graphite Heather", hex: "#63666A" },
    { name: "Heather Aqua", hex: "#8FB8BC" },
    { name: "Heather Charcoal", hex: "#5C5C5C" },
    { name: "Heather Dust", hex: "#D8C4B5" },
    { name: "Heather Grey", hex: "#A9A9A9" },
    { name: "Heather Ice Blue", hex: "#B5C9D6" },
    { name: "Heather Mint", hex: "#A8C5BB" },
    { name: "Heather Peach", hex: "#E8C4B8" },
    { name: "Heather Slate", hex: "#7C8B95" },
    { name: "Indigo", hex: "#3D2B56" },
    { name: "Ivory / Natural", hex: "#F2E8DA" },
    { name: "Kelly Green", hex: "#2E8B3E" },
    { name: "Key Lime", hex: "#C4E538" },
    { name: "Khaki", hex: "#C3B091" },
    { name: "Lavender", hex: "#D8BFD8" },
    { name: "Light Blue", hex: "#A8C8EC" },
    { name: "Light Pink", hex: "#FFB6C1" },
    { name: "Lilac", hex: "#C8A2C8" },
    { name: "Maroon", hex: "#800000" },
    { name: "Mauve", hex: "#B784A7" },
    { name: "Midnight", hex: "#1C1F2A" },
    { name: "Military Green", hex: "#4A5D23" },
    { name: "Mint", hex: "#9FD9C9" },
    { name: "Moss", hex: "#8A9A5B" },
    { name: "Mustard", hex: "#D4A017" },
    { name: "Olive", hex: "#6B7C3F" },
    { name: "Orange", hex: "#E85D04" },
    { name: "Peach", hex: "#FFCCBC" },
    { name: "Pink", hex: "#F4B6C2" },
    { name: "Powder Blue", hex: "#B8D9EB" },
    { name: "Purple", hex: "#6B3FA0" },
    { name: "Red", hex: "#CE2029" },
    { name: "Royal Blue", hex: "#27408B" },
    { name: "Rust", hex: "#B7410E" },
    { name: "Safety Green", hex: "#00A651" },
    { name: "Sage", hex: "#9CAB86" },
    { name: "Sand", hex: "#D4C4A8" },
    { name: "Seafoam", hex: "#7EC8B8" },
    { name: "Sky", hex: "#7EC8E3" },
    { name: "Slate", hex: "#708090" },
    { name: "Steel Blue", hex: "#4A6FA5" },
    { name: "Sunset Orange", hex: "#E55B13" },
    { name: "Tan", hex: "#D2B48C" },
    { name: "Teal", hex: "#0D7377" },
    { name: "True Navy", hex: "#1B2838" },
    { name: "Turquoise", hex: "#2EC4B6" },
    { name: "Texas Orange", hex: "#BF5700" },
    { name: "Violet", hex: "#7B5BA6" },
    { name: "Wheat", hex: "#E8D5B7" },
    { name: "Wine", hex: "#5C1A1B" },
    { name: "Yellow", hex: "#F4D03F" },
  ];

  function hexToRgb(hex) {
    const n = hex.replace("#", "");
    return {
      r: parseInt(n.slice(0, 2), 16) / 255,
      g: parseInt(n.slice(2, 4), 16) / 255,
      b: parseInt(n.slice(4, 6), 16) / 255,
    };
  }

  function relativeLuminance(hex) {
    const { r, g, b } = hexToRgb(hex);
    const lin = (c) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    const R = lin(r);
    const G = lin(g);
    const B = lin(b);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  }

  function applyRandomTheme() {
    const pick = APPAREL_PALETTE[Math.floor(Math.random() * APPAREL_PALETTE.length)];
    const bg = pick.hex;
    const lum = relativeLuminance(bg);
    const lightBg = lum > 0.45;
    const text = lightBg ? "#141414" : "#FFFFFF";
    const root = document.documentElement;
    root.style.setProperty("--page-bg", bg);
    root.style.setProperty("--text", text);
    root.style.setProperty(
      "--tab-hover-bg",
      lightBg ? "rgba(0, 0, 0, 0.09)" : "rgba(255, 255, 255, 0.14)",
    );
    root.style.setProperty(
      "--tab-active-bg",
      lightBg ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.42)",
    );
    root.style.setProperty(
      "--border-subtle",
      lightBg ? "rgba(0, 0, 0, 0.18)" : "rgba(255, 255, 255, 0.22)",
    );
    root.style.setProperty(
      "--mobile-menu-hover-bg",
      lightBg ? "rgba(0, 0, 0, 0.06)" : "rgba(0, 0, 0, 0.22)",
    );

    const logoForLightBg = "Zimmerman%20Logo%20B.svg";
    const logoForDarkBg = "Zimmerman%20Logo%20W.svg";
    const logoSrc = lightBg ? logoForLightBg : logoForDarkBg;
    document.querySelectorAll(".hours-logo-mark").forEach((img) => {
      img.src = logoSrc;
    });
  }

  /**
   * Random heather / mélange fabric grain (noise + subtle weave), ~40% of visits.
   */
  function maybeApplyHeatherTexture() {
    if (Math.random() >= 0.4) return;
    document.body.classList.add("heather-bg");
  }

  applyRandomTheme();
  maybeApplyHeatherTexture();

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

      applyRandomTheme();
    });
  });

  const contentCell = document.querySelector(".cell-content");

  // Hamburger menu toggle: replace tab content with menu in the same cell
  if (hamburgerBtn && mobileMenu && contentCell) {
    hamburgerBtn.addEventListener("click", function () {
      this.classList.toggle("active");
      mobileMenu.classList.toggle("active");
      contentCell.classList.toggle("mobile-menu-open");
    });
  }

  // Mobile menu items: pick a tab, then close menu and show that tab in the cell
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

      applyRandomTheme();

      // Close menu and show tab content in the cell again
      hamburgerBtn.classList.remove("active");
      mobileMenu.classList.remove("active");
      if (contentCell) contentCell.classList.remove("mobile-menu-open");
    });
  });

  function drawGridLines() {
    const grid = document.querySelector(".excel-grid");
    const svg = document.querySelector(".grid-overlay");
    if (!grid || !svg) return;
    const cells = grid.querySelectorAll(".cell");
    if (cells.length === 0) return;

    svg.innerHTML =
      '<defs><style>.grid-line { stroke: var(--text); stroke-width: 3; vector-effect: non-scaling-stroke; }</style></defs>';

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
});
