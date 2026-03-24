import {useEffect, useState, useContext} from "react";
import {BASE_API_URL} from "../constants";
import { CourseContext } from "./Courses";

import './styles/Filters.css';

interface FilterProps {
    isMobile?: boolean,

    setGE: (ge: string) => void,
    setStatus: (status: string) => void,
    setTimes: (times: string) => void,
}

async function getTermOptions() {
    const response = await fetch(`${BASE_API_URL}/courses/terms`);

    let data = await response.json();

    return data.map((term: Record<string, string>) => {
        return {
            label: term.label.replace('Quarter', '').trim(),
            value: term.value
        }
    }).slice(0, 8); // Get only the latest 8 quarters
}

const fallbackTerms = [
    { label: "2026 Winter", value: "2260" },
    { label: "2025 Fall", value: "2258" },
    { label: "2025 Summer", value: "2254" },
    { label: "2025 Spring", value: "2252" },

];

export default function Filters({ setGE, setStatus, setTimes }: FilterProps) {
    const [termOptions, setTermOptions] = useState<Array<Record<string, string>>>(fallbackTerms);
	const courseCtx = useContext(CourseContext);

    useEffect(() => {
        (async () => {
            const options = await getTermOptions();
            setTermOptions(options);
			console.log(options)
            courseCtx!.setTerm(options[0].value);
        })();

    }, [courseCtx!.setTerm]);

    return (
		<div className="filters">

            {/* Quarter select */}
            <select
                name="quarter"
                id="quarter"
                className="dropdown"
                style={{ width: 'calc(30% - 3px)' }}
                value={courseCtx!.term}
                onChange={(e) => {
                    courseCtx!.setTerm(e.target.value);
                }}
            >
                {termOptions.map((termOption: Record<string, string>, idx: number) => (
                    <option key={idx} value={termOption.value}>{termOption.label}</option>
                ))}
            </select>

            {/* GE type selection */}
            <select
                name="GE"
                id="GE"
                className="dropdown"
                style={{ width: 'calc(20% - 3px)' }}
                onChange={(e) => { setGE(e.target.value) }}
            >
                {["Any GE", "AH & I", "C", "CC", "ER", "IM", "MF", "PE-E", "PE-H", "PE-T", "PR-C", "PR-E", "PR-S", "SI", "SR", "TA"].map((ge: string, idx: number) => (
                    <option key={idx} value={ge}>{ge}</option>
                ))}
            </select>

            {/* filter by open/all */}
            <select
                name="status"
                id="status"
                className="dropdown"
                style={{ width: 'calc(17% - 3px)' }}
                onChange={(e) => { setStatus(e.target.value) }}
            >
                <option value="all">All</option>
                <option value="O">Open</option>
            </select>

            {/* filter by time */}
            <select
                name="times"
                id="times"
                className="dropdown"
                style={{ width: 'calc(33% - 3px)' }}
                onChange={(e) => { setTimes(e.target.value) }}
            >
                <option value="">All Times</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
                {/* Time options... */}
                {/*<option value="08:00PM09:45PM">08:00PM-09:45PM</option>*/}
                <option value="Night">Night</option>
            </select>
        </div>

    );
}
