// ============================
// Typing Animation
// ============================

const typingText = document.getElementById("typing-text");

const roles = [
    "SEO Specialist",
    "Web Developer",
    "IT Support Engineer"
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {

    const currentRole = roles[roleIndex];

    if (!deleting) {

        typingText.textContent =
            currentRole.substring(0, charIndex + 1);

        charIndex++;

        if (charIndex === currentRole.length) {
            deleting = true;

            setTimeout(typeEffect, 1500);
            return;
        }

    } else {

        typingText.textContent =
            currentRole.substring(0, charIndex - 1);

        charIndex--;

        if (charIndex === 0) {
            deleting = false;

            roleIndex++;

            if (roleIndex === roles.length) {
                roleIndex = 0;
            }
        }
    }

    setTimeout(typeEffect, deleting ? 50 : 100);
}

typeEffect();


// ============================
// Automatic Copyright Year
// ============================

document.getElementById("year").textContent =
    new Date().getFullYear();


// ============================
// Back To Top
// ============================

const backToTop = document.getElementById("back-to-top");

window.addEventListener("scroll", function () {

    if (window.scrollY > 400) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }

});

backToTop.addEventListener("click", function () {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


// ============================
// Certificates + Projects Card Reveal
// ============================

document.documentElement.classList.add("reveal-ready");

const revealGroups = [

    document.querySelectorAll(
        "#certifications .certificate-card"
    ),

    document.querySelectorAll(
        "#seo-projects .seo-project-card"
    ),

    document.querySelectorAll(
        "#web-projects .project-card, #web-projects .web-project-card"
    )
];

const revealCards = [];

revealGroups.forEach(function (group) {

    group.forEach(function (card, index) {

        card.style.setProperty(
            "--reveal-delay",
            Math.min(index * 0.09, 0.36) + "s"
        );

        revealCards.push(card);
    });
});

const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

function revealCardsInView() {

    const triggerPoint = window.innerHeight * 0.9;

    revealCards.forEach(function (card) {

        if (card.classList.contains("is-visible")) {
            return;
        }

        const rect = card.getBoundingClientRect();

        if (rect.top < triggerPoint && rect.bottom > 0) {

            card.classList.add("is-visible");
        }
    });
}

if (reduceMotion) {

    revealCards.forEach(function (card) {

        card.classList.add("is-visible");
    });

} else {

    let lastRevealCheck = 0;

    function requestRevealCheck() {

        const now = Date.now();

        if (now - lastRevealCheck < 80) {
            return;
        }

        lastRevealCheck = now;

        revealCardsInView();

        window.setTimeout(revealCardsInView, 350);
    }

    window.addEventListener("scroll", requestRevealCheck, {
        passive: true
    });

    window.addEventListener("resize", requestRevealCheck);

    window.addEventListener("load", revealCardsInView);

    revealCardsInView();
}


// ============================
// TaskFlow Dashboard Preview
// ============================

(function () {

    const previewDialog = document.getElementById(
        "taskflowPreview"
    );

    const previewTriggers = document.querySelectorAll(
        ".js-taskflow-preview"
    );

    if (!previewDialog || !previewTriggers.length) {
        return;
    }

    const closeButton = previewDialog.querySelector(
        ".js-lightbox-close"
    );

    let lastTrigger = null;

    function openPreview(event) {

        lastTrigger = event.currentTarget;

        if (typeof previewDialog.showModal === "function") {
            previewDialog.showModal();
        } else {
            previewDialog.setAttribute("open", "");
        }

        document.body.classList.add("lightbox-open");

        if (closeButton) {
            closeButton.focus({ preventScroll: true });
        }
    }

    function closePreview() {

        if (typeof previewDialog.close === "function") {
            previewDialog.close();
        } else {
            previewDialog.removeAttribute("open");
        }

        document.body.classList.remove("lightbox-open");

        if (lastTrigger) {
            lastTrigger.focus({ preventScroll: true });
        }
    }

    previewTriggers.forEach(function (trigger) {

        trigger.addEventListener("click", openPreview);
    });

    if (closeButton) {
        closeButton.addEventListener("click", closePreview);
    }

    previewDialog.addEventListener("click", function (event) {

        if (event.target === previewDialog) {
            closePreview();
        }
    });

    previewDialog.addEventListener("cancel", function (event) {

        event.preventDefault();

        closePreview();
    });
})();


/* =========================================================
   CONTACT FORM
   Static site: validates input, then POSTs the message to
   Web3Forms, which forwards it straight to the owner's inbox.
   ========================================================= */

(function () {

    var form = document.getElementById("contactForm");

    if (!form) {
        return;
    }

    var ACCESS_KEY = "c1d03c3a-4767-4907-b637-d636d7544b08";

    var status = form.querySelector(".contact-form-status");
    var submitButton = form.querySelector(".contact-submit");

    function setStatus(message, isOk) {

        status.textContent = message;

        status.classList.toggle("is-ok", Boolean(isOk));
    }

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        var name = form.elements.name.value.trim();
        var email = form.elements.email.value.trim();
        var subject = form.elements.subject.value.trim();
        var message = form.elements.message.value.trim();

        if (!name || !email || !subject || !message) {
            setStatus("Please fill in all fields.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setStatus("Please enter a valid email address.");
            return;
        }

        if (ACCESS_KEY.indexOf("YOUR_") === 0) {
            setStatus("The form is not configured yet.");
            return;
        }

        var data = new FormData();

        data.append("access_key", ACCESS_KEY);
        data.append("name", name);
        data.append("email", email);
        data.append("subject", "Portfolio contact: " + subject);
        data.append("message", message);

        submitButton.disabled = true;

        setStatus("Sending...");

        fetch("https://api.web3forms.com/submit", {

            method: "POST",

            body: data

        }).then(function (response) {

            return response.json();

        }).then(function (result) {

            if (result.success) {

                setStatus("Message sent! I will get back to you soon.", true);

                form.reset();

            } else {

                setStatus("Sending failed. Please try again or email me directly.");
            }

        }).catch(function () {

            setStatus("Network error. Please try again or email me directly.");

        }).finally(function () {

            submitButton.disabled = false;
        });
    });
})();

// ============================
// Scroll Progress Bar + Scrollspy Nav
// ============================

(function () {

    var progressFill = document.querySelector(".scroll-progress span");
    var navLinks = Array.prototype.slice.call(
        document.querySelectorAll("nav ul li a[href^='#']")
    );
    var sections = navLinks.map(function (link) {
        return document.getElementById(link.getAttribute("href").slice(1));
    });
    var ticking = false;

    function update() {

        ticking = false;

        var max = document.documentElement.scrollHeight - window.innerHeight;
        var ratio = max > 0 ? window.scrollY / max : 0;

        if (progressFill) {
            progressFill.style.transform =
                "scaleX(" + Math.min(1, Math.max(0, ratio)) + ")";
        }

        var line = window.innerHeight * 0.4;
        var activeIndex = 0;

        for (var i = 0; i < sections.length; i++) {
            if (sections[i] && sections[i].getBoundingClientRect().top <= line) {
                activeIndex = i;
            }
        }

        for (var j = 0; j < navLinks.length; j++) {
            navLinks[j].classList.toggle("is-active", j === activeIndex);
        }
    }

    window.addEventListener("scroll", function () {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(update);
        }
    }, { passive: true });

    window.addEventListener("resize", update);

    update();
})();


