import Results from "./Results";
import React from "react";
import {MONTHS} from "../utils";

export default function ResultsSection(props) {
    const [sortByRecent, setSortByRecent] = React.useState(true);

    let gameCountText;
    if (props.games.length === 0) {
        gameCountText = 'No games';
    }
    else if (props.games.length === 1) {
            gameCountText = '1 game';
    }
    else {
        gameCountText = props.games.length + ' games';
    }
    let dateTag = <></>;
    if (props.searchParams.username !== null) {
        dateTag = <span className='font-semibold'>{`${MONTHS[props.searchParams.yearMonth.month - 1]} ${props.searchParams.yearMonth.year}`}</span>
    }

    return (
        <div hidden={props.hidden} className='w-full'>
            <div className='flex justify-center items-center p-5 gap-6 whitespace-nowrap'>
                <span className='flex justify-center font-light rounded-2xl text-teal-800 text-lg'>
                    <span className='font-semibold'>{gameCountText}</span>&nbsp;retrieved from&nbsp;{dateTag}&nbsp;for&nbsp;"<span className='font-bold'>{props.searchParams.username}</span>"
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