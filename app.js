// ------------------------
// DEMO DATA
// ------------------------
const uid = () => crypto.randomUUID();
const sample = [
  { id: uid(), title: "Paneer Tikka Wrap", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWXmwK5N2Cb2oM0GE--JOcXc7IDpOPKxVVUA&s", tags: ["paneer","wrap","tandoori"], desc: "Smoky paneer, crisp veg, tangy mint chutney.", owner: null },
  { id: uid(), title: "Masala Maggi", image: "https://images.unsplash.com/photo-1495546968767-f0573cca821e?q=80&w=1200&auto=format&fit=crop", tags: ["noodles","quick"], desc: "5-minute comfort noodles with veggies.", owner: null },
  { id: uid(), title: "Cold Coffee", image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1200&auto=format&fit=crop", tags: ["coffee","drink"], desc: "Frothy cafe-style iced coffee.", owner: null },
  { id: uid(), title: "Aloo Paratha", image: "https://pipingpotcurry.com/wp-content/uploads/2022/11/Aloo-Paratha-Piping-Pot-Curry.jpg", tags: ["paratha","north indian"], desc: "Stuffed flatbread with spiced potato.", owner: null },
  { id: uid(), title: "Veg Pulao", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgZRhyo-Zt6dtTBw9m-jPZYvkt8rMp9yZOsw&s", tags: ["rice","one-pot"], desc: "Fragrant rice with mixed vegetables.", owner: null },
  { id: uid(), title: "Chocolate Mug Cake", image: "https://i1.wp.com/www.livewellbakeoften.com/wp-content/uploads/2019/09/Chocolate-Mug-Cake-4.jpg?resize=745,1118&ssl=1", tags: ["dessert","microwave"], desc: "Single-serve gooey chocolate treat.", owner: null }
];

// ------------------------
// STATE
// ------------------------
const state = {
  recipes: [...sample],
  filter: "",
  user: null,
  favorites: []
};

// ------------------------
// ELEMENTS
// ------------------------
const grid = document.getElementById("grid");
const countEl = document.getElementById("count");
const searchInput = document.getElementById("searchInput");
const addBtn = document.getElementById("addBtn");
const addPanel = document.getElementById("addPanel");
const addForm = document.getElementById("addForm");
const navtabs = document.querySelectorAll(".navtab");

// Auth elements
const signoutBtn = document.getElementById("signoutBtn");

// Profile page elements
const profilePage = document.getElementById("profilePage");
const profilePic = document.getElementById("profilePic");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const myRecipesView = document.getElementById("myRecipesView");
const favoritesView = document.getElementById("favoritesView");
const profileTabs = document.querySelectorAll(".ptab");

// ------------------------
// CARD TEMPLATE
// ------------------------
function cardTemplate(r) {
  const tags = r.tags.map(t => `<span class="tag">#${t}</span>`).join("");
  const isFavorite = state.favorites.some(fav => fav.id === r.id);
  return `
  <article class="card">
    <img class="thumb" src="${r.image}" alt="${r.title}" />
    <div class="body">
      <h3 class="title">${r.title}</h3>
      <p class="desc">${r.desc}</p>
      <div class="tags">${tags}</div>
      ${state.user ? `<button class="favorite-btn" data-id="${r.id}">${isFavorite ? 'Unfavorite' : 'Favorite'}</button>` : ''}
    </div>
  </article>`;
}

// ------------------------
// RENDER DISCOVER GRID
// ------------------------
function render() {
  const q = state.filter.toLowerCase();
  const list = state.recipes.filter(r =>
    r.title.toLowerCase().includes(q) ||
    r.desc.toLowerCase().includes(q) ||
    r.tags.some(t => t.toLowerCase().includes(q))
  );
  grid.innerHTML = list.map(cardTemplate).join("");
  countEl.textContent = list.length;

  // Add favorite button functionality
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const recipeId = e.target.dataset.id;
      toggleFavorite(recipeId);
    });
  });
}

