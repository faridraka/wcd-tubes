// ==========================================================================
// 1. DOM SELECTORS
// ==========================================================================
const menuTbody = document.querySelector(".menu-table tbody");
const selectedGrid = document.querySelector(".selected-grid");
const totalKaloriEl = document.querySelector(".total-row:nth-child(1) .total-val");
const totalHargaEl = document.querySelector(".total-row:nth-child(2) .total-val");
const alertBox = document.querySelector(".alert-box");
const giziTags = document.querySelectorAll(".gizi-tag");

// ==========================================================================
// 2. RENDER TABLE FUNCTION
// ==========================================================================
function renderMenuTable() {
  if (!menuTbody) return;
  menuTbody.innerHTML = ""; // Bersihkan isi template awal di HTML

  // menuItems diakses langsung karena menu-data.js dimuat lebih dulu
  menuItems.forEach((item, index) => {
    const tr = document.createElement("tr");

    // Standardisasi class name untuk warna badge kategori di CSS
    // Contoh: "Lauk-Pauk" -> "laukpauk", "Pokok" -> "pokok"
    const badgeClass = item.category.toLowerCase().replace("-", "");

    tr.innerHTML = `
      <td>
        <div class="thumb-placeholder">
          <img src="${item.image || 'assets/images/placeholder.png'}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover; border-radius:6px;" onerror="this.src='https://placehold.co/92'">
        </div>
      </td>
      <td><span class="menu-name">${item.name}</span></td>
      <td><span class="badge badge-${badgeClass}">${item.category}</span></td>
      <td class="text-muted">${item.kkal} kkal</td>
      <td>Rp ${item.price.toLocaleString("id-ID")}</td>
      <td><input type="checkbox" class="custom-checkbox" data-index="${index}"></td>
    `;

    menuTbody.appendChild(tr);
  });

  // Pasang Event Listener ke semua checkbox yang baru saja di-render
  const checkboxes = document.querySelectorAll(".custom-checkbox");
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", handleCheckboxChange);
  });
}

// ==========================================================================
// 3. REAL-TIME DOM MANIPULATION LOGIC
// ==========================================================================
function handleCheckboxChange(e) {
  const index = e.target.getAttribute("data-index");
  // Update state internal array berdasarkan status checkbox (true/false)
  menuItems[index].isChecked = e.target.checked; 

  updatePlannerSummary();
}

function updatePlannerSummary() {
  // Filter menu yang sedang aktif dicentang oleh pengguna
  const selectedItems = menuItems.filter(item => item.isChecked);

  // A. Kalkulasi Akumulasi Kalori & Harga (Menggunakan Array Reduce)
  const totalKalori = selectedItems.reduce((sum, item) => sum + item.kkal, 0);
  const totalHarga = selectedItems.reduce((sum, item) => sum + item.price, 0);

  // Update text content ke elemen UI secara real-time
  totalKaloriEl.textContent = `${totalKalori.toLocaleString("id-ID")} kkal`;
  totalHargaEl.textContent = `Rp ${totalHarga.toLocaleString("id-ID")}`;

  // B. Mengurus Grid Tumpukan Gambar & State Kosong
  selectedGrid.innerHTML = ""; 

  if (selectedItems.length === 0) {
    // Tampilan state kosong yang informatif sesuai kriteria tugas
    selectedGrid.innerHTML = `
      <div class="empty-state-msg" style="grid-column: span 2; text-align: center; color: var(--color-text-subtle); padding: 20px 0; font-size: 0.9rem;">
        Belum ada menu dipilih
      </div>
    `;
  } else {
    // Inject gambar menu yang dipilih ke dalam grid box secara rapi
    selectedItems.forEach(item => {
      const gridBox = document.createElement("div");
      gridBox.classList.add("grid-box");
      gridBox.style.overflow = "hidden";
      gridBox.innerHTML = `<img src="${item.image}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='https://placehold.co/100'">`;
      selectedGrid.appendChild(gridBox);
    });
  }

  // C. Validasi Checklist 5 Kategori Gizi
  const giziStatus = {
    "Pokok": false,
    "Lauk-Pauk": false,
    "Sayur": false,
    "Buah": false,
    "Minuman": false
  };

  // Tandai true jika minimal ada 1 item dari kategori tersebut yang dicentang
  selectedItems.forEach(item => {
    if (giziStatus.hasOwnProperty(item.category)) {
      giziStatus[item.category] = true;
    }
  });

  // Manipulasi classList untuk menambahkan indikator centang pada tag gizi di UI
  giziTags.forEach(tag => {
    const categoryAttr = tag.getAttribute("data-category");
    if (giziStatus[categoryAttr]) {
      tag.classList.add("checked");
    } else {
      tag.classList.remove("checked");
    }
  });

  // D. Pengondisian Tampilan Dinamis Badge "Menu Seimbang!"
  // Memastikan kelima properti di giziStatus bernilai true semuanya
  const isMenuSeimbang = Object.values(giziStatus).every(status => status === true);

  if (isMenuSeimbang) {
    alertBox.style.display = "flex"; // Munculkan badge
  } else {
    alertBox.style.display = "none"; // Sembunyikan badge
  }
}

// ==========================================================================
// 4. RUNTIME INITIALIZATION
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  renderMenuTable();      // Render 26 menu saat DOM siap
  updatePlannerSummary(); // Set tampilan awal (empty state)
});