const Settings = {
    init() {
        this.bindEvents();
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
