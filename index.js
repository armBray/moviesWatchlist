const searchEl = document.getElementById('search-input')
const searchBtnEl = document.getElementById('search-btn')
const mainEl = document.getElementById('hero')
const mainBaseEl = document.getElementById('hero-base')
const switchEl = document.getElementById('switch-color')

let localWatchlist = JSON.parse(localStorage.getItem('watchlist'));

function handleSwitch(event) {
    // var element = document.body;
    // element.classList.toggle("dark-mode");

    if (event.target.id == "img-moon") {
        console.log('Please switch to light mode');
        var element = document.body;
        element.classList.toggle("light");
    } else if (event.target.id == "img-sun") {
        console.log('Please switch to night mode');
        var element = document.body;
        element.classList.toggle("light");
    }
}
switchEl.addEventListener('click', handleSwitch)

function renderCards(dataArray){
    let html = ''
    mainEl.innerHTML = html
    dataArray.forEach(element => {
        const itemId = element.imdbID
        const isTheId = (element) => element === itemId;
        const indexToRender = localWatchlist.findIndex(isTheId)
        console.log(indexToRender);
        let htmlSvg = ''

        if (indexToRender === -1) {
            htmlSvg = `
                    <svg id="card-plus" data-id="${element.imdbID}" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="https://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM9 5C9 4.44772 8.55228 4 8 4C7.44772 4 7 4.44772 7 5V7H5C4.44772 7 4 7.44771 4 8C4 8.55228 4.44772 9 5 9H7V11C7 11.5523 7.44772 12 8 12C8.55228 12 9 11.5523 9 11V9H11C11.5523 9 12 8.55228 12 8C12 7.44772 11.5523 7 11 7H9V5Z" fill="#111827"/>
                    </svg>
                    <span data-id="${element.imdbID}">Watchlist</span>
                    `
        } else {
            htmlSvg = `
                    <svg id="card-plus" data-id="${element.imdbID}" width="16" height="16" viewBox="0 0 50 50" fill="none" xmlns="https://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M25 50C38.8071 50 50 38.8071 50 25C50 11.1929 38.8071 0 25 0C11.1929 0 0 11.1929 0 25C0 38.8071 11.1929 50 25 50ZM15.625 21.875C13.8991 21.875 12.5 23.2741 12.5 25C12.5 26.7259 13.8991 28.125 15.625 28.125H34.375C36.1009 28.125 37.5 26.7259 37.5 25C37.5 23.2741 36.1009 21.875 34.375 21.875H15.625Z" fill="#111827"/>
                    </svg>
                    <span data-id="${element.imdbID}">Watchlist</span>
                    `
        }

        html += `
                <div class="card" id="card">
                    <img src="${element.Poster}" alt="" id="card-poster">
                    <div>
                        <section class="card-first-section">
                            <h1 id="card-title">${element.Title}</h1>
                            <div class="card-div-imdbRating">
                                <img src="./assets/icons/star.svg" alt="">
                                <span id="card-imdbRating">${element.imdbRating}</span>
                            </div>
                            <div class="card-div-watchlist" id="card-div-watchlist" data-id="${element.imdbID}">
                                ${htmlSvg}
                            </div>
                        </section>
                        <section>
                            <h2 id="card-duration">${element.Runtime}</h2>
                            <h2 id="card-styles">${element.Genre}</h2>
                        </section>
                        <p id="card-description">${element.Plot}</p>
                    </div>
                </div>
                `
    });
    mainEl.innerHTML = html
}

async function handleSearch(){
    if (searchEl.value !== '') {
        const response = await fetch(`https://www.omdbapi.com/?apikey=4d93911c&s=${searchEl.value}`)
        const data = await response.json()

        console.log(data);
        mainEl.innerHTML = `<div class="hero-base" id="hero-base"><h1>Loading...</h1></div>`
        // mainBaseEl.innerHTML = `<h1>Loading...</h1>`
        if (data['Search'] !== 'undefined' && data.Response !== 'False'){
            const completeData = await Promise.all(
                data['Search'].map( async data => {
                    const response = await fetch(`https://www.omdbapi.com/?apikey=4d93911c&i=${data.imdbID}`)
                    const json = await response.json()
                    return json
            }))
            renderCards(completeData)
        } else {
            // mainBaseEl.innerHTML = `<h1>Unable to find what you’re looking for. Please try another search.</h1>`
            mainEl.innerHTML = `<div class="hero-base" id="hero-base"><h1>Unable to find what you’re looking for. Please try another search.</h1></div>`
        }
    } else {
        console.info('please insert a value');
    }

    searchEl.value = ''
}
try {
    searchBtnEl.addEventListener('click', handleSearch)
} catch (e) {
}


function renderToggle(id, operation){
    // const queryDataIDs = document.querySelectorAll('[data-id]')
    const queryDataIDs = document.querySelector(`svg[data-id=${id}]`)

    if (operation === 'plus') {
        queryDataIDs.setAttribute('viewBox', '0 0 50 50')
        queryDataIDs.innerHTML = `
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M25 50C38.8071 50 50 38.8071 50 25C50 11.1929 38.8071 0 25 0C11.1929 0 0 11.1929 0 25C0 38.8071 11.1929 50 25 50ZM15.625 21.875C13.8991 21.875 12.5 23.2741 12.5 25C12.5 26.7259 13.8991 28.125 15.625 28.125H34.375C36.1009 28.125 37.5 26.7259 37.5 25C37.5 23.2741 36.1009 21.875 34.375 21.875H15.625Z" fill="#111827"/>
                                `
        alert('Movie added to watchlist!')
    } else {
        queryDataIDs.setAttribute('viewBox', '0 0 16 16')
        queryDataIDs.innerHTML = `
        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM9 5C9 4.44772 8.55228 4 8 4C7.44772 4 7 4.44772 7 5V7H5C4.44772 7 4 7.44771 4 8C4 8.55228 4.44772 9 5 9H7V11C7 11.5523 7.44772 12 8 12C8.55228 12 9 11.5523 9 11V9H11C11.5523 9 12 8.55228 12 8C12 7.44772 11.5523 7 11 7H9V5Z" fill="#111827"/>
        `
        alert('Movie removed from watchlist!')
    }
}

function isInLocalWatchList(id) {
    const localWatchlist = JSON.parse(localStorage.getItem('watchlist'));

    if (localWatchlist) {
        const found = localWatchlist.find((element) => element == id);
        return found ? true : false
    }
    else return false
}

function handleWatchlist(id){
    const response = isInLocalWatchList(id)
    // console.log(response);
    if (response) {
        const isTheId = (element) => element === id;
        const indexToRemove = localWatchlist.findIndex(isTheId)
        delete localWatchlist[indexToRemove]

        //remove null or undefined
        localWatchlist = localWatchlist.filter(element => {
            return element !== null && element !== undefined;
        });

        renderToggle(id, 'minus')
    } else {
        localWatchlist.push(id)
        renderToggle(id, 'plus')
    }
    localStorage.setItem('watchlist', JSON.stringify(localWatchlist))

}
mainEl.addEventListener('click', (event) =>{
    const verificationClick = event.target.id === 'card-div-watchlist' || event.target.id === 'card-plus' || event.target.localName === "span"
    console.log(verificationClick);
    
    if (verificationClick ){
        const itemId = event.target.dataset.id
        handleWatchlist(itemId)
    }
})


/**
 * both
 *
 * restyle card
 */

/**
 * index.js
 *
 *
 */


/**
 * watchlist.js
 *
 */
