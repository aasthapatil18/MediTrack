/* =========================================================
   MediTrack - JavaScript
   Frontend only
   Uses localStorage for data storage
   ========================================================= */


/* =========================================================
   1. DATA
   ========================================================= */

// Dummy medicines used when the application is opened for
// the first time.
const defaultMedicines = [
    {
        id: "med-1",
        name: "Paracetamol",
        manufacturer: "Cipla Ltd.",
        genericName: "Paracetamol",
        strength: "650 mg",
        form: "Tablet",
        manufacturingDate: "2025-04",
        expiryDate: "2027-04",
        quantity: 120,
        batchNumber: "PCM650A24",
        storageCondition: "Store in a cool, dry place",
        uses: "Used for relieving pain and reducing fever.",
        precautions: "Use according to recommended dosage.",
        sideEffects: "Nausea, stomach discomfort in some cases."
    },
    {
        id: "med-2",
        name: "Azithromycin",
        manufacturer: "Sun Pharma",
        genericName: "Azithromycin",
        strength: "500 mg",
        form: "Tablet",
        manufacturingDate: "2025-06",
        expiryDate: "2026-11",
        quantity: 40,
        batchNumber: "AZ500B25",
        storageCondition: "Store below recommended room temperature.",
        uses: "Used for certain bacterial infections.",
        precautions: "Take only as directed by a healthcare professional.",
        sideEffects: "Nausea, diarrhea or stomach discomfort."
    },
    {
        id: "med-3",
        name: "Cetirizine",
        manufacturer: "Dr. Reddy's",
        genericName: "Cetirizine",
        strength: "10 mg",
        form: "Tablet",
        manufacturingDate: "2025-02",
        expiryDate: "2026-10",
        quantity: 60,
        batchNumber: "CTZ10C25",
        storageCondition: "Store in a dry place.",
        uses: "Used for allergy symptoms.",
        precautions: "May cause drowsiness in some people.",
        sideEffects: "Drowsiness, dry mouth."
    },
    {
        id: "med-4",
        name: "Cough Syrup",
        manufacturer: "Mankind Pharma",
        genericName: "Cough Relief Syrup",
        strength: "100 ml",
        form: "Syrup",
        manufacturingDate: "2025-08",
        expiryDate: "2027-08",
        quantity: 15,
        batchNumber: "CS100D25",
        storageCondition: "Store in a cool, dry place.",
        uses: "Used for temporary relief from cough symptoms.",
        precautions: "Use the measuring cup provided.",
        sideEffects: "Mild drowsiness or stomach discomfort."
    }
];

const defaultReminders = [
    {
        id: "rem-1",
        medicineId: "med-1",
        date: getTodayDate(),
        time: "09:00",
        ampm: "AM",
        type: "Medicine",
        active: true
    },
    {
        id: "rem-2",
        medicineId: "med-2",
        date: getTodayDate(),
        time: "02:30",
        ampm: "PM",
        type: "Medicine",
        active: true
    }
];

const defaultProfile = {
    name: "",
    age: "",
    gender: "",
    location: ""
};

let medicines = [];
let reminders = [];
let profile = {};

let editingMedicineId = null;
let editingReminderId = null;

/* =========================================================
   2. INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", async function () {
    await loadData();
    setupNavigation();
    setupMedicineEvents();
    setupReminderEvents();
    setupProfileEvents();
    setupModalEvents();
    setupDashboardLinks();
    setupMobileMenu();

    updateCurrentDate();
    renderAll();

    // Set the initial date for the reminder form.
    const reminderDate = document.getElementById("reminderDate");

    if (reminderDate) {
        reminderDate.value = getTodayDate();
    }
});


/* =========================================================
   3. LOCAL STORAGE
   ========================================================= */

    /* =========================================================
   3. LOCAL STORAGE
   ========================================================= */

async function loadData() {
    const storedReminders = localStorage.getItem("meditrack_reminders");
    const storedProfile = localStorage.getItem("meditrack_profile");

    try {
        const response = await fetch("http://127.0.0.1:5000/medicines");

        if (!response.ok) {
            throw new Error("Backend returned " + response.status);
        }

        const data = await response.json();

        medicines = data.map(function (item) {
            return {
                id: String(item.id),
                name: item.medicine_name || "",
                manufacturer: item.manufacturer || "",
                genericName: item.generic_name || "",
                strength: item.strength || "",
                form: item.medicine_form || "",
                manufacturingDate: item.manufacture_date
                    ? String(item.manufacture_date).substring(0, 7)
                    : "",
                expiryDate: item.expiry_date
                    ? String(item.expiry_date).substring(0, 7)
                    : "",
                quantity: item.quantity ?? 0,
                batchNumber: item.batch_number || "",
                storageCondition: item.storage_condition || "",
                uses: item.uses || "",
                precautions: item.precautions || "",
                sideEffects: item.side_effects || ""
            };
        });

    } catch (error) {
        console.error("Could not load medicines from backend:", error);
        medicines = [];
        showToast("Could not connect to MediTrack backend.");
    }

        // Load reminders from MySQL backend.
    try {
        const reminderResponse =
            await fetch("http://127.0.0.1:5000/reminders");

        if (!reminderResponse.ok) {
            throw new Error(
                "Backend returned " + reminderResponse.status
            );
        }

        const reminderData =
            await reminderResponse.json();

        reminders = reminderData.map(function (item) {

            let time = item.reminder_time || "00:00";

            // Convert MySQL 24-hour time to 12-hour time.
            const timeParts = time.split(":");

            let hour = Number(timeParts[0]);
            const minute = timeParts[1] || "00";

            const ampm = hour >= 12 ? "PM" : "AM";

            hour = hour % 12;

            if (hour === 0) {
                hour = 12;
            }

            time =
                String(hour).padStart(2, "0") +
                ":" +
                minute;

            return {
                id: String(item.id),
                medicineId: String(item.medicine_id),
                date: item.reminder_date || "",
                time: time,
                ampm: ampm,
                type: item.reminder_type || "Medicine",
                dosage: item.dosage || "",
                frequency: item.frequency || "Daily",
                notes: item.notes || "",
                status:
                    item.status &&
                    item.status.toLowerCase() === "taken"
                        ? "taken"
                        : "pending",
                takenAt: item.taken_at || null,
                active: Boolean(item.active)
            };
        });

        // Keep a local copy as a backup/cache.
        saveReminders();

    } catch (error) {

        console.error(
            "Could not load reminders from backend:",
            error
        );

        // Temporary fallback to existing local reminders.
        if (storedReminders) {
            try {
                reminders =
                    JSON.parse(storedReminders);
            } catch (parseError) {
                reminders = [];
            }
        } else {
            reminders = [];
        }
    }
    if (storedProfile) {
        try {
            profile = JSON.parse(storedProfile);
        } catch (error) {
            profile = { ...defaultProfile };
        }
    } else {
        profile = { ...defaultProfile };
    }

    saveMedicines();
    saveReminders();
    saveProfile();
}

