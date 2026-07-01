const Settings = {
    init() {
        this.bindEvents();
        this.initTTS();
    },

    initTTS() {
        const voiceSel = document.getElementById('tts-voice-select');
        if (!voiceSel) return; // widok ustawien nieobecny w DOM
        if (!window.LearnTTS || !window.LearnTTS.enabled) {
            const card = voiceSel.closest('.glass-card');
            if (card) card.innerHTML = '<h2>🔊 Czytanie na głos</h2><p class="small-text warning-text">Ta przeglądarka nie obsługuje czytania na głos (Web Speech API).</p>';
            return;
        }

        const cfg = Store._data.settings.tts || { voiceURI: '', rate: 1, pitch: 1, volume: 1 };
        const rateEl = document.getElementById('tts-rate');
        const pitchEl = document.getElementById('tts-pitch');
        const volEl = document.getElementById('tts-volume');
        const rateVal = document.getElementById('tts-rate-val');
        const pitchVal = document.getElementById('tts-pitch-val');
        const volVal = document.getElementById('tts-volume-val');
        const testBtn = document.getElementById('tts-test-btn');
        const statusEl = document.getElementById('tts-status');

        rateEl.value = cfg.rate;
        pitchEl.value = cfg.pitch;
        volEl.value = cfg.volume;
        rateVal.textContent = Number(cfg.rate).toFixed(2) + '×';
        pitchVal.textContent = Number(cfg.pitch).toFixed(2);
        volVal.textContent = Math.round(cfg.volume * 100) + '%';

        const populateVoices = () => {
            const voices = window.LearnTTS.listVoices();
            if (!voices.length) return;
            const prevSelection = voiceSel.value || cfg.voiceURI;
            voiceSel.innerHTML = '<option value="">Automatyczny (najlepszy polski)</option>' +
                voices.map(v => `<option value="${v.voiceURI.replace(/"/g, '&quot;')}">${v.name} (${v.lang})</option>`).join('');
            if (prevSelection && voices.some(v => v.voiceURI === prevSelection)) voiceSel.value = prevSelection;
        };
        populateVoices();
        // niektore przegladarki laduja liste glosow asynchronicznie (np. dopiero po pierwszej interakcji)
        if (window.speechSynthesis) speechSynthesis.addEventListener('voiceschanged', populateVoices);

        const persist = () => {
            Store._data.settings.tts = {
                voiceURI: voiceSel.value || '',
                rate: parseFloat(rateEl.value),
                pitch: parseFloat(pitchEl.value),
                volume: parseFloat(volEl.value)
            };
            Store.save();
        };

        voiceSel.addEventListener('change', persist);
        rateEl.addEventListener('input', () => { rateVal.textContent = Number(rateEl.value).toFixed(2) + '×'; persist(); });
        pitchEl.addEventListener('input', () => { pitchVal.textContent = Number(pitchEl.value).toFixed(2); persist(); });
        volEl.addEventListener('input', () => { volVal.textContent = Math.round(volEl.value * 100) + '%'; persist(); });

        testBtn.addEventListener('click', () => {
            window.LearnTTS.speak('Cześć! Tak brzmi ten głos podczas czytania lekcji o finansach i rachunkowości.', testBtn);
            if (statusEl) { statusEl.textContent = 'Odtwarzanie…'; setTimeout(() => { statusEl.textContent = ''; }, 4000); }
        });
    },

    bindEvents() {
        const btnExport = document.getElementById('btn-export');
        const btnImport = document.getElementById('btn-import');
        const btnReset = document.getElementById('btn-reset');
        
        if(btnExport) {
            btnExport.addEventListener('click', () => {
                const dataStr = Store.exportData();
                const blob = new Blob([dataStr], {type: "application/json"});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `egzaminFiR_backup_${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
            });
        }
        
        if(btnImport) {
            btnImport.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'application/json';
                input.onchange = e => {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onload = event => {
                        if(Store.importData(event.target.result)) {
                            alert("Import udany! Strona zostanie odświeżona.");
                            location.reload();
                        } else {
                            alert("Błąd: Nieprawidłowy plik kopii zapasowej.");
                        }
                    };
                    reader.readAsText(file);
                };
                input.click();
            });
        }
        
        if(btnReset) {
            btnReset.addEventListener('click', () => {
                if(confirm("Czy NA PEWNO chcesz usunąć wszystkie postępy i statystyki? Tej operacji nie można cofnąć!")) {
                    Store.clearAll();
                }
            });
        }
    }
};
