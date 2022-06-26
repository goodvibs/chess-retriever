import React from "react";
import {Game} from "../utils";

export default function Results(props) {
    const [lichessIDs, setLichessIDs] = React.useState({});
    return props.games.map((game, gameIndex) => {
        const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];
        const timeClasses = [
            'bullet',
            'blitz',
            'rapid',
            'daily'
        ];
        let result;
        if (game.result === Game.RESULT.DRAW) {
            result = 'drew';
        } else if ((game.result === Game.RESULT.WHITE_WON && game.playerWhite === true) || (game.result === Game.RESULT.BLACK_WON && game.playerWhite === false)) {
            result = 'won';
        } else if ((game.result === Game.RESULT.WHITE_WON && game.playerWhite === false) || (game.result === Game.RESULT.BLACK_WON && game.playerWhite === true)) {
            result = 'lost';
        } else {
            throw Error;
        }
        const terminationCauses = [
            'checkmate',
            'resignation',
            'abandonment',
            'timeout',
            'stalemate',
            'agreement',
            'repetition',
            'insufficient material',
            'timeout vs. insufficient material',
            'fifty move rule'
        ];

        let iframe = <></>;
        if (gameIndex in lichessIDs) {
            iframe = (
                <iframe src={'https://lichess.org/embed/' + lichessIDs[gameIndex] + '?theme=auto&bg=auto'} width='600'
                        height='397'
                        className='rounded-xl hover:'></iframe>
            );
        }

        return (
            <div
                className='flex flex-col gap-6 bg-amber-300 rounded-xl p-5 items-center transition-colors duration-500'>
                <div className='flex gap-6 items-center'>
                    <div className='flex flex-col items-center text-sm font-semibold'>
                        <div>
                            {months[game.endUTC.getMonth()] + ' ' + game.endUTC.getDate() + ','}
                        </div>
                        <div>
                            {game.endUTC.getFullYear()}
                        </div>
                    </div>
                    <div className='flex flex-col items-center text-sm font-semibold'>
                        <div>
                            {game.timeControl.toString()}
                        </div>
                        <div>
                            {timeClasses[game.timeClass - 1]}
                        </div>
                    </div>
                    <div
                        className='w-52 flex flex-wrap font-light md:inline md:flex-nowrap md:truncate md:w-100 lg:w-120'>
                        <span className='font-semibold'>{result}&nbsp;</span>
                        vs.&nbsp;
                        <a href={game.opponent.url} target='_blank' rel='noreferrer'
                           className='font-bold text-blue-600 hover:text-blue-500 hover:no-underline'>
                            {game.opponent.username}
                        </a>
                        &nbsp;by&nbsp;
                        <span className='font-semibold'>{terminationCauses[game.terminationCause - 1]}&nbsp;</span>
                    </div>
                    <button type='button' onClick={mouseEvent => {
                        mouseEvent.preventDefault();
                        const urlSearchParams = new URLSearchParams({
                            pgn: game.pgn
                        });
                        fetch('https://lichess.org/api/import', {
                            method: 'POST',
                            body: urlSearchParams
                        }).then(response => {
                            //response.json().then((data) => window.open(data['url'], '_blank'));
                            /*response.json().then((data) => {
                                let container = document.getElementById('iframe-container-' + index);
                                container.innerHTML = ReactDOMServer.renderToString(
                                    <iframe src={'https://lichess.org/embed/' + data['id'] + '?theme=auto&bg=auto'} width='600' height='397'
                                    className='rounded-xl'></iframe>
                                );
                            });*/
                            response.json().then((data) => {
                                setLichessIDs(prevLichessIDs => {
                                    let temp = {...prevLichessIDs};
                                    temp[gameIndex] = data['id'];
                                    return temp;
                                });
                            })
                        });
                        mouseEvent.target.disabled = true;
                    }}
                            className='bg-teal-800 text-white font-semibold text-sm p-2 px-4 rounded-full hover:bg-teal-900 disabled:opacity-100 disabled:bg-black disabled:bg-opacity-30'>
                        lichess
                    </button>
                </div>
                {iframe}
            </div>
        );
    });
}