function saveMedicines() {
    localStorage.setItem(
        "meditrack_medicines",
        JSON.stringify(medicines)
    );
}

function saveReminders() {
    localStorage.setItem(
        "meditrack_reminders",
        JSON.stringify(reminders)
    );
}

function saveProfile() {
    localStorage.setItem(
        "meditrack_profile",
        JSON.stringify(profile)
    );
}


/* =========================================================
   4. NAVIGATION
   ========================================================= */

function setupNavigation() {
    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(function (item) {
        item.addEventListener("click", function () {
            const pageName = item.dataset.page;
            showPage(pageName);
        });
    });
}

function showPage(pageName) {
    const pages = document.querySelectorAll(".page");
    const navItems = document.querySelectorAll(".nav-item");

    pages.forEach(function (page) {
        page.classList.remove("active");
    });

    navItems.forEach(function (item) {
        item.classList.remove("active");
    });

    const selectedPage = document.getElementById(pageName + "Page");
    const selectedNav = document.querySelector(
        '.nav-item[data-page="' + pageName + '"]'
    );

    if (selectedPage) {
        selectedPage.classList.add("active");
    }

    if (selectedNav) {
        selectedNav.classList.add("active");
    }

    const pageLabels = {
        dashboard: "Dashboard",
        medicines: "Medicines",
        reminders: "Reminders",
        alerts: "Expiry Alerts",
        reports: "Reports",
        profile: "Profile"
    };

    document.getElementById("currentPageLabel").textContent =
        pageLabels[pageName] || "Dashboard";

    // Close mobile navigation after selecting a page.
    const sidebar = document.getElementById("sidebar");

    if (sidebar) {
        sidebar.classList.remove("mobile-open");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function setupDashboardLinks() {
    const pageLinks = document.querySelectorAll("[data-page-link]");

    pageLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            showPage(link.dataset.pageLink);
        });
    });
}


/* =========================================================
   5. MOBILE MENU
   ========================================================= */

function setupMobileMenu() {
    const mobileMenu = document.getElementById("mobileMenu");
    const sidebar = document.getElementById("sidebar");

    mobileMenu.addEventListener("click", function () {
        sidebar.classList.toggle("mobile-open");
    });

    document.addEventListener("click", function (event) {
        if (window.innerWidth > 760) {
            return;
        }

        if (
            !sidebar.contains(event.target) &&
            !mobileMenu.contains(event.target)
        ) {
            sidebar.classList.remove("mobile-open");
        }
    });
}


/* =========================================================
   6. MEDICINES
   ========================================================= */

function setupMedicineEvents() {
    document
        .getElementById("addMedicineBtn")
        .addEventListener("click", function () {
            openAddMedicineModal();
        });

    document
        .getElementById("dashboardAddMedicine")
        .addEventListener("click", function () {
            openAddMedicineModal();
        });

    document
        .getElementById("scanMedicineBtn")
        .addEventListener("click", function () {
            openModal("scanModal");
        });

    document
        .getElementById("medicineSearch")
        .addEventListener("input", function () {
            renderMedicineTable();
        });

    document
        .getElementById("medicineSort")
        .addEventListener("change", function () {
            renderMedicineTable();
        });

    document
        .getElementById("medicineForm")
        .addEventListener("submit", function (event) {
            event.preventDefault();
            saveMedicineFromForm();
        });

    document
        .getElementById("medicineTableBody")
        .addEventListener("click", function (event) {
            const editButton = event.target.closest("[data-edit-id]");
            const deleteButton = event.target.closest("[data-delete-id]");

            if (editButton) {
                editMedicine(editButton.dataset.editId);
            }

            if (deleteButton) {
                deleteMedicine(deleteButton.dataset.deleteId);
            }
        });
}

