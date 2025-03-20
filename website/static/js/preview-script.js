document.addEventListener('DOMContentLoaded', function () {
    // Éléments DOM
    const fileInput = document.getElementById('file-input');
    const selectFileBtn = document.getElementById('select-file-btn');
    const mediaPreview = document.getElementById('media-preview');
    const mediaControls = document.getElementById('media-controls');
    const filename = document.getElementById('filename');
    const fileDescription = document.getElementById('file-description');
    const saveDescriptionBtn = document.getElementById('save-description');
    const clearDescriptionBtn = document.getElementById('clear-description');

    // Variables pour stocker les données
    let currentFile = null;

    // Vérifier si une description existe déjà dans le localStorage
    function loadDescription() {
        const savedFilename = localStorage.getItem('currentFilename');
        if (savedFilename) {
            filename.textContent = savedFilename;
            fileDescription.value = localStorage.getItem('fileDescription_' + savedFilename) || '';
        }
    }

    // Charger la description au démarrage
    loadDescription();

    // Événement au clic sur le bouton de sélection de fichier
    selectFileBtn.addEventListener('click', function () {
        fileInput.click();
    });

    // Gestion du changement de fichier
    fileInput.addEventListener('change', function (e) {
        if (this.files && this.files[0]) {
            currentFile = this.files[0];
            displayFilePreview(currentFile);
        }
    });

    // Fonction pour afficher l'aperçu du fichier
    function displayFilePreview(file) {
        const fileType = file.type;
        filename.textContent = file.name;

        // Vider les conteneurs
        mediaPreview.innerHTML = '';
        mediaControls.innerHTML = '';

        // Récupérer la description sauvegardée si elle existe
        fileDescription.value = localStorage.getItem('fileDescription_' + file.name) || '';

        // Créer l'élément approprié selon le type de fichier
        if (fileType.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.alt = file.name;
            img.onload = function () {
                URL.revokeObjectURL(this.src);
            };
            mediaPreview.appendChild(img);
        }
        else if (fileType.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = URL.createObjectURL(file);
            video.controls = true;
            mediaPreview.appendChild(video);

            // Ajouter des contrôles supplémentaires
            createMediaControls('video');
        }
        else if (fileType.startsWith('audio/')) {
            const audioContainer = document.createElement('div');
            audioContainer.className = 'audio-container';

            const audioIcon = document.createElement('div');
            audioIcon.className = 'file-icon';
            audioIcon.innerHTML = '&#x1F3B5;';

            const audio = document.createElement('audio');
            audio.src = URL.createObjectURL(file);
            audio.controls = true;

            audioContainer.appendChild(audioIcon);
            audioContainer.appendChild(audio);
            mediaPreview.appendChild(audioContainer);

            // Ajouter des contrôles supplémentaires
            createMediaControls('audio');
        }
        else {
            // Format non pris en charge
            const unsupported = document.createElement('div');
            unsupported.className = 'placeholder';
            unsupported.innerHTML = `
                <div class="file-icon">&#x1F4C4;</div>
                <p>Format de fichier non pris en charge pour l'aperçu</p>
                <p>Type: ${fileType}</p>
            `;
            mediaPreview.appendChild(unsupported);
        }

        // Sauvegarder le nom du fichier actuel
        localStorage.setItem('currentFilename', file.name);
    }

    // Créer des contrôles personnalisés pour audio/vidéo
    function createMediaControls(type) {
        // Cette fonction peut être étendue pour ajouter des contrôles personnalisés
        // en plus des contrôles natifs
    }

    // Enregistrer la description
    saveDescriptionBtn.addEventListener('click', function () {
        const currentFilename = filename.textContent;
        if (currentFilename && currentFilename !== '') {
            localStorage.setItem('fileDescription_' + currentFilename, fileDescription.value);

            // Afficher un message de confirmation
            const saveConfirmation = document.createElement('div');
            saveConfirmation.className = 'save-confirmation';
            saveConfirmation.textContent = 'Description enregistrée !';
            saveConfirmation.style.color = 'var(--google-green)';
            saveConfirmation.style.textAlign = 'center';
            saveConfirmation.style.marginTop = '0.5rem';

            // Ajouter à la suite des boutons
            const descriptionContainer = document.querySelector('.description-container');

            // Supprimer la confirmation précédente si elle existe
            const existingConfirmation = document.querySelector('.save-confirmation');
            if (existingConfirmation) {
                existingConfirmation.remove();
            }

            descriptionContainer.appendChild(saveConfirmation);

            // Masquer après 3 secondes
            setTimeout(() => {
                saveConfirmation.remove();
            }, 3000);
        }
    });

    // Effacer la description
    clearDescriptionBtn.addEventListener('click', function () {
        fileDescription.value = '';
    });

    // Permettre le glisser-déposer sur toute la page
    document.addEventListener('dragover', function (e) {
        e.preventDefault();
    });

    document.addEventListener('drop', function (e) {
        e.preventDefault();

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            currentFile = e.dataTransfer.files[0];
            displayFilePreview(currentFile);
        }
    });
});