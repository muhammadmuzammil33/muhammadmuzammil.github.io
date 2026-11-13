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