function openAddMedicineModal() {
    editingMedicineId = null;

    clearMedicineForm();

    document.getElementById("medicineModalTitle").textContent =
        "Add Medicine";

    document.getElementById("medicineSubmitBtn").textContent =
        "Add Medicine";

    openModal("medicineModal");
}

function clearMedicineForm() {
    const form = document.getElementById("medicineForm");

    form.reset();

    document.getElementById("medicineId").value = "";

    clearValidationErrors();
}

async function saveMedicineFromForm() {
    clearValidationErrors();

    const name = document.getElementById("medicineName").value.trim();
    const manufacturer = document.getElementById("manufacturer").value.trim();
    const genericName = document.getElementById("genericName").value.trim();
    const strength = document.getElementById("strength").value.trim();
    const form = document.getElementById("medicineFormType").value;
    const manufacturingDate =
        document.getElementById("manufacturingDate").value;
    const expiryDate =
        document.getElementById("expiryDate").value;
    const quantityValue =
        document.getElementById("quantity").value;
    const batchNumber =
        document.getElementById("batchNumber").value.trim();
    const storageCondition =
        document.getElementById("storageCondition").value.trim();
    const uses =
        document.getElementById("uses").value.trim();
    const precautions =
        document.getElementById("precautions").value.trim();
    const sideEffects =
        document.getElementById("sideEffects").value.trim();

    let isValid = true;

    if (!name) {
        showFieldError("medicineName", "Medicine name is required.");
        isValid = false;
    }

    if (!manufacturer) {
        showFieldError("manufacturer", "Manufacturer is required.");
        isValid = false;
    }

    if (!strength) {
        showFieldError("strength", "Strength is required.");
        isValid = false;
    }

    if (!form) {
        showFieldError(
            "medicineFormType",
            "Please select the medicine form."
        );
        isValid = false;
    }

    if (!manufacturingDate) {
        showFieldError(
            "manufacturingDate",
            "Manufacturing month and year are required."
        );
        isValid = false;
    }

    if (!expiryDate) {
        showFieldError(
            "expiryDate",
            "Expiry month and year are required."
        );
        isValid = false;
    }

    if (
        manufacturingDate &&
        expiryDate &&
        expiryDate < manufacturingDate
    ) {
        showFieldError(
            "expiryDate",
            "Expiry date cannot be earlier than manufacturing date."
        );
        isValid = false;
    }

    if (
        quantityValue === "" ||
        !Number.isInteger(Number(quantityValue)) ||
        Number(quantityValue) < 0
    ) {
        showFieldError(
            "quantity",
            "Enter a valid quantity."
        );
        isValid = false;
    }

    if (!batchNumber) {
        showFieldError(
            "batchNumber",
            "Batch number is required."
        );
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    const medicineData = {
        medicine_name: name,
        manufacturer: manufacturer,
        generic_name: genericName,
        strength: strength,
        medicine_form: form,
        manufacture_date: manufacturingDate + "-01",
        expiry_date: expiryDate + "-01",
        quantity: Number(quantityValue),
        batch_number: batchNumber,
        storage_condition: storageCondition,
        uses: uses,
        precautions: precautions,
        side_effects: sideEffects
    };

    try {
        let response;

        if (editingMedicineId) {
            response = await fetch(
                "http://127.0.0.1:5000/medicines/" + editingMedicineId,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(medicineData)
                }
            );
        } else {
            response = await fetch(
                "http://127.0.0.1:5000/medicines",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(medicineData)
                }
            );
        }

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.error || "Failed to save medicine."
            );
        }

        if (editingMedicineId) {
            showToast("Medicine updated successfully.");
        } else {
            showToast("Medicine added successfully.");
        }

        closeModal("medicineModal");

        await loadData();

        renderAll();

    } catch (error) {
        console.error("Error saving medicine:", error);

        showToast(
            "Could not save medicine to the database."
        );
    }
}


function editMedicine(id) {
    const medicine = medicines.find(function (item) {
        return item.id === id;
    });

    if (!medicine) {
        return;
    }

    editingMedicineId = id;

    document.getElementById("medicineId").value = medicine.id;
    document.getElementById("medicineName").value = medicine.name || "";
    document.getElementById("manufacturer").value =
        medicine.manufacturer || "";
    document.getElementById("genericName").value =
        medicine.genericName || "";
    document.getElementById("strength").value =
        medicine.strength || "";
    document.getElementById("medicineFormType").value =
        medicine.form || "";
    document.getElementById("manufacturingDate").value =
        medicine.manufacturingDate || "";
    document.getElementById("expiryDate").value =
        medicine.expiryDate || "";
    document.getElementById("quantity").value =
        medicine.quantity ?? "";
    document.getElementById("batchNumber").value =
        medicine.batchNumber || "";
    document.getElementById("storageCondition").value =
        medicine.storageCondition || "";
    document.getElementById("uses").value =
        medicine.uses || "";
    document.getElementById("precautions").value =
        medicine.precautions || "";
    document.getElementById("sideEffects").value =
        medicine.sideEffects || "";

    clearValidationErrors();

    document.getElementById("medicineModalTitle").textContent =
        "Edit Medicine";

    document.getElementById("medicineSubmitBtn").textContent =
        "Update Medicine";

    openModal("medicineModal");
}

