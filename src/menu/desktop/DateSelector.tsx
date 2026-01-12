
const dayOffsets = [0, 1, 2, 3, 4, 5, 6];

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

const weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

export function DateSelector() {
    return (
        <>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', borderRadius: 50, backgroundColor: 'var(--bg-color)', overflow: 'hidden', padding: '2.5px 2.5px', gap: '10px', marginTop: '10px'}}>
            {dayOffsets.map((offset) => {
                const date = new Date();
                date.setDate(date.getDate() + offset);
                const display = `${weekdays[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
                return (
                    <div key={offset} style={{margin: '5px', padding: '0px 15px', whiteSpace: 'nowrap', borderRadius: 50, wordBreak: 'keep-all', backgroundColor: offset === 0 ? 'var(--gold)' : 'var(--light-gray)', color: offset === 0 ? 'black' : 'var(--dark-gray)', cursor: 'pointer', userSelect: 'none'}}>
                        <h3>{display}</h3>
                    </div>
                    );
                })
            }
        </div>
        </>
    );
}