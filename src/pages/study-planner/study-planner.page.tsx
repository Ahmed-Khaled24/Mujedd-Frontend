import Fuse from 'fuse.js';
import moment from 'moment';
import { useEffect, useState } from 'react';
import React from 'react';
import {
    Calendar as BigCalendar,
    CalendarProps,
    Navigate,
    ToolbarProps,
    momentLocalizer,
} from 'react-big-calendar';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { GoPlus } from 'react-icons/go';
import { IoMdSearch } from 'react-icons/io';
import { RiRobot2Line } from 'react-icons/ri';

import noTask from '../../assets/imgs/no-task.png';
import { AddTaskModal } from '../../components/AddTaskModal';
import { EditTaskModal } from '../../components/EditTaskModal';
import Skeleton from '../../components/Skeleton';
import Spinner from '../../components/Spinner';
import TaskBox from '../../components/TaskBox';
import Button from '../../components/button/button.component';
import '../../index.css';
import { useFetchTasksQuery } from '../../store';
import {
    ButtonMV,
    CalendarHolder,
    LeftButton,
    MiddleButton,
    NoTasksContainer,
    PageContainer,
    RightButton,
    Searchbar,
    SideNav,
    TaskBoxContainer,
    TasksContainer,
} from './study-planner.styles';

const formats = {
    weekdayFormat: 'ddd',
    dayFormat: 'ddd',
};
const localizer = momentLocalizer(moment);

const CustomToolbar = (props: ToolbarProps) => {
    const [viewState, setViewState] = useState<string>('week');

    const goToDayView = () => {
        props.onView('day');
        setViewState('day');
    };
    const goToMonthView = () => {
        props.onView('month');
        setViewState('month');
    };

    const goToWeekView = () => {
        props.onView('week');
        setViewState('week');
    };

    const goToBack = () => {
        props.onNavigate(Navigate.PREVIOUS);
    };

    const goToNext = () => {
        props.onNavigate(Navigate.NEXT);
    };

    const viewFunctions = [goToWeekView, goToDayView, goToMonthView];
    const [currentViewIndex, setCurrentView] = useState(0);
    function cycleView() {
        setCurrentView((currentViewIndex + 1) % viewFunctions.length);
        const currentView = viewFunctions[currentViewIndex];
        currentView();
    }
    return (
        <div className="flex flex-column justify-between pt-[1rem]">
            <div className="flex flex-row gap-3 pb-4  w-2/5 px-2">
                {viewState == 'day' ? (
                    <>
                        <label className="lg:text-4xl text-3xl text-indigo-900 font-semibold">
                            {moment(props.date).format('DD ')}
                        </label>
                        <label className="lg:text-4xl text-3xl text-indigo-900 font-normal">
                            {moment(props.date).format('dddd')}
                        </label>
                    </>
                ) : (
                    <>
                        <label className="lg:text-4xl text-3xl text-indigo-900 font-semibold">
                            {moment(props.date).format('MMMM ')}
                        </label>
                        <label className="lg:text-4xl text-3xl text-indigo-900 font-light">
                            {moment(props.date).format('YYYY ')}
                        </label>
                    </>
                )}
            </div>

            <div className="flex flex-row justify-end items-center	justify-items-center lg:w-1/5 w-[10%] lg:mb-0 mb-4 ">
                <div className="flex flex-row justify-items-center ">
                    <LeftButton onClick={goToBack}>
                        <FaChevronLeft color="white" size="12" />
                    </LeftButton>
                    <MiddleButton onClick={cycleView}>
                        {viewState.charAt(0).toUpperCase() + viewState.slice(1)}
                    </MiddleButton>
                    <RightButton onClick={goToNext}>
                        <FaChevronRight color="white" size="12" />
                    </RightButton>
                </div>
            </div>
        </div>
    );
};