async function deleteMedicine(id) {
    const medicine = medicines.find(function (item) {
        return item.id === id;
    });

    if (!medicine) {
        return;
    }

    const confirmed = window.confirm(
        "Are you sure you want to delete this medicine?"
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(
            "http://127.0.0.1:5000/medicines/" + id,
            {
                method: "DELETE"
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.error || "Failed to delete medicine."
            );
        }

        // Remove the medicine from the current website data.
        medicines = medicines.filter(function (item) {
            return item.id !== id;
        });

        // Remove reminders belonging to the deleted medicine.
        reminders = reminders.filter(function (reminder) {
            return reminder.medicineId !== id;
        });

        saveReminders();

        renderAll();

        showToast("Medicine deleted successfully.");

    } catch (error) {
        console.error("Error deleting medicine:", error);

        showToast(
            "Could not delete medicine from the database."
        );
    }
}

/* =========================================================
   7. SEARCH AND SORT
   ========================================================= */

function getFilteredAndSortedMedicines() {
    const searchValue = document
        .getElementById("medicineSearch")
        .value
        .trim()
        .toLowerCase();

    const sortValue = document.getElementById("medicineSort").value;

    let filtered = medicines.filter(function (medicine) {
        const name = (medicine.name || "").toLowerCase();
        const manufacturer =
            (medicine.manufacturer || "").toLowerCase();
        const batch =
            (medicine.batchNumber || "").toLowerCase();

        return (
            name.includes(searchValue) ||
            manufacturer.includes(searchValue) ||
            batch.includes(searchValue)
        );
    });

    filtered.sort(function (a, b) {
        if (sortValue === "name-asc") {
            return a.name.localeCompare(b.name);
        }

        if (sortValue === "name-desc") {
            return b.name.localeCompare(a.name);
        }

        if (sortValue === "expiry-asc") {
            return a.expiryDate.localeCompare(b.expiryDate);
        }

        if (sortValue === "expiry-desc") {
            return b.expiryDate.localeCompare(a.expiryDate);
        }

        if (sortValue === "quantity-asc") {
            return Number(a.quantity) - Number(b.quantity);
        }

        if (sortValue === "quantity-desc") {
            return Number(b.quantity) - Number(a.quantity);
        }

        if (sortValue === "status") {
            const statusOrder = {
                "Expired": 1,
                "Expiring Soon": 2,
                "Safe": 3
            };

            return (
                statusOrder[getMedicineStatus(a.expiryDate)] -
                statusOrder[getMedicineStatus(b.expiryDate)]
            );
        }

        return 0;
    });

    return filtered;
}


/* =========================================================
   8. MEDICINE STATUS
   ========================================================= */

function getMedicineStatus(expiryDate) {
    if (!expiryDate) {
        return "Safe";
    }

    const [year, month] = expiryDate.split("-").map(Number);

    // Expiry is based on month/year only.
    // The expiry month is treated as valid through the end
    // of that month.
    const expiryEnd = new Date(
        year,
        month,
        0,
        23,
        59,
        59
    );

    const today = new Date();

    if (today > expiryEnd) {
        return "Expired";
    }

    // Three-month warning period.
    const warningDate = new Date(
        today.getFullYear(),
        today.getMonth() + 3,
        1
    );

    const expiryStart = new Date(
        year,
        month - 1,
        1
    );

    if (expiryStart <= warningDate) {
        return "Expiring Soon";
    }

    return "Safe";
}

function getStatusClass(status) {
    if (status === "Expired") {
        return "status-expired";
    }

    if (status === "Expiring Soon") {
        return "status-soon";
    }

    return "status-safe";
}

function getStatusIcon(status) {
    if (status === "Expired") {
        return "×";
    }

    if (status === "Expiring Soon") {
        return "!";
    }

    return "✓";
}


/* =========================================================
   9. MEDICINE TABLE
   ========================================================= */

