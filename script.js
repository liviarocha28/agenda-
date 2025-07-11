// Dias da semana e meses do ano
const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

// Seletores do DOM
const selectAno = document.getElementById('selectAno');
const selectMes = document.getElementById('selectMes');
const selectSemana = document.getElementById('selectSemana');
const agendaContainer = document.getElementById('agendaContainer');
const contadorDiv = document.getElementById('contadorCliques');
const limparBtn = document.getElementById('limparTarefasBtn');
const temaToggleBtn = document.getElementById('temaToggleBtn');
const temaPink = document.getElementById('temaPink');

// Recupera o número de tarefas adicionadas do localStorage ou inicia com 0
let contadorCliques = parseInt(localStorage.getItem('contadorCliques')) || 0;

// Exibe o número de tarefas adicionadas
function atualizarContador() {
  contadorDiv.textContent = `Tarefas adicionadas: ${contadorCliques}`;
}

// Preenche os seletores de ano e mês
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

// Atualiza o número de semanas de acordo com o mês
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

// Salva as tarefas da semana no localStorage
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

// Carrega as tarefas da semana do localStorage
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

// Adiciona tarefa à lista e atualiza o contador
function adicionarTarefa(diaIndex) {
  const input = document.getElementById(`input-${diaIndex}`);
  const lista = document.getElementById(`lista-${diaIndex}`);

  if (input.value.trim() !== '') {
    const li = document.createElement('li');
    li.innerHTML = `<input type="checkbox"> <span>${input.value}</span>`;
    lista.appendChild(li);
    input.value = '';

    contadorCliques++; // Aumenta contador
    localStorage.setItem('contadorCliques', contadorCliques); // Salva no localStorage
    atualizarContador(); // Atualiza visualmente

    salvarTarefas();
  }
}

// Limpa as tarefas da semana atual e zera o contador
function limparTarefas() {
  const ano = selectAno.value;
  const mes = selectMes.value;
  const semana = selectSemana.value;
  const chave = `tarefas-${ano}-${mes}-${semana}`;

  localStorage.removeItem(chave); // Remove tarefas dessa semana
  contadorCliques = 0;
  localStorage.setItem('contadorCliques', contadorCliques); // Zera o contador salvo
  atualizarContador();
  carregarTarefas();
}

// Aplica o tema salvo (claro ou escuro) ao carregar a página
function aplicarTemaSalvo() {
  const tema = localStorage.getItem('tema') || 'claro';
  if (tema === 'escuro') {
    document.body.classList.add('dark-mode');
    temaToggleBtn.textContent = 'Modo Claro';
  } else if (tema==="claro"){
    document.body.classList.remove('dark-mode');
    temaToggleBtn.textContent = 'Modo Escuro';
  } else {
    document.body.classList.add('pink-mode');
    temaToggleBtn.textContent = 'Modo Pink';
  }
}


// Alterna entre modo escuro e claro
function alternarTema() {
  const modoEscuroAtivo = document.body.classList.toggle('dark-mode');
  localStorage.setItem('tema', modoEscuroAtivo ? 'escuro' : 'claro');
  temaToggleBtn.textContent = modoEscuroAtivo ? 'Modo Claro' : 'Modo Escuro';
}

//Alterna entre modo claro e pink
function temaPink() {
  const modoEscuroAtivo = document.body.classList.toggle('pink-mode');
  localStorage.setItem('tema', modoEscuroAtivo ? 'escuro' : 'claro');
  temaToggleBtn.textContent = modoEscuroAtivo ? 'Modo Claro' : 'Modo Escuro';
}



// EVENT LISTENERS — reagem a mudanças do usuário

// Quando o ano muda
selectAno.addEventListener('change', () => {
  atualizarSemanas();
  carregarTarefas();
});

// Quando o mês muda
selectMes.addEventListener('change', () => {
  atualizarSemanas();
  carregarTarefas();
});

// Quando a semana muda
selectSemana.addEventListener('change', carregarTarefas);

// Quando o botão "Limpar Tarefas" é clicado
limparBtn.addEventListener('click', limparTarefas);

// Quando o botão de tema é clicado
temaToggleBtn.addEventListener('click', alternarTema);

// Quando o botão de tema rosa é clicado
temaPink.addEventListener('click', temaPink);



// Inicializa a agenda ao abrir a página
atualizarSemanas();
carregarTarefas();
atualizarContador();
aplicarTemaSalvo();

// temaToggleBtn