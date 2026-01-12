import '../Menu.css';
import {DateSelector} from "./DateSelector";



export default function DateHeader() {
    return (
        <>
            <div className={`dateHeader`} style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: 60, padding: '10px 25px', textAlign: 'center' }}> 
                <div style={{padding: '15px 20px', width: '100%', borderRadius: 10, backgroundColor: 'var(--card-bg)', zIndex: 499}}>
                    <p style={{fontSize: 28, fontWeight: 'bold', margin: 0,  color: 'var(--gold)'}}>Menus for</p>
                    <DateSelector />
                </div>
            </div>
        </>
    );
}