function renderMedicineTable() {
    const tableBody = document.getElementById("medicineTableBody");
    const emptyState = document.getElementById("medicineEmpty");

    const filteredMedicines = getFilteredAndSortedMedicines();

    tableBody.innerHTML = "";

    if (filteredMedicines.length === 0) {
        emptyState.classList.remove("hidden");
        return;
    }

    emptyState.classList.add("hidden");

    filteredMedicines.forEach(function (medicine) {
        const status = getMedicineStatus(medicine.expiryDate);

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <div class="medicine-cell">
                    <div class="medicine-avatar">
                        ${escapeHtml(getInitial(medicine.name))}
                    </div>
                    <div>
                        <div class="medicine-name">
                            ${escapeHtml(medicine.name)}
                        </div>
                        <span class="medicine-strength">
                            ${escapeHtml(medicine.strength)}
                        </span>
                    </div>
                </div>
            </td>

            <td>${escapeHtml(medicine.manufacturer)}</td>

            <td>${escapeHtml(medicine.batchNumber)}</td>

            <td>${formatMonthYear(medicine.manufacturingDate)}</td>

            <td>${formatMonthYear(medicine.expiryDate)}</td>

            <td>${escapeHtml(String(medicine.quantity))}</td>

            <td>
                <span class="status-badge ${getStatusClass(status)}">
                    ${getStatusIcon(status)}
                    ${status}
                </span>
            </td>

            <td>
                <div class="action-buttons">
                    <button
                        class="action-btn edit"
                        data-edit-id="${medicine.id}"
                    >
                        Edit
                    </button>

                    <button
                        class="action-btn delete"
                        data-delete-id="${medicine.id}"
                    >
                        Delete
                    </button>
                </div>
            </td>
        `;

        tableBody.appendChild(row);
    });
}


/* =========================================================
   10. REMINDERS
   ========================================================= */

function setupReminderEvents() {
    document
        .getElementById("addReminderBtn")
        .addEventListener("click", function () {
            openAddReminderModal();
        });

    document
        .getElementById("reminderForm")
        .addEventListener("submit", function (event) {
            event.preventDefault();
            saveReminderFromForm();
        });

    document
        .getElementById("remindersList")
        .addEventListener("click", function (event) {


            const deleteButton =
                event.target.closest("[data-delete-reminder]");

            if (deleteButton) {
                deleteReminder(
                    deleteButton.dataset.deleteReminder
                );
                return;
            }

            const takeButton =
                event.target.closest("[data-take-reminder]");

            if (takeButton) {
                markReminderAsTaken(
                    takeButton.dataset.takeReminder
                );
            }
        });
}

function openAddReminderModal() {
    editingReminderId = null;
    const form = document.getElementById("reminderForm");

    form.reset();

    clearReminderErrors();

    document.getElementById("reminderDate").value =
        getTodayDate();

    document.getElementById("reminderAmPm").value = "AM";

    populateReminderMedicineOptions();

    openModal("reminderModal");
}

function populateReminderMedicineOptions() {
    const select = document.getElementById("reminderMedicine");

    select.innerHTML = `
        <option value="">Select Medicine</option>
    `;

    medicines.forEach(function (medicine) {
        const option = document.createElement("option");

        option.value = medicine.id;
        option.textContent = medicine.name;

        select.appendChild(option);
    });
}

async function saveReminderFromForm() {

    clearReminderErrors();

    const medicineId =
        document.getElementById("reminderMedicine").value;

    const date =
        document.getElementById("reminderDate").value;

    const time =
        document.getElementById("reminderTime").value.trim();

    const ampm =
        document.getElementById("reminderAmPm").value;

    const type =
        document.getElementById("reminderType").value;

    let valid = true;

    if (!medicineId) {
        showReminderError(
            "reminderMedicine",
            "Please select a medicine."
        );
        valid = false;
    }

    if (!date) {
        showReminderError(
            "reminderDate",
            "Reminder date is required."
        );
        valid = false;
    }

    if (!isValidTime(time)) {
        showReminderError(
            "reminderTime",
            "Enter a valid time such as 09:00 or 02:30."
        );
        valid = false;
    }

    if (!valid) {
        return;
    }

    // Convert 12-hour time to MySQL 24-hour time.
    const timeParts = time.split(":");

    let hour = Number(timeParts[0]);
    const minute = timeParts[1];

    if (ampm === "PM" && hour !== 12) {
        hour += 12;
    }

    if (ampm === "AM" && hour === 12) {
        hour = 0;
    }

    const mysqlTime =
        String(hour).padStart(2, "0") +
        ":" +
        minute +
        ":00";

    const reminderData = {
        medicine_id: Number(medicineId),
        reminder_date: date,
        reminder_time: mysqlTime,
        reminder_type: type,
        dosage: "",
        frequency: "Daily",
        notes: "",
        status: "pending",
        active: true
    };

    if (editingReminderId) {
    reminderData.status =
        reminders.find(function (item) {
            return item.id === editingReminderId;
        })?.status || "pending";

    reminderData.taken_at =
        reminders.find(function (item) {
            return item.id === editingReminderId;
        })?.takenAt || null;

    reminderData.active =
        reminders.find(function (item) {
            return item.id === editingReminderId;
        })?.active ?? true;
}

    try {

        let response;

if (editingReminderId) {

    response = await fetch(
        `http://127.0.0.1:5000/reminders/${editingReminderId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reminderData)
        }
    );

} else {

    response = await fetch(
        "http://127.0.0.1:5000/reminders",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reminderData)
        }
    );
}
        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.error ||
                "Failed to save reminder."
            );
        }

        closeModal("reminderModal");

        // Reload reminders from MySQL.
        await loadData();

        renderAll();

        if (editingReminderId) {
    showToast("Reminder updated successfully.");
} else {
    showToast("Reminder added successfully.");
}

editingReminderId = null;

    } catch (error) {

        console.error(
            "Error saving reminder:",
            error
        );

        showToast(
            "Could not save reminder to the database."
        );
    }
}
function deleteReminder(id) {
    const confirmed = window.confirm(
        "Are you sure you want to delete this reminder?"
    );

    if (!confirmed) {
        return;
    }

    reminders = reminders.filter(function (reminder) {
        return reminder.id !== id;
    });

    saveReminders();

    renderAll();

    showToast("Reminder deleted successfully.");
}

