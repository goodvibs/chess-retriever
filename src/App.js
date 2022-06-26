import React from 'react';
import Header from './components/Header';
import {Game, getGamesByMonth, isValidUsername, YearMonth} from "./utils"
import Main from "./components/Main";

export default function App() {

    const [loadingResults, setLoading] = React.useState(false);

    const [resultsHidden, setResultsHidden] = React.useState(true);

    const [games, setGames] = React.useState([]);

    function setGamesReversed() {
        setGames(games.slice().reverse());
    }

    function handleSearch(formEvent) {
        formEvent.preventDefault();
        //const advanced = formEvent.target.elements.;
        const username = formEvent.target.elements.username.value;
        if (!isValidUsername(username)) {
            return;
        }

        setResultsHidden(true);
        setLoading(true);

        const month = parseInt(formEvent.target.elements.month.value);
        const year = parseInt(formEvent.target.elements.year.value);
        //const since = new YearMonth(...formEvent.target.elements.from.value.split('-').map(x => parseInt(x)));
        //const until = new YearMonth(...formEvent.target.elements.to.value.split('-').map(x => parseInt(x)));
        const timeClasses = [Game.TIME_CLASSES.BULLET, Game.TIME_CLASSES.BLITZ, Game.TIME_CLASSES.RAPID, Game.TIME_CLASSES.DAILY];
        let allowedTimeClasses = [];
        [formEvent.target.elements.bullet.checked, formEvent.target.elements.blitz.checked, formEvent.target.elements.rapid.checked, formEvent.target.elements.daily.checked].forEach((allowed, index) => {
            if (allowed) {
                allowedTimeClasses.push(timeClasses[index]);
            }
        });
        getGamesByMonth(username, new YearMonth(year, month), allowedTimeClasses).then(res => {
            setGames(res);
            setResultsHidden(false);
            setLoading(false);
        }).catch(() => {
            setGames([]);
            setResultsHidden(false);
            setLoading(false);
        });
    }

    return (
        <div className='flex flex-col items-center w-fit h-fit  p-2'>
            <Header searchFormSubmissionHandler={handleSearch} loading={loadingResults}/>
            <Main games={games} resultsReverser={setGamesReversed} hidden={resultsHidden}/>
        </div>
    );
}
