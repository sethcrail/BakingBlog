const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");

function openModal(photoSrc) {
    console.log(photoSrc);
    modalImg.src = photoSrc;
    modal.showModal();
}

function closeModal() {
    modal.close();
}

