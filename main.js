"use strict";
console.log("Bismillahir Rohmanir Rohiym");
const countriesContainer = document.querySelector(".country_container");
const searchButton = document.querySelector(".btn--search");
const searchInput = document.querySelector(".search_bar__input");
const selectBtn = document.querySelector(".select__options");
const searchBar = document.querySelector(".search_bar");
const moreInfoContainer = document.querySelector(".info");
const btnBack = document.querySelector(".btn--back");
const btnMode = document.querySelector(".navigation__mode");

//----OOP ES6 CLASS
class Main {
  #data;
  constructor() {
    this._fetchingData();
    selectBtn.addEventListener("change", this._renderByRegion.bind(this));
    countriesContainer.addEventListener("click", this._moreInfoFn.bind(this));
    btnBack.addEventListener("click", this._goBackFn.bind(this));
    btnMode.addEventListener("click", function () {
      document.querySelector("body").classList.toggle("dark-mode");
    });
    addEventListener("keydown", this._enterBtnFn.bind(this));
  }
  async _fetchingData() {
    try {
      const response = await fetch(`https://restcountries.com/v2/all`);
      this.#data = await response.json();
      this._renderCountry(this.#data);
      searchButton.addEventListener(
        "click",
        this._searchingCountries.bind(this)
      );
    } catch (err) {
      console.log("Something went wrong");
    }
  }
  _renderCountry(data) {
    countriesContainer.textContent = "";
    data.forEach((element) => {
      const countryCard = `
      <div data-country="${element.name}" class="card">
      <img src=${element.flags.png} alt="flag" class="flag" />
      <div class="text_container">
        <h2 class="heading-2 country">${element.name}</h2>
        <p class="paragraph"><span>Population:</span> ${element.population}</p>
        <p class="paragraph"><span>Region:</span> ${element.region}</p>
        <p class="paragraph"><span>Capital:</span> ${
          element.capital ? element.capital : "No Capital"
        }</p>
      </div>
    </div>
        
        
        `;
      countriesContainer.insertAdjacentHTML("beforeend", countryCard);
    });
  }
  async _searchingCountries() {
    if (!searchInput.value) {
      this._renderCountry(this.#data);
    } else {
      let country = searchInput.value;
      const response = await fetch(
        `https://restcountries.com/v2/name/${country}`
      );
      const data = await response.json();

      this._renderCountry(data);
    }
  }
  _renderByRegion() {
    if (selectBtn.value === "default") {
      this._renderCountry(this.#data);
    } else {
      const dataByRegion = this.#data.filter(
        (element) => element.region === selectBtn.value
      );
      this._renderCountry(dataByRegion);
    }
  }
  _moreInfoFn(e) {
    try {
      if (!e.target.closest(".card")) return;
      const card = e.target.closest(".card");
      const countryName = card.dataset.country;
      const filteredArr = this.#data.filter((element) => {
        return element.name === countryName;
      });
      console.log("filteredArr: ", filteredArr);

      const infoHtml = `
          <img src="${filteredArr[0].flags.png}" alt="flag" class="info__img" />
          <div class="info__box">
            <h2 class="heading-2">Country ${filteredArr[0]?.name}</h2>
            <p class="paragraph"><span>Native Name:</span>${
              filteredArr[0].nativeName
            }</p>
            <p class="paragraph"><span>Population:</span>${
              filteredArr[0].population
            }</p>
            <p class="paragraph"><span>Region:</span>${
              filteredArr[0].region
            }</p>
            <p class="paragraph"><span>Sub Region:</span>${
              filteredArr[0].subregion
            }</p>
            <p class="paragraph"><span>Capital:</span>${
              filteredArr[0].capital ? filteredArr[0].capital : "No capital"
            }</p>
            <p class="paragraph"><span>Top Level Domain:</span>${
              filteredArr[0]?.topLevelDomain
            }</p>
            <p class="paragraph"><span>Currency:</span>${
              filteredArr[0].currencies
                ? filteredArr[0]?.currencies[0]?.name
                : "No currency name"
            }</p>
            <p class="paragraph"><span>Language:</span>${
              filteredArr[0].languages[0].name
            }</p>
          </div>
          <div class="border_countries">
            <p class="paragraph">
              <span class="border_country_title">Border Countries: </span>
            
            </p>
          </div>
        `;

      moreInfoContainer.textContent = "";
      moreInfoContainer.insertAdjacentHTML("beforeend", infoHtml);
      this._hiddenToggleFn();

      this._borderCountryRenderer(
        filteredArr[0].borders ? filteredArr[0].borders : []
      );
    } catch (err) {
      alert("Something went wrong with API,Try with other country");
    }
  }
  async _borderCountryRenderer(arr) {
    console.log(arr);
    if (arr.length === 0) {
      const borderCountriesHtml = `
   <button class="btn btn--border">This country does not have borders</button>
   `;
      document
        .querySelector(".border_country_title")
        .insertAdjacentHTML("beforeend", borderCountriesHtml);
    }
    arr.forEach((eachOne) => {
      try {
        (async function () {
          const response = await fetch(
            `https://restcountries.com/v2/alpha/${eachOne}`
          );

          const data = await response.json();
          const borderCountriesHtml = `
         <button class="btn btn--border">${data.name}</button>
         `;
          document
            .querySelector(".border_country_title")
            .insertAdjacentHTML("beforeend", borderCountriesHtml);
        })();
      } catch (err) {}
    });
  }
  _hiddenToggleFn() {
    searchBar.classList.toggle("hidden");
    countriesContainer.classList.toggle("hidden");
    moreInfoContainer.classList.toggle("hidden");
    btnBack.classList.toggle("hidden");
  }
  _goBackFn() {
    this._hiddenToggleFn();
    this._renderCountry(this.#data);
  }
  _enterBtnFn(e) {
    const enter = e.key;

    if (enter !== "Enter") return;

    this._searchingCountries();
  }
}
const main = new Main();

const init = function () {
  const textElement = document.querySelector(".textElement");
  const wordsArr = JSON.parse(textElement.dataset.words);
  const wait = parseInt(textElement.dataset.wait);
  new TypeWriting(textElement, wordsArr, wait);
};

class TypeWriting {
  constructor(textElement, wordsArr, wait) {
    this.textElement = textElement;
    this.wordsArr = wordsArr;
    this.wait = wait;
    this.txt = "";
    this.wordIndex = 0;
    this.type();
    this.isDeleting = false;
  }
  type() {
    // getting the word in the first index of wordsArr

    const current = this.wordIndex % this.wordsArr.length;
    const fullText = this.wordsArr[current];
    if (this.isDeleting) {
      //remove character
      this.txt = fullText.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullText.substring(0, this.txt.length + 1);
    }
    this.textElement.innerHTML = `<span class="txt">${this.txt}</span>`;
    //timeSpeed
    let timeSpeed = 300;
    if (this.isDeleting) {
      timeSpeed /= 2;
    }
    if (this.txt === fullText && !this.isDeleting) {
      timeSpeed = this.wait;
      this.isDeleting = true;
    }
    if (this.txt === "" && this.isDeleting) {
      //move to next word
      this.wordIndex++;
      this.isDeleting = false;
      timeSpeed = 500;
    }

    setTimeout(() => this.type(), timeSpeed);
  }
}

document.addEventListener("DOMContentLoaded", init);
