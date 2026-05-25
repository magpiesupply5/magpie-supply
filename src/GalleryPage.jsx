import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BASE_FONT =
  "'Outfit', 'Pretendard', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

// Auto-scan all images from /public/gallery/ folder
// Steve가 폴더에 사진 추가하면 자동으로 여기 나타남
// 파일명을 01-, 02-, 03- 형식으로 시작하면 알파벳순으로 정렬됨
const galleryImages = import.meta.glob("/public/gallery/*.{jpg,jpeg,png,JPG,JPEG,PNG}", {
  eager: true,
  query: "?url",
  import: "default",
});

const sortedImages = Object.entries(galleryImages)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, url]) => ({
    src: url,
    name: path.split("/").pop(),
  }));

const GalleryPage = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    // Load Outfit + Pretendard fonts
    const link1 = document.createElement("link");
    link1.href =
      "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap";
    link1.rel = "stylesheet";
    document.head.appendChild(link1);

    const link2 = document.createElement("link");
    link2.href =
      "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css";
    link2.rel = "stylesheet";
    document.head.appendChild(link2);

    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lightbox keyboard: ESC to close
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setLightboxImage(null);
    };
    if (lightboxImage) {
      window.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightboxImage]);

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: BASE_FONT }}>
      {/* ═══ MINIMAL HEADER ═══ */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(15,43,74,0.08)",
          zIndex: 100,
          padding: isMobile ? "16px 20px" : "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          style={{
            fontFamily: BASE_FONT,
            fontSize: isMobile ? 14 : 16,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "#0F2B4A",
            textDecoration: "none",
          }}
        >
          MAGPIE SUPPLY
        </Link>

        <Link
          to="/"
          style={{
            fontFamily: BASE_FONT,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.15em",
            color: "#5a6a7a",
            textDecoration: "none",
            textTransform: "uppercase",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.color = "#0F2B4A")}
          onMouseLeave={(e) => (e.target.style.color = "#5a6a7a")}
        >
          ← Back
        </Link>
      </nav>

      {/* ═══ HERO / TITLE ═══ */}
      <header
        style={{
          padding: isMobile ? "48px 20px 32px" : "80px 40px 56px",
          textAlign: "center",
          maxWidth: 800,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            fontFamily: BASE_FONT,
            fontSize: isMobile ? 10 : 12,
            fontWeight: 600,
            letterSpacing: isMobile ? "0.18em" : "0.27em",
            color: "#4A90D9",
            marginBottom: isMobile ? 16 : 20,
            textTransform: "uppercase",
          }}
        >
          Selected Work
        </div>
        <h1
          style={{
            fontFamily: BASE_FONT,
            fontSize: isMobile ? 32 : 48,
            fontWeight: 700,
            color: "#0F2B4A",
            letterSpacing: "-0.025em",
            lineHeight: 1.15,
            marginBottom: isMobile ? 16 : 20,
          }}
        >
          Our Work
        </h1>
        <p
          style={{
            fontSize: isMobile ? 14 : 16,
            color: "#5a6a7a",
            lineHeight: 1.7,
            maxWidth: 560,
            margin: "0 auto",
            fontWeight: 400,
          }}
        >
          Custom beauty accessories, tools, and GWP — designed and supplied
          for global prestige brands.
        </p>
      </header>

      {/* ═══ GALLERY GRID ═══ */}
      <main
        style={{
          padding: isMobile ? "0 12px 80px" : "0 40px 120px",
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        {sortedImages.length === 0 ? (
          <div
            style={{
              padding: "80px 20px",
              textAlign: "center",
              color: "#8899aa",
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "0.05em",
            }}
          >
            No images yet. Add photos to <code>public/gallery/</code> to populate this gallery.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
              gap: isMobile ? 4 : 8,
            }}
          >
            {sortedImages.map((item, i) => (
              <button
                key={i}
                onClick={() => setLightboxImage(item)}
                aria-label={`Open image ${i + 1}`}
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  overflow: "hidden",
                  background: "#F7F9FB",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  position: "relative",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <img
                  src={item.src}
                  alt={`Magpie Supply custom B2B beauty product ${i + 1}`}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </button>
            ))}
          </div>
        )}

        <div
          style={{
            textAlign: "center",
            marginTop: isMobile ? 48 : 72,
            fontSize: 12,
            fontWeight: 500,
            color: "#8899aa",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          — Full catalogue available on request —
        </div>

        <div style={{ textAlign: "center", marginTop: isMobile ? 32 : 48 }}>
          <Link
            to="/#contact"
            style={{
              display: "inline-block",
              padding: isMobile ? "14px 28px" : "16px 36px",
              background: "#0F2B4A",
              color: "#fff",
              fontFamily: BASE_FONT,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: 4,
              transition: "background 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#4A90D9")}
            onMouseLeave={(e) => (e.target.style.background = "#0F2B4A")}
          >
            Get in Touch
          </Link>
        </div>
      </main>

      {/* ═══ LIGHTBOX ═══ */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(8, 26, 46, 0.92)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: isMobile ? 20 : 60,
            cursor: "zoom-out",
            animation: "fadeIn 0.2s ease",
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxImage(null);
            }}
            aria-label="Close"
            style={{
              position: "absolute",
              top: isMobile ? 16 : 24,
              right: isMobile ? 16 : 24,
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              width: 40,
              height: 40,
              borderRadius: "50%",
              fontSize: 20,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: BASE_FONT,
              fontWeight: 300,
              zIndex: 1001,
            }}
          >
            ✕
          </button>
          <img
            src={lightboxImage.src}
            alt="Enlarged product view"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              cursor: "default",
              boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
            }}
          />
        </div>
      )}

      {/* ═══ FOOTER (Minimal) ═══ */}
      <footer
        style={{
          background: "#081A2E",
          color: "#fff",
          padding: isMobile ? "40px 24px" : "60px 40px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: BASE_FONT,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.08em",
            marginBottom: 8,
          }}
        >
          MAGPIE SUPPLY
        </div>
        <div
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.05em",
            marginBottom: 16,
          }}
        >
          B2B Beauty Supply · Seoul, Korea
        </div>
        <Link
          to="/"
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: 11,
            textDecoration: "none",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
          onMouseEnter={(e) => (e.target.style.color = "#fff")}
          onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.6)")}
        >
          ← Back to Home
        </Link>
      </footer>

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default GalleryPage;
