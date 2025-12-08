"use client";
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.HeroSlider = void 0;
var react_1 = require("react");
var Button_1 = require("@/components/Button");
// ==============================================================================
// HILFS-KOMPONENTEN (Icons)
// ==============================================================================
// Hilfs-Icons (simuliert)
var ChevronLeft = function (props) { return (react_1["default"].createElement("svg", __assign({}, props, { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
    react_1["default"].createElement("path", { d: "M15 18l-6-6 6-6" }))); };
var ChevronRight = function (props) { return (react_1["default"].createElement("svg", __assign({}, props, { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
    react_1["default"].createElement("path", { d: "M9 18l6-6-6-6" }))); };
// ==============================================================================
// HeroSlider Komponente
// ==============================================================================
/**
 * Vollständig responsiver, autom. laufender Hero-Slider.
 * Die Daten werden via 'slides' Prop übergeben.
 */
exports.HeroSlider = function (_a) {
    var slides = _a.slides;
    var _b = react_1.useState(0), currentSlide = _b[0], setCurrentSlide = _b[1];
    var totalSlides = slides.length;
    var nextSlide = react_1.useCallback(function () {
        setCurrentSlide(function (prevIndex) { return (prevIndex + 1) % totalSlides; });
    }, [totalSlides]);
    var prevSlide = function () {
        setCurrentSlide(function (prevIndex) { return (prevIndex - 1 + totalSlides) % totalSlides; });
    };
    // Auto-Advance Logik mit useEffect (5 Sekunden)
    react_1.useEffect(function () {
        // Stellen Sie sicher, dass slides vorhanden sind, bevor der Timer gestartet wird.
        if (totalSlides === 0)
            return;
        var intervalId = setInterval(nextSlide, 5000);
        return function () { return clearInterval(intervalId); };
    }, [nextSlide, totalSlides]);
    // Error-Handling für das Bild
    var handleImageError = function (e) {
        var target = e.target;
        target.onerror = null;
        target.src =
            "https://placehold.co/720x400/CCCCCC/333333?text=Bild+nicht+gefunden";
    };
    return (
    // Responsive Höhe: Mobile (h-80), Tablet/Small Desktop (md:h-96), Large Desktop (lg:h-[70vh])
    react_1["default"].createElement("section", { className: "relative w-full overflow-hidden h-80 md:h-96 lg:h-[70vh] mb-12 shadow-xl" },
        react_1["default"].createElement("div", { className: "flex transition-transform duration-700 ease-in-out h-full", style: { transform: "translateX(-" + currentSlide * 100 + "%)" } }, slides.map(function (slide, index) { return (react_1["default"].createElement("div", { key: slide.id, className: "w-full shrink-0 relative h-full" },
            react_1["default"].createElement("picture", null,
                react_1["default"].createElement("source", { media: "(min-width: 768px)", srcSet: slide.imageDesktop }),
                react_1["default"].createElement("img", { src: slide.imageMobile, alt: slide.title, 
                    // Deckt den gesamten Container ab und zentriert das Bild
                    className: "absolute inset-0 w-full h-full object-cover", onError: handleImageError })),
            react_1["default"].createElement("div", { className: "absolute inset-0 bg-black/30" }),
            react_1["default"].createElement("div", { className: "absolute inset-0 flex flex-col items-center justify-center px-16 sm:px-20 md:px-24 py-4 sm:py-8 text-center text-white drop-shadow-lg animated-slide", style: { willChange: 'transform, opacity', backfaceVisibility: 'hidden', transform: 'translateZ(0)' } },
                react_1["default"].createElement("h1", { className: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-2 " + (index === currentSlide
                        ? "animate-[slideInUp_0.8s_ease-out_0.2s_both]"
                        : "opacity-0") + " animated-slide", style: { willChange: 'transform, opacity', backfaceVisibility: 'hidden', transform: 'translateZ(0)' } }, slide.title),
                react_1["default"].createElement("p", { className: "text-md sm:text-lg md:text-xl lg:text-2xl mb-4 " + (index === currentSlide
                        ? "animate-[slideInUp_0.8s_ease-out_0.4s_both]"
                        : "opacity-0") + " animated-slide", style: { willChange: 'transform, opacity', backfaceVisibility: 'hidden', transform: 'translateZ(0)' } }, slide.description),
                react_1["default"].createElement("div", { className: index === currentSlide
                        ? "animate-[popIn_0.6s_ease-out_0.8s_both] animated-slide"
                        : "opacity-0 animated-slide", style: { willChange: 'transform, opacity', backfaceVisibility: 'hidden', transform: 'translateZ(0)' } },
                    react_1["default"].createElement(Button_1["default"], { href: slide.ctaLink, className: "shadow-xl mt-2 text-sm md:text-base" }, slide.cta))))); })),
        react_1["default"].createElement("button", { onClick: prevSlide, "aria-label": "Previous slide", className: "absolute top-1/2 left-1 md:left-4 transform -translate-y-1/2 p-3 bg-black/30 backdrop-blur-md hover:bg-black/50 hover:scale-90 text-white rounded-full transition-all shadow-md cursor-pointer", style: { willChange: 'transform', backfaceVisibility: 'hidden', transform: 'translateZ(0)' } },
            react_1["default"].createElement(ChevronLeft, { className: "w-10 h-10 md:w-8 md:h-8 lg:w-10 lg:h-10" })),
        react_1["default"].createElement("button", { onClick: nextSlide, "aria-label": "Next slide", className: "absolute top-1/2 right-1 md:right-4 transform -translate-y-1/2 p-3 bg-black/30 backdrop-blur-md hover:bg-black/50 hover:scale-90 text-white rounded-full transition-all shadow-md cursor-pointer", style: { willChange: 'transform', backfaceVisibility: 'hidden', transform: 'translateZ(0)' } },
            react_1["default"].createElement(ChevronRight, { className: "w-10 h-10 md:w-8 md:h-8 lg:w-10 lg:h-10" })),
        react_1["default"].createElement("div", { className: "absolute bottom-4 left-0 right-0 flex justify-center space-x-2" }, slides.map(function (_, index) { return (react_1["default"].createElement("button", { key: index, onClick: function () { return setCurrentSlide(index); }, "aria-label": "Go to slide " + (index + 1), className: "w-3.5 h-3.5 md:w-3 md:h-3 lg:w-2.5 lg:h-2.5 rounded-full transition-colors duration-300 cursor-pointer " + (index === currentSlide
                ? "bg-accent shadow-md"
                : "bg-white/70 hover:bg-white"), style: { willChange: 'transform', backfaceVisibility: 'hidden', transform: 'translateZ(0)' } })); }))));
};
