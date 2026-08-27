document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const menu = document.querySelector("#main-menu");
    const header = document.querySelector("header");
    const form = document.querySelector("form");
    const formButton = form?.querySelector("button[type=submit]");
    const toggleClientInfoBtn = document.querySelector("#toggleClientInfo");
    const clientInfoSection = document.querySelector("#clientInfoSection");
    const togglePaymentInfoBtn = document.querySelector("#togglePaymentInfo");
    const paymentInfoSection = document.querySelector("#paymentInfoSection");
    const submitPaymentDetailsBtn = document.querySelector("#submitPaymentDetails");

    // Toggle Client Information Section
    if (toggleClientInfoBtn && clientInfoSection) {
        toggleClientInfoBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const isHidden = clientInfoSection.style.display === "none";
            clientInfoSection.style.display = isHidden ? "block" : "none";
            toggleClientInfoBtn.textContent = isHidden ? "Hide Information" : "Submit Information";
            if (isHidden) {
                clientInfoSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    }

    // Toggle Payment Information Section
    if (togglePaymentInfoBtn && paymentInfoSection) {
        togglePaymentInfoBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const isHidden = paymentInfoSection.style.display === "none";
            paymentInfoSection.style.display = isHidden ? "block" : "none";
            togglePaymentInfoBtn.textContent = isHidden ? "Hide Payment Information" : "Payment Information";
            if (isHidden) {
                paymentInfoSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    }

    // Submit Payment Details - Add to form
    if (submitPaymentDetailsBtn && paymentInfoSection) {
        submitPaymentDetailsBtn.addEventListener("click", (e) => {
            e.preventDefault();
            // Validate payment fields
            const transactionId = document.querySelector("#transactionId");
            const paymentAmount = document.querySelector("#paymentAmount");
            const paymentDate = document.querySelector("#paymentDate");
            
            if (!transactionId.value.trim()) {
                transactionId.setCustomValidity("Please enter a transaction ID.");
                transactionId.reportValidity();
                return;
            }
            if (!paymentAmount.value) {
                paymentAmount.setCustomValidity("Please enter the payment amount.");
                paymentAmount.reportValidity();
                return;
            }
            if (!paymentDate.value) {
                paymentDate.setCustomValidity("Please select a payment date.");
                paymentDate.reportValidity();
                return;
            }
            
            // Clear validation messages
            transactionId.setCustomValidity("");
            paymentAmount.setCustomValidity("");
            paymentDate.setCustomValidity("");
            
            // Submit the form
            form.submit();
        });
    }

    const closeMenu = () => {
        if (!menuToggle || !menu) return;
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.querySelector(".sr-only").textContent = "Open menu";
        menu.classList.remove("is-open");
    };

    if (menuToggle && menu) {
        menuToggle.addEventListener("click", () => {
            const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
            menuToggle.setAttribute("aria-expanded", String(!isOpen));
            menuToggle.querySelector(".sr-only").textContent = isOpen ? "Open menu" : "Close menu";
            menu.classList.toggle("is-open", !isOpen);
        });

        menu.querySelectorAll("a[href^='#']").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 700) closeMenu();
        });
    }

    document.querySelectorAll("a[href^='#']").forEach((link) => {
        link.addEventListener("click", (event) => {
            const target = document.querySelector(link.getAttribute("href"));
            if (!target) return;
            event.preventDefault();
            const headerHeight = header?.offsetHeight ?? 0;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
            window.scrollTo({ top: targetPosition, behavior: "smooth" });
            window.history.pushState(null, "", link.getAttribute("href"));
        });
    });

    if (form) {
        const successMessage = form.querySelector(".success-message");
        const fields = form.querySelectorAll("input, textarea, select");
        
        // Clear custom validity when user interacts with field
        fields.forEach((field) => {
            field.addEventListener("input", () => {
                field.setCustomValidity("");
                field.removeAttribute("aria-invalid");
            });

            field.addEventListener("change", () => {
                field.setCustomValidity("");
                field.removeAttribute("aria-invalid");
            });

            field.addEventListener("invalid", () => {
                field.setAttribute("aria-invalid", "true");
                if (field.validity.valueMissing) {
                    field.setCustomValidity("This field is required.");
                } else if (field.validity.typeMismatch && field.type === "email") {
                    field.setCustomValidity("Please enter a valid email address.");
                }
            });
        });

        // Validate at least one service is selected
        const validateServices = () => {
            const serviceCheckboxes = form.querySelectorAll("input[name='service']");
            const anyChecked = Array.from(serviceCheckboxes).some(cb => cb.checked);
            if (!anyChecked) {
                serviceCheckboxes[0].setCustomValidity("Please select at least one service.");
                return false;
            }
            serviceCheckboxes.forEach(cb => cb.setCustomValidity(""));
            return true;
        };

        // Validate confirmation checkbox
        const confirmationCheckbox = form.querySelector("#confirmation");
        
        form.addEventListener("submit", (event) => {
            if (!form.checkValidity() || !validateServices() || !confirmationCheckbox.checked) {
                event.preventDefault();
                form.reportValidity();
                if (!confirmationCheckbox.checked) {
                    confirmationCheckbox.setCustomValidity("Please confirm that the information is accurate.");
                    confirmationCheckbox.reportValidity();
                }
                return;
            }

            if (formButton) {
                formButton.disabled = true;
                formButton.textContent = "Submitting...";
            }

            // Show success message after submission
            setTimeout(() => {
                if (successMessage) {
                    successMessage.textContent = "Thank you! Your project request has been submitted successfully. We will review your requirements and get back to you by email.";
                    successMessage.classList.add("show");
                    
                    // Reset form after success
                    form.reset();
                    if (formButton) {
                        formButton.disabled = false;
                        formButton.textContent = "Submit Project Request";
                    }
                    
                    // Hide client info section
                    if (clientInfoSection) {
                        clientInfoSection.style.display = "none";
                        toggleClientInfoBtn.textContent = "Submit Information";
                    }
                    
                    // Scroll to success message
                    successMessage.scrollIntoView({ behavior: "smooth", block: "center" });
                    
                    // Hide message after 10 seconds
                    setTimeout(() => {
                        successMessage.classList.remove("show");
                    }, 10000);
                }
            }, 1500);
        });
    }

    const sections = document.querySelectorAll("main section");
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12 });

    sections.forEach((section) => revealObserver.observe(section));

    const navLinks = document.querySelectorAll("nav li a");
    const activeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((link) => {
                link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
            });
        });
    }, { rootMargin: "-35% 0px -55%", threshold: 0 });

    sections.forEach((section) => activeObserver.observe(section));
});

