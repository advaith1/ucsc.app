import { useState, useEffect, useRef, useContext, createContext } from "react";
import { TopBar as MobileTopBar } from "../components/navbar/mobile/TopBar.tsx";
import { TopBar as DesktopTopBar } from "../components/navbar/desktop/TopBar.tsx";
import DetailedView from "./DetailedView";
import CourseSearchPanel from "./CourseSearchPanel.tsx";
import { usePageMeta } from "../hooks/usePageMeta.tsx";
import { generateCourseSchema } from "../utils/schema";
import { Context } from "../Context.tsx";
import { Course } from "../types";
import { DetailedClassInfo } from "../types";
import "./styles/Courses.css";

interface CourseContextType {
	getDetailedView: (courseTerm: string, courseID: string) => void,
	setSelectedClassModality: (m: string) => void,
	setSelectedClassLink: (l: string) => void,
	term: string,
	setTerm: (t: string) => void,
	details: DetailedClassInfo,
	modality: string
}

export const CourseContext = createContext<CourseContextType | null>(null);


export default function Courses() {
	const ctx = useContext(Context);
	// const courseCtx = useContext(CourseContext);


	// const [courses, setCourses] = useState<Course[]>([]);
	// const [loading, setLoading] = useState(false);
	// const isMobile = useMediaQuery("(max-width: 768px)");
	const [detailedData, setDetailedData] = useState<DetailedClassInfo>({} as unknown as DetailedClassInfo);
	const [selectedClassModality, setSelectedClassModality] = useState<string>("");
	const [selectedClassLink, setSelectedClassLink] = useState<string>("");

	const [showDetails, setShowDetails] = useState(false);
	const [isFirstLoad, setFirstLoad] = useState<boolean>(true);
	const [selectedCourse, setSelectedCourse] = useState<Course>();
	const [term, setTerm] = useState<string>("");


	// const [ge, setGE] = useState<string>("");
	// const [status, setStatus] = useState<string>("all");
	// const [time, setTimes] = useState<string>("");

	// const abortControllerRef = useRef<AbortController | null>(null);

	const courseSchema = generateCourseSchema(
		'Find UCSC Courses',
		'Search and register for UC Santa Cruz courses. Find classes by department, catalog number, time, and more.'
	);

	usePageMeta({
		title: 'Courses',
		description: 'Search and register for UC Santa Cruz courses. Find classes by department, catalog number, time, and more.',
		keywords: 'UCSC courses, course search, course registration, UC Santa Cruz classes',
		ogUrl: 'https://ucsc.app/courses',
		canonical: 'https://ucsc.app/courses',
		schema: courseSchema,
	});

	const getDetailedView = async (courseTerm: string, courseID: string) => {
		const response = await fetch(
			`https://my.ucsc.edu/PSIGW/RESTListeningConnector/PSFT_CSPRD/SCX_CLASS_DETAIL.v1/${courseTerm}/${courseID}`,
		);
		const data = await response.json();
		setDetailedData(data);
		if (ctx!.mobile) setShowDetails(true);
	};


	const courseCtxValues = {
		getDetailedView,
		setSelectedClassModality,
		setSelectedClassLink,
		term,
		setTerm,
		details: detailedData,
		modality: selectedClassModality
	}

	const detailedViewStyle = ctx!.mobile ? {
		flex: undefined,
		position: "absolute" as const,
		width: "100%",
		display: showDetails ? "block" : "none"
	} : {
		flex: 15,
		position: "static" as const,
		width: "auto",
		display: "block"
	}

	return (
		<CourseContext.Provider value={courseCtxValues}>
			<div className="topbar-container">
				{ctx!.mobile ? <MobileTopBar /> : <DesktopTopBar />}
			</div>

			<div className="coursesParent">
				<div
					className="searchPanelParent"
					style={{
						flex: ctx!.mobile ? 1 : 7,
						display: ctx!.mobile && showDetails ? "none" : "block"
					}}>
					<CourseSearchPanel />
				</div>

				<div
					className="detailedViewParent"
					style={detailedViewStyle}>
					<DetailedView
						details={detailedData}
						modality={selectedClassModality}
						link={selectedClassLink}
						term={term}
						handleBack={() => setShowDetails(false)}
					/>
				</div>
			</div>
		</CourseContext.Provider>
	)
}
