import React, { useEffect, useState } from "react";
import "./Coordinador.css";

export default function VerTicketsCoordinador() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const obtenerTickets = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/coordinador/tickets`, {
          headers: { "Chibcha-api-key": import.meta.env.VITE_API_KEY },
        });
        const data = await res.json();
        setTickets(data);
      } catch (err) {
        console.error(err);
      }
    };

    obtenerTickets();
  }, []);

  return (
    <div className="coordinador-container">
      <h2>Tickets Asignados</h2>
      <table className="tabla-tickets">
        <caption className="sr-only">Listado de tickets asignados a técnicos con sus respectivos estados e información de clientes</caption>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Cliente</th>
            <th scope="col">Asunto</th>
            <th scope="col">Estado</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.idticket}>
              <td>{t.idticket}</td>
              <td>{t.nombrecliente}</td>
              <td>{t.asunto}</td>
              <td>{t.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