// ============================
// Animated Section Dividers
// ============================

(function () {

    var sections = document.querySelectorAll("body > section:not(#home)");

    for (var i = 0; i < sections.length; i++) {

        var divider = document.createElement("div");

        divider.className = "section-divider";

        divider.setAttribute("aria-hidden", "true");

        sections[i].parentNode.insertBefore(divider, sections[i]);
    }
})();


// ============================
// Project Card 3D Tilt
// ============================

(function () {

    var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!finePointer.matches || reducedMotion.matches) {
        return;
    }

    var cards = document.querySelectorAll(
        ".seo-project-card, .web-project-card, .taskflow-card"
    );

    var MAX_TILT = 5;

    for (var i = 0; i < cards.length; i++) {

        (function (card) {

            var frame = null;

            card.addEventListener("pointermove", function (event) {

                if (event.pointerType !== "mouse") {
                    return;
                }

                var rect = card.getBoundingClientRect();

                var px = (event.clientX - rect.left) / rect.width - 0.5;
                var py = (event.clientY - rect.top) / rect.height - 0.5;

                var rotateX = (-py * MAX_TILT * 2).toFixed(2);
                var rotateY = (px * MAX_TILT * 2).toFixed(2);

                if (frame) {
                    window.cancelAnimationFrame(frame);
                }

                frame = window.requestAnimationFrame(function () {

                    card.classList.add("is-tilting");

                    card.style.transform =
                        "perspective(900px) rotateX(" + rotateX + "deg) " +
                        "rotateY(" + rotateY + "deg) translateY(-8px) scale(1.01)";
                });
            });

            card.addEventListener("pointerleave", function () {

                if (frame) {
                    window.cancelAnimationFrame(frame);
                    frame = null;
                }

                card.classList.remove("is-tilting");

                card.style.transform = "";
            });

        })(cards[i]);
    }
})();


