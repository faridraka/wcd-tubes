// ==========================================================================
// 1. DOM SELECTORS (Connecting HTML Elements to JavaScript)
// ==========================================================================
const menuTableBody = document.querySelector(".menu-table tbody");
const selectedImagesGrid = document.querySelector(".selected-grid");
const totalCaloriesText = document.querySelector(
  ".total-row:nth-child(1) .total-val",
);
const totalPriceText = document.querySelector(
  ".total-row:nth-child(2) .total-val",
);
const balancedMenuAlert = document.querySelector(".alert-box");
const nutritionTags = document.querySelectorAll(".gizi-tag");

// ==========================================================================
// 2. RENDER TABLE FUNCTION (Displaying 26 Items Automatically)
// ==========================================================================
function renderMenuTable() {
  if (!menuTableBody) return;
  menuTableBody.innerHTML = "";

  for (let index = 0; index < menuItems.length; index = index + 1) {
    const currentMenu = menuItems[index];

    // Determine the CSS class name for category badges manually
    let badgeClassName = "";
    if (currentMenu.category === "Pokok") {
      badgeClassName = "pokok";
    } else if (currentMenu.category === "Lauk-Pauk") {
      badgeClassName = "laukpauk";
    } else if (currentMenu.category === "Sayur") {
      badgeClassName = "sayur";
    } else if (currentMenu.category === "Buah") {
      badgeClassName = "buah";
    } else if (currentMenu.category === "Minuman") {
      badgeClassName = "minuman";
    }

    // Handle empty image string protection
    let imageSource = currentMenu.image;
    if (imageSource.trim() === "") {
      imageSource = "https://placehold.co/92";
    }

    // Create a new table row element
    const newTableRow = document.createElement("tr");

    // Fill table row with dynamic menu data
    newTableRow.innerHTML = `
      <td>
        <div class="thumb-placeholder">
          <img src="${imageSource}" alt="${currentMenu.name}" style="width:100%; height:100%; object-fit:cover; border-radius:6px;" onerror="this.src='https://placehold.co/92'">
        </div>
      </td>
      <td><span class="menu-name">${currentMenu.name}</span></td>
      <td><span class="badge badge-${badgeClassName}">${currentMenu.category}</span></td>
      <td class="text-muted">${currentMenu.kkal} kkal</td>
      <td>Rp ${currentMenu.price.toLocaleString("id-ID")}</td>
      <td><input type="checkbox" class="custom-checkbox" data-index="${index}"></td>
    `;

    // Append the row to the HTML table body
    menuTableBody.appendChild(newTableRow);
  }

  // Attach click listener to every newly created checkbox
  const allCheckboxes = document.querySelectorAll(".custom-checkbox");
  for (let i = 0; i < allCheckboxes.length; i = i + 1) {
    allCheckboxes[i].addEventListener("change", handleCheckboxChange);
  }
}

// ==========================================================================
// 3. EVENT HANDLER (Responding to Checkbox Clicks)
// ==========================================================================
function handleCheckboxChange(clickEvent) {
  // Get the unique index number from the clicked checkbox
  const menuIndex = clickEvent.target.getAttribute("data-index");

  // Update internal state array (true if checked, false if unchecked)
  menuItems[menuIndex].isChecked = clickEvent.target.checked;

  // Re-calculate and update everything on the page
  updatePlannerPage();
}

