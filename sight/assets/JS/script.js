const searchInput = document.getElementById('searchInput');
const container = document.getElementById('data-list');
const URL = 'https://6729bdac6d5fa4901b6e27f4.mockapi.io/attractions';

const closeBtn = document.querySelector('.close-btn');
const socialPanelContainer = document.querySelector('.social-panel-container');
const socialPanel = document.querySelector('.social-panel');
const modalSocial = document.querySelector('.obratnuj__zvonok');

addEventListener('load', async () => {
    const data = await fetch(URL);
    const persone = await data.json();
    console.log(persone);
    
    if (persone) {
        persone.map((t, index) => {
            const poisk = document.createElement('div');
            poisk.classList.add('info__main');
            poisk.setAttribute('data-title', t.name);
            poisk.insertAdjacentHTML('afterbegin',` 
                <img class="info__img" src="${t.img}" alt="картинки ${index + 1}">
                <div class="info__box">
                    <div class="info__title">${t.name}</div>
                    <button class="info__btn floating-btn" id="btn_${index}">Увидеть больше</button>
                </div>`
            );
            container.append(poisk);

            let infoBtn = document.getElementById(`btn_${index}`);
            infoBtn.addEventListener('click', () => {
                socialPanelContainer.classList.toggle('visible');
                modalSocial.innerHTML = `
                    <div class="modal__title">${t.name}</div>
                    <div class="modal__box">
                        <div>${t.title}</div>
                        <img class="modal__img" src="${t.img}" alt="${t.name}">
                    </div>
                    <div id="map" style="height: 300px;"></div>`; 

                ymaps.ready(() => {
                    const map = new ymaps.Map('map', {
                        center: [t.lat, t.lng],
                        zoom: 17,
                    });

                    const placemark = new ymaps.Placemark([t.lat, t.lng], {
                    });

                    map.geoObjects.add(placemark);
            });
        });
    });
    }
    closeBtn.addEventListener('click', () => {
        socialPanelContainer.classList.remove('visible');
    });

    setupSearch();
    floatingBtn();
});

function setupSearch() {
    const infoSections = document.querySelectorAll('.info__main');
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        infoSections.forEach(section => {
            const title = section.getAttribute('data-title').toLowerCase();
            if (title.includes(query)) {
                section.style.display = '';
            } else {
                section.style.display = 'none';
            }
        });
    });
}

document.querySelector('.burger').addEventListener('click', function() {
    this.classList.toggle('active');
    document.querySelector('.nav').classList.toggle('open');
});
