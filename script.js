/* =====================================================
   PREMIUM 3D INTERACTIVE PORTFOLIO — COMPLETE JS
   Perumalla Hari Babu
   ===================================================== */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFine      = window.matchMedia("(pointer: fine)").matches;
  const isMobile    = window.innerWidth < 768;

  /* ================================================
     1. PAGE LOADER
  ================================================ */
  const loader       = document.getElementById("pageLoader");
  const loaderFill   = document.getElementById("loaderBarFill");
  let   loadProgress = 0;

  function runLoader() {
    if (!loader) return;
    const interval = setInterval(() => {
      loadProgress += Math.random() * 22 + 8;
      if (loadProgress >= 100) {
        loadProgress = 100;
        clearInterval(interval);
        if (loaderFill) loaderFill.style.width = "100%";
        setTimeout(() => {
          loader.classList.add("hidden");
          document.body.style.overflow = "";
          initReveal();
        }, 400);
      } else {
        if (loaderFill) loaderFill.style.width = loadProgress + "%";
      }
    }, 60);
  }
  document.body.style.overflow = "hidden";
  runLoader();

  /* ================================================
     2. CUSTOM CURSOR
  ================================================ */
  const dot  = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  const glow = document.getElementById("cursorGlow");

  let mx = -200, my = -200;  // mouse
  let rx = -200, ry = -200;  // ring (lagged)

  if (dot && ring && isFine && !reduceMotion) {
    document.addEventListener("mousemove", e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left  = mx + "px";
      dot.style.top   = my + "px";
      if (glow) { glow.style.left = mx + "px"; glow.style.top = my + "px"; }
    });

    // Ring lags behind
    (function animateRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + "px";
      ring.style.top  = ry + "px";
      requestAnimationFrame(animateRing);
    })();

    // Hover states
    const hoverEls = document.querySelectorAll(
      "a, button, .cert-card, .project-card, .skill-chip, .contact-card, .edu-card"
    );
    hoverEls.forEach(el => {
      el.addEventListener("mouseenter", () => {
        dot.classList.add("hover"); ring.classList.add("hover");
      });
      el.addEventListener("mouseleave", () => {
        dot.classList.remove("hover"); ring.classList.remove("hover");
      });
    });

    document.addEventListener("mousedown", () => dot.classList.add("click"));
    document.addEventListener("mouseup",   () => dot.classList.remove("click"));
  }

  /* ================================================
     3. SCROLL PROGRESS BAR
  ================================================ */
  const progressBar = document.getElementById("scrollProgress");
  function updateProgress() {
    if (!progressBar) return;
    const docH   = document.documentElement.scrollHeight - window.innerHeight;
    const prog   = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    progressBar.style.width = prog + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });

  /* ================================================
     4. HEADER SCROLL BEHAVIOUR
  ================================================ */
  const header = document.getElementById("siteHeader");
  function onHeaderScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 50);
  }
  window.addEventListener("scroll", onHeaderScroll, { passive: true });
  onHeaderScroll();

  /* ================================================
     5. MOBILE NAV TOGGLE
  ================================================ */
  const navToggle = document.getElementById("navToggle");
  const mainNav   = document.getElementById("mainNav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const open = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    mainNav.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", e => {
        if (a.hash) {
          e.preventDefault();
          const target = document.querySelector(a.hash);
          if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: "smooth" });
        }
        mainNav.classList.remove("open");
        document.body.style.overflow = "";
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
    // Close on outside click
    document.addEventListener("click", e => {
      if (mainNav.classList.contains("open") &&
          !mainNav.contains(e.target) && !navToggle.contains(e.target)) {
        mainNav.classList.remove("open");
        document.body.style.overflow = "";
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ================================================
     6. ACTIVE NAV INDICATOR
  ================================================ */
  const sections  = document.querySelectorAll("section[id], main section[id]");
  const navLinks  = document.querySelectorAll(".nav-link[data-section]");

  function updateActiveNav() {
    let current = "";
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 160) current = sec.id;
    });
    navLinks.forEach(l => {
      l.classList.toggle("active", l.dataset.section === current);
    });
  }
  window.addEventListener("scroll", updateActiveNav, { passive: true });

  /* ================================================
     6.5 THEME TOGGLE CONTROLLER
  ================================================ */
  const themeToggle = document.getElementById("themeToggle");

  function getActiveTheme() {
    return document.documentElement.getAttribute("data-theme") || "dark";
  }

  function updateThemeUI(theme) {
    if (!themeToggle) return;
    const isLight = theme === "light";
    const nextLabel = isLight ? "Switch to Dark Mode" : "Switch to Light Mode";
    themeToggle.setAttribute("aria-label", nextLabel);
    themeToggle.setAttribute("title", nextLabel);
  }

  function setTheme(theme, animate = true) {
    if (animate) {
      document.documentElement.classList.add("theme-transitioning");
    }
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("phb_theme", theme);
    } catch (e) {}

    updateThemeUI(theme);

    if (animate) {
      setTimeout(() => {
        document.documentElement.classList.remove("theme-transitioning");
      }, 400);
    }
  }

  if (themeToggle) {
    // Initial sync with active attribute
    const initialTheme = getActiveTheme();
    updateThemeUI(initialTheme);

    themeToggle.addEventListener("click", () => {
      const current = getActiveTheme();
      const next = current === "light" ? "dark" : "light";
      setTheme(next, true);
    });
  }

  /* ================================================
     7. HERO CANVAS PARTICLES
  ================================================ */
  const canvas = document.getElementById("heroCanvas");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let W, H, particles = [];

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const COUNT = isMobile ? 40 : 80;
    const COLORS_DARK  = ["rgba(108,99,255,", "rgba(184,145,85,", "rgba(255,255,255,"];
    const COLORS_LIGHT = ["rgba(84,72,234,",  "rgba(140,96,29,",  "rgba(18,20,34,"];

    for (let i = 0; i < COUNT; i++) {
      const colorIndex = Math.floor(Math.random() * 3);
      particles.push({
        x: Math.random() * 1200,
        y: Math.random() * 800,
        r: Math.random() * 1.4 + 0.4,
        vx: (Math.random() - .5) * .3,
        vy: (Math.random() - .5) * .3,
        alpha: Math.random() * .5 + .1,
        colorIndex: colorIndex
      });
    }

    let heroMouseX = 0.5, heroMouseY = 0.5;
    canvas.addEventListener("mousemove", e => {
      const r = canvas.getBoundingClientRect();
      heroMouseX = (e.clientX - r.left) / r.width;
      heroMouseY = (e.clientY - r.top)  / r.height;
    }, { passive: true });

    function drawCanvas() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      const currentColors = isLight ? COLORS_LIGHT : COLORS_DARK;
      const lineColor = isLight ? "rgba(84,72,234," : "rgba(108,99,255,";

      particles.forEach(p => {
        // gentle mouse attract
        const dx = heroMouseX * W - p.x;
        const dy = heroMouseY * H - p.y;
        p.vx += dx * 0.00003;
        p.vy += dy * 0.00003;
        p.vx *= .99; p.vy *= .99;

        p.x = (p.x + p.vx + W) % W;
        p.y = (p.y + p.vy + H) % H;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = currentColors[p.colorIndex] + p.alpha + ")";
        ctx.fill();
      });

      // Draw subtle connections
      if (!isMobile) {
        ctx.lineWidth = .4;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 100) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = lineColor + ((1 - dist/100) * .08) + ")";
              ctx.stroke();
            }
          }
        }
      }
      requestAnimationFrame(drawCanvas);
    }
    drawCanvas();
  }

  /* ================================================
     8. HERO SCROLL NARRATIVE
  ================================================ */
  const heroSection  = document.querySelector(".hero");
  const scenes       = Array.from(document.querySelectorAll(".scene"));
  const heroPortrait = document.getElementById("heroPortrait");
  const scrollCue    = document.getElementById("scrollCue");
  const orbs         = document.querySelectorAll(".orb");

  let heroTicking = false;

  function updateHero() {
    heroTicking = false;
    if (!heroSection) return;

    const rect      = heroSection.getBoundingClientRect();
    const scrollable= heroSection.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;

    const progress  = Math.max(0, Math.min(1, -rect.top / scrollable));
    const n         = scenes.length;
    const activeIdx = Math.min(n - 1, Math.floor(progress * n));

    scenes.forEach((scene, i) => {
      scene.classList.toggle("active", i === activeIdx);
    });

    if (heroPortrait) {
      const t = Math.min(1, progress * 2.5) * (1 - Math.max(0, progress - .72) * 4);
      heroPortrait.style.opacity = Math.max(0, Math.min(.55, t)).toFixed(2);
    }

    if (scrollCue) {
      scrollCue.style.opacity = progress > .04 ? "0" : "1";
    }

    // Orbs parallax
    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 18;
      orb.style.transform = `translateY(${progress * factor}px)`;
    });

    // Fade hero at end
    const sticky = heroSection.querySelector(".hero-sticky");
    if (sticky) {
      const fadeStart = .9;
      sticky.style.opacity = progress > fadeStart
        ? (1 - (progress - fadeStart) / (1 - fadeStart)).toFixed(2)
        : "1";
    }
  }

  function scheduleHeroUpdate() {
    if (!heroTicking) { heroTicking = true; requestAnimationFrame(updateHero); }
  }
  window.addEventListener("scroll", scheduleHeroUpdate, { passive: true });
  window.addEventListener("resize", scheduleHeroUpdate, { passive: true });

  /* Mouse parallax on hero */
  if (!reduceMotion && !isMobile) {
    document.addEventListener("mousemove", e => {
      const px = (e.clientX / window.innerWidth  - .5) * 20;
      const py = (e.clientY / window.innerHeight - .5) * 20;
      const portrait = document.getElementById("heroPortrait");
      if (portrait) portrait.style.transform = `translate(${px * .4}px, ${py * .4}px)`;
    }, { passive: true });
  }

  /* ================================================
     9. SCROLL REVEAL — IntersectionObserver
  ================================================ */
  function initReveal() {
    const revealEls = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      revealEls.forEach(el => el.classList.add("in-view"));
      return;
    }

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add("in-view");
        io.unobserve(el);

        // Trigger stat counter
        el.querySelectorAll(".stat-num[data-count]").forEach(n => {
          if (!reduceMotion) animateCount(n);
        });
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    // Stagger children inside containers
    const staggerContainers = document.querySelectorAll(
      ".skill-groups, .project-grid, .cert-gallery, .edu-list, .about-stats, .contact-cards, .timeline"
    );
    staggerContainers.forEach(container => {
      container.querySelectorAll(".reveal").forEach((child, i) => {
        if (!reduceMotion) child.style.transitionDelay = (i * 0.1) + "s";
      });
    });

    revealEls.forEach(el => io.observe(el));
  }

  /* ================================================
     10. ANIMATED COUNTERS
  ================================================ */
  function animateCount(el) {
    const target   = parseFloat(el.dataset.count);
    const isFloat  = el.dataset.decimal || (target % 1 !== 0);
    const decimals = parseInt(el.dataset.decimal || 0);
    const duration = 1800;
    let start = null;

    function step(ts) {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      const val  = ease * target;
      el.textContent = isFloat ? val.toFixed(decimals || 2) : Math.floor(val);
      if (prog < 1) requestAnimationFrame(step);
      else el.textContent = isFloat ? target.toFixed(decimals || 2) : target;
    }
    requestAnimationFrame(step);
  }

  /* ================================================
     11. 3D CARD TILT
  ================================================ */
  function initTilt() {
    if (reduceMotion || !isFine) return;

    const tiltEls = document.querySelectorAll(
      ".project-card, .cert-card, .skill-group-card, .stat-card, .edu-card, .contact-card"
    );

    tiltEls.forEach(el => {
      el.addEventListener("mousemove", e => {
        const rect  = el.getBoundingClientRect();
        const x     = e.clientX - rect.left;
        const y     = e.clientY - rect.top;
        const cx    = rect.width  / 2;
        const cy    = rect.height / 2;
        const rotX  = ((y - cy) / cy) * -6;
        const rotY  = ((x - cx) / cx) *  6;
        el.style.transform =
          `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) scale(1.01)`;
        el.style.transition = "transform .15s ease, box-shadow .15s ease";

        // Dynamic highlight
        const gPercX = (x / rect.width)  * 100;
        const gPercY = (y / rect.height) * 100;
        el.style.background = `radial-gradient(circle at ${gPercX}% ${gPercY}%, rgba(108,99,255,.07), transparent 65%), var(--glass-2)`;
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform  = "";
        el.style.transition = "transform .6s var(--ease), box-shadow .6s var(--ease), border-color .6s var(--ease), background .6s var(--ease)";
        el.style.background = "";
      });
    });
  }

  /* ================================================
     12. MAGNETIC BUTTONS
  ================================================ */
  function initMagnetic() {
    if (reduceMotion || !isFine || isMobile) return;

    document.querySelectorAll(".magnetic").forEach(el => {
      el.addEventListener("mousemove", e => {
        const rect   = el.getBoundingClientRect();
        const dx     = e.clientX - (rect.left + rect.width  / 2);
        const dy     = e.clientY - (rect.top  + rect.height / 2);
        el.style.transform    = `translate(${dx * .22}px, ${dy * .22}px)`;
        el.style.transition   = "transform .2s ease";
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform  = "";
        el.style.transition = "transform .5s var(--ease)";
      });
    });
  }

  /* ================================================
     13. CERTIFICATION LIGHTBOX & PDF VIEWER
  ================================================ */
  // Configure PDF.js worker
  if (typeof pdfjsLib !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }

  const certLightbox        = document.getElementById("certLightbox");
  const certBackdrop        = document.getElementById("certBackdrop");
  const certPanel           = document.getElementById("certPanel");
  const certClose           = document.getElementById("certClose");
  const certLbOrg           = document.getElementById("certLbOrg");
  const certLbName          = document.getElementById("certLbName");
  const certLbDate          = document.getElementById("certLbDate");

  const certZoomGroup       = document.getElementById("certZoomGroup");
  const certZoomIn          = document.getElementById("certZoomIn");
  const certZoomOut         = document.getElementById("certZoomOut");
  const certZoomReset       = document.getElementById("certZoomReset");
  const certZoomLevel       = document.getElementById("certZoomLevel");

  const certPageGroup       = document.getElementById("certPageGroup");
  const certPrevPage        = document.getElementById("certPrevPage");
  const certNextPage        = document.getElementById("certNextPage");
  const certPageInfo        = document.getElementById("certPageInfo");

  const certOpenNewTab      = document.getElementById("certOpenNewTab");
  const certDownload         = document.getElementById("certDownload");
  const certFooterOpenBtn   = document.getElementById("certFooterOpenBtn");
  const certFooterOpenText  = document.getElementById("certFooterOpenText");

  const certLoader          = document.getElementById("certLoader");
  const certErrorState      = document.getElementById("certErrorState");
  const certErrorOpenBtn    = document.getElementById("certErrorOpenBtn");
  const certErrorDownloadBtn= document.getElementById("certErrorDownloadBtn");

  const certPdfViewport     = document.getElementById("certPdfViewport");
  const certPdfCanvas       = document.getElementById("certPdfCanvas");
  const certImgViewport     = document.getElementById("certImgViewport");
  const certLbImg           = document.getElementById("certLbImg");

  // State
  let currentDocSrc   = "";
  let currentDocType  = "image"; // "pdf" | "image"
  let currentZoom     = 1.0;
  let currentPdfDoc   = null;
  let currentPageNum  = 1;
  let totalPdfPages   = 1;
  let pdfRenderTask   = null;
  let resizeDebounce  = null;

  function showCertLoader(show) {
    if (certLoader) {
      if (show) certLoader.classList.remove("hidden");
      else certLoader.classList.add("hidden");
    }
  }

  function showCertError(show, src) {
    if (certErrorState) {
      certErrorState.style.display = show ? "flex" : "none";
      if (show && src) {
        if (certErrorOpenBtn) certErrorOpenBtn.href = src;
        if (certErrorDownloadBtn) {
          certErrorDownloadBtn.href = src;
          certErrorDownloadBtn.setAttribute("download", src.split("/").pop());
        }
      }
    }
  }

  function updateZoomUI() {
    if (certZoomLevel) {
      certZoomLevel.textContent = Math.round(currentZoom * 100) + "%";
    }
    if (certZoomOut) certZoomOut.disabled = currentZoom <= 0.5;
    if (certZoomIn) certZoomIn.disabled = currentZoom >= 3.0;
  }

  function applyZoom() {
    updateZoomUI();
    if (currentDocType === "image" && certLbImg) {
      certLbImg.style.transform = `scale(${currentZoom})`;
    } else if (currentDocType === "pdf" && currentPdfDoc) {
      renderPdfPage(currentPageNum);
    }
  }

  function updatePageUI() {
    if (certPageInfo) {
      certPageInfo.textContent = `${currentPageNum} / ${totalPdfPages}`;
    }
    if (certPrevPage) certPrevPage.disabled = currentPageNum <= 1;
    if (certNextPage) certNextPage.disabled = currentPageNum >= totalPdfPages;
  }

  function renderPdfPage(num) {
    if (!currentPdfDoc || !certPdfCanvas) return;

    if (pdfRenderTask) {
      pdfRenderTask.cancel();
      pdfRenderTask = null;
    }

    showCertLoader(true);

    currentPdfDoc.getPage(num).then(page => {
      // Calculate responsive scale
      const unscaledViewport = page.getViewport({ scale: 1 });
      const containerWidth = certPdfViewport ? (certPdfViewport.clientWidth || 800) : 800;
      const targetWidth = Math.max(280, Math.min(containerWidth - 24, 920));
      const baseScale = targetWidth / unscaledViewport.width;
      const finalScale = baseScale * currentZoom;
      const viewport = page.getViewport({ scale: finalScale });

      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      certPdfCanvas.width = Math.floor(viewport.width * dpr);
      certPdfCanvas.height = Math.floor(viewport.height * dpr);
      certPdfCanvas.style.width = Math.floor(viewport.width) + "px";
      certPdfCanvas.style.height = Math.floor(viewport.height) + "px";

      const ctx = certPdfCanvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };

      pdfRenderTask = page.render(renderContext);
      pdfRenderTask.promise.then(() => {
        showCertLoader(false);
        pdfRenderTask = null;
        updatePageUI();
      }).catch(err => {
        if (err && err.name !== "RenderingCancelledException") {
          console.error("PDF page render error:", err);
          showCertLoader(false);
        }
      });
    }).catch(err => {
      console.error("Error getting PDF page:", err);
      showCertLoader(false);
      showCertError(true, currentDocSrc);
    });
  }

  function loadPdfDocument(src) {
    currentDocType = "pdf";
    currentZoom = 1.0;
    currentPageNum = 1;
    totalPdfPages = 1;
    currentPdfDoc = null;

    if (certPdfViewport) certPdfViewport.style.display = "flex";
    if (certImgViewport) certImgViewport.style.display = "none";
    if (certZoomGroup) certZoomGroup.style.display = "flex";
    showCertError(false);
    showCertLoader(true);
    updateZoomUI();

    if (typeof pdfjsLib === "undefined") {
      showCertLoader(false);
      showCertError(true, src);
      return;
    }

    const loadingTask = pdfjsLib.getDocument({
      url: src,
      cMapUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/",
      cMapPacked: true
    });

    loadingTask.promise.then(pdf => {
      currentPdfDoc = pdf;
      totalPdfPages = pdf.numPages;

      if (certPageGroup) {
        certPageGroup.style.display = totalPdfPages > 1 ? "flex" : "none";
      }

      renderPdfPage(1);
    }).catch(err => {
      console.error("Error loading PDF document:", err);
      showCertLoader(false);
      showCertError(true, src);
    });
  }

  function loadImageDocument(src, altName) {
    currentDocType = "image";
    currentZoom = 1.0;
    currentPdfDoc = null;

    if (certPdfViewport) certPdfViewport.style.display = "none";
    if (certPageGroup) certPageGroup.style.display = "none";
    if (certImgViewport) certImgViewport.style.display = "flex";
    if (certZoomGroup) certZoomGroup.style.display = "flex";
    showCertError(false);
    showCertLoader(true);
    updateZoomUI();

    if (certLbImg) {
      certLbImg.style.transform = "scale(1)";
      certLbImg.onload = () => {
        showCertLoader(false);
      };
      certLbImg.onerror = () => {
        showCertLoader(false);
        showCertError(true, src);
      };
      certLbImg.src = src;
      certLbImg.alt = altName || "Certificate";
    }
  }

  function openCertLightbox(imgSrc, org, name, date) {
    if (!certLightbox) return;

    currentDocSrc = imgSrc;
    const isPdf = imgSrc.toLowerCase().endsWith(".pdf");

    // Populate header info
    if (certLbOrg)  certLbOrg.textContent  = org;
    if (certLbName) certLbName.textContent  = name;
    if (certLbDate) certLbDate.textContent  = date || "";

    // Set actions
    const fileName = imgSrc.split("/").pop();
    if (certOpenNewTab) {
      certOpenNewTab.href = imgSrc;
    }
    if (certDownload) {
      certDownload.href = imgSrc;
      certDownload.setAttribute("download", fileName);
    }
    if (certErrorOpenBtn) certErrorOpenBtn.href = imgSrc;
    if (certErrorDownloadBtn) {
      certErrorDownloadBtn.href = imgSrc;
      certErrorDownloadBtn.setAttribute("download", fileName);
    }
    if (certFooterOpenBtn) {
      certFooterOpenBtn.href = imgSrc;
    }
    if (certFooterOpenText) {
      certFooterOpenText.textContent = isPdf ? "Open PDF in New Tab" : "Open Image in New Tab";
    }

    // Open lightbox modal
    certLightbox.classList.add("open");
    certLightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Load file
    if (isPdf) {
      loadPdfDocument(imgSrc);
    } else {
      loadImageDocument(imgSrc, name);
    }
  }

  function closeCertLightbox() {
    if (!certLightbox) return;

    if (pdfRenderTask) {
      pdfRenderTask.cancel();
      pdfRenderTask = null;
    }

    certLightbox.classList.remove("open");
    certLightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    // Cleanup
    setTimeout(() => {
      if (certLbImg) { certLbImg.src = ""; certLbImg.style.transform = "scale(1)"; }
      if (certPdfCanvas) {
        const ctx = certPdfCanvas.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, certPdfCanvas.width, certPdfCanvas.height);
      }
      currentPdfDoc = null;
      currentZoom = 1.0;
      showCertLoader(false);
      showCertError(false);
    }, 400);
  }

  // Event Listeners for Viewer Controls
  if (certClose) certClose.addEventListener("click", closeCertLightbox);
  if (certBackdrop) certBackdrop.addEventListener("click", closeCertLightbox);

  // Zoom events
  if (certZoomIn) {
    certZoomIn.addEventListener("click", () => {
      if (currentZoom < 3.0) {
        currentZoom = Math.min(3.0, +(currentZoom + 0.25).toFixed(2));
        applyZoom();
      }
    });
  }

  if (certZoomOut) {
    certZoomOut.addEventListener("click", () => {
      if (currentZoom > 0.5) {
        currentZoom = Math.max(0.5, +(currentZoom - 0.25).toFixed(2));
        applyZoom();
      }
    });
  }

  if (certZoomReset) {
    certZoomReset.addEventListener("click", () => {
      currentZoom = 1.0;
      applyZoom();
    });
  }

  // Page navigation events
  if (certPrevPage) {
    certPrevPage.addEventListener("click", () => {
      if (currentPageNum > 1) {
        currentPageNum--;
        renderPdfPage(currentPageNum);
      }
    });
  }

  if (certNextPage) {
    certNextPage.addEventListener("click", () => {
      if (currentPageNum < totalPdfPages) {
        currentPageNum++;
        renderPdfPage(currentPageNum);
      }
    });
  }

  // Keyboard shortcut: Escape
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && certLightbox && certLightbox.classList.contains("open")) {
      closeCertLightbox();
    }
  });

  // Re-render PDF on window resize with debounce
  window.addEventListener("resize", () => {
    if (certLightbox && certLightbox.classList.contains("open") && currentDocType === "pdf" && currentPdfDoc) {
      clearTimeout(resizeDebounce);
      resizeDebounce = setTimeout(() => {
        renderPdfPage(currentPageNum);
      }, 200);
    }
  }, { passive: true });

  // Attach to certification cards
  document.querySelectorAll(".cert-card[data-img]").forEach(card => {
    function triggerOpen() {
      openCertLightbox(
        card.dataset.img,
        card.dataset.org  || "",
        card.dataset.name || "",
        card.dataset.date || ""
      );
    }
    card.addEventListener("click",   triggerOpen);
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); triggerOpen(); }
    });
  });

  // Expose for timeline and education cards
  window.openCertFromTimeline = function(imgSrc, org, name, date) {
    openCertLightbox(imgSrc, org, name, date);
  };

  window.openEduMemo = function(imgSrc, org, name, date) {
    openCertLightbox(imgSrc, org, name, date);
  };

  /* ================================================
     14. RIPPLE EFFECT ON BUTTONS
  ================================================ */
  function addRipple(e) {
    const btn  = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;
    const ripple = document.createElement("span");
    ripple.style.cssText = `
      position:absolute; border-radius:50%; pointer-events:none;
      width:10px; height:10px;
      left:${x - 5}px; top:${y - 5}px;
      background:rgba(255,255,255,.25);
      transform:scale(0); animation:ripple .55s ease-out forwards;
    `;
    btn.style.position = "relative";
    btn.style.overflow = "hidden";
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  // Inject ripple keyframes
  const rippleStyle = document.createElement("style");
  rippleStyle.textContent = `
    @keyframes ripple {
      to { transform: scale(28); opacity: 0; }
    }
  `;
  document.head.appendChild(rippleStyle);

  document.querySelectorAll(".btn, .header-cta, .tl-cert-btn, .contact-card").forEach(btn => {
    btn.addEventListener("click", addRipple);
  });

  /* ================================================
     15. SMOOTH SCROLL FOR ALL ANCHORS
  ================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 80, behavior: "smooth" });
      }
    });
  });

  /* ================================================
     16. INIT SEQUENCE
  ================================================ */
  // Hero starts immediately (loader hides body overflow, but hero runs)
  updateHero();

  // After loader finishes, init everything
  // (initReveal is called from runLoader's callback)
  // But if loader is already done, call directly
  if (loader && loader.classList.contains("hidden")) {
    initReveal();
  }

  // Tilt & magnetic can init after DOM is ready
  window.addEventListener("load", () => {
    initTilt();
    initMagnetic();
    updateActiveNav();
  });

})();
