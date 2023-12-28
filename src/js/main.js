import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import axios from "axios";

import infoIcon from "/info.svg";
import errorIcon from "/close-message.svg";

const form = document.getElementById("form");
const loader = document.querySelector(".loader");
const input = form.elements.userInput;
const imagesList = document.getElementById("results");
const more = document.getElementById("more");

// light create SimpleLightBox
const lightbox = new SimpleLightbox("#results .card-link", {
  captionDelay: 250,
  captionsData: "alt",
});

// Set axios defaults
const perPage = 40;
axios.defaults.baseURL = `https://pixabay.com/api/`;
axios.defaults.params = {
  key: "41489531-fbd647ce3ca134c20e68a1b0d",
  orientation: "horizontal",
  safesearch: true,
  image_type: "photo",
  per_page: perPage,
};

// add event listeners
form.addEventListener("submit", onFormSubmit);
more.addEventListener("click", onMore);

let currentPage;
let query;

async function onFormSubmit(evt) {
  evt.preventDefault();

  const separateSign = "+";
  query = input.value
    .trim()
    .replace(" ", separateSign)
    .replace(",", separateSign);

  currentPage = 1;
  await findAndFill();
}

async function onMore() {
  currentPage++;
  await findAndFill();
  const card = document.querySelector(".results-item");
  const cardHeight2X = card.getBoundingClientRect().height * 2;
  console.log(card);
  window.scrollBy({
    top: cardHeight2X,
    behavior: "smooth"
  });
}

async function findAndFill() {
  if (currentPage === 1) {
    imagesList.innerHTML = "";
  }
  loader.style.display = "block";
  more.style.display = "none";

  try {
    const res = await axios.get("", {
      params: {
        q: query,
        page: currentPage,
      },
    });

    const data = res.data;
    const totalHits = data.totalHits;
    const maximumPage = totalHits / perPage;

    const hits = data.hits;

    if (totalHits === 0) {
      showError(
        "Sorry, there are no images matching your search query. Please try again!"
      );
    } else if (maximumPage - currentPage < 1) {
      showInfo("We're sorry, but you've reached the end of search results.");
      more.style.display = "none";
    } else {
      more.style.display = "inline-block";
    }

    fillImagesList(hits);
    form.reset();
    loader.style.display = "none";
  } catch (err) {
    console.error(err);
    showError("Something unexpected happened! Check the console.");
  }
}

function showError(errorText) {
  iziToast.error({
    message: errorText,
    maxWidth: "380px",
    messageSize: 16,
    position: "topRight",
    iconUrl: errorIcon,
    theme: "dark",
    color: "#fff",
    backgroundColor: "#EF4040",
    messageColor: "#fff",
    titleColor: "#fff",
    iconColor: "#fff",
  });
}

function showInfo(infoText) {
  iziToast.info({
    message: infoText,
    maxWidth: "380px",
    messageSize: 16,
    position: "topRight",
    iconUrl: infoIcon,
    theme: "dark",
    color: "#fff",
    backgroundColor: "#4e75ff",
    messageColor: "#fff",
    titleColor: "#fff",
    iconColor: "#fff",
  });
}

function fillImagesList(hits) {
  const listItems = [];

  hits.forEach(hit => {
    const li = document.createElement("li");
    li.className = "results-item";
    li.innerHTML = `
    <a class="card-link" href="${hit.largeImageURL}">
      <img class="card-image" src="${hit.webformatURL}" alt="${hit.tags}" />
    </a>
    <table class="image-description-table">
      <tr class="description-row">
        <th class="description-column">Likes</th>
        <th class="description-column">Views</th>
        <th class="description-column">Comments</th>
        <th class="description-column">Downloads</th>
      </tr>
      <tr class="description-row">
        <td class="description-column">${hit.likes}</td>
        <td class="description-column">${hit.views}</td>
        <td class="description-column">${hit.comments}</td>
        <td class="description-column">${hit.downloads}</td>
      </tr>
    </table>
    `;

    listItems.push(li);
  });

  imagesList.append(...listItems);

  lightbox.refresh();
}
