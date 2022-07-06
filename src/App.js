import React from 'react';
import SearchBlock from './components/SearchBlock';
import {Game, getGamesByMonth, isValidUsername, YearMonth} from "./utils"
import ResultsSection from "./components/ResultsSection";
import ReactGA from "react-ga";

export default function App() {
    React.useEffect(() => {
        ReactGA.pageview(window.location.pathname);
    });

    const [loadingResults, setLoading] = React.useState(false);

    const [isInInitialState, setIsInInitialState] = React.useState(true);

    const [searchParams, setSearchParams] = React.useState({
        username: null,
        yearMonth: null
    });

    const [games, setGames] = React.useState([]);

    const [lichessIDs, setLichessIDs] = React.useState({});

    function addLichessID(gameIndex, lichessID) {
        setLichessIDs(prevLichessIDs => {
            let temp = {...prevLichessIDs};
            temp[gameIndex] = lichessID;
            return temp;
        });
    }

    function handleSearch(formEvent) {
        formEvent.preventDefault();
        setLichessIDs({});
        const username = formEvent.target.elements.username.value;
        if (!isValidUsername(username)) {
            return;
        }
        setLoading(true);
        const month = parseInt(formEvent.target.elements.month.value);
        const year = parseInt(formEvent.target.elements.year.value);
        const yearMonth = new YearMonth(year, month);
        const timeClasses = [Game.TIME_CLASSES.BULLET, Game.TIME_CLASSES.BLITZ, Game.TIME_CLASSES.RAPID, Game.TIME_CLASSES.DAILY];
        let allowedTimeClasses = [];
        [formEvent.target.elements.bullet.checked, formEvent.target.elements.blitz.checked, formEvent.target.elements.rapid.checked, formEvent.target.elements.daily.checked].forEach((allowed, index) => {
            if (allowed) {
                allowedTimeClasses.push(timeClasses[index]);
            }
        });

        ReactGA.event({
            category: 'Search',
            action: 'Submitted the "retrieve games" form',
            label: `Retrieved games with the following parameters: {username: ${username}, yearMonth: ${yearMonth.toString()}, timeClasses: ${allowedTimeClasses.toString()}}`
        });

        getGamesByMonth(username, yearMonth, allowedTimeClasses).then(res => {
            setSearchParams({
                username: username,
                yearMonth: yearMonth
            });
            setGames(res);
            setIsInInitialState(false);
            setLoading(false);
        }).catch(() => {
            setSearchParams({
                username: username,
                yearMonth: yearMonth
            });
            setGames([]);
            setIsInInitialState(false);
            setLoading(false);
        });
    }

    return (
        <div className='flex flex-col items-center min-h-screen-3/4 justify-center p-5 text-teal-800'>
            <SearchBlock searchFormSubmissionHandler={handleSearch} expanded={isInInitialState} loading={loadingResults}/>
            <ResultsSection searchParams={searchParams} games={games} hidden={isInInitialState} lichessIDs={lichessIDs} lichessIDAdder={addLichessID}/>
        </div>
    );
}