// ============================
// About Section Background Effects
// ============================

(function () {

    var fx = document.querySelector(".about-bg-fx");

    if (!fx) {
        return;
    }

    var NS = "http://www.w3.org/2000/svg";

    function createLayer() {

        var svg = document.createElementNS(NS, "svg");

        svg.setAttribute("viewBox", "0 0 1000 700");

        svg.setAttribute("preserveAspectRatio", "xMidYMid slice");

        svg.setAttribute("aria-hidden", "true");

        svg.setAttribute("focusable", "false");

        svg.classList.add("about-layer");

        return svg;
    }

    // Constellation network

    var nodes = [
        [80, 100], [210, 64], [352, 128], [118, 252],
        [280, 296], [452, 214], [72, 404], [258, 448],
        [430, 372], [596, 286], [148, 556], [352, 576],
        [540, 492], [700, 168], [664, 410], [788, 592]
    ];

    var constellation = createLayer();

    var drift = document.createElementNS(NS, "g");

    drift.setAttribute("class", "about-constellation");

    var lineGroup = document.createElementNS(NS, "g");

    lineGroup.setAttribute("class", "about-constellation-lines");

    var MAX_LINK_DISTANCE = 190;

    for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {

            var dx = nodes[i][0] - nodes[j][0];
            var dy = nodes[i][1] - nodes[j][1];

            if (Math.sqrt(dx * dx + dy * dy) > MAX_LINK_DISTANCE) {
                continue;
            }

            var line = document.createElementNS(NS, "line");

            line.setAttribute("x1", nodes[i][0]);
            line.setAttribute("y1", nodes[i][1]);
            line.setAttribute("x2", nodes[j][0]);
            line.setAttribute("y2", nodes[j][1]);

            lineGroup.appendChild(line);
        }
    }

    drift.appendChild(lineGroup);

    for (var k = 0; k < nodes.length; k++) {

        var circle = document.createElementNS(NS, "circle");

        circle.setAttribute("cx", nodes[k][0]);
        circle.setAttribute("cy", nodes[k][1]);
        circle.setAttribute("r", k % 5 === 2 ? 2.6 : 2);

        circle.setAttribute("class", "about-constellation-node" + (k % 5 === 2 ? " is-purple" : ""));

        circle.style.animationDelay = (-k * 0.6) + "s";

        drift.appendChild(circle);
    }

    constellation.appendChild(drift);

    fx.appendChild(constellation);

    // Circuit traces

    var circuits = [
        { d: "M0 78 H180 L214 112 H372", end: [372, 112], purple: false },
        { d: "M1000 128 H868 L834 162 H706", end: [706, 162], purple: true },
        { d: "M0 540 H96 L138 582 H246", end: [246, 582], purple: false },
        { d: "M1000 620 H904 L872 588 H764", end: [764, 588], purple: false },
        { d: "M338 700 V648 L296 606 V512", end: [296, 512], purple: true }
    ];

    var circuitLayer = createLayer();

    for (var c = 0; c < circuits.length; c++) {

        var path = document.createElementNS(NS, "path");

        path.setAttribute("d", circuits[c].d);

        path.setAttribute("class", "about-circuit" + (circuits[c].purple ? " is-purple" : ""));

        path.style.animationDelay = (-c * 1.7) + "s";

        circuitLayer.appendChild(path);

        var terminal = document.createElementNS(NS, "circle");

        terminal.setAttribute("r", 2.4);

        terminal.setAttribute("cx", circuits[c].end[0]);
        terminal.setAttribute("cy", circuits[c].end[1]);

        terminal.setAttribute("class", "about-circuit-terminal" + (circuits[c].purple ? " is-purple" : ""));

        circuitLayer.appendChild(terminal);
    }

    fx.appendChild(circuitLayer);

    // Cursor spotlight

    var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!finePointer.matches || reducedMotion.matches) {
        return;
    }

    var section = fx.parentNode;
    var frame = null;

    section.addEventListener("pointermove", function (event) {

        if (event.pointerType !== "mouse") {
            return;
        }

        var rect = section.getBoundingClientRect();

        var mx = ((event.clientX - rect.left) / rect.width) * 100;
        var my = ((event.clientY - rect.top) / rect.height) * 100;

        if (frame) {
            return;
        }

        frame = window.requestAnimationFrame(function () {

            frame = null;

            fx.style.setProperty("--about-mx", mx.toFixed(1) + "%");
            fx.style.setProperty("--about-my", my.toFixed(1) + "%");
        });
    });
})();


