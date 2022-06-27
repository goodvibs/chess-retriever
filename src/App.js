import React from 'react';
import SearchBlock from './components/SearchBlock';
import {Game, getGamesByMonth, isValidUsername, YearMonth} from "./utils"
import ResultsBlock from "./components/ResultsBlock";

export default function App() {

    const [loadingResults, setLoading] = React.useState(false);

    const [isInInitialState, setIsInInitialState] = React.useState(true);

    const [games, setGames] = React.useState([]);

    function handleSearch(formEvent) {
        formEvent.preventDefault();
        //const advanced = formEvent.target.elements.;
        const username = formEvent.target.elements.username.value;
        if (!isValidUsername(username)) {
            return;
        }

        setIsInInitialState(true);
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
            <ResultsBlock games={games} hidden={isInInitialState}/>
        </div>
    );
}
