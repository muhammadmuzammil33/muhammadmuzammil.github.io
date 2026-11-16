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
