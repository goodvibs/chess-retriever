import React from 'react';
import SearchBlock from './components/SearchBlock';
import {Game, getGamesByMonth, isValidUsername, YearMonth} from "./utils"
import ResultsBlock from "./components/ResultsBlock";

export default function App() {

    const [loadingResults, setLoading] = React.useState(false);

    const [isInInitialState, setIsInInitialState] = React.useState(true);

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
        const timeClasses = [Game.TIME_CLASSES.BULLET, Game.TIME_CLASSES.BLITZ, Game.TIME_CLASSES.RAPID, Game.TIME_CLASSES.DAILY];
        let allowedTimeClasses = [];
        [formEvent.target.elements.bullet.checked, formEvent.target.elements.blitz.checked, formEvent.target.elements.rapid.checked, formEvent.target.elements.daily.checked].forEach((allowed, index) => {
            if (allowed) {
                allowedTimeClasses.push(timeClasses[index]);
            }
        });
        getGamesByMonth(username, new YearMonth(year, month), allowedTimeClasses).then(res => {
            setGames(res);
            setIsInInitialState(false);
            setLoading(false);
        }).catch(() => {
            setGames([]);
            setIsInInitialState(false);
            setLoading(false);
        });
    }

    return (
        <div className='flex flex-col items-center p-2'>
            <SearchBlock searchFormSubmissionHandler={handleSearch} expanded={isInInitialState} loading={loadingResults}/>
            <ResultsBlock games={games} hidden={isInInitialState} lichessIDs={lichessIDs} lichessIDAdder={addLichessID}/>
        </div>
    );
}
