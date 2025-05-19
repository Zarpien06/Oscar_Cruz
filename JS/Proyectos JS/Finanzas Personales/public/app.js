async function cargarTransacciones() {
    const res = await fetch('/api/transacciones');
    const data = await res.json();
    const lista = document.getElementById('lista');
    const total = document.getElementById('total');
    lista.innerHTML = '';
    let suma = 0;

    data.forEach(t => {
        const li = document.createElement('li');
        const clase = t.tipo === 'ingreso' ? 'tipo-ingreso' : 'tipo-gasto';
        li.innerHTML = `
            <span class="${clase}">${t.tipo === 'ingreso' ? '+' : '-'} $${t.monto.toFixed(2)} - ${t.descripcion}</span>
            <button onclick="eliminarTransaccion(${t.id})">✖</button>
        `;
        lista.appendChild(li);
        suma += t.tipo === 'ingreso' ? t.monto : -t.monto;
    });

    total.textContent = `Total: $${suma.toFixed(2)}`;
}

async function agregarTransaccion() {
    const descripcion = document.getElementById('descripcion').value;
    const monto = document.getElementById('monto').value;
    const tipo = document.getElementById('tipo').value;

    if (!descripcion || !monto) return alert('Completa todos los campos.');

    await fetch('/api/transacciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, descripcion, monto })
    });

    document.getElementById('descripcion').value = '';
    document.getElementById('monto').value = '';
    cargarTransacciones();
}

async function eliminarTransaccion(id) {
    await fetch(`/api/transacciones/${id}`, { method: 'DELETE' });
    cargarTransacciones();
}

cargarTransacciones();