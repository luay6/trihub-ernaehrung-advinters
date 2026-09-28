document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('berater-container');

    fetch('json/berater.json')
        .then(response => {
            if (!response.ok) throw new Error('Fehler beim Laden der JSON');
            return response.json();
        })
        .then(beraterDaten => {
            beraterDaten.forEach(berater => {
                const card = document.createElement('div');
                card.className = 'berater-card';

                // 1. Bekannte Listen und Zusätze verarbeiten
                let zertifikateHtml = '';
                if (berater.zertifikate && berater.zertifikate.length > 0) {
                    zertifikateHtml = `<h4 class="bio-title" style="margin-top: 16px;">Zertifikate</h4><ul class="berater-liste">`;
                    berater.zertifikate.forEach(zert => {
                        zertifikateHtml += `<li>${zert}</li>`;
                    });
                    zertifikateHtml += `</ul>`;
                }

                let linksHtml = '';
                if (berater.links && berater.links.length > 0) {
                    linksHtml = `<div class="berater-links">`;
                    berater.links.forEach(link => {
                        linksHtml += `<a href="${link.url}" target="_blank" class="berater-link-btn">${link.text}</a>`;
                    });
                    linksHtml += `</div>`;
                }

                let zusatzHtml = '';
                if (berater.zusatzInfo) {
                    zusatzHtml = `<p class="berater-zusatz">${berater.zusatzInfo}</p>`;
                }

                // 2. NEU: Alle eigenen/unbekannten Felder automatisch generieren
                // Wir definieren zuerst, welche Felder Standard sind und ignoriert werden sollen
                const standardFelder = ['id', 'name', 'role', 'image', 'bioTitle', 'bioText', 'zertifikate', 'links', 'zusatzInfo'];
                let eigeneFelderHtml = '';

                // Wir durchlaufen jeden Eintrag in der JSON für diesen Berater
                for (const [schluessel, wert] of Object.entries(berater)) {
                    // Wenn das Feld kein Standardfeld ist, bauen wir daraus Überschrift + Text
                    if (!standardFelder.includes(schluessel)) {
                        eigeneFelderHtml += `
                            <h4 class="bio-title" style="margin-top: 16px; text-transform: capitalize;">${schluessel}</h4>
                            <p class="bio-text">${wert}</p>
                        `;
                    }
                }

                // 3. Die Karte zusammenbauen
                card.innerHTML = `
                    <div class="berater-image-wrapper">
                        <img src="${berater.image}" alt="${berater.name} Profilbild">
                    </div>
                    <h2 class="berater-name">${berater.name}</h2>
                    <h3 class="berater-rolle">${berater.role}</h3>
                    
                    <div class="berater-bio-box">
                        <h4 class="bio-title">${berater.bioTitle}</h4>
                        <p class="bio-text">${berater.bioText}</p>
                        
                        <!-- Hier werden deine eigenen JSON-Einträge wie "bla bla bla" platziert -->
                        ${eigeneFelderHtml}
                        
                        ${zusatzHtml}
                        ${zertifikateHtml}
                        ${linksHtml}
                    </div>
                `;

                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Fehler:', error);
            container.innerHTML = '<p style="color: #94A3B8;">Daten konnten nicht geladen werden.</p>';
        });
});