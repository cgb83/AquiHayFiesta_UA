import { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
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
  const { t, lang } = useApp();
  const locale = lang === 'EN' ? 'en-US' : 'es-ES';
  const startDate = useMemo(() => parseIsoDateToLocal(fiesta?.startDate), [fiesta?.startDate]);
  const endDate = useMemo(() => parseIsoDateToLocal(fiesta?.endDate), [fiesta?.endDate]);
  const fiestaDate = startDate || useMemo(() => parseIsoDateToLocal(fiesta?.date), [fiesta?.date]);
  const [activeMonth, setActiveMonth] = useState(fiestaDate || new Date());

  const longDate = useMemo(() => {
    if (!fiestaDate) return '';
    if (startDate && endDate && !isSameDate(startDate, endDate)) {
      const start = new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
      }).format(startDate);
      const end = new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(endDate);
      return start + ' - ' + end;
    }
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(fiestaDate);
  }, [fiestaDate, startDate, endDate, locale]);

  if (!fiesta?.startDate && !fiesta?.date) {
    return (
      <div className="calendar-card">
        <div className="calendar-topbar">
          <h3 className="section-subtitle" style={{ marginBottom: 0 }}>{t('cal_titulo')}</h3>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-soft)' }}>
          {t('cal_no_fecha')}
        </p>
      </div>
    );
  }

  return (
    <div className="calendar-card">
      <div className="calendar-topbar">
        <h3 className="section-subtitle" style={{ marginBottom: 0 }}>{t('cal_titulo')}</h3>
        <span className="calendar-chip">{t('cal_evento')}</span>
      </div>
      <p className="calendar-date-text">{longDate}</p>

      <div className="calendar-wrapper">
        <ReactCalendar
          value={fiestaDate}
          locale={lang === 'EN' ? 'en-US' : 'es-ES'}
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
        <span>{endDate && !isSameDate(startDate, endDate) ? t('cal_rango') : t('cal_fecha')}</span>
      </div>
    </div>
  );
}
