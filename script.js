document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // Task 1: Form Validation (Contact Form)
    // ==========================================
    const contactForm = document.getElementById("contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const nameInput = document.getElementById("name");
            const emailInput = document.getElementById("email");
            const messageInput = document.getElementById("message");

            let isValid = true;

            // Очистка предыдущих ошибок
            document.querySelectorAll(".error-text").forEach(el => el.remove());

            // Валидация Имени
            if (!nameInput.value.trim()) {
                showError(nameInput, "Please enter your name.");
                isValid = false;
            }

            // Валидация Email
            const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/i;
            if (!emailInput.value.trim()) {
                showError(emailInput, "Please enter your email.");
                isValid = false;
            } else if (!emailInput.value.match(emailPattern)) {
                showError(emailInput, "Please enter a valid email address.");
                isValid = false;
            }

            // Валидация Сообщения (минимум 10 символов)
            if (messageInput.value.trim().length < 10) {
                showError(messageInput, "Message must be at least 10 characters long.");
                isValid = false;
            }

            if (isValid) {
                alert("Thank you! Your message has been sent successfully.");
                contactForm.reset();
            }
        });
    }

    function showError(inputElement, message) {
        const errorDiv = document.createElement("div");
        errorDiv.className = "error-text text-danger small mt-1";
        errorDiv.textContent = message;
        inputElement.closest(".mb-3").appendChild(errorDiv);
    }


    // ==========================================
    // Task 2: Accordion for FAQs / Rules
    // ==========================================
    const accordionHeaders = document.querySelectorAll(".custom-accordion-header");

    accordionHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const content = header.nextElementSibling;

            
            document.querySelectorAll(".custom-accordion-content").forEach(item => {
                if (item !== content) {
                    item.classList.remove("active");
                    item.style.maxHeight = null;
                }
            });

            
            content.classList.toggle("active");
            if (content.classList.contains("active")) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });


    // ==========================================
    // Task 3: Modal Popup Window
    // ==========================================
    const openModalBtn = document.getElementById("open-modal-btn");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const modalOverlay = document.getElementById("modal-overlay");

    if (openModalBtn && modalOverlay) {
        openModalBtn.addEventListener("click", () => {
            modalOverlay.classList.remove("d-none");
        });
    }

    if (closeModalBtn && modalOverlay) {
        closeModalBtn.addEventListener("click", () => {
            modalOverlay.classList.add("d-none");
        });
    }

    if (modalOverlay) {
        window.addEventListener("click", (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.add("d-none");
            }
        });
    }


    // ==========================================
    // Task 4: Change Background Color
    // ==========================================
    const bgToggleBtn = document.getElementById("bg-toggle-btn");
    const colors = ["#ffffff", "#f8f9fa", "#e8f5e9", "#e3f2fd", "#fff3e0","green"];
    let colorIndex = 0;

    if (bgToggleBtn) {
        bgToggleBtn.addEventListener("click", () => {
            colorIndex = (colorIndex + 1) % colors.length;
            document.body.style.backgroundColor = colors[colorIndex];
        });
    }


    // ==========================================
    // Task 5: Live Date & Time Display
    // ==========================================
    const clockElement = document.getElementById("live-clock");

    function updateClock() {
        if (!clockElement) return;
        const now = new Date();
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        clockElement.textContent = now.toLocaleDateString("en-US", options);
    }

    if (clockElement) {
        updateClock();
        setInterval(updateClock, 1000);
    }
});