const interactionStyles = document.createElement("style");
interactionStyles.textContent = `
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }

    .menu-toggle {
        display: none;
        min-height: 42px;
        width: 46px;
        padding: 9px;
        border: 1px solid var(--line);
        background: var(--white);
        box-shadow: none;
        flex-direction: column;
        gap: 4px;
    }

    .menu-toggle span:not(.sr-only) {
        width: 100%;
        height: 2px;
        background: var(--teal-dark);
        border-radius: 2px;
        transition: transform .2s ease, opacity .2s ease;
    }

    .menu-toggle[aria-expanded="true"] span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
    .menu-toggle[aria-expanded="true"] span:nth-child(2) { opacity: 0; }
    .menu-toggle[aria-expanded="true"] span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
    nav li a.is-active { color: var(--teal-dark); background: var(--mint); }
    main section { opacity: 0; transform: translateY(18px); transition: opacity .65s ease, transform .65s ease; }
    main section.is-visible { opacity: 1; transform: translateY(0); }
    form button:disabled { cursor: wait; opacity: .7; transform: none; }
    input[aria-invalid="true"], textarea[aria-invalid="true"], select[aria-invalid="true"] { border-color: var(--coral); }
    
    input[type="checkbox"]:focus, input[type="radio"]:focus, select:focus { outline: none; }
    .checkbox-group label:has(input:focus), .radio-group label:has(input:focus) { outline: 2px solid var(--teal); outline-offset: 2px; border-radius: 4px; }

    @media (max-width: 700px) {
        nav { position: relative; }
        .menu-toggle { display: inline-flex; position: absolute; top: 13px; right: 0; }
        nav ul { display: none; }
        nav ul.is-open { display: flex; }
    }
`;
document.head.appendChild(interactionStyles);
