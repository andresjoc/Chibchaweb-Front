import React, { useEffect, useState } from 'react';
import './VistaSoporteEmpleado.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../Context/UserContext';

function VistaSoporteEmpleado() {
  const [tickets, setTickets] = useState([]);
  const [ticketActivo, setTicketActivo] = useState(null);
  const [respuestaTexto, setRespuestaTexto] = useState('');
  const [enviandoRespuesta, setEnviandoRespuesta] = useState(false);
  const [respuestas, setRespuestas] = useState([]);

  const { usuario } = useUser();

  useEffect(() => {
    console.log("Usuario:", usuario);

    const cargarTicketsAsignados = async () => {
      if (!usuario?.idcuenta) return;

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/mis-tickets-empleado?idempleado=${usuario.idcuenta}`,
          {
            headers: {
              'Chibcha-api-key': import.meta.env.VITE_API_KEY
            }
          }
        );

        if (!res.ok) throw new Error("Error al cargar tickets asignados");

        const data = await res.json();
console.log("Tickets obtenidos:", data);

if (!Array.isArray(data.tickets_asignados)) {
  throw new Error("La respuesta no es un arreglo");
}

const formateados = data.tickets_asignados.map((t) => ({
  id: String(t.id_ticket),
  cliente: t.cliente?.nombre || 'Sin nombre',
  correo: t.cliente?.correo || '',
  descripcion: t.descripcion ?? '',
  fecha_creacion: t.fecha_creacion ?? '',
  asunto: typeof t.descripcion === 'string' && t.descripcion.trim()
    ? t.descripcion.slice(0, 60) + (t.descripcion.length > 60 ? '…' : '')
    : 'Sin descripción',
  nivel: typeof t.nivel === 'number' ? `Soporte ${t.nivel}` : 'Sin nivel',
  estado: t.estado === 2 ? 'Resuelto' : 'En proceso',
}));


        setTickets(formateados);
      } catch (err) {
        console.error('❌ Error al cargar tickets asignados:', err);
      }
    };

    cargarTicketsAsignados();
  }, [usuario]);

  const enviarRespuestaTicket = async () => {
    if (!respuestaTexto.trim() || !ticketActivo?.id) return;

    try {
      setEnviandoRespuesta(true);

      const resRespuesta = await fetch(
        `${import.meta.env.VITE_API_URL}/ticket/${ticketActivo.id}/respuesta`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Chibcha-api-key': import.meta.env.VITE_API_KEY
          },
          body: JSON.stringify({ mensaje: respuestaTexto.trim() })
        }
      );

      if (!resRespuesta.ok) throw new Error('Error al enviar respuesta');

      const resEstado = await fetch(
        `${import.meta.env.VITE_API_URL}/CambiarEstadoTicket/${ticketActivo.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Chibcha-api-key': import.meta.env.VITE_API_KEY
          },
          body: JSON.stringify({ estado: 2 })
        }
      );

      if (!resEstado.ok) throw new Error('Error al cambiar estado');

      setTickets(prev =>
        prev.map(ticket =>
          ticket.id === ticketActivo.id
            ? { ...ticket, estado: 'Resuelto' }
            : ticket
        )
      );

      alert("✅ Respuesta enviada con éxito");
      setTicketActivo(null);
      setRespuestaTexto('');
    } catch (err) {
      alert("❌ No se pudo enviar la respuesta o actualizar el estado.");
      console.error("Error:", err);
    } finally {
      setEnviandoRespuesta(false);
    }
  };

  const abrirTicket = async (ticket) => {
    setTicketActivo(ticket);
    setRespuestaTexto('');
    setRespuestas([]);

    if (ticket.estado === 'Resuelto') {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/ticket/${ticket.id}`, {
          headers: {
            'Chibcha-api-key': import.meta.env.VITE_API_KEY
          }
        });
        const data = await res.json();
        setRespuestas(data.respuestas || []);
      } catch (err) {
        console.error('❌ Error al obtener detalle del ticket:', err);
      }
    }
  };

  return (
    <div className="panel-soporte">
      <h2>🎫 Tickets Asignados</h2>

      <table>
        <caption className="sr-only">Listado de tickets asignados al empleado técnico actual con identificadores, cliente, asunto, nivel y estado</caption>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Cliente</th>
            <th scope="col">Asunto</th>
            <th scope="col">Nivel</th>
            <th scope="col">Estado</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id} onClick={() => abrirTicket(ticket)}>
              <td>#{ticket.id}</td>
              <td>{ticket.cliente}</td>
              <td>{ticket.asunto}</td>
              <td>{ticket.nivel}</td>
              <td>
                <span className={`estado-tag ${ticket.estado.toLowerCase().replace(" ", "-")}`}>
                  {ticket.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {ticketActivo && (
        <div className="modal-overlay" onClick={() => setTicketActivo(null)}>
          <div className="modal-ticket" onClick={(e) => e.stopPropagation()}>
            <button className="cerrar-modal" onClick={() => setTicketActivo(null)}>✖</button>
            <h2>🎫 Detalles del Ticket</h2>
            <p><strong>ID:</strong> {ticketActivo.id}</p>
            <p><strong>Cliente:</strong> {ticketActivo.cliente}</p>
            <p><strong>Correo:</strong> {ticketActivo.correo}</p>
            <p><strong>Nivel:</strong> {ticketActivo.nivel}</p>
            <p><strong>Estado:</strong> {ticketActivo.estado}</p>
            <p><strong>Fecha de creación:</strong> {ticketActivo.fecha_creacion}</p>
            <p><strong>Descripción completa:</strong></p>
            <div className="descripcion-completa">{ticketActivo.descripcion}</div>

            {ticketActivo.estado === 'Resuelto' ? (
              <div className="respuesta-mostrada">
                <p><strong>✉ Respuestas del empleado:</strong></p>
                {respuestas.length > 0 ? (
                  respuestas.map((r) => (
                    <div className="respuesta-box" key={r.id_respuesta}>
                      <p>{r.contenido}</p>
                      <small><em>📅 {r.fecha}</em></small>
                    </div>
                  ))
                ) : (
                  <p><em>No hay respuestas registradas.</em></p>
                )}
              </div>
            ) : (
              <div className="area-respuesta">
                <label htmlFor="respuesta">✉ Escribir respuesta:</label>
                <textarea
                  id="respuesta"
                  value={respuestaTexto}
                  onChange={(e) => setRespuestaTexto(e.target.value)}
                  placeholder="Escribe aquí tu respuesta al cliente..."
                  rows="4"
                />
                <button
                  className="btn-responder"
                  onClick={enviarRespuestaTicket}
                  disabled={enviandoRespuesta}
                >
                  {enviandoRespuesta ? "Enviando..." : "Enviar respuesta"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default VistaSoporteEmpleado;
