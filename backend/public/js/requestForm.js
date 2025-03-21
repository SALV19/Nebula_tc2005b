document.addEventListener("DOMContentLoaded", function () { 
    const openBtn = document.getElementById("openRequestForm");
    const closeBtn = document.getElementById("closeRequestForm");
    const requestPopup = document.getElementById("requestPopup");

    // Verifica si los elementos existen
    if (!openBtn || !closeBtn || !requestPopup) {
        console.error("Error: No se encontraron los elementos del pop-up.");
        return;
    }

    // Abrir pop-up
    openBtn.addEventListener("click", () => {
        requestPopup.style.display = "flex";
    });

    // Cerrar pop-up
    closeBtn.addEventListener("click", () => {
        requestPopup.style.display = "none";
    });
});
