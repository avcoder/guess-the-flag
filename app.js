import leafletMap from "./showmap.js";
import { getRandomNum, formatNumber } from "./utils.js";

// eventually need to update these nodes
const btn = document.querySelector("button");
const answer = document.querySelector("#answer");
const img = document.querySelector("img");

const capitalText = document.querySelector("#capitalText");
const populationText = document.querySelector("#populationText");
const currencyText = document.querySelector("#currencyText");
const languagesText = document.querySelector("#languagesText");
const soundAnswer = document.querySelector("audio");
soundAnswer.volume = 0.07;

let timeoutId = 0;

// we are going to store our fetched json countries here
const countries = [];

// this will represent the current country we're showing
let country = {};

// get all the countries and their data in JSON format
fetch("https://restcountries.com/v3.1/all")
  .then((res) => res.json())
  .then((data) => {
    // we want to take that data and store it locally
    countries.push(...data.filter((country) => country.latlng.length === 2));
    leafletMap.mapInit("mapid");

    startGame();
  });

function getLang(languages) {
  const langs = Object.entries(languages).map((lang) => lang[1]);
  return langs;
}

function getCurr(currencies) {
  const currs = Object.entries(currencies).map((cur) => cur[1].name);
  return currs;
}

function getRandomCountry() {
  const index = getRandomNum(countries.length);
  const {
    name: { common: name },
    capital: [capital, ...rest],
    flags: { svg: flag },
    latlng,
    population,
  } = countries[index];

  const languages = getLang(countries[index].languages);
  const currencies = getCurr(countries[index].currencies);
  country = { name, capital, flag, latlng, population, languages, currencies };

  // remove that country from our array
  countries.splice(index, 1);
  return country;
}

function startGame() {
  if (countries.length <= 1) {
    btn.textContent = "No more countries";
    btn.removeEventListener("click", btnClicked);
    return;
  }
  country = { ...getRandomCountry() };
  img.src = country.flag;
}

function showAnswer() {
  answer.textContent = country.name;
  btn.textContent = "Play Again";
  capitalText.textContent = country.capital ?? "n/a";
  populationText.textContent = formatNumber(country.population);
  currencyText.textContent = country.currencies.join(", ");
  languagesText.textContent = country.languages.join(", ");

  // add button animation
  timeoutId = setTimeout(() => {
    btn.classList.add("pulse");
  }, 3000);

  // rewind then play sound
  soundAnswer.currentTime = 0;
  soundAnswer.play();
}

function clearAnswer() {
  leafletMap.remove();
  answer.textContent = "";
  capitalText.textContent = "";
  populationText.textContent = "";
  currencyText.textContent = "";
  languagesText.textContent = "";
}

function btnClicked() {
  if (btn.textContent == "Answer") {
    btn.classList.remove("pulse");
    leafletMap.show({
      lat: country.latlng[0],
      lng: country.latlng[1],
      name: country.name,
    });
    showAnswer();
  } else {
    clearTimeout(timeoutId);
    btn.textContent = "Answer";
    clearAnswer();
    startGame();
  }
}

btn.addEventListener("click", btnClicked);
