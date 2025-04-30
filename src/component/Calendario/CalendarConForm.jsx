import { useState } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { it } from 'date-fns/locale'
import { Trash } from 'react-bootstrap-icons'

const locales = { it }
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

export default function CalendarConForm() {
  const [events, setEvents] = useState([])
  const [title, setTitle] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title || !start || !end) return alert('Completa tutti i campi.')

    const nuovoEvento = {
      id: Date.now(),
      title,
      start: new Date(start),
      end: new Date(end),
    }

    setEvents([...events, nuovoEvento])
    setTitle('')
    setStart('')
    setEnd('')
  }

  const handleDelete = (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo evento?')) {
      setEvents(events.filter((ev) => ev.id !== id))
    }
  }

  const EventComponent = ({ event }) => (
    <div className="d-flex justify-content-between align-items-center">
      <span>{event.title}</span>
      <button
        onClick={(e) => {
          e.stopPropagation()
          handleDelete(event.id)
        }}
        title="Elimina evento"
        className="btn btn-sm btn-link text-danger p-0 ms-2"
      >
        <Trash />
      </button>
    </div>
  )

  return (
    <div>
      <div style={{ height: 500 }}>
        <Calendar
          className="bg-white rounded-3 border p-2"
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          culture="it"
          style={{ height: '100%' }}
          components={{
            event: EventComponent,
          }}
        />
      </div>

      <div className="border border-top-1 mt-3 p-3 bg-white rounded-3">
        <form onSubmit={handleSubmit} className="space-y-2">
          <h2 className="text-xl fw-semibold">Aggiungi un nuovo appuntamento</h2>
          <input
            type="text"
            placeholder="Titolo evento"
            className="form-control mb-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="row mb-2">
            <div className="col">
              <input
                type="datetime-local"
                className="form-control"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div className="col">
              <input
                type="datetime-local"
                className="form-control"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-success mt-2"
          >
            Aggiungi evento
          </button>
        </form>
      </div>
    </div>
  )
}