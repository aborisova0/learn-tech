const content = document.querySelector('#content');
const modal = document.querySelector('#modal');
const backdrop = document.querySelector('#backdrop');
const progress = document.querySelector('#progress');

content.addEventListener('click', openCard);
backdrop.addEventListener('click', closeCard);
modal.addEventListener('change', toggleTech)

const APP_TITLE = document.title;

function openCard(event) {
    const data = event.target.dataset
    const tech = technologies.find(t => t.type === data.type)
    if (!tech) return
    openModal(toModal(tech), tech.title)
}

function toModal(tech){
    const checked = tech.done ? 'checked' : ''

    return `
    <h2>${tech.title}</h2>
        <p>${tech.description}</p>
        <hr />
        <div>
            <input type="checkbox" id="done" ${checked} data-type="${tech.type}">
            <label for="done">Выучил</label>
        </div>
    `
}

function toggleTech(event){
    const type = event.target.dataset.type
    const tech = technologies.find(t => t.type === type)
    tech.done = event.target.checked
    init()
}

function openModal(html, title = APP_TITLE) {
    document.title = `${title} | ${APP_TITLE}`
    modal.innerHTML = html
    modal.classList.add('open')
}

function closeCard() {
    modal.classList.remove('open')
    document.title = ` ${APP_TITLE}`
}

const technologies = [
    { title: 'HTML', description: 'HTML text', type: 'html', done: true },
    { title: 'CSS', description: 'CSS text', type: 'css', done: true },
    { title: 'JavaScript', description: 'JavaScript text', type: 'javascript', done: false },
    { title: 'React', description: 'React text', type: 'react', done: false },
    { title: 'Git', description: 'Git text', type: 'git', done: false }
]

function init() {
    renderCards()
    renderProgress(technologies)
}

function renderCards() {
    if (technologies.length === 0) {
        content.innerHTML = '<p class="empty">Технологий пока нет</p>'
    }
    else {
        content.innerHTML = technologies.map(toCard).join('')
    }
}

function toCard(tech) {
    const doneClass = tech.done ? 'done' : ''
    return `
    <div class="card ${doneClass}" data-type="${tech.type}">
        <h3 data-type="${tech.type}">${tech.title}</h3>
    </div>
    `
}

init()

function renderProgress() {
    const percent = computeProgressPercent()
    let background
    if (percent <= 30) {
        background = '#e75a5a'
    } else if (percent > 30 && percent < 70) {
        background = '#f99415'
    } else {
        background = '#73ba3c'
    }
    progress.style.background = background
    progress.style.width = `${percent}%`
    progress.textContent = percent ? `${percent}%` : ''
}

function computeProgressPercent() {
    if (technologies.length === 0) return 0
    let doneCount = 0;
    for (let item of technologies) {
        if (item.done) doneCount++
    }
    return Math.round(doneCount / technologies.length * 100);
}