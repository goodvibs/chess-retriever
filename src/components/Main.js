import Results from "./Results";
import React from "react";

export default function Main(props) {
    //const [results, setResults] = React.useState(<Results games={props.games}/>);

    let gameCountText;
    if (props.games.length === 0) {
        gameCountText = 'No games retrieved.';
    } else if (props.games.length === 1) {
        gameCountText = '1 game retrieved.';
    } else {
        gameCountText = props.games.length + ' games retrieved.';
    }

    return (
        <div hidden={props.hidden}>
            <div className='flex justify-center items-center whitespace-nowrap'>
                <span
                    className='flex justify-center font-light text-md p-3 rounded-xl text-teal-800 md:text-lg md:p-4 lg:text-xl lg:p-5'>
                    {gameCountText}
                </span>
                <select hidden={props.games <= 1} onChange={(changeEvent) => {
                    props.resultsReverser();
                }}
                        className='p-1 rounded-xl bg-amber-300 text-teal-800 font-light outline-none text-md md:text-lg md:p-1.5 lg:text-xl lg:p-2'
                        defaultValue='1'>
                    <option value='1'>oldest first</option>
                    <option value='2'>recent first</option>
                </select>
            </div>
            <div className='flex flex-col text-md gap-2 rounded-xl text-teal-800 md:text-lg lg:text-xl'>
                <Results games={props.games}/>
            </div>
        </div>
    );
}