// ------------------------
// SEARCH
// ------------------------
searchInput.addEventListener("input", e => {
  state.filter = e.target.value;
  render();
});

// ------------------------
// ADD RECIPE
// ------------------------
addBtn.addEventListener("click", () => {
  addPanel.classList.toggle("hidden");
});

addForm.addEventListener("submit", e => {
  e.preventDefault();
  const titleVal = title.value.trim();
  const imageVal = image.value.trim();
  const tagsVal = tags.value.split(",").map(t => t.trim()).filter(Boolean);
  const descVal = desc.value.trim();

  if (!titleVal || !imageVal || !descVal) return;

  state.recipes.unshift({
    id: uid(),
    title: titleVal,
    image: imageVal,
    tags: tagsVal,
    desc: descVal,
    owner: state.user ? state.user.email : null
  });

  addForm.reset();
  addPanel.classList.add("hidden");
  render();
  if (state.user) renderMyRecipes();
});

// ------------------------
// BOTTOM NAV
// ------------------------
navtabs.forEach(btn => {
  btn.addEventListener("click", () => {
    navtabs.forEach(b => b.dataset.active = "false");
    btn.dataset.active = "true";

    if (btn.dataset.tab === "add") {
      addPanel.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (btn.dataset.tab === "my") {
      if (!state.user) return alert("Please sign in first.");
      profilePage.classList.remove("hidden");
      renderProfile();
    }

    if (btn.dataset.tab === "home") {
      profilePage.classList.add("hidden");
    }
  });
});

// ------------------------
// PROFILE RENDERING
// ------------------------
function renderProfile() {
  if (!state.user) return;
  profilePic.src = state.user.picture;
  profileName.textContent = state.user.name;
  profileEmail.textContent = state.user.email;

  renderMyRecipes();
  renderFavorites();
}

// ------------------------
// MY RECIPES & FAVORITES
// ------------------------
function renderMyRecipes() {
  const list = state.recipes.filter(r => r.owner === state.user.email);
  myRecipesView.innerHTML = list.length
    ? list.map(cardTemplate).join("")
    : `<p class="muted">You have not added any recipes yet.</p>`;
}

function renderFavorites() {
  const list = state.favorites;
  favoritesView.innerHTML = list.length
    ? list.map(cardTemplate).join("")
    : `<p class="muted">No favorites yet.</p>`;
}

// ------------------------
// PROFILE TABS
// ------------------------
profileTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    profileTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    document.querySelectorAll(".pview").forEach(v => v.classList.add("hidden"));

    const view = tab.dataset.view;
    document.getElementById(view + "View").classList.remove("hidden");

    if (view === 'myrecipes') renderMyRecipes();
    else if (view === 'favorites') renderFavorites();
  });
});

// ------------------------
// TOGGLE FAVORITE
// ------------------------
function toggleFavorite(recipeId) {
  const recipe = state.recipes.find(r => r.id === recipeId);
  const index = state.favorites.findIndex(f => f.id === recipeId);

  if (index === -1) {
    state.favorites.push(recipe);
  } else {
    state.favorites.splice(index, 1);
  }

  renderFavorites();
  render();
}

// ------------------------
// GOOGLE SIGN-IN (GIS)
// ------------------------
window.onGoogleSignIn = function(response) {
  const payload = JSON.parse(atob(response.credential.split(".")[1]));

  state.user = {
    name: payload.name,
    email: payload.email,
    picture: payload.picture
  };

  document.querySelector(".g_id_signin").classList.add("hidden");
  signoutBtn.classList.remove("hidden");

  renderProfile();
};

signoutBtn.onclick = () => {
  google.accounts.id.disableAutoSelect();
  document.querySelector(".g_id_signin").classList.remove("hidden");
  signoutBtn.classList.add("hidden");

  state.user = null;
  state.favorites = [];
  profilePage.classList.add("hidden");
  render();
};

// ------------------------
// INITIAL RENDER
// ------------------------
window.onload = () => {
  render();
};
