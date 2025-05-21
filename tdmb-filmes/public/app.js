async function adicionar() {
  try {
    const titulo = document.getElementById('titulo').value;
    if (!titulo.trim()) {
      alert('Digite um título válido');
      return;
    }

    const res = await fetch('/api/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo })
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`Erro ao adicionar filme: ${msg}`);
    }

    alert(await res.text());
    listar();
  } catch (error) {
    console.error('Erro em adicionar():', error);
    alert('Erro ao adicionar filme: ' + error.message);
  }
}

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#039;'
  }[c]));
}

async function listar() {
  try {
    const res = await fetch('/api/listar');
    if (!res.ok) {
      throw new Error(`Erro ao listar filmes: ${await res.text()}`);
    }
    
    const filmes = await res.json();
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = '';
    
    if (!Array.isArray(filmes) || filmes.length === 0) {
      resultado.innerHTML = '<p>Nenhum filme encontrado.</p>';
      return;
    }

    filmes.forEach(f => {
      resultado.innerHTML += `
        <div class="filme">
          <h3>${escapeHtml(f.titulo)}</h3>
          <p><strong>Data:</strong> ${escapeHtml(f.data)}</p>
          <p>${escapeHtml(f.sinopse)}</p>
          ${f.poster ? `<img src="${escapeHtml(f.poster)}" alt="Poster do filme ${escapeHtml(f.titulo)}" />` : ''}
          <br>
          <button onclick="excluir('${escapeHtml(f.titulo)}')">Excluir</button>
          <button onclick="editar('${escapeHtml(f.titulo)}')">Editar</button>
        </div>
      `;
    });
  } catch (error) {
    console.error('Erro em listar():', error);
    alert('Erro ao listar filmes: ' + error.message);
  }
}

async function excluir(titulo) {
  try {
    if (!confirm(`Deseja excluir o filme "${titulo}"?`)) return;
    
    const res = await fetch(`/api/excluir/${encodeURIComponent(titulo)}`, {
      method: 'DELETE'
    });

    if (!res.ok) {
      throw new Error(`Erro ao excluir filme: ${await res.text()}`);
    }

    alert(await res.text());
    listar();
  } catch (error) {
    console.error('Erro em excluir():', error);
    alert('Erro ao excluir filme: ' + error.message);
  }
}

async function editar(titulo) {
  try {
    const novaSinopse = prompt(`Nova sinopse para "${titulo}":`);
    if (!novaSinopse) return;

    const res = await fetch(`/api/editar/${encodeURIComponent(titulo)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sinopse: novaSinopse })
    });

    if (!res.ok) {
      throw new Error(`Erro ao editar filme: ${await res.text()}`);
    }

    alert(await res.text());
    listar();
  } catch (error) {
    console.error('Erro em editar():', error);
    alert('Erro ao editar filme: ' + error.message);
  }
}

listar();