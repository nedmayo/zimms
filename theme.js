/** Apparel-blank style swatches — random page color shared by every page */
(function () {
  const APPAREL_PALETTE = [
    { name: "White", hex: "#FFFFFF" },
    { name: "Black", hex: "#141414" },
    { name: "Banana Cream", hex: "#F5E6B8" },
    { name: "Berry", hex: "#8E4585" },
    { name: "Brown", hex: "#5D4037" },
    { name: "Burgundy", hex: "#722F37" },
    { name: "Cardinal", hex: "#C41E3A" },
    { name: "Celadon", hex: "#A8C3A0" },
    { name: "Charcoal", hex: "#3D3D3D" },
    { name: "Chocolate", hex: "#4E342E" },
    { name: "Cream", hex: "#F5F0DC" },
    { name: "Dark Chocolate", hex: "#3E2723" },
    { name: "Dark Grey Heather", hex: "#4A4A4A" },
    { name: "Dark Olive", hex: "#556B2F" },
    { name: "Dust", hex: "#E8DCD0" },
    { name: "Forest", hex: "#2D4A32" },
    { name: "Graphite Heather", hex: "#63666A" },
    { name: "Heather Charcoal", hex: "#5C5C5C" },
    { name: "Heather Dust", hex: "#D8C4B5" },
    { name: "Heather Ice Blue", hex: "#B5C9D6" },
    { name: "Heather Mint", hex: "#A8C5BB" },
    { name: "Heather Peach", hex: "#E8C4B8" },
    { name: "Indigo", hex: "#3D2B56" },
    { name: "Ivory / Natural", hex: "#F2E8DA" },
    { name: "Key Lime", hex: "#C4E538" },
    { name: "Lavender", hex: "#D8BFD8" },
    { name: "Light Blue", hex: "#A8C8EC" },
    { name: "Light Pink", hex: "#FFB6C1" },
    { name: "Maroon", hex: "#800000" },
    { name: "Midnight", hex: "#1C1F2A" },
    { name: "Military Green", hex: "#4A5D23" },
    { name: "Mint", hex: "#9FD9C9" },
    { name: "Olive", hex: "#6B7C3F" },
    { name: "Peach", hex: "#FFCCBC" },
    { name: "Pink", hex: "#F4B6C2" },
    { name: "Powder Blue", hex: "#B8D9EB" },
    { name: "Purple", hex: "#6B3FA0" },
    { name: "Red", hex: "#CE2029" },
    { name: "Royal Blue", hex: "#27408B" },
    { name: "Rust", hex: "#B7410E" },
    { name: "Sand", hex: "#D4C4A8" },
    { name: "Seafoam", hex: "#7EC8B8" },
    { name: "Sky", hex: "#7EC8E3" },
    { name: "Steel Blue", hex: "#4A6FA5" },
    { name: "Tan", hex: "#D2B48C" },
    { name: "Teal", hex: "#0D7377" },
    { name: "True Navy", hex: "#1B2838" },
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

  /** Logo <img>s with class `hours-logo-mark` should set `data-logo-base` when not at the site root */
  function applyRandomTheme() {
    const pick =
      APPAREL_PALETTE[Math.floor(Math.random() * APPAREL_PALETTE.length)];
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

    const logoFile = lightBg
      ? "Zimmerman%20Logo%20B.svg"
      : "Zimmerman%20Logo%20W.svg";
    document.querySelectorAll(".hours-logo-mark").forEach((img) => {
      img.src = (img.dataset.logoBase || "") + logoFile;
    });
  }

  function applyRandomFabric() {
    if (Math.random() < 0.5) {
      document.body.classList.add("fabric-heather");
    }
  }

  window.applyRandomTheme = applyRandomTheme;
  window.applyRandomFabric = applyRandomFabric;
})();
