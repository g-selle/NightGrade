// ======================
// DARK / LIGHT MODE
// ====================

const poofSound = new Audio("assets/poof.mp3");

function playPoofSound() {
    poofSound.currentTime = 0;
    poofSound.play();
}

const toggleBtn = document.getElementById("mode-toggle");

if (toggleBtn) {

    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-mode");
        toggleBtn.textContent = "🌙";
    } else {
        toggleBtn.textContent = "☀️";
    }

    toggleBtn.addEventListener("click", () => {

        document.body.classList.toggle("light-mode");

        if (document.body.classList.contains("light-mode")) {
            toggleBtn.textContent = "🌙";
            localStorage.setItem("theme", "light");
        } else {
            toggleBtn.textContent = "☀️";
            localStorage.setItem("theme", "dark");
        }
    });
}


// ==================
// MODAL SYSTEM
// =================

const addBtn = document.querySelector(".add-btn");
const modal = document.getElementById("assessment-modal");
const closeModal = document.getElementById("close-modal");

if (addBtn && modal && closeModal) {

    addBtn.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
}


// ====================
// ADD ASSESSMENT
// ==================

const form = document.getElementById("assessment-form");
const container = document.querySelector(".assessment-container");

if (form && container) {

    function createAssessmentCard(className, assignmentName, dueDate) {

        const card = document.createElement("div");
        card.classList.add("assessment-card");

        card.innerHTML = `
            <button class="delete-btn">✖</button>
            <h3>${className}</h3>
            <p>${assignmentName}</p>
            <p>Due: ${dueDate}</p>

            <label>
                <input type="checkbox" class="complete-check">
                Complete
            </label>
        `;

        container.appendChild(card);

        /* ---------- DELETE BUTTON ---------- */
        const deleteBtn = card.querySelector(".delete-btn");

        deleteBtn.addEventListener("click", () => {
    card.remove();
    updateProgress();
    saveAssessments();
});

        /* ---------- COMPLETE CHECK ---------- */
        const checkbox = card.querySelector(".complete-check");

        checkbox.addEventListener("change", () => {

            card.classList.add("poof");
            playPoofSound();

            setTimeout(() => {
    card.remove();
    updateProgress();
    saveAssessments();
}, 400);
        });
        /* ---------- DUE SOON GLOW ---------- */
        const today = new Date();
        const due = new Date(dueDate);

        const diffDays =
            (due - today) / (1000 * 60 * 60 * 24);

        if (diffDays <= 2 && diffDays >= 0) {
            card.classList.add("due-soon");
        }

        updateProgress();
    }


    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const className =
            document.getElementById("class-name").value;

        const assignmentName =
            document.getElementById("assignment-name").value;

        const dueDate =
            document.getElementById("due-date").value;

        // ✅ ONLY create card here
        createAssessmentCard(
            className,
            assignmentName,
            dueDate
        );

        form.reset();
        modal.style.display = "none";
    });
}


// ===================
// PROGRESS SYSTEM
// ==================

function updateProgress() {

    const cards =
        document.querySelectorAll(".assessment-card");

    const progressText =
        document.getElementById("progress-text");

    if (!progressText) return;

    progressText.textContent =
        `${cards.length} assessments remaining`;
}

// ====================
// SAVE SYSTEM
// ===================

function saveAssessments() {

    const cards =
        document.querySelectorAll(".assessment-card");

    const data = [];

    cards.forEach(card => {

        const title =
            card.querySelector("h3").textContent;

        const assignment =
            card.querySelectorAll("p")[0].textContent;

        const due =
            card.querySelectorAll("p")[1]
                .textContent.replace("Due: ", "");

        data.push({
            title,
            assignment,
            due
        });
    });

    localStorage.setItem(
        "assessments",
        JSON.stringify(data)
    );
}

function loadAssessments() {

    const saved =
        JSON.parse(
            localStorage.getItem("assessments")
        );

    if (!saved) return;

    saved.forEach(item => {
        createAssessmentCard(
            item.title,
            item.assignment,
            item.due
        );
    });}    


loadAssessments();