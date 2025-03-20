document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('file-upload');
    const fileName = document.getElementById('file-name');
    const dropArea = document.getElementById('file-drop-area');

    // Gérer le clic sur la zone de fichier
    dropArea.addEventListener('click', function () {
        fileInput.click();
    });

    // Afficher le nom du fichier sélectionné
    fileInput.addEventListener('change', function () {
        if (this.files && this.files[0]) {
            fileName.textContent = this.files[0].name;
        } else {
            fileName.textContent = 'Aucun fichier sélectionné';
        }
    });

    // Gestion du glisser-déposer
    dropArea.addEventListener('dragover', function (e) {
        e.preventDefault();
        dropArea.style.borderColor = 'var(--google-blue)';
        dropArea.style.backgroundColor = 'rgba(66, 133, 244, 0.05)';
    });

    dropArea.addEventListener('dragleave', function () {
        dropArea.style.borderColor = 'var(--google-grey)';
        dropArea.style.backgroundColor = 'transparent';
    });

    dropArea.addEventListener('drop', function (e) {
        e.preventDefault();
        dropArea.style.borderColor = 'var(--google-grey)';
        dropArea.style.backgroundColor = 'transparent';

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            fileInput.files = e.dataTransfer.files;
            fileName.textContent = e.dataTransfer.files[0].name;
        }
    });

    // Empêcher la propagation lors du clic sur l'input file caché
    fileInput.addEventListener('click', function (e) {
        e.stopPropagation();
    });
});