// ==========================================================================
// 4. CORE PLANNED LOGIC (Calculations & Nutrition Checklist)
// ==========================================================================
function updatePlannerPage() {
  // --- Manually collect all selected/checked items using for loop ---
  const selectedItems = [];
  for (let index = 0; index < menuItems.length; index = index + 1) {
    if (menuItems[index].isChecked === true) {
      selectedItems.push(menuItems[index]);
    }
  }

  // --- Calculate Total Calories and Total Price ---
  let totalCalories = 0;
  let totalPrice = 0;

  for (let index = 0; index < selectedItems.length; index = index + 1) {
    const activeItem = selectedItems[index];
    totalCalories = totalCalories + activeItem.kkal;
    totalPrice = totalPrice + activeItem.price;
  }

  // Print results instantly to HTML text nodes
  totalCaloriesText.textContent = `${totalCalories.toLocaleString("id-ID")} kkal`;
  totalPriceText.textContent = `Rp ${totalPrice.toLocaleString("id-ID")}`;

  // --- Update Dynamic Image Grid / Empty State Handling ---
  selectedImagesGrid.innerHTML = "";

  if (selectedItems.length === 0) {
    selectedImagesGrid.innerHTML = `
      <div class="empty-state-msg" style="grid-column: span 2; text-align: center; color: var(--color-text-subtle); padding: 20px 0; font-size: 0.9rem;">
        Belum ada menu dipilih
      </div>
    `;
  } else {
    for (let index = 0; index < selectedItems.length; index = index + 1) {
      const checkedItem = selectedItems[index];

      let gridImageSource = checkedItem.image;
      if (gridImageSource.trim() === "") {
        gridImageSource = "https://placehold.co/100";
      }

      const newGridBox = document.createElement("div");
      newGridBox.classList.add("grid-box");
      newGridBox.style.overflow = "hidden";
      newGridBox.innerHTML = `<img src="${gridImageSource}" alt="${checkedItem.name}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='https://placehold.co/100'">`;

      selectedImagesGrid.appendChild(newGridBox);
    }
  }

  // --- Validate Checklist for 5 Nutrition Categories ---
  let hasCarb = false; // Pokok
  let hasProtein = false; // Lauk-Pauk
  let hasVegetable = false; // Sayur
  let hasFruit = false; // Buah
  let hasDrink = false; // Minuman

  // Inspect selected items one by one to check categories
  for (let index = 0; index < selectedItems.length; index = index + 1) {
    const currentCategory = selectedItems[index].category;

    if (currentCategory === "Pokok") {
      hasCarb = true;
    } else if (currentCategory === "Lauk-Pauk") {
      hasProtein = true;
    } else if (currentCategory === "Sayur") {
      hasVegetable = true;
    } else if (currentCategory === "Buah") {
      hasFruit = true;
    } else if (currentCategory === "Minuman") {
      hasDrink = true;
    }
  }

  // Color the UI nutrition labels based on the boolean statuses above
  for (let index = 0; index < nutritionTags.length; index = index + 1) {
    const singleTag = nutritionTags[index];
    const tagCategoryAttribute = singleTag.getAttribute("data-category");

    if (tagCategoryAttribute === "Pokok" && hasCarb === true) {
      singleTag.classList.add("checked");
    } else if (tagCategoryAttribute === "Lauk-Pauk" && hasProtein === true) {
      singleTag.classList.add("checked");
    } else if (tagCategoryAttribute === "Sayur" && hasVegetable === true) {
      singleTag.classList.add("checked");
    } else if (tagCategoryAttribute === "Buah" && hasFruit === true) {
      singleTag.classList.add("checked");
    } else if (tagCategoryAttribute === "Minuman" && hasDrink === true) {
      singleTag.classList.add("checked");
    } else {
      singleTag.classList.remove("checked");
    }
  }

  // --- Toggle Display and Content for Dynamic Alert Box ---
  const alertIcon = balancedMenuAlert.querySelector(".alert-icon");
  const alertTitle = balancedMenuAlert.querySelector(".alert-title");
  const alertSub = balancedMenuAlert.querySelector(".alert-sub");

  if (
    hasCarb === true &&
    hasProtein === true &&
    hasVegetable === true &&
    hasFruit === true &&
    hasDrink === true
  ) {
    // SEIMBANG STATE (Green Neon)
    balancedMenuAlert.classList.remove("unresolved");
    alertIcon.textContent = "✓";
    alertTitle.textContent = "Menu Seimbang!";
    alertSub.textContent = "NUTRISI TERPENUHI";
  } else {
    // BELUM SEIMBANG STATE (Orange/Secondary Accent)
    balancedMenuAlert.classList.add("unresolved");
    alertIcon.textContent = "!";
    alertTitle.textContent = "Menu Belum Seimbang";
    alertSub.textContent = "PILIH MINIMAL 1 ITEM PER KATEGORI";
  }
} // <--- Pembungkus fungsi updatePlannerPage() dikunci dengan benar di sini!

// ==========================================================================
// 5. RUNTIME INITIALIZATION (Bootstrap System)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  renderMenuTable();
  updatePlannerPage();
});