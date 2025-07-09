const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const selectAno = document.getElementById('selectAno');
const selectMes = document.getElementById('selectMes');
const selectSemana = document.getElementById('selectSemana');
const agendaContainer = document.getElementById('agendaContainer');
const contadorDiv = document.getElementById('contadorCliques');
const limparBtn = document.getElementById('limparTarefasBtn');

let contadorCliques = parseInt(localStorage.getItem('contadorCliques')) || 0;

function atualizarContador() {
  contadorDiv.textContent = `Tarefas adicionadas: ${contadorCliques}`;
}

const anoAtual = new Date().getFullYear();
for (let i = anoAtual - 2; i <= anoAtual + 2; i++) {
  const option = document.createElement('option');
  option.value = i;
  option.textContent = i;
  if (i === anoAtual) option.selected = true;
  selectAno.appendChild(option);
}

meses.forEach((mes, index) => {
  const option = document.createElement('option');
  option.value = index;
  option.textContent = mes;
  if (index === new Date().getMonth()) option.selected = true;
  selectMes.appendChild(option);
});

function atualizarSemanas() {
  selectSemana.innerHTML = '';
  const ano = parseInt(selectAno.value);
  const mes = parseInt(selectMes.value);
  const primeiroDia = new Date(ano, mes, 1);
  const ultimoDia = new Date(ano, mes + 1, 0);
  const semanas = Math.ceil((primeiroDia.getDay() + ultimoDia.getDate()) / 7);

  for (let i = 0; i < semanas; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `Semana ${i + 1}`;
    selectSemana.appendChild(option);
  }
}

function salvarTarefas() {
  const ano = selectAno.value;
  const mes = selectMes.value;
  const semana = selectSemana.value;
  const chave = `tarefas-${ano}-${mes}-${semana}`;
  const tarefas = [];
  dias.forEach((_, diaIndex) => {
    const ul = document.getElementById(`lista-${diaIndex}`);
    const tarefasDia = [];
    ul.querySelectorAll('li').forEach(li => {
      tarefasDia.push({
        texto: li.querySelector('span').textContent,
        feito: li.querySelector('input[type="checkbox"]').checked
      });
    });
    tarefas.push(tarefasDia);
  });
  localStorage.setItem(chave, JSON.stringify(tarefas));
}

function carregarTarefas() {
  agendaContainer.innerHTML = '';
  dias.forEach((dia, index) => {
    const div = document.createElement('div');
    div.className = 'dia';
    div.innerHTML = `
      <h2>${dia}</h2>
      <ul id="lista-${index}"></ul>
      <input class="tarefa-input" id="input-${index}" type="text" placeholder="Nova tarefa...">
      <button onclick="adicionarTarefa(${index})">Adicionar</button>
    `;
    agendaContainer.appendChild(div);
  });

  const ano = selectAno.value;
  const mes = selectMes.value;
  const semana = selectSemana.value;
  const chave = `tarefas-${ano}-${mes}-${semana}`;
  const tarefasSalvas = JSON.parse(localStorage.getItem(chave)) || [];

  tarefasSalvas.forEach((tarefasDia, diaIndex) => {
    const ul = document.getElementById(`lista-${diaIndex}`);
    tarefasDia.forEach(tarefa => {
      const li = document.createElement('li');
      li.innerHTML = `<input type="checkbox" ${tarefa.feito ? 'checked' : ''}> <span>${tarefa.texto}</span>`;
      ul.appendChild(li);
    });
  });
}

function adicionarTarefa(diaIndex) {
  const input = document.getElementById(`input-${diaIndex}`);
  const lista = document.getElementById(`lista-${diaIndex}`);

  if (input.value.trim() !== '') {
    const li = document.createElement('li');
    li.innerHTML = `<input type="checkbox"> <span>${input.value}</span>`;
    lista.appendChild(li);
    input.value = '';

    contadorCliques++;
    localStorage.setItem('contadorCliques', contadorCliques);
    atualizarContador();

    salvarTarefas();
  }
}

function limparTarefas() {
  const ano = selectAno.value;
  const mes = selectMes.value;
  const semana = selectSemana.value;
  const chave = `tarefas-${ano}-${mes}-${semana}`;

  localStorage.removeItem(chave);
  contadorCliques = 0;
  localStorage.setItem('contadorCliques', contadorCliques);
  atualizarContador();
  carregarTarefas();
}

// Ouvintes
selectAno.addEventListener('change', () => {
  atualizarSemanas();
  carregarTarefas();
});

selectMes.addEventListener('change', () => {
  atualizarSemanas();
  carregarTarefas();
});

selectSemana.addEventListener('change', carregarTarefas);
limparBtn.addEventListener('click', limparTarefas);

atualizarSemanas();
carregarTarefas();
atualizarContador();
