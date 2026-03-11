import {TopBar as MobileTopBar} from "../components/navbar/mobile/TopBar";
import {TopBar as DesktopTopBar} from "../components/navbar/desktop/TopBar";
import {useContext} from "react";
import { Context } from "../Context";
import { Link } from "react-router";
import './Dashboard.css';

export default function Dashboard() {
    const contextValues = useContext(Context);

    const features = [
        {
            icon: '📚',
            title: 'Courses',
            description: 'Search and explore all UCSC courses with detailed information',
            path: '/courses',
            color: '#0066CC'
        },
        {
            icon: '🍽️',
            title: 'Menu',
            description: 'Check dining hall menus and meal options across campus',
            path: '/menu',
            color: '#FFB81C'
        },
        {
            icon: '📰',
            title: 'News',
            description: 'Stay updated with the latest UCSC campus news and events',
            path: '/news',
            color: '#00A591'
        },
        {
            icon: '📍',
            title: 'Schedule',
            description: 'View campus locations and find buildings on the map',
            path: '/schedule',
            color: '#C75623'
        }
    ];

    return (
        <>
            {contextValues?.mobile ? (<MobileTopBar />) : (<DesktopTopBar />)}

            <main className="dashboard-container">
                {/* Hero Section */}
                <section className="hero">
                    <div className="hero-content">
                        <h1 className="hero-title">UCSC.app</h1>
                        <p className="hero-subtitle">Your all-in-one campus companion</p>
                        <p className="hero-description">
                            Discover courses, explore menus, find locations, and stay connected with your UCSC community
                        </p>
                        <div className="hero-cta">
                            <Link to="/courses" className="cta-button primary">
                                Explore Courses
                            </Link>
                            <Link to="/schedule" className="cta-button secondary">
                                View Campus Map
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="features">
                    <h2 className="features-title">Everything You Need</h2>
                    <div className="features-grid">
                        {features.map((feature) => (
                            <Link
                                key={feature.path}
                                to={feature.path}
                                className="feature-card"
                                style={{'--accent-color': feature.color} as React.CSSProperties}
                            >
                                <div className="feature-icon">{feature.icon}</div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                                <div className="feature-arrow">→</div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Footer CTA */}
                <section className="footer-cta">
                    <p>Ready to enhance your UCSC experience?</p>
                    <Link to="/courses" className="cta-link">Get started →</Link>
                </section>
            </main>
        </>
    )
}
