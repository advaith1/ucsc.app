import {TopBar as MobileTopBar} from "../components/navbar/mobile/TopBar";
import {TopBar as DesktopTopBar} from "../components/navbar/desktop/TopBar";
import {useContext} from "react";
import { Context } from "../Context";
import { useNavigate } from "react-router";
import './Dashboard.css';

export default function Dashboard() {
    const contextValues = useContext(Context);
    const navigate = useNavigate();

    return (
        <div className="dashboard-container">
            {contextValues?.mobile ? (<MobileTopBar />) : (<DesktopTopBar />)}

            <div className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">UCSC's all-in-one<br />student platform</h1>
                    <p className="hero-subtitle">Discover courses, dining, schedules, and campus news</p>
                    <button className="hero-cta" onClick={() => navigate("/courses")}>
                        Get Started →
                    </button>
                </div>
                <div className="hero-illustration">
                    <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
                        {/* Tree/Forest elements */}
                        <g opacity="0.8">
                            <path d="M 80 300 Q 70 250 80 200 Q 75 220 85 200 Q 80 220 90 200" fill="none" stroke="currentColor" strokeWidth="2"/>
                            <ellipse cx="80" cy="180" rx="35" ry="40" fill="currentColor" opacity="0.6"/>

                            <path d="M 200 320 Q 190 270 200 220 Q 195 240 205 220 Q 200 240 210 220" fill="none" stroke="currentColor" strokeWidth="2"/>
                            <ellipse cx="200" cy="200" rx="40" ry="45" fill="currentColor" opacity="0.7"/>

                            <path d="M 240 310 Q 230 260 240 210 Q 235 230 245 210 Q 240 230 250 210" fill="none" stroke="currentColor" strokeWidth="2"/>
                            <ellipse cx="240" cy="190" rx="35" ry="40" fill="currentColor" opacity="0.65"/>
                        </g>

                        {/* Books */}
                        <g>
                            <rect x="50" y="340" width="30" height="50" fill="currentColor" opacity="0.7"/>
                            <rect x="85" y="335" width="30" height="55" fill="currentColor" opacity="0.5"/>
                            <rect x="120" y="345" width="30" height="45" fill="currentColor" opacity="0.6"/>
                        </g>

                        {/* Ground */}
                        <ellipse cx="150" cy="395" rx="140" ry="20" fill="currentColor" opacity="0.1"/>
                    </svg>
                </div>
            </div>
        </div>
    )
}
