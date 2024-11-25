let currentDate = new Date();
let events = [];

async function fetchEvents(year, month) {
    try {
        const url = `https://intensprotectionexenew.vercel.app/api/events_jkt48?year=${year}&month=${month + 1}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.success && data.data) {
            events = data.data;
            renderCalendar(year, month);
        } else {
            events = [];
            renderCalendar(year, month);
        }
    } catch (error) {
        console.error('Error fetching events:', error);
        events = [];
        renderCalendar(year, month);
    }
}

function renderCalendar(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    document.getElementById('current-month').textContent =
        new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });

    window.history.pushState({}, '', `/schedule/month/${month + 1}`);

    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = '';

    for (let i = 0; i < firstDay.getDay(); i++) {
        calendarGrid.appendChild(createEmptyCell());
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
        const cell = createDayCell(day, year, month);
        calendarGrid.appendChild(cell);
    }
}

function createEmptyCell() {
    const cell = document.createElement('div');
    cell.className = 'day-cell bg-gray-700 rounded-lg p-2';
    return cell;
}

function parseEventDate(tanggal_full) {
    if (!tanggal_full) return null;

    const [day, year, monthStr] = tanggal_full.split('/');
    const monthMap = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'Mei': 4, 'Jun': 5,
        'Jul': 6, 'Agu': 7, 'Sep': 8, 'Okt': 9, 'Nov': 10, 'Des': 11
    };

    return {
        day: parseInt(day),
        month: monthMap[monthStr],
        year: parseInt(year)
    };
}

function createDayCell(day, year, month) {
    const cell = document.createElement('div');
    cell.className = 'day-cell bg-gray-700 rounded-lg p-2 relative';

    const dateSpan = document.createElement('span');
    dateSpan.className = 'block text-sm mb-2';
    dateSpan.textContent = day;
    cell.appendChild(dateSpan);
    const dayEvents = events.filter(event => {
        if (!event.tanggal_full || !event.have_event) return false;

        const eventDate = parseEventDate(event.tanggal_full);
        if (!eventDate) return false;

        return eventDate.day === day &&
            eventDate.month === month &&
            eventDate.year === year;
    });

    dayEvents.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'text-xs mb-1';

        const badge = document.createElement('span');
        badge.className = 'inline-block py-1 px-2 text-xs leading-5 rounded-lg min-w-[50px] text-left capitalize';

        if (event.badge_url && (event.badge_url.includes('cat17') || event.badge_url.includes('cat19'))) {
            badge.classList.add('bg-red-500');
        } else {
            badge.classList.add('bg-blue-500');
        }

        let badgeText = event.event_name || '';
        if (event.event_time) {
            badgeText += badgeText ? ` - ${event.event_time}` : event.event_time;
        }
        badge.textContent = badgeText;

        if (event.badge_url || event.event_name) {
            eventDiv.appendChild(badge);
        }

        cell.appendChild(eventDiv);
    });

    return cell;
}

document.getElementById('prev-month').addEventListener('click', async () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    await fetchEvents(currentDate.getFullYear(), currentDate.getMonth());
});

document.getElementById('next-month').addEventListener('click', async () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    await fetchEvents(currentDate.getFullYear(), currentDate.getMonth());
});


fetchEvents(currentDate.getFullYear(), currentDate.getMonth());