// ============================
// Section Themed Background Icons
// ============================

(function () {

    var ICONS = {

        cap: [
            "M12 4 2 9l10 5 10-5-10-5Z",
            "M6 11.5V16c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4.5",
            "M22 9v4"
        ],
        book: [
            "M4 4.5h6.5A2.5 2.5 0 0 1 13 7v13a2 2 0 0 0-2-2H4V4.5Z",
            "M20 4.5h-6.5A2.5 2.5 0 0 0 11 7v13a2 2 0 0 1 2-2h7V4.5Z"
        ],
        pencil: [
            "M4 20l4.5-1L19.5 8l-3.5-3.5L5 15.5 4 20Z",
            "M13.5 6.5 17 10"
        ],
        diploma: [
            "M6 3h12v11H6Z",
            "M9 6.5h6",
            "M9 9.5h6",
            "M10 14v6l2-1.4L14 20v-6"
        ],

        briefcase: [
            "M3 8h18v11H3Z",
            "M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2",
            "M3 13h18"
        ],
        calendar: [
            "M4 5h16v16H4Z",
            "M4 9.5h16",
            "M8 3v4",
            "M16 3v4",
            "M8 13h2",
            "M12 13h2",
            "M16 13h2",
            "M8 17h2",
            "M12 17h2"
        ],
        chartUp: [
            "M4 20V5",
            "M4 20h16",
            "M8 16l4-5 3 2 5-6"
        ],
        clock: [
            "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z",
            "M12 7.5V12l3 2"
        ],

        brackets: [
            "M9 5 4 12l5 7",
            "M15 5l5 7-5 7"
        ],
        gear: [
            "M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z",
            "M12 2.5v3",
            "M12 18.5v3",
            "M2.5 12h3",
            "M18.5 12h3",
            "M5 5l2.1 2.1",
            "M16.9 16.9 19 19",
            "M19 5l-2.1 2.1",
            "M7.1 16.9 5 19"
        ],
        database: [
            "M4 6c0-1.6 3.6-3 8-3s8 1.4 8 3-3.6 3-8 3-8-1.4-8-3Z",
            "M4 6v12c0 1.6 3.6 3 8 3s8-1.4 8-3V6",
            "M4 12c0 1.6 3.6 3 8 3s8-1.4 8-3"
        ],
        terminal: [
            "M3 4.5h18v15H3Z",
            "M7 9l3 3-3 3",
            "M13 15h4"
        ],

        medal: [
            "M12 3.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z",
            "M8.8 11.6 6 21l6-3.2 6 3.2-2.8-9.4"
        ],
        shieldCheck: [
            "M12 3l7 2.8V12c0 4.2-3 7.3-7 9-4-1.7-7-4.8-7-9V5.8L12 3Z",
            "M9 11.8l2.2 2.2 4-4.2"
        ],
        certificate: [
            "M5 3h14v13H5Z",
            "M8 6.5h8",
            "M8 9.5h8",
            "M8 12.5h4.5",
            "M15.5 15a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2Z"
        ],
        star: [
            "M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 16.9l-5.3 2.8 1.1-5.9-4.3-4.1 5.9-.8L12 3.5Z"
        ],

        browser: [
            "M3 4.5h18v15H3Z",
            "M3 8.5h18",
            "M6 6.5h.01",
            "M8.5 6.5h.01",
            "M11 6.5h.01"
        ],
        cursor: [
            "M6 3l12 8.5-5.2 1.2 2.7 5.6-2.7 1.3-2.7-5.6L6 17.5V3Z"
        ],

        envelope: [
            "M3 5h18v14H3Z",
            "M3 6l9 7 9-7"
        ],
        chat: [
            "M4 4h16v11H9l-5 5V4Z",
            "M8 9h8",
            "M8 12h5"
        ],
        phone: [
            "M8 3h8v18H8Z",
            "M11 17.5h2"
        ],
        plane: [
            "M21 3.5 3 10.2l7 2 2.8 7.3L21 3.5Z",
            "M10 12.2 21 3.5"
        ]
    };

    var SECTIONS = {
        education: {
            colors: ["rgba(56, 189, 248, 0.6)"],
            icons: ["cap", "book", "pencil", "diploma"]
        },
        experience: {
            colors: ["rgba(168, 85, 247, 0.55)"],
            icons: ["briefcase", "calendar", "chartUp", "clock"]
        },
        skills: {
            colors: ["rgba(34, 197, 94, 0.5)"],
            icons: ["brackets", "gear", "database", "terminal"]
        },
        certifications: {
            colors: ["rgba(245, 158, 11, 0.45)"],
            icons: ["medal", "shieldCheck", "certificate", "star"]
        },
        "seo-projects": {
            colors: ["rgba(56, 189, 248, 0.55)", "rgba(168, 85, 247, 0.45)"],
            icons: ["chartUp", "browser", "star", "cursor"]
        },
        "web-projects": {
            colors: ["rgba(56, 189, 248, 0.55)", "rgba(34, 197, 94, 0.4)"],
            icons: ["browser", "brackets", "terminal", "database"]
        },
        contact: {
            colors: ["rgba(56, 189, 248, 0.55)"],
            icons: ["envelope", "chat", "phone", "plane"]
        }
    };

    var SPOTS = [
        { side: "left", top: 10, gap: 4 },
        { side: "right", top: 7, gap: 5 },
        { side: "left", top: 26, gap: 6 },
        { side: "right", top: 29, gap: 4 },
        { side: "left", top: 45, gap: 5 },
        { side: "right", top: 48, gap: 6 },
        { side: "left", top: 63, gap: 4 },
        { side: "right", top: 66, gap: 5 }
    ];

    var SIZES = [46, 60, 38, 52, 44, 58, 40, 54];

    var NS = "http://www.w3.org/2000/svg";

    function buildIcon(name) {

        var svg = document.createElementNS(NS, "svg");

        svg.setAttribute("viewBox", "0 0 24 24");

        svg.setAttribute("aria-hidden", "true");

        svg.setAttribute("focusable", "false");

        var paths = ICONS[name];

        for (var i = 0; i < paths.length; i++) {

            var path = document.createElementNS(NS, "path");

            path.setAttribute("d", paths[i]);

            svg.appendChild(path);
        }

        return svg;
    }

    Object.keys(SECTIONS).forEach(function (id) {

        var section = document.getElementById(id);

        if (!section) {
            return;
        }

        var config = SECTIONS[id];

        var fx = document.createElement("div");

        fx.className = "section-fx";

        fx.setAttribute("aria-hidden", "true");

        for (var i = 0; i < SPOTS.length; i++) {

            var spot = SPOTS[i];

            var icon = document.createElement("span");

            icon.className = "section-fx-icon";

            icon.style[spot.side] = spot.gap + "%";
            icon.style.top = spot.top + "%";

            icon.style.width = SIZES[i] + "px";
            icon.style.height = SIZES[i] + "px";

            icon.style.setProperty(
                "--fx-color",
                config.colors[i % config.colors.length]
            );

            icon.style.setProperty("--fx-dur", (13 + (i % 4) * 2) + "s");
            icon.style.setProperty("--fx-delay", (-i * 1.8) + "s");

            icon.appendChild(buildIcon(config.icons[i % config.icons.length]));

            fx.appendChild(icon);
        }

        section.insertBefore(fx, section.firstChild);
    });
})();
