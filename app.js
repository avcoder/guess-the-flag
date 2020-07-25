import leafletMap from './showmap.js';
import { getRandomNum, formatNumber } from './utils.js';

// eventually need to update these nodes
const btn = document.querySelector('button');
const answer = document.querySelector('#answer');
const img = document.querySelector('img');

const capitalText = document.querySelector('#capitalText');
const populationText = document.querySelector('#populationText');
const currencyText = document.querySelector('#currencyText');
const languagesText = document.querySelector('#languagesText');
const soundAnswer = document.querySelector('audio');
soundAnswer.volume = 0.07;

let timeoutId = 0;


// we are going to store our fetched json countries here
const countries = [];

// this will represent the current country we're showing
let country = {};

// get all the countries and their data in JSON format
fetch('https://restcountries.eu/rest/v2/all')
    .then(res => res.json())
    .then(data => {
        // we want to take that data and store it locally
        countries.push(...data.filter(country => country.latlng.length === 2));
        leafletMap.mapInit('mapid');

        startGame();
    });


function getRandomCountry() {
    const index = getRandomNum(countries.length);
    const { name, flag, latlng, capital, population, currencies, languages } = countries[index];

    country = { name, flag, latlng, capital, population, currencies, languages };

    // remove that country from our array
    countries.splice(index, 1); 
    console.log(country)
    return country;
}

function startGame() {
    if (countries.length <=1 ) {
        btn.textContent = 'No more countries';
        btn.removeEventListener('click', btnClicked);
        return;
    }
    country = { ...getRandomCountry() };
    img.src = country.flag;
}

function showAnswer() {
    answer.textContent = country.name;
    btn.textContent = "Play Again";
    capitalText.textContent = country.capital;
    populationText.textContent = formatNumber(country.population);
    currencyText.textContent = country.currencies.map(money => `${money.name}`).join(', ');
    languagesText.textContent = country.languages.map(lang => lang.name).join(', ');
    
    // add button animation 
    timeoutId = setTimeout(() => {
        btn.classList.add('pulse');
    }, 3000)

    // rewind then play sound
    soundAnswer.currentTime = 0;
    soundAnswer.play();
}

function clearAnswer() {
    leafletMap.remove();
    answer.textContent = '';
    capitalText.textContent = '';
    populationText.textContent = '';
    currencyText.textContent = '';
    languagesText.textContent = '';
}

function btnClicked() {
    if (btn.textContent == "Answer") {
        btn.classList.remove('pulse');
        leafletMap.show({lat: country.latlng[0], lng: country.latlng[1], name: country.name });
        showAnswer();
    } else {
        clearTimeout(timeoutId);
        btn.textContent = "Answer";
        clearAnswer();
        startGame();
    }
}


btn.addEventListener('click', btnClicked);