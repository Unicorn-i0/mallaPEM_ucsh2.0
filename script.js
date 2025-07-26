document.addEventListener('DOMContentLoaded', () => {
    // --- BASE DE DATOS DE CURSOS ---
    // Extraído de tu archivo maya.xlsx. Si necesitas cambiar algo, hazlo aquí.
    const cursosDB = [
      { id: '1', semestre: 1, nombre: 'CURSO 1', creditos: 5, tipo: 'disciplinar', prerequisitos: [], hito: false },
      { id: '2', semestre: 1, nombre: 'CURSO 2', creditos: 5, tipo: 'disciplinar', prerequisitos: [], hito: false },
      { id: '3', semestre: 1, nombre: 'CURSO 3', creditos: 5, tipo: 'pedagogico', prerequisitos: [], hito: false },
      { id: '4', semestre: 1, nombre: 'CURSO 4', creditos: 5, tipo: 'formacion-general', prerequisitos: [], hito: false },
      { id: '5', semestre: 1, nombre: 'CURSO 5', creditos: 5, tipo: 'optativo', prerequisitos: [], hito: false },
      { id: '6', semestre: 2, nombre: 'CURSO 6', creditos: 5, tipo: 'disciplinar', prerequisitos: ['1'], hito: false },
      { id: '7', semestre: 2, nombre: 'CURSO 7', creditos: 5, tipo: 'disciplinar', prerequisitos: ['2'], hito: false },
      { id: '8', semestre: 2, nombre: 'CURSO 8', creditos: 5, tipo: 'pedagogico', prerequisitos: ['3'], hito: true },
      { id: '9', semestre: 2, nombre: 'CURSO 9', creditos: 5, tipo: 'formacion-general', prerequisitos: [], hito: false },
      { id: '10', semestre: 2, nombre: 'CURSO 10', creditos: 5, tipo: 'optativo', prerequisitos: [], hito: false },
      { id: '11', semestre: 3, nombre: 'CURSO 11', creditos: 5, tipo: 'disciplinar', prerequisitos: ['6', '7'], hito: false },
      { id: '12', semestre: 3, nombre: 'CURSO 12', creditos: 5, tipo: 'disciplinar', prerequisitos: ['7'], hito: true },
    ];

    const container = document.getElementById('malla-container');
    const creditosAprobadosEl = document.getElementById('creditos-aprobados');
    const resetButton = document.getElementById('reset-button');
    let cursosAprobados = new Set(JSON.parse(localStorage.getItem('cursosAprobados')) || []);

    const renderMalla = () => {
        container.innerHTML = '';
        const maxSemestre = Math.max(...cursosDB.map(c => c.semestre));
        
        for (let i = 1; i <= maxSemestre; i++) {
            const semestreColumna = document.createElement('div');
            semestreColumna.classList.add('semestre-columna');
            semestreColumna.innerHTML = `<div class="semestre-titulo">Semestre ${i}</div>`;
            
            cursosDB.filter(c => c.semestre === i).forEach(curso => {
                const cursoDiv = document.createElement('div');
                cursoDiv.classList.add('curso');
                cursoDiv.dataset.id = curso.id;
                
                const prerequisitosCumplidos = curso.prerequisitos.every(pr => cursosAprobados.has(pr));
                
                // Aplicar clases de estado y tipo
                if (cursosAprobados.has(curso.id)) {
                    cursoDiv.classList.add('aprobado');
                } else if (prerequisitosCumplidos) {
                    cursoDiv.classList.add('disponible');
                } else {
                    cursoDiv.classList.add('bloqueado');
                }

                cursoDiv.classList.add(curso.tipo.replace(/\s+/g, '-').toLowerCase());
                if(curso.hito) {
                    cursoDiv.classList.add('hito');
                }
                
                cursoDiv.innerHTML = `
                    <div class="curso-nombre">${curso.nombre}</div>
                    <div class="curso-creditos">Créditos: ${curso.creditos}</div>
                `;
                
                cursoDiv.addEventListener('click', () => toggleAprobacion(curso, prerequisitosCumplidos));
                semestreColumna.appendChild(cursoDiv);
            });
            container.appendChild(semestreColumna);
        }
        actualizarCreditos();
    };

    const toggleAprobacion = (curso, prerequisitosCumplidos) => {
        if (cursosAprobados.has(curso.id)) {
            // No se puede des-aprobar para simplificar la lógica
            return; 
        }

        if (prerequisitosCumplidos) {
            cursosAprobados.add(curso.id);
            actualizarEstado();
        }
    };

    const actualizarCreditos = () => {
        const totalCreditos = Array.from(cursosAprobados).reduce((acc, id) => {
            const curso = cursosDB.find(c => c.id === id);
            return acc + (curso ? curso.creditos : 0);
        }, 0);
        creditosAprobadosEl.textContent = totalCreditos;
    };
    
    const actualizarEstado = () => {
        localStorage.setItem('cursosAprobados', JSON.stringify(Array.from(cursosAprobados)));
        renderMalla();
    };

    resetButton.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres reiniciar el progreso de la malla?')) {
            cursosAprobados.clear();
            actualizarEstado();
        }
    });

    // Iniciar la aplicación
    renderMalla();
});
