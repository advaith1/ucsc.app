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


        </>
    )
}
