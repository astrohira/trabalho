async function adicionar() {
  const titulo = document.getElementById('titulo').value;
  const res = await fetch('/api/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo })
  });

  alert(await res.text());
  listar();
}

async function listar() {
  const res = await fetch('/api/listar');
  const filmes = await res.json();

  const resultado = document.getElementById('resultado');
  resultado.innerHTML = '';
  filmes.forEach(f => {
    resultado.innerHTML += `
      <div class="filme">
        <h3>${f.titulo}</h3>
        <p><strong>Data:</strong> ${f.data}</p>
        <p>${f.sinopse}</p>
        ${f.poster ? `<img src="${f.poster}" />` : ''}
        <br>
        <button onclick="excluir('${f.titulo}')">Excluir</button>
        <button onclick="editar('${f.titulo}')">Editar</button>
      </div>
    `;
  });
}

async function excluir(titulo) {
  if (!confirm(`Deseja excluir o filme "${titulo}"?`)) return;
  const res = await fetch(`/api/excluir/${encodeURIComponent(titulo)}`, {
    method: 'DELETE'
  });
  alert(await res.text());
  listar();
}

async function editar(titulo) {
  const novaSinopse = prompt(`Nova sinopse para "${titulo}":`);
  if (!novaSinopse) return;

  const res = await fetch(`/api/editar/${encodeURIComponent(titulo)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sinopse: novaSinopse })
  });
  alert(await res.text());
  listar();
}

listar();