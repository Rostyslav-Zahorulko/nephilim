import images from './gallery-images.js';

const refs = {
  body: document.querySelector('body'),
};

// Создание галереи

const gallery = document.createElement('ul');
gallery.classList.add('gallery', 'js-gallery');

function createGalleryItem(item) {
  const galleryItem = document.createElement('li');
  galleryItem.classList.add('gallery__item');

  const galleryLink = document.createElement('a');
  galleryLink.classList.add('gallery__link');
  galleryLink.href = item.original;

  const galleryImage = document.createElement('img');
  galleryImage.classList.add('gallery__image');
  galleryImage.src = item.preview;
  galleryImage.dataset.sourse = item.original;
  galleryImage.alt = item.description;
  galleryImage.dataset.index = images.indexOf(item);

  galleryLink.appendChild(galleryImage);
  galleryItem.appendChild(galleryLink);

  return galleryItem;
}

const galleryItemsArray = images.map(image => createGalleryItem(image));

gallery.append(...galleryItemsArray);

refs.body.prepend(gallery);

const galleryImagesRefs = document.querySelectorAll('.gallery__image');
const galleryImagesArray = Array.from(galleryImagesRefs);

// Создание модального окна

const lightbox = document.createElement('div');
lightbox.classList.add('lightbox', 'js-lightbox');

const lightboxOverlay = document.createElement('div');
lightboxOverlay.classList.add('lightbox__overlay');

const lightboxContent = document.createElement('div');
lightboxContent.classList.add('lightbox__content');

const lightboxButton = document.createElement('button');
lightboxButton.classList.add('lightbox__button');
lightboxButton.setAttribute('type', 'button');
lightboxButton.setAttribute('data-action', 'close-lightbox');

const lightboxImage = document.createElement('img');
lightboxImage.classList.add('lightbox__image');
lightboxImage.setAttribute('src', '');
lightboxImage.setAttribute('alt', '');

lightboxContent.appendChild(lightboxImage);
lightbox.appendChild(lightboxOverlay);
lightbox.appendChild(lightboxContent);
lightbox.appendChild(lightboxButton);
gallery.after(lightbox);

// Добавление функционала

gallery.addEventListener('click', handleOnGalleryClick);
lightboxOverlay.addEventListener('click', handleOnLightboxOverlayClick);
lightboxButton.addEventListener('click', handleOnLightboxButtonClick);

function handleOnGalleryClick(event) {
  event.preventDefault();

  if (event.target.nodeName !== 'IMG') {
    return;
  }

  const image = event.target;

  openLightbox(image);
}

function handleOnLightboxOverlayClick(event) {
  if (event.target !== event.currentTarget) {
    return;
  }

  closeLightbox();
}

function handleOnLightboxButtonClick() {
  closeLightbox();
}

function handleKeyboardKeyPress(event) {
  let activeImageIndex = findActiveImageIndex();

  switch (event.code) {
    case 'ArrowLeft':
      activeImageIndex -= 1;
      changeActiveImage(activeImageIndex);
      break;

    case 'ArrowRight':
      activeImageIndex += 1;
      changeActiveImage(activeImageIndex);
      break;

    case 'Escape':
      closeLightbox();
      break;

    default:
  }
}

function openLightbox(image) {
  window.addEventListener('keydown', handleKeyboardKeyPress);

  lightbox.classList.add('is-open');
  lightboxImage.src = image.dataset.sourse;
  lightboxImage.alt = image.alt;
}

function closeLightbox() {
  window.removeEventListener('keydown', handleKeyboardKeyPress);

  lightbox.classList.remove('is-open');
  lightboxImage.src = '';
  lightboxImage.alt = '';
}

function findActiveImageIndex() {
  const activeImageSourse = lightboxImage.src;
  const imageToFind = galleryImagesArray.find(
    image => activeImageSourse === image.dataset.sourse,
  );
  const indexToFind = imageToFind.dataset.index;

  return Number(indexToFind);
}

function changeActiveImage(index) {
  if (index >= 0 && index <= galleryImagesArray.length - 1) {
    lightboxImage.src = galleryImagesArray[index].dataset.sourse;
    lightboxImage.alt = galleryImagesArray[index].alt;
  }
}
