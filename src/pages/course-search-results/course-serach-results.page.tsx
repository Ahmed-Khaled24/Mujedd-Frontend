import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CourseResultsGrid } from '../../components/course-results-grid/course-results-grid.components';
import ExplorePageHeader from '../../components/explore-page-header/explore-page-header.component';
import BackendSupportedPagination from '../../components/pagination/pagination.components';
import UpButton from '../../components/up-button/up-button.components';
import { PageTitle } from '../../index.styles';
import {
    RootState,
    changeCoursesPagePaginationPageNumber,
    changeCoursesPageSearchInitiated,
    changeCoursesPageSearchQuery,
    changeGroupsPageSearchQuery,
} from '../../store';
import {
    useLazyGetRecommendedCoursesQuery,
    useLazySearchCoursesQuery,
    usePrefetchCourse,
} from '../../store/apis/coursesApi';
import { Course } from '../../types/course';
import { PaginatedResult } from '../../types/pagination';
import { errorToast } from '../../utils/toasts';
import {
    CourseSearchPageHeader,
    CourseSearchResultsPageContainer,
} from './course-search-results.styles';

export const CoursesSearchResultsPage = () => {
    const pageHeaderRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    const {
        searchInitiated,
        searchTerm,
        searchCategory,
        paginationPageNumber,
        paginationPageLimit,
    } = useSelector((state: RootState) => state.appState.coursesPage);

    const [
        triggerSearchCourses,
        {
            data: searchResultsData,
            isFetching: isSearchResultsIsFetching,
            isLoading: isSearchResultsIsLoading,
        },
    ] = useLazySearchCoursesQuery();
    const [
        triggerRecommendedCourses,
        {
            data: recommendedCoursesData,
            isFetching: isRecommendedCoursesIsFetching,
            isLoading: isRecommendedCoursesIsLoading,
        },
    ] = useLazyGetRecommendedCoursesQuery();

    let data: PaginatedResult<Course> =
        searchTerm === 'Recommended For You'
            ? (recommendedCoursesData?.data as PaginatedResult<Course>)
            : (searchResultsData?.data as PaginatedResult<Course>);

    const isDataFetching =
        searchTerm === 'Recommended For You'
            ? isRecommendedCoursesIsFetching
            : isSearchResultsIsFetching;

    const isDataLoading =
        searchTerm === 'Recommended For You'
            ? isRecommendedCoursesIsLoading
            : isSearchResultsIsLoading;

    const prefetchSearchCourses = usePrefetchCourse('searchCourses');
    const prefetchRecommendedCourses = usePrefetchCourse(
        'getRecommendedCourses',
    );

    useEffect(() => {
        if (searchInitiated) {
            if (searchTerm === 'Recommended For You') {
                triggerRecommendedCourses({
                    limit: paginationPageLimit,
                    offset: paginationPageNumber,
                }).unwrap();
            } else {
                triggerSearchCourses({
                    query: searchTerm,
                    category: searchCategory,
                    limit: paginationPageLimit,
                    offset: paginationPageNumber,
                }).unwrap();
            }
        } else {
            data = {} as PaginatedResult<Course>;
            // TODO: take from search Params and set the search term
        }
    }, []);

    useEffect(() => {
        document.title = 'Search Courses | Mujedd';
        return () => {
            document.title = 'Mujedd';
        };
    }, []);

    const onSearchValueChangeHandler = (value: string) => {
        dispatch(changeCoursesPageSearchQuery(value));
    };

    const onSearchSubmitHandler = async (value: string) => {
        dispatch(changeCoursesPageSearchInitiated(true));
        try {
            if (value.trim().length === 0) {
                dispatch(changeGroupsPageSearchQuery(''));
                return;
            }
            await triggerSearchCourses({
                query: value,
                category: searchCategory,
                limit: paginationPageLimit,
                offset: 0,
            }).unwrap();
            dispatch(changeCoursesPagePaginationPageNumber(1));
            dispatch(changeCoursesPageSearchQuery(value));
            // TODO: add in search params
        } catch (error) {
            errorToast('Error occurred while searching.');
            console.error(error);
        }
    };

    const onPageHoverHandler = (pageNum: number) => {
        if (pageNum >= data.NumPages) {
            return;
        }

        if (searchTerm === 'Recommended For You') {
            prefetchRecommendedCourses(
                {
                    limit: paginationPageLimit,
                    offset: pageNum,
                },
                {
                    ifOlderThan: 60 * 60,
                },
            );
        } else {
            prefetchSearchCourses({
                query: searchTerm,
                category: searchCategory,
                limit: paginationPageLimit,
                offset: pageNum,
            }),
                {
                    ifOlderThan: 60 * 60,
                };
        }
    };

    const onPageChangeHandler = (pageNum: number) => {
        dispatch(changeCoursesPagePaginationPageNumber(pageNum));
        if (searchTerm === 'Recommended For You') {
            triggerRecommendedCourses({
                limit: paginationPageLimit,
                offset: pageNum,
            });
        } else {
            triggerSearchCourses({
                query: searchTerm,
                category: searchCategory,
                limit: paginationPageLimit,
                offset: pageNum,
            });
        }
    };

    return (
        <CourseSearchResultsPageContainer>
            <CourseSearchPageHeader ref={pageHeaderRef}>
                <PageTitle className="text-center">Search Courses</PageTitle>
                <ExplorePageHeader
                    placeholder="Search Courses..."
                    WithoutButton={true}
                    searchValue={searchTerm as string}
                    onSearchValueChange={onSearchValueChangeHandler}
                    searchHandler={onSearchSubmitHandler}
                />
            </CourseSearchPageHeader>
            <CourseResultsGrid
                courseResults={data?.Results || []}
                isLoading={isDataFetching || isDataLoading}
            />
            {data?.NumPages && (
                <BackendSupportedPagination
                    pageHeaderElement={pageHeaderRef?.current as HTMLDivElement}
                    currentPage={data?.CurrentPageNum}
                    onPageChange={onPageChangeHandler}
                    onPageHover={onPageHoverHandler}
                    numOfPages={data?.NumPages}
                    pageSize={data?.LimitPerPage}
                    siblingCount={1}
                />
            )}
            <UpButton
                pageHeaderElement={pageHeaderRef?.current as HTMLDivElement}
            />
        </CourseSearchResultsPageContainer>
    );
};

export default CoursesSearchResultsPage;