export default function StudyPlanner() {
    const [showModal, setShowModal] = useState(false);
    const openModal = () => {
        setShowModal((prev) => !prev);
    };

    const { data: getTasks, error, isLoading } = useFetchTasksQuery(undefined);
    const data = getTasks?.data || [];
    const [id, setID] = useState(0);
    const [editShow, setEdit] = useState(false);
    const [tasks, setTasks] = useState(data);

    const [searchValue, setSearchValue] = useState('');
    const [showButtons, setShowButtons] = useState(true);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchValue(value);
        setShowButtons(value === '');

        const fuseOptions = {
            keys: ['Title'],
            includeScore: true,
        };

        const fuse = new Fuse(data, fuseOptions);
        const searchResult = fuse.search(searchValue);

        const filteredTasks =
            value === '' ? data : searchResult.map((result) => result.item);
        setTasks(filteredTasks);
    };

    const handleEdit = (ID: number) => {
        setID(ID);
        setEdit((prev) => !prev);
    };
    useEffect(() => {
        setTasks(data);
    }, [data]);
    const [content, setContent] = useState<JSX.Element | JSX.Element[] | null>(
        null,
    );

    useEffect(() => {
        let content;
        if (isLoading) {
            content = (
                <div className="h-auto w-full">
                    <Skeleton times={3} className="h-20 w-full" />
                </div>
            );
        } else if (error) {
            content = (
                <NoTasksContainer>
                    <img src={noTask} className="w-[90%]" />
                    <div className="flex flex-col w-full justify-center items-center mr-6">
                        <p className="text-txt text-lg font-extrabold">
                            Error loading...
                        </p>
                    </div>
                </NoTasksContainer>
            );
        } else {
            const getSortedFutureTasks = (tasks: any[]) => {
                const currentDateTime = new Date();
                return tasks
                    .filter((task) => new Date(task.DueDate) > currentDateTime)
                    .sort(
                        (a, b) =>
                            new Date(a.DueDate).getTime() -
                            new Date(b.DueDate).getTime(),
                    );
            };
            const futureTasks = getSortedFutureTasks(tasks);

            content = futureTasks.map(
                (tasks: {
                    ID: any;
                    Title: string | undefined;
                    Status: string | undefined;
                    Description: string | undefined;
                    DueDate: string;
                    StartDate: string;
                    Color: string | undefined;
                }) => {
                    function formatTimestamp(timestamp: string): string {
                        const date = new Date(timestamp);
                        const formattedDate = date.toLocaleString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                        });

                        return formattedDate;
                    }
                    const time = formatTimestamp(tasks.DueDate);
                    return (
                        <div
                            className="w-full"
                            onClick={() => handleEdit(tasks.ID)}
                        >
                            <TaskBox
                                key={tasks.ID}
                                id={tasks.ID}
                                title={tasks.Title + ' | '}
                                status={tasks.Status}
                                description={tasks.Description}
                                DueDate={tasks.DueDate}
                                StartDate={tasks.StartDate}
                                due_date={'Due: ' + time}
                                color={tasks.Color}
                            />
                        </div>
                    );
                },
            );
        }

        setContent(content);
    }, [isLoading, error, tasks]);

    const Calendar = (props: Omit<CalendarProps, 'localizer'>) => {
        let EVENTS: any[] = [];
        if (isLoading) {
        } else if (error) {
        } else {
            EVENTS = data?.map(
                (task: {
                    ID: any;
                    Title: string | undefined;
                    Status: string | undefined;
                    Description: string | undefined;
                    StartDate: string;
                    DueDate: string;
                    Color: string | undefined;
                }) => ({
                    start: moment(task.StartDate).toDate(),
                    end: moment(task.DueDate).toDate(),
                    data: {
                        task: {
                            id: task.ID,
                            status: task.Status,
                            courseName: task.Title,
                            start: moment(task.StartDate).format('LT'),
                            end: moment(task.DueDate).format('LT'),
                            color: task.Color,
                        },
                    },
                }),
            );
        }
        return (
            <BigCalendar
                popup
                {...props}
                events={EVENTS}
                formats={formats}
                localizer={localizer}
                defaultView={'week'}
                max={moment('2023-12-24T23:59:00').toDate()}
                min={moment('2023-12-24T08:00:00').toDate()}
                components={{
                    toolbar: CustomToolbar,
                    event: ({ event }: { event: any }) => {
                        const data = event?.data;
                        if (data?.task)
                            return (
                                <TaskBoxContainer
                                    color={data.task.color}
                                    onClick={() => handleEdit(data.task.id)}
                                    className="h-full"
                                >
                                    <div>
                                        <p className="text-[10px] pb-[4px] font-bold">
                                            <span>
                                                {data.task.start + ' - '}
                                            </span>
                                            <span>{data.task.end}</span>
                                        </p>
                                        <p className="text-xs text-[#0369A1] font-bold">
                                            {data.task.courseName}
                                        </p>
                                    </div>
                                </TaskBoxContainer>
                            );

                        return null;
                    },
                }}
            />
        );
    };

    return isLoading ? (
        <Spinner />
    ) : (
        <PageContainer>
            <CalendarHolder>
                <Calendar className="w-[95%] h-full" />
                <ButtonMV>
                    <Button
                        select="primary300"
                        type="button"
                        rounded
                        onClick={(e: unknown) => {
                            (e as MouseEvent).stopPropagation();
                            openModal();
                        }}
                        className="!w-[55px] !h-[55px]"
                    >
                        <GoPlus size="28" color="#0D062D" />
                    </Button>
                    <Button
                        select="primary"
                        type="button"
                        rounded
                        className="!w-[55px] !h-[55px]"
                    >
                        <RiRobot2Line size="24" color="white" />
                    </Button>
                </ButtonMV>
            </CalendarHolder>
            <SideNav>
                <div>
                    <Searchbar>
                        <IoMdSearch color="#312E81" size="20" />
                        <input
                            type="search"
                            id="default-search"
                            value={searchValue}
                            onChange={handleInputChange}
                        />
                    </Searchbar>
                    {showButtons && (
                        <>
                            <Button
                                select="primary300"
                                type="button"
                                onClick={openModal}
                                className="!text-txt"
                            >
                                + Add a task
                            </Button>

                            <Button
                                select="primary"
                                className="flex flex-row gap-2 py-[10px]"
                                type="button"
                            >
                                <RiRobot2Line size="16" color="white" />
                                <span className="text-sm">Make plan</span>
                            </Button>
                        </>
                    )}
                </div>
                <div className="flex flex-col mt-8 items-center justify-center w-full ">
                    <TasksContainer>
                        {' '}
                        {React.Children.count(content) !== 0 ? (
                            content
                        ) : (
                            <NoTasksContainer>
                                <img src={noTask} className="w-[90%]" />
                                <div className="flex flex-col w-full justify-center items-center mr-6">
                                    <p className="text-txt text-lg font-extrabold">
                                        No tasks
                                    </p>
                                    <p className="text-slate-400 text-sm text-center">
                                        You have no tasks to do.
                                    </p>
                                </div>
                            </NoTasksContainer>
                        )}
                    </TasksContainer>
                </div>
            </SideNav>
            {editShow && (
                <EditTaskModal
                    showModal={editShow}
                    setShowModal={setEdit}
                    ID={id}
                />
            )}
            {showModal && (
                <AddTaskModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                />
            )}
        </PageContainer>
    );
}
