import Results from "./Results";
import React from "react";

export default function ResultsSection(props) {
    const [sortByRecent, setSortByRecent] = React.useState(true);

    let gameCountText;
    if (props.games.length === 0) {
        gameCountText = 'No games retrieved.';
    } else if (props.games.length === 1) {
        gameCountText = '1 game retrieved.';
    } else {
        gameCountText = props.games.length + ' games retrieved.';
    }

    return (
        <div hidden={props.hidden} className='w-full'>
            <div className='flex justify-center items-center whitespace-nowrap'>
                <span
                    className='flex justify-center font-light rounded-xl text-teal-800 text-xl p-5'>
                    {gameCountText}
                </span>
                <select hidden={props.games <= 1} onChange={(changeEvent) => {
                    if (changeEvent.target.value === 'recent') {
                        setSortByRecent(true);
                    }
                    else {
                        setSortByRecent(false);
                    }
                }}
                        className='rounded-2xl bg-amber-300 text-teal-800 font-light outline-none text-xl px-2 py-1'
                        defaultValue='recent'>
                    <option value='recent'>recent first</option>
                    <option value='oldest'>oldest first</option>
                </select>
            </div>
            <div className={'flex w-full' + (sortByRecent ? ' flex-col-reverse ' : ' flex-col ')}>
                <Results games={props.games} lichessIDs={props.lichessIDs} lichessIDAdder={props.lichessIDAdder}/>
            </div>
        </div>
    );
}