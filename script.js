'use strict';
//////////////////////////////////////////////////////////////////////////
const map = document.querySelector('.europe-map');
const flag = document.querySelector('.flag-container');
const infoBox = document.querySelector('.icons-and-info-container');
//////////////////////////////////////////////////////////////////////////
const countryName = document.querySelector('.resolved.country-name');
const countryContinent = document.querySelector('.resolved.country-continent');
const countryPopulation = document.querySelector('.resolved.population');
const countryLanguage = document.querySelector('.resolved.language');
const countryCurrency = document.querySelector('.resolved.currency');
const countryCapital = document.querySelector('.resolved.capital');
const countryLocation = document.querySelector('.resolved.location');

//////////////////////////////////////////////////////////////////////////
const modal = document.querySelector('.initial-modal-background');
const closeButton = document.querySelector('.close-modal');
//////////////////////////////////////////////////////////////////////////
window.addEventListener('load', function () {
  modal.classList.remove('hidden');
  modal.classList.add('visible');
});
/* ///////////////////////////////////////////////////// */
// Map hover effect
/* ///////////////////////////////////////////////////// */
map.addEventListener('mouseover', function (e) {
  if (e.target.classList.contains('st1')) {
    document.getElementById(`${e.target.id}`).classList.remove('st1');
    document.getElementById(`${e.target.id}`).classList.add('st0');
  }
});
map.addEventListener('mouseout', function (e) {
  if (e.target.classList.contains('st0')) {
    document.getElementById(`${e.target.id}`).classList.remove('st0');
    document.getElementById(`${e.target.id}`).classList.add('st1');
  }
});
/* ///////////////////////////////////////////////////// */
// Main function, click on the random country to get it's data displayed
/* ///////////////////////////////////////////////////// */
map.addEventListener('click', function (e) {
  if (e.target.id === 'Layer_1') return; // Guard clause
  //////////////////////////////////////////////////////////////////////////
  const currentCountry = checkId(e.target.id.split('_'));
  //////////////////////////////////////////////////////////////////////////
  
  const getDataFromApi = async function (country) {
    try {
      renderSpinner(flag);
      const response = await Promise.race([
        fetch(`https://api.countrylayer.com/v2/name/{country}
    ? access_key = 1b3b9343c4887a256ef2a996fea0d56f & FullText=`),
        timeout(5),
      ]);
      const data = await response.json();
      renderData(data);
    } catch (err) {
      renderError(flag, err);
    }
  };
  getDataFromApi(currentCountry);
});
//////////////////////////////////////////////////////////////////////////
// Inserting and rendering data
//////////////////////////////////////////////////////////////////////////
function renderData(data) {
  //////////////////////////////////////////////////////////////////////////
  flag.innerHTML = '';
  flag.style.backgroundImage = `url(${data[0].flag})`;
  //////////////////////////////////////////////////////////////////////////
  countryName.textContent = data[0].name;
  countryContinent.textContent = data[0].subregion;
  //////////////////////////////////////////////////////////////////////////
  countryPopulation.textContent = `${(data[0].population / 1000000).toFixed(
    2
  )}M`;
  //////////////////////////////////////////////////////////////////////////
  if (data[0].name === 'Norway') {
    countryLanguage.textContent = data[0].languages[0].name;
  } else {
    countryLanguage.textContent =
      data[0].languages.length > 1
        ? data[0].languages.map(lang => lang.name)
        : data[0].languages[0].name;
  }
  //////////////////////////////////////////////////////////////////////////
  countryCurrency.textContent =
    data[0].name === 'Bosnia and Herzegovina'
      ? 'BiH Convertible Mark'
      : data[0].currencies[0].name;
  //////////////////////////////////////////////////////////////////////////
  countryCapital.textContent = data[0].capital;
  countryLocation.textContent = `Lat: ${data[0].latlng[0].toFixed(
    2
  )}, Lng: ${data[0].latlng[1].toFixed(2)}`;
}
//////////////////////////////////////////////////////////////////////////
// CheckId function parses id's from SVG map, after clicking on the random country.
//////////////////////////////////////////////////////////////////////////
function checkId(arr) {
  return arr.filter(el => el[0] !== 'x' && el != +el).join(' ');
}
//////////////////////////////////////////////////////////////////////////
// Render Spinner
//////////////////////////////////////////////////////////////////////////
function renderSpinner(element) {
  const markup = `
<div class="spinner-container">
  <img src="img/Spinner-blue.png" alt="Spinning Loader" class="spinner" />
</div>;
`;
  element.innerHTML = '';

  element.insertAdjacentHTML('afterbegin', markup);
}
//////////////////////////////////////////////////////////////////////////
// Error Handling Message
//////////////////////////////////////////////////////////////////////////

function renderError(element, err) {
  const markup = ` <div class="error-container">
  <p class="error-text">
    Ooops...Something went wrong !
  </p>
  <p class="error-message">
    ${err.message} !
  </p>
  <p class="error-message">
    Please try again
  </p>
</div>`;
  element.innerHTML = '';

  element.insertAdjacentHTML('afterbegin', markup);

  textContentOnFailedFetch();
}
//////////////////////////////////////////////////////////////////////////
function textContentOnFailedFetch() {
  const resolvedOutputs = document.querySelectorAll('.resolved');
  resolvedOutputs.forEach(paragraph => (paragraph.textContent = '???'));
}
//////////////////////////////////////////////////////////////////////////
// Timeout function is used to prevent long requests in getDataFromApi ()
// with Promise.race method
//////////////////////////////////////////////////////////////////////////

function timeout(sec) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error('Request took too long'));
    }, sec * 1000);
  });
}
//////////////////////////////////////////////////////////////////////////
// Modal Functionality
//////////////////////////////////////////////////////////////////////////
function closeModal() {
  modal.classList.remove('visible');
  modal.classList.add('hidden');
  modal.style.zIndex = -5;
}
closeButton.addEventListener('click', closeModal);

modal.addEventListener('click', function (e) {
  if (e.target.classList.contains('visible')) closeModal();
});
window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && modal.classList.contains('visible')) closeModal();
});
