const searchInput = document.getElementById('searchInput');
const container = document.getElementById('data-list');
const mochApi = 'https://6729bdac6d5fa4901b6e27f4.mockapi.io/attractions';

const closeBtn = document.querySelector('.close-btn');
const socialPanelContainer = document.querySelector('.social-panel-container');
const modalSocial = document.querySelector('.obratnuj__zvonok');

const itemOnPage = 3;
let currentPage = 1;
let persone = [];


addEventListener('load', async () => {
const data = await fetch(mochApi);
persone = await data.json();
totalItems = persone.length;
totalPages = Math.ceil(totalItems / itemOnPage);

pageLoader(currentPage);
});

closeBtn.addEventListener('click', () => {
socialPanelContainer.classList.remove('visible');
});

function showLoader() {
document.getElementById('loader').style.display = 'block';
}

function hideLoader() {
document.getElementById('loader').style.display = 'none';
}

function loadData() {
document.getElementById('loader').style.display = 'block';
setTimeout(() => {
    document.getElementById('loader').style.display = 'none';
}, 2000);
}
window.onload = loadData;

function pageLoader(card) {
    showLoader();

    container.innerHTML = '';
    const start = (card - 1) * itemOnPage;
    const end = Math.min(start + itemOnPage, totalItems);

    for (let i = start; i < end; i++) {
        const t = persone[i];
        const poisk = document.createElement('div');
        poisk.classList.add('info__main');
        poisk.setAttribute('data-title', t.name);
        poisk.innerHTML = `
            <img class="info__img" src="${t.img}" alt="картинки ${i + 1}">
            <div class="info__box">
                <div class="info__title">${t.name}</div>
                <button class="info__btn floating-btn" id="btn_${i}">Увидеть больше</button>
            </div>`
        ;
        container.append(poisk);

        let infoBtn = document.getElementById(`btn_${i}`);
        infoBtn.addEventListener('click', () => {
            socialPanelContainer.classList.add('visible');
            modalSocial.innerHTML = `
                <div class="modal__title">${t.name}</div>
                <div class="modal__box">
                    <div class="modal__text">${t.title}</div>
                    <img class="modal__img" src="${t.img}" alt="${t.name}">
                </div>
                <div id="map"></div>`; 
            ymaps.ready(() => {
                const map = new ymaps.Map('map', {
                    center: [t.lat, t.lng],
                    zoom: 17,
                });
                const placemark = new ymaps.Placemark([t.lat, t.lng]);
                map.geoObjects.add(placemark);
            });
        });
}

updatePag();
search(); 

hideLoader(); 
}

function updatePag() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.onclick = () => changePage(i);
        paginationContainer.appendChild(pageButton);
    }
}

function changePage(page) {
    currentPage = page;
    pageLoader(currentPage);
}

function search() {
const infoSections = document.querySelectorAll('.info__main');
searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    infoSections.forEach(section => {
        const title = section.getAttribute('data-title').toLowerCase();
        section.style.display = title.includes(query) ? '' : 'none';
    });
});
}

function sortData(order) {
if (order === 'abc') {
    persone.sort((a, b) => a.name.localeCompare(b.name));
}
totalPages = Math.ceil(persone.length / itemOnPage);
pageLoader(currentPage);
}
document.getElementById('sortName').addEventListener('click', () => {
    sortData('abc');
});
loadData();
