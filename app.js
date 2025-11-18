// Demo data in-memory
const uid = () => crypto.randomUUID();
const sample = [
  { id: uid(), title: "Paneer Tikka Wrap", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWXmwK5N2Cb2oM0GE--JOcXc7IDpOPKxVVUA&s", tags: ["paneer","wrap","tandoori"], desc: "Smoky paneer, crisp veg, tangy mint chutney." },
  { id: uid(), title: "Masala Maggi", image: "https://images.unsplash.com/photo-1495546968767-f0573cca821e?q=80&w=1200&auto=format&fit=crop", tags: ["noodles","quick"], desc: "5-minute comfort noodles with veggies." },
  { id: uid(), title: "Cold Coffee", image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1200&auto=format&fit=crop", tags: ["coffee","drink"], desc: "Frothy cafe-style iced coffee." },
  { id: uid(), title: "Aloo Paratha", image: "https://pipingpotcurry.com/wp-content/uploads/2022/11/Aloo-Paratha-Piping-Pot-Curry.jpg", tags: ["paratha","north indian"], desc: "Stuffed flatbread with spiced potato." },
  { id: uid(), title: "Veg Pulao", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgZRhyo-Zt6dtTBw9m-jPZYvkt8rMp9yZOsw&s", tags: ["rice","one-pot"], desc: "Fragrant rice with mixed vegetables." },
  { id: uid(), title: "Chocolate Mug Cake", image: "https://i1.wp.com/www.livewellbakeoften.com/wp-content/uploads/2019/09/Chocolate-Mug-Cake-4.jpg?resize=745,1118&ssl=1", tags: ["dessert","microwave"], desc: "Single-serve gooey chocolate treat." }
];

// App state
const state = { recipes: [...sample], filter: "" };

// Elements
const grid = document.getElementById("grid");
const countEl = document.getElementById("count");
const searchInput = document.getElementById("searchInput");
const addBtn = document.getElementById("addBtn");
const addPanel = document.getElementById("addPanel");
const addForm = document.getElementById("addForm");
const navtabs = document.querySelectorAll(".navtab");

// Auth elements
const signoutBtn = document.getElementById("signoutBtn");

// Render card template
function cardTemplate(r) {
  const tags = r.tags.map(t => `<span class="tag">#${t}</span>`).join("");
  return `
  <article class="card">
    <img class="thumb" src="${r.image}" alt="${r.title}" />
    <div class="body">
      <h3 class="title">${r.title}</h3>
      <p class="desc">${r.desc}</p>
      <div class="tags">${tags}</div>
    </div>
  </article>`;
}

function render() {
  const q = state.filter.toLowerCase();
  const list = state.recipes.filter(r =>
    r.title.toLowerCase().includes(q) ||
    r.desc.toLowerCase().includes(q) ||
    r.tags.some(t => t.toLowerCase().includes(q))
  );
  grid.innerHTML = list.map(cardTemplate).join("");
  countEl.textContent = list.length;
}

// Search
searchInput.addEventListener("input", e => {
  state.filter = e.target.value;
  render();
});

// Add recipe
addBtn.addEventListener("click", () => {
  addPanel.classList.toggle("hidden");
});

// Form submit
addForm.addEventListener("submit", e => {
  e.preventDefault();
  const title = title.value.trim();
  const image = image.value.trim();
  const tags = tags.value.split(",").map(t => t.trim()).filter(Boolean);
  const desc = desc.value.trim();
  if (!title || !image || !desc) return;

  state.recipes.unshift({ id: uid(), title, image, tags, desc });
  addForm.reset();
  addPanel.classList.add("hidden");
  render();
});

// Bottom nav
navtabs.forEach(btn => {
  btn.addEventListener("click", () => {
    navtabs.forEach(b => b.dataset.active = "false");
    btn.dataset.active = "true";
    if (btn.dataset.tab === "search") searchInput.focus();
    if (btn.dataset.tab === "add") {
      addPanel.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
});

/* --------------------------
      GOOGLE SIGN-IN (GIS)
-------------------------- */

// Callback from Google
window.onGoogleSignIn = function(response) {
  const jwt = response.credential;
  const payload = JSON.parse(atob(jwt.split(".")[1]));

  console.log("Signed in:", payload);

  document.querySelector(".g_id_signin").classList.add("hidden");
  signoutBtn.classList.remove("hidden");

  window.user = {
    name: payload.name,
    email: payload.email,
    picture: payload.picture
  };
};

// Sign out
signoutBtn.onclick = () => {
  google.accounts.id.disableAutoSelect();
  document.querySelector(".g_id_signin").classList.remove("hidden");
  signoutBtn.classList.add("hidden");
  window.user = null;
};

render();
