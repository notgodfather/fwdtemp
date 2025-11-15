// Demo data in-memory
const uid = () => crypto.randomUUID()
const sample = [
  { id: uid(), title: 'Paneer Tikka Wrap', image: 'https://images.unsplash.com/photo-1604908176997-43167b9893e3?q=80&w=1200&auto=format&fit=crop', tags: ['paneer','wrap','tandoori'], desc: 'Smoky paneer, crisp veg, tangy mint chutney.' },
  { id: uid(), title: 'Masala Maggi', image: 'https://images.unsplash.com/photo-1495546968767-f0573cca821e?q=80&w=1200&auto=format&fit=crop', tags: ['noodles','quick'], desc: '5-minute comfort noodles with veggies.' },
  { id: uid(), title: 'Cold Coffee', image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1200&auto=format&fit=crop', tags: ['coffee','drink'], desc: 'Frothy cafe-style iced coffee.' },
  { id: uid(), title: 'Aloo Paratha', image: 'https://images.unsplash.com/photo-1674674477680-e5e6a3dc32c9?q=80&w=1200&auto=format&fit=crop', tags: ['paratha','north indian'], desc: 'Stuffed flatbread with spiced potato.' },
  { id: uid(), title: 'Veg Pulao', image: 'https://images.unsplash.com/photo-1625944523352-df2d2d6f2a32?q=80&w=1200&auto=format&fit=crop', tags: ['rice','one-pot'], desc: 'Fragrant rice with mixed vegetables.' },
  { id: uid(), title: 'Chocolate Mug Cake', image: 'https://images.unsplash.com/photo-1614707267537-3a3e1a4a4f1f?q=80&w=1200&auto=format&fit=crop', tags: ['dessert','microwave'], desc: 'Single-serve gooey chocolate treat.' }
]

// State
const state = {
  recipes: [...sample],
  filter: ''
}

// Elements
const grid = document.getElementById('grid')
const countEl = document.getElementById('count')
const searchInput = document.getElementById('searchInput')
const addBtn = document.getElementById('addBtn')
const addPanel = document.getElementById('addPanel')
const addForm = document.getElementById('addForm')
const navtabs = document.querySelectorAll('.navtab')

// Render cards
function cardTemplate(r){
  const tags = r.tags.map(t=>`<span class="tag">#${t}</span>`).join('')
  return `
    <article class="card">
      <img class="thumb" src="${r.image}" alt="${r.title}" />
      <div class="body">
        <h3 class="title">${r.title}</h3>
        <p class="desc">${r.desc}</p>
        <div class="tags">${tags}</div>
      </div>
    </article>
  `
}

function render(){
  const q = state.filter.trim().toLowerCase()
  const list = state.recipes.filter(r=>{
    if(!q) return true
    return r.title.toLowerCase().includes(q)
      || r.desc.toLowerCase().includes(q)
      || r.tags.some(t=>t.toLowerCase().includes(q))
  })
  grid.innerHTML = list.map(cardTemplate).join('')
  countEl.textContent = String(list.length)
}

// Handlers
searchInput.addEventListener('input', e => {
  state.filter = e.target.value
  render()
})

addBtn.addEventListener('click', () => {
  addPanel.classList.toggle('hidden')
})

addForm.addEventListener('submit', e => {
  e.preventDefault()
  const title = document.getElementById('title').value.trim()
  const image = document.getElementById('image').value.trim()
  const tags = document.getElementById('tags').value.split(',').map(s=>s.trim()).filter(Boolean)
  const desc = document.getElementById('desc').value.trim()
  if(!title || !image || !desc) return
  state.recipes.unshift({ id: uid(), title, image, tags, desc })
  addForm.reset()
  addPanel.classList.add('hidden')
  render()
})

// Bottom nav demo behavior
navtabs.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    navtabs.forEach(b=>b.dataset.active='false')
    btn.dataset.active='true'
    if(btn.dataset.tab==='add'){
      addPanel.classList.remove('hidden')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    if(btn.dataset.tab==='search'){
      document.getElementById('searchInput').focus()
    }
  })
})

// Initial paint
render()
