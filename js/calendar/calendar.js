//             VVVVVVVVVVVVVVV---CALENDAR---VVVVVVVVVVVVVVV

function calendarWrapper(selector, year, month) {
    let days = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
    let date = new Date(year,month - 1);
    month = date.getMonth();
    year = date.getFullYear();

    let todayIs = new Date();
    let weekDay = new Date(year,month,1).getDay();

    let calendarTable = document.createElement('div');
    calendarTable.id = 'calendarTable';
    calendarTable.innerHTML = createCalendar(year, month);

    let currentDateInfo = document.createElement('p');
    currentDateInfo.innerHTML = `${month + 1}.${year}`;
    currentDateInfo.id = 'current-date';
    selector.prepend(currentDateInfo);

    selector.innerHTML = '';
    selector.append(calendarTable);
    controlButtons(selector);

    clock(selector);

    if (month === todayIs.getMonth()) {
        let currMonthDays = document.querySelectorAll('#calendarTable td');
        currMonthDays.forEach(day=>day.innerHTML === todayIs.getDate().toString() ? day.id = 'todayIs' : false);
    }

    function createCalendar(year, month) {
        let table = '<table><tbody>';
        let trTh = '<tr>';

        days.forEach(item=>{
            trTh += `<th>${item}</th>`;
        });

        table += trTh;

        if (weekDay === 0) {
            weekDay = 7;
        }

        let tr = '<tr>';
        for (let i = 1; i < weekDay; i++) {
            tr += '<td></td>';
        }
        table += tr;

        function insertDates() {
            let currDay = weekDay;
            let i = 1;
            while (date.getMonth() === month) {
                if (currDay > 7) {
                    table += '<tr>';
                    currDay = 1;
                }
                table += `<td>${i}</td>`;
                i++;
                currDay++;
                date = new Date(year,month,i);
            }

            if (date.getMonth() != month) {
                for (let j = currDay; j < 8; j++) {
                    table += '<td></td>';
                }
            }
        }
        insertDates()
        return table;
    }
}

//             VVVVVVVVVVVVVVV---CALENDAR-BUTTONS---VVVVVVVVVVVVVVV
function controlButtons(selector) {
    let nextMonth = document.createElement('button');
    let prevMonth = document.createElement('button');

    nextMonth.id = "nextMonth";
    nextMonth.onclick = ()=>calendarWrapper(calendar, year, ++month);
    nextMonth.innerHTML = ">>>";

    prevMonth.onclick = ()=>calendarWrapper(calendar, year, --month);
    prevMonth.id = "prevMonth";
    prevMonth.innerHTML = "<<<";
    selector.append(prevMonth);
    selector.append(nextMonth)
}

//             VVVVVVVVVVVVVVV---CLOCK---VVVVVVVVVVVVVVV

function clock(selector) {

    function clockRender() {
        let clock;
        if (!document.querySelector('#clock')) {
            clock = document.createElement('div');
        } else {
            clock = document.querySelector('#clock');
        }

        clock.innerHTML = '';
        clock.id = 'clock';
        let pattern = 'hh:mm:ss';
        let currTime = new Date();
        pattern = pattern.replace(/hh/, ('0' + currTime.getHours()).substr(-2));
        pattern = pattern.replace(/mm/, ('0' + currTime.getMinutes()).substr(-2));
        pattern = pattern.replace(/ss/, ('0' + currTime.getSeconds()).substr(-2));
        pattern = pattern.replace(/ms/, ('00' + currTime.getMilliseconds()).substr(-3));
        clock.innerHTML = pattern;
        selector.append(clock)
    }
    clockRender()
    setInterval(clockRender, 1000);
}

let today = new Date();
let year = today.getFullYear();
let month = today.getMonth() + 1;
calendarWrapper(calendar, year, month);