async function markReminderAsTaken(id) {
    const reminder = reminders.find(function (item) {
        return item.id === id;
    });

    if (!reminder) {
        return;
    }

    const now = new Date();

const takenAt =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0") +
    " " +
    String(now.getHours()).padStart(2, "0") +
    ":" +
    String(now.getMinutes()).padStart(2, "0") +
    ":" +
    String(now.getSeconds()).padStart(2, "0");

    try {
        const response = await fetch(
            `http://127.0.0.1:5000/reminders/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    medicine_id: Number(reminder.medicineId),
                    reminder_date: reminder.date,
                    reminder_time: (() => {
    let time = reminder.time;
    let ampm = reminder.ampm;

    if (!time) {
        return "00:00:00";
    }

    let parts = time.split(":");
    let hours = parseInt(parts[0], 10);
    let minutes = parts[1] || "00";

    if (ampm === "PM" && hours !== 12) {
        hours += 12;
    }

    if (ampm === "AM" && hours === 12) {
        hours = 0;
    }

    return `${String(hours).padStart(2, "0")}:${minutes}:00`;
})(),
                   
                    reminder_type: reminder.type,
                    dosage: reminder.dosage || "",
                    frequency: reminder.frequency || "Daily",
                    notes: reminder.notes || "",
                    status: "taken",
                    taken_at: takenAt,
                    active: false
                })
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update reminder");
        }

        await loadData();

        renderAll();

        showToast("Medicine marked as taken.");

    } catch (error) {
        console.error("Error marking reminder as taken:", error);

        showToast("Could not update reminder.");
    }
}

function renderReminders() {

    const container =
        document.getElementById("remindersList");

    const emptyState =
        document.getElementById("remindersEmpty");

    container.innerHTML = "";

    const sortedReminders = [...reminders].sort(
        function (a, b) {

            const first =
                a.date + " " + a.time;

            const second =
                b.date + " " + b.time;

            return first.localeCompare(second);
        }
    );

    if (sortedReminders.length === 0) {

        emptyState.classList.remove("hidden");

        return;
    }

    emptyState.classList.add("hidden");

    sortedReminders.forEach(function (reminder) {

        const medicine = medicines.find(
            function (item) {
                return item.id === reminder.medicineId;
            }
        );

        const medicineName = medicine
            ? medicine.name
            : "Unknown Medicine";

        const isTaken =
            reminder.status === "taken" ||
            reminder.active === false;

        let takenTime = "";

        if (reminder.takenAt) {

            const takenDate =
                new Date(reminder.takenAt);

            takenTime =
                takenDate.toLocaleTimeString(
                    "en-IN",
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );
        }

        const card =
            document.createElement("div");

        card.className = "reminder-card";

        card.innerHTML = `

            <div class="reminder-top">

                <div class="reminder-icon">
                    ${isTaken ? "✓" : "◷"}
                </div>

                <span class="reminder-status">
                    ${isTaken ? "Taken" : "Pending"}
                </span>

            </div>

            <h3>
                ${escapeHtml(medicineName)}
            </h3>

            <p class="reminder-type">
                ${escapeHtml(reminder.type)} reminder
            </p>

            <div class="reminder-details">

                <div class="reminder-detail">

                    <span>Date</span>

                    <strong>
                        ${formatDate(reminder.date)}
                    </strong>

                </div>

                <div class="reminder-detail">

                    <span>Time</span>

                    <strong>
                        ${escapeHtml(reminder.time)}
                        ${escapeHtml(reminder.ampm)}
                    </strong>

                </div>

            </div>

            ${
                isTaken
                    ? `
                        <div class="reminder-taken-time">
                            ✓ Taken
                            ${takenTime ? "at " + takenTime : ""}
                        </div>
                    `
                    : `
                        <button
                            class="take-reminder"
                            data-take-reminder="${reminder.id}"
                        >
                            ✓ Mark as Taken
                        </button>
                    `
            }

            

            <button
                class="delete-reminder"
                data-delete-reminder="${reminder.id}"
            >
                Delete Reminder
            </button>

        `;

        container.appendChild(card);
    });
}



/* =========================================================
   11. EXPIRY ALERTS
   ========================================================= */

function renderExpiryAlerts() {
    const expired = medicines.filter(function (medicine) {
        return getMedicineStatus(medicine.expiryDate) === "Expired";
    });

    const expiringSoon = medicines.filter(function (medicine) {
        return getMedicineStatus(medicine.expiryDate) === "Expiring Soon";
    });

    document.getElementById("alertExpiredCount").textContent =
        expired.length;

    document.getElementById("alertSoonCount").textContent =
        expiringSoon.length;

    renderAlertTable(
        "expiredTableBody",
        "expiredEmpty",
        expired
    );

    renderAlertTable(
        "soonTableBody",
        "soonEmpty",
        expiringSoon
    );
}

function renderAlertTable(tableId, emptyId, medicineList) {
    const body = document.getElementById(tableId);
    const empty = document.getElementById(emptyId);

    body.innerHTML = "";

    if (medicineList.length === 0) {
        empty.classList.remove("hidden");
        return;
    }

    empty.classList.add("hidden");

    medicineList.forEach(function (medicine) {
        const status = getMedicineStatus(medicine.expiryDate);

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <strong>${escapeHtml(medicine.name)}</strong>
            </td>

            <td>${escapeHtml(medicine.batchNumber)}</td>

            <td>${formatMonthYear(medicine.expiryDate)}</td>

            <td>
                <span class="status-badge ${getStatusClass(status)}">
                    ${getStatusIcon(status)}
                    ${status}
                </span>
            </td>
        `;

        body.appendChild(row);
    });
}


/* =========================================================
   12. DASHBOARD
   ========================================================= */

function renderDashboard() {
    const total = medicines.length;

    const expiringSoon = medicines.filter(function (medicine) {
        return getMedicineStatus(medicine.expiryDate) ===
            "Expiring Soon";
    }).length;

    const expired = medicines.filter(function (medicine) {
        return getMedicineStatus(medicine.expiryDate) ===
            "Expired";
    }).length;

    const activeReminders = reminders.filter(function (reminder) {
        return reminder.active;
    }).length;

    document.getElementById("totalMedicines").textContent =
        total;

    document.getElementById("expiringSoon").textContent =
        expiringSoon;

    document.getElementById("expiredMedicines").textContent =
        expired;

    document.getElementById("activeReminders").textContent =
        activeReminders;

    renderTodaySchedule();
    renderDashboardAlerts();
}

