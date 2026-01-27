import {createContext} from 'react';
import { TimeBlock } from '../types';

export interface ContextType {
	selectedBuilding: string;
	setSelectedBuilding: (building: string) => void;
	selectedRoom: string;
	setSelectedRoom: (room: string) => void;
	selectedSchedule: TimeBlock[];
	onScheduleBackButtonPress: () => void;
}

export const MapContext = createContext<ContextType | null>( null);