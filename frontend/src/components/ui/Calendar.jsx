import { useMemo, useState } from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function parseIsoDateToLocal(isoDate) {
  if (!isoDate) return null;
  const [year, month, day] = isoDate.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function isSameDate(a, b) {
  return (
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isDateInRange(date, startDate, endDate) {
  if (!startDate) return false;
  if (!endDate) return isSameDate(date, startDate);
  return date >= startDate && date <= endDate;
}

export default function Calendar({ fiesta }) {
  const startDate = useMemo(() => parseIsoDateToLocal(fiesta?.startDate), [fiesta?.startDate]);
  const endDate = useMemo(() => parseIsoDateToLocal(fiesta?.endDate), [fiesta?.endDate]);
  const fiestaDate = startDate || useMemo(() => parseIsoDateToLocal(fiesta?.date), [fiesta?.date]);
  const [activeMonth, setActiveMonth] = useState(fiestaDate || new Date());

  const longDate = useMemo(() => {
    if (!fiestaDate) return '';
    if (startDate && endDate && !isSameDate(startDate, endDate)) {
      const start = new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'long',
      }).format(startDate);
      const end = new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(endDate);
      return start + ' - ' + end;
    }
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(fiestaDate);
  }, [fiestaDate, startDate, endDate]);

  if (!fiesta?.startDate && !fiesta?.date) {
    return (
      <div className="calendar-card">
        <div className="calendar-topbar">
          <h3 className="section-subtitle" style={{ marginBottom: 0 }}>Calendario</h3>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-soft)' }}>
          Fecha no especificada
        </p>
      </div>
    );
  }

  return (
    <div className="calendar-card">
      <div className="calendar-topbar">
        <h3 className="section-subtitle" style={{ marginBottom: 0 }}>Calendario</h3>
        <span className="calendar-chip">Evento</span>
      </div>
      <p className="calendar-date-text">{longDate}</p>

      <div className="calendar-wrapper">
        <ReactCalendar
          value={fiestaDate}
          locale="es-ES"
          activeStartDate={activeMonth}
          next2Label={null}
          prev2Label={null}
          tileClassName={({ date, view }) => {
            if (view === 'month') {
              if (isDateInRange(date, startDate, endDate)) return 'event-day';
            }
            return null;
          }}
          onActiveStartDateChange={({ activeStartDate }) => {
            if (activeStartDate) setActiveMonth(activeStartDate);
          }}
        />
      </div>

      <div className="calendar-legend">
        <span className="legend-dot" aria-hidden="true" />
        <span>{endDate && !isSameDate(startDate, endDate) ? 'Rango de la fiesta' : 'Fecha principal de la fiesta'}</span>
      </div>
    </div>
  );
}
