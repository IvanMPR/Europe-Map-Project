const map = document.querySelector('.europe-map');
const flag = document.querySelector('.flag-container');
const infoBox = document.querySelector('.icons-and-info-container');
/* ********************************************** */
const countryName = document.querySelector('.resolved.country-name');
const countryContinent = document.querySelector('.resolved.country-continent');
const countryPopulation = document.querySelector('.resolved.population');
const countryLanguage = document.querySelector('.resolved.language');
const countryCurrency = document.querySelector('.resolved.currency');
const countryCapital = document.querySelector('.resolved.capital');
const countryLocation = document.querySelector('.resolved.location');
const flagContainer = document.querySelector('.flag-container');
const spinnerContainer = document.querySelector('.spinner-container');
/* ********************************************** */
const modal = document.querySelector('.initial-modal-background');
const closeButton = document.querySelector('.close-modal');
/* ********************************************** */
window.addEventListener('load', function () {
  modal.classList.remove('hidden');
  modal.classList.add('visible');
});

function closeModal() {
  modal.classList.remove('visible');
  modal.classList.add('hidden');
  modal.style.zIndex = '-5';
}
closeButton.addEventListener('click', closeModal);
modal.addEventListener('click', function (e) {
  console.log(e.target);
  if (e.target.classList.contains('visible')) closeModal();
});
window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && modal.style.zIndex !== '-5') closeModal();
});
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

map.addEventListener('click', function (e) {
  if (e.target.id === 'Layer_1') return;
  const currentCountry = checkId(e.target.id.split('_'));

  console.log(e.target.id.split('_'));
  const getDataFromApi = function (country) {
    // renderSpinner(flagContainer);
    // showSpinner();
    fetch(`https://restcountries.eu/rest/v2/name/${country}`)
      .then(function (response) {
        console.log(response);
        return response.json();
      })
      .then(data => renderData(data))
      .catch(err => console.error(err));
  };

  getDataFromApi(currentCountry);
});
// console.log(
// window.screen.availHeight - (window.outerHeight - window.innerHeight)
// );
// console.log(window.screen.availWidth - (window.outerWidth - window.innerWidth));
function renderData(data) {
  console.log(data);
  console.log(`url(${data[0].flag})`);
  // showSpinner();
  /* ********************************************** */
  flag.style.backgroundImage = `url(${data[0].flag})`;
  flag.style.backgroundPosition = `center`;
  flag.style.backgroundSize = `cover`;
  /* ********************************************** */
  countryName.textContent = data[0].name;
  countryContinent.textContent = data[0].subregion;
  /* ********************************************** */
  countryPopulation.textContent = `${(data[0].population / 1000000).toFixed(
    2
  )}M`;
  /* ********************************************** */
  if (data[0].name === 'Norway') {
    countryLanguage.textContent = data[0].languages[0].name;
  } else {
    countryLanguage.textContent =
      data[0].languages.length > 1
        ? data[0].languages.map(lang => lang.name)
        : data[0].languages[0].name;
  }
  /* ********************************************** */
  countryCurrency.textContent =
    data[0].name === 'Bosnia and Herzegovina'
      ? 'BiH Convertible Mark'
      : data[0].currencies[0].name;
  /* ********************************************** */
  countryCapital.textContent = data[0].capital;
  countryLocation.textContent = `Lat: ${data[0].latlng[0].toFixed(
    2
  )}, Lng: ${data[0].latlng[1].toFixed(2)}`;
}
function checkId(arr) {
  return arr.filter(el => el[0] !== 'x' && el != +el).join(' ');
}

function showSpinner() {
  if (flagContainer.style.backgroundImage.src === 'img/Empty-flag.png') {
    spinnerContainer.style.zIndex = '10';
  } else {
    spinnerContainer.style.zIndex = '-10';
  }
}

// function _clear() {
//   this._parentElement.innerHTML = '';
// }

// function renderSpinner(element) {
//   const markup = `
// <div class="spinner-container">
//   <img src="img/Spinner-yellow.png" alt="Spinning Loader" class="spinner" />
// </div>;

//   `;
//   element.innerHTML = '';
//   // this._clear();
//   element.insertAdjacentHTML('afterbegin', markup);
// }