function renderTodaySchedule() {
    const container =
        document.getElementById("todaySchedule");

    container.innerHTML = "";

    const today = getTodayDate();

    const todayReminders = reminders
        .filter(function (reminder) {
            return reminder.date === today &&
                reminder.active;
        })
        .sort(function (a, b) {
            return a.time.localeCompare(b.time);
        });

    if (todayReminders.length === 0) {
        container.innerHTML = `
            <div class="empty-state small-empty">
                <div class="empty-icon">◷</div>
                <h3>No medicines scheduled today</h3>
                <p>Your medicine schedule is clear for today.</p>
            </div>
        `;

        return;
    }

    todayReminders.forEach(function (reminder) {
        const medicine = medicines.find(function (item) {
            return item.id === reminder.medicineId;
        });

        if (!medicine) {
            return;
        }

        const item = document.createElement("div");

        item.className = "schedule-item";

        item.innerHTML = `
            <div class="schedule-left">
                <div class="schedule-icon">✚</div>

                <div>
                    <strong>${escapeHtml(medicine.name)}</strong>
                    <small>${escapeHtml(reminder.type)} reminder</small>
                </div>
            </div>

            <span class="schedule-time">
                ${escapeHtml(reminder.time)}
                ${escapeHtml(reminder.ampm)}
            </span>
        `;

        container.appendChild(item);
    });
}

function renderDashboardAlerts() {
    const container =
        document.getElementById("dashboardAlerts");

    container.innerHTML = "";

    const alerts = medicines.filter(function (medicine) {
        const status = getMedicineStatus(medicine.expiryDate);

        return status === "Expired" ||
            status === "Expiring Soon";
    });

    if (alerts.length === 0) {
        container.innerHTML = `
            <div class="empty-state small-empty">
                <div class="empty-icon">✓</div>
                <h3>No expiry alerts</h3>
                <p>All medicines are currently within their safe period.</p>
            </div>
        `;

        return;
    }

    alerts
        .sort(function (a, b) {
            return a.expiryDate.localeCompare(b.expiryDate);
        })
        .slice(0, 5)
        .forEach(function (medicine) {
            const status = getMedicineStatus(medicine.expiryDate);

            const item = document.createElement("div");

            item.className = "dashboard-alert-item";

            item.innerHTML = `
                <span class="alert-dot ${
                    status === "Expired"
                        ? "danger"
                        : "warning"
                }"></span>

                <div>
                    <strong>${escapeHtml(medicine.name)}</strong>
                    <small>
                        Expires ${formatMonthYear(medicine.expiryDate)}
                    </small>
                </div>

                <span class="status-badge ${getStatusClass(status)}">
                    ${status}
                </span>
            `;

            container.appendChild(item);
        });
}


/* =========================================================
   13. REPORTS
   ========================================================= */

