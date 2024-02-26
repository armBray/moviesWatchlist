const mainEl = document.getElementById('hero')

let localWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

async function fetchData(){
    const completeData = await Promise.all(
        localWatchlist.map( async data => {
            if (data !== null){
                // console.log(data);
                const response = await fetch(`https://www.omdbapi.com/?apikey=4d93911c&i=${data}`)
                const json = await response.json()
                return json
            }
    }))
    return completeData
}

if (localWatchlist.length > 0) {
    const completeData = await fetchData()
    console.log(completeData);
    renderCards(completeData)
} else {
    mainEl.innerHTML = `<div class="hero-base" id="hero-base">
                            <h1>Your watchlist is looking a little empty...</h1>
                            <a href="../index.html"id="add-items-watchlist">
                                <svg id="card-plus" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="https://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM9 5C9 4.44772 8.55228 4 8 4C7.44772 4 7 4.44772 7 5V7H5C4.44772 7 4 7.44771 4 8C4 8.55228 4.44772 9 5 9H7V11C7 11.5523 7.44772 12 8 12C8.55228 12 9 11.5523 9 11V9H11C11.5523 9 12 8.55228 12 8C12 7.44772 11.5523 7 11 7H9V5Z" fill="#111827"/>
                                </svg>
                                <span>Let’s add some movies!</span>
                            </a>
                        </div>`
}

function renderCards(dataArray){
    let html = ''
    mainEl.innerHTML = html
    dataArray.forEach(element => {
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
                                <svg id="card-plus" data-id="${element.imdbID}" width="16" height="16" viewBox="0 0 50 50" fill="none" xmlns="https://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M25 50C38.8071 50 50 38.8071 50 25C50 11.1929 38.8071 0 25 0C11.1929 0 0 11.1929 0 25C0 38.8071 11.1929 50 25 50ZM15.625 21.875C13.8991 21.875 12.5 23.2741 12.5 25C12.5 26.7259 13.8991 28.125 15.625 28.125H34.375C36.1009 28.125 37.5 26.7259 37.5 25C37.5 23.2741 36.1009 21.875 34.375 21.875H15.625Z" fill="#111827"/>
                                </svg>
                                <span data-id="${element.imdbID}">Watchlist</span>
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

mainEl.addEventListener('click', async (event) =>{
    //remove item
    const itemId = event.target.dataset.id
    const isTheId = (element) => element === itemId;
    const indexToRemove = localWatchlist.findIndex(isTheId)
    delete localWatchlist[indexToRemove]

    //remove null or undefined
    localWatchlist = localWatchlist.filter(element => {
        return element !== null && element !== undefined;
      });
    localStorage.setItem('watchlist', JSON.stringify(localWatchlist))

    if (localWatchlist.length > 0) {
        const completeData = await fetchData()
        // console.log(completeData);
        renderCards(completeData)
    } else {
        console.log('render add');

        mainEl.innerHTML = `<div class="hero-base" id="hero-base">
                                <h1>Your watchlist is looking a little empty...</h1>
                                <a href="../index.html" id="add-items-watchlist">
                                    <svg id="card-plus" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM9 5C9 4.44772 8.55228 4 8 4C7.44772 4 7 4.44772 7 5V7H5C4.44772 7 4 7.44771 4 8C4 8.55228 4.44772 9 5 9H7V11C7 11.5523 7.44772 12 8 12C8.55228 12 9 11.5523 9 11V9H11C11.5523 9 12 8.55228 12 8C12 7.44772 11.5523 7 11 7H9V5Z" fill="#111827"/>
                                    </svg>
                                    <span>Let’s add some movies!</span>
                                </a>
                            </div>`
    }
})
