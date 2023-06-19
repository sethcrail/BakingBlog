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

modal.addEventListener("click", e => {
    const modalDimensions = modal.getBoundingClientRect();
    if (
        e.clientX < modalDimensions.left ||
        e.clientX > modalDimensions.right ||
        e.clientY < modalDimensions.top ||
        e.clientY > modalDimensions.bottom
    ) {
        modal.close();
    }
})