function renderReports() {
    const safe = medicines.filter(function (medicine) {
        return getMedicineStatus(medicine.expiryDate) === "Safe";
    }).length;

    const soon = medicines.filter(function (medicine) {
        return getMedicineStatus(medicine.expiryDate) ===
            "Expiring Soon";
    }).length;

    const expired = medicines.filter(function (medicine) {
        return getMedicineStatus(medicine.expiryDate) ===
            "Expired";
    }).length;

    document.getElementById("reportTotal").textContent =
        medicines.length;

    document.getElementById("reportSafe").textContent =
        safe;

    document.getElementById("reportSoon").textContent =
        soon;

    document.getElementById("reportExpired").textContent =
        expired;

    const body =
        document.getElementById("reportTableBody");

    body.innerHTML = "";

    medicines.forEach(function (medicine) {
        const status = getMedicineStatus(medicine.expiryDate);

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHtml(medicine.name)}</td>
            <td>${escapeHtml(medicine.manufacturer)}</td>
            <td>${escapeHtml(medicine.batchNumber)}</td>
            <td>${formatMonthYear(medicine.manufacturingDate)}</td>
            <td>${formatMonthYear(medicine.expiryDate)}</td>
            <td>${escapeHtml(String(medicine.quantity))}</td>
            <td>
                <span class="status-badge ${getStatusClass(status)}">
                    ${getStatusIcon(status)}
                    ${status}
                </span>
            </td>
        `;

        body.appendChild(row);
    });
}

document
    .getElementById("printReportBtn")
    .addEventListener("click", function () {
        window.print();
    });


/* =========================================================
   14. PROFILE
   ========================================================= */

function setupProfileEvents() {
    document
        .getElementById("profileForm")
        .addEventListener("submit", function (event) {
            event.preventDefault();
            saveProfileFromForm();
        });
}

function loadProfileIntoForm() {
    document.getElementById("profileName").value =
        profile.name || "";

    document.getElementById("profileAge").value =
        profile.age || "";

    document.getElementById("profileGender").value =
        profile.gender || "";

    document.getElementById("profileLocation").value =
        profile.location || "";

    updateProfileDisplay();
}

function saveProfileFromForm() {
    profile = {
        name: document
            .getElementById("profileName")
            .value
            .trim(),

        age: document
            .getElementById("profileAge")
            .value,

        gender: document
            .getElementById("profileGender")
            .value,

        location: document
            .getElementById("profileLocation")
            .value
            .trim()
    };

    saveProfile();
    updateProfileDisplay();

    const message =
        document.getElementById("profileMessage");

    message.classList.remove("hidden");

    setTimeout(function () {
        message.classList.add("hidden");
    }, 3000);

    showToast("Profile saved successfully.");
}

function updateProfileDisplay() {
    const name = profile.name || "User";

    document.getElementById("profileDisplayName").textContent =
        name;

    document.getElementById("profileInitial").textContent =
        getInitial(name);

    document.querySelector(".profile-mini").textContent =
        getInitial(name);
}


/* =========================================================
   15. MODALS
   ========================================================= */

function setupModalEvents() {

    // Close buttons.
    document.querySelectorAll("[data-close-modal]")
        .forEach(function (button) {
            button.addEventListener("click", function () {
                closeModal(button.dataset.closeModal);
            });
        });

    // Clicking the dark background closes the modal.
    document.querySelectorAll(".modal-overlay")
        .forEach(function (overlay) {
            overlay.addEventListener("click", function (event) {
                if (event.target === overlay) {
                    closeModal(overlay.id);
                }
            });
        });

    // Escape key closes open modal.
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            const openModalElement =
                document.querySelector(".modal-overlay.active");

            if (openModalElement) {
                closeModal(openModalElement.id);
            }
        }
    });
}

function openModal(id) {
    const modal = document.getElementById(id);

    if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);

    if (modal) {
        modal.classList.remove("active");
    }

    const anyOpenModal =
        document.querySelector(".modal-overlay.active");

    if (!anyOpenModal) {
        document.body.style.overflow = "";
    }
}


/* =========================================================
   16. FORM VALIDATION HELPERS
   ========================================================= */

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + "Error");

    if (field) {
        field.classList.add("error");
    }

    if (error) {
        error.textContent = message;
    }
}

function clearValidationErrors() {
    const fields = [
        "medicineName",
        "manufacturer",
        "strength",
        "medicineFormType",
        "manufacturingDate",
        "expiryDate",
        "quantity",
        "batchNumber"
    ];

    fields.forEach(function (fieldId) {
        const field = document.getElementById(fieldId);
        const error = document.getElementById(fieldId + "Error");

        if (field) {
            field.classList.remove("error");
        }

        if (error) {
            error.textContent = "";
        }
    });
}

function showReminderError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + "Error");

    if (field) {
        field.classList.add("error");
    }

    if (error) {
        error.textContent = message;
    }
}

function clearReminderErrors() {
    const fields = [
        "reminderMedicine",
        "reminderDate",
        "reminderTime"
    ];

    fields.forEach(function (fieldId) {
        const field = document.getElementById(fieldId);
        const error = document.getElementById(fieldId + "Error");

        if (field) {
            field.classList.remove("error");
        }

        if (error) {
            error.textContent = "";
        }
    });
}


/* =========================================================
   17. RENDER EVERYTHING
   ========================================================= */

function renderAll() {
    renderMedicineTable();
    renderReminders();
    renderExpiryAlerts();
    renderDashboard();
    renderReports();
    loadProfileIntoForm();
}


/* =========================================================
   18. DATE AND TIME HELPERS
   ========================================================= */

function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function updateCurrentDate() {
    const dateElement =
        document.getElementById("currentDate");

    const today = new Date();

    dateElement.textContent =
        today.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
}

function formatMonthYear(value) {
    if (!value) {
        return "-";
    }

    const parts = value.split("-");

    if (parts.length !== 2) {
        return value;
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]);

    const date = new Date(
        year,
        month - 1,
        1
    );

    return date.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric"
    });
}

function formatDate(value) {
    if (!value) {
        return "-";
    }

    const parts = value.split("-");

    if (parts.length !== 3) {
        return value;
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    const date = new Date(
        year,
        month - 1,
        day
    );

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


/* =========================================================
   19. TIME VALIDATION
   ========================================================= */

function isValidTime(time) {
    if (!/^\d{2}:\d{2}$/.test(time)) {
        return false;
    }

    const parts = time.split(":");

    const hour = Number(parts[0]);
    const minute = Number(parts[1]);

    // User enters 12-hour time.
    if (hour < 1 || hour > 12) {
        return false;
    }

    if (minute < 0 || minute > 59) {
        return false;
    }

    return true;
}

function formatTimeInput(time) {
    const parts = time.split(":");

    let hour = Number(parts[0]);
    const minute = Number(parts[1]);

    return (
        String(hour).padStart(2, "0") +
        ":" +
        String(minute).padStart(2, "0")
    );
}


/* =========================================================
   20. GENERAL HELPERS
   ========================================================= */

function createId(prefix) {
    return (
        prefix +
        "-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 8)
    );
}

function getInitial(name) {
    if (!name) {
        return "U";
    }

    return name
        .trim()
        .charAt(0)
        .toUpperCase();
}

function escapeHtml(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   21. TOAST MESSAGE
   ========================================================= */

let toastTimer = null;

function showToast(message) {
    const toast = document.getElementById("toast");
    const toastMessage =
        document.getElementById("toastMessage");

    toastMessage.textContent = message;

    toast.classList.add("show");

    if (toastTimer) {
        clearTimeout(toastTimer);
    }

    toastTimer = setTimeout(function () {
        toast.classList.remove("show");
    }, 3000);
}