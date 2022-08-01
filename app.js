const content = document.querySelector('#content');
const modal = document.querySelector('#modal');
const backdrop = document.querySelector('#backdrop');
const progress = document.querySelector('#progress');
const form = document.querySelector('#form');

content.addEventListener('click', openCard);
backdrop.addEventListener('click', closeCard);
modal.addEventListener('change', toggleTech)
form.addEventListener('submit', createTech)

const APP_TITLE = document.title;
const LS_KEY = 'MY_TECH'

const technologies = getState() //массив технологий

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

    saveState()
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

//отрисовка полосы прогресса
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

//вычисление процента изученных технологий
function computeProgressPercent() {
    if (technologies.length === 0) return 0
    let doneCount = 0;
    for (let item of technologies) {
        if (item.done) doneCount++
    }
    return Math.round(doneCount / technologies.length * 100);
}

function isValid(title, description){
    return !title.value || !description.value
}

function createTech(event){
    //убрать перезагрузку страницы после submit 
    event.preventDefault()
    
    //получить title и description из формы ввода
    const {title, description} = event.target

    if(isValid(title, description)){
        //подсветить красным цветом пустые поля 
        if(!title.value) title.classList.add('invalid')
        if(!description.value) description.classList.add('invalid')

        setTimeout(()=>{
            title.classList.remove('invalid')
            description.classList.remove('invalid')
        }, 2000)

        return 
    }

    //новая технология
    const newTech = {
        title: title.value,
        description: description.value,
        done: false,
        type: title.value.toLowerCase()
    }

    //push в массив технологий
    technologies.push(newTech)
    saveState()
    title.value = ''
    description.value = ''
    init()
}

function saveState(){
    localStorage.setItem(LS_KEY, JSON.stringify(technologies))
}

function getState(){
    const row = localStorage.getItem(LS_KEY)
    return row ? JSON.parse(row) : []
}

init()