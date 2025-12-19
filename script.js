// Add subtle interactions
document.addEventListener("DOMContentLoaded", function () {
  // Add hover effect to navigation links
  const navLinks = document.querySelectorAll(".nav-link, .footer-link");
  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)";
    });
    link.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });

  // Tab functionality
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  // Set initial background color to green (matching Zimmerman's default)
  document.body.style.backgroundColor = "#1a4d2e";

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.closest(".tab-cell").dataset.tab;
      const bgColor = this.dataset.bgColor;

      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Only show content if "About Us" (history) is clicked
      if (tabId === "history") {
        this.classList.add("active");
        const targetContent = document.getElementById(tabId);
        if (targetContent) {
          targetContent.classList.add("active");
        }
      } else {
        // For other buttons, just activate the button but don't show content
        this.classList.add("active");
      }

      // Change background color
      if (bgColor) {
        document.body.style.backgroundColor = bgColor;
      }
    });
  });

  // Draw grid lines with SVG
  function drawGridLines() {
    const grid = document.querySelector(".excel-grid");
    const svg = document.querySelector(".grid-overlay");
    const cells = grid.querySelectorAll(".cell");

    if (!grid || !svg || cells.length === 0) return;

    // Clear existing lines
    svg.innerHTML =
      "<defs><style>.grid-line { stroke: white; stroke-width: 3; vector-effect: non-scaling-stroke; }</style></defs>";

    const gridRect = grid.getBoundingClientRect();
    const gridTop = gridRect.top;
    const gridLeft = gridRect.left;

    // Get all cell positions relative to grid
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

    // Find merged cells to know where to break lines
    const mergedCells = cellPositions.filter((pos) => {
      return (
        pos.element.classList.contains("cell-merged-2") ||
        pos.element.classList.contains("cell-merged-3")
      );
    });

    // Helper function to check if a vertical line would bisect a merged cell and get its bounds
    function getMergedCellAtX(x, mergedCells) {
      for (const merged of mergedCells) {
        const tolerance = 1;
        if (x > merged.left + tolerance && x < merged.right - tolerance) {
          return merged;
        }
      }
      return null;
    }

    // Draw vertical lines (between columns)
    const verticalPositions = new Set();
    cellPositions.forEach((pos) => {
      // Draw line at right edge of each cell (except cells that shouldn't have right border or are at the right edge of grid)
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
        // Draw two segments: above and below the merged cell
        // Top segment
        if (mergedCell.top > 0) {
          const topLine = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
          );
          topLine.setAttribute("class", "grid-line");
          topLine.setAttribute("x1", x);
          topLine.setAttribute("y1", 0);
          topLine.setAttribute("x2", x);
          topLine.setAttribute("y2", Math.round(mergedCell.top));
          svg.appendChild(topLine);
        }
        // Bottom segment
        if (mergedCell.bottom < gridRect.height) {
          const bottomLine = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
          );
          bottomLine.setAttribute("class", "grid-line");
          bottomLine.setAttribute("x1", x);
          bottomLine.setAttribute("y1", Math.round(mergedCell.bottom));
          bottomLine.setAttribute("x2", x);
          bottomLine.setAttribute("y2", gridRect.height);
          svg.appendChild(bottomLine);
        }
      } else {
        // Draw full height line
        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        );
        line.setAttribute("class", "grid-line");
        line.setAttribute("x1", x);
        line.setAttribute("y1", 0);
        line.setAttribute("x2", x);
        line.setAttribute("y2", gridRect.height);
        svg.appendChild(line);
      }
    });

    // Draw horizontal lines (between rows)
    const horizontalPositions = new Set();
    cellPositions.forEach((pos) => {
      // Draw line at bottom edge of each cell (except last row)
      if (pos.bottom < gridRect.height - 1) {
        horizontalPositions.add(Math.round(pos.bottom));
      }
    });

    horizontalPositions.forEach((y) => {
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line.setAttribute("class", "grid-line");
      line.setAttribute("x1", 0);
      line.setAttribute("y1", y);
      line.setAttribute("x2", gridRect.width);
      line.setAttribute("y2", y);
      svg.appendChild(line);
    });
  }

  // Draw grid lines on load and resize
  drawGridLines();
  window.addEventListener("resize", drawGridLines);

  // Redraw after a short delay to ensure layout is complete
  setTimeout(drawGridLines, 100);
});
