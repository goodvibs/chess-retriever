import React from "react";
import {Game} from "../utils";

export default function Results(props) {
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
            result = 'draw';
        } else if ((game.result === Game.RESULT.WHITE_WON && game.playerWhite === true) || (game.result === Game.RESULT.BLACK_WON && game.playerWhite === false)) {
            result = 'win';
        } else if ((game.result === Game.RESULT.WHITE_WON && game.playerWhite === false) || (game.result === Game.RESULT.BLACK_WON && game.playerWhite === true)) {
            result = 'loss';
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
        if (gameIndex in props.lichessIDs) {
            iframe = (
                <iframe src={'https://lichess.org/embed/' + props.lichessIDs[gameIndex] + '?theme=auto&bg=auto'} width='600'
                        height='397'
                        className='rounded-xl w-full h-60 md:h-96'></iframe>
            );
        }

        return (
            <div className='flex flex-col gap-5 bg-amber-300 rounded-xl p-5 my-1 items-center'>
                <div className='flex items-center'>
                    <span className='flex flex-col w-16 items-center text-sm font-semibold'>
                        <div>
                            {months[game.endUTC.getMonth()] + ' ' + game.endUTC.getDate() + ','}
                        </div>
                        <div>
                            {game.endUTC.getFullYear()}
                        </div>
                    </span>
                    <span className='flex flex-col w-16 items-center text-sm font-semibold'>
                        <div>
                            {game.timeControl.toString()}
                        </div>
                        <div>
                            {timeClasses[game.timeClass - 1]}
                        </div>
                    </span>
                    <div className='flex flex-col items-start ml-2 w-52 text-lg font-bold'>
                            <span className='flex flex-nowrap items-center gap-2'>
                                <svg width='12' height='12'>
                                    <rect width='12' height='12' rx='4' ry='4' className={game.white.username === game.player.username ? 'fill-white ' : 'fill-black '}></rect>
                                </svg>
                                <a href={game.player.url} target='_blank' rel='noreferrer' className='flex flex-nowrap items-center hover:text-blue-500'>
                                    <span className='max-w-32 truncate'>{game.player.username}</span>
                                    &nbsp;
                                    <span className='text-sm font-semibold'>{`(${game.player.rating})`}</span>
                                </a>
                            </span>
                        <span className='flex flex-nowrap items-center gap-2'>
                                <svg width='12' height='12'>
                                    <rect width='12' height='12' rx='4' ry='4' className={game.white.username === game.opponent.username ? 'fill-white ' : 'fill-black '}></rect>
                                </svg>
                                <a href={game.opponent.url} target='_blank' rel='noreferrer' className='flex flex-nowrap items-center hover:text-blue-500'>
                                    <span className='max-w-32 truncate'>{game.opponent.username}</span>
                                    &nbsp;
                                    <span className='text-sm font-semibold'>{`(${game.opponent.rating})`}</span>
                                </a>
                            </span>
                    </div>

                    <span className='flex text-lg font-light justify-center w-16 mr-2 md:w-48 md:justify-start md:ml-2 md:mr-0'>
                        <a href={game.url} target='_blank' rel='noreferrer' className='hover:text-blue-500'>
                        <span className='font-semibold'>{result}</span>
                        <span className='hidden md:inline'>
                            &nbsp;by&nbsp;
                            <span className=''>{terminationCauses[game.terminationCause - 1]}</span>
                        </span>
                    </a>
                    </span>

                    <button type='button' disabled={gameIndex in props.lichessIDs} onClick={mouseEvent => {
                        mouseEvent.preventDefault();
                        const urlSearchParams = new URLSearchParams({
                            pgn: game.pgn
                        });
                        fetch('https://lichess.org/api/import', {
                            method: 'POST',
                            body: urlSearchParams
                        }).then(response => {
                            response.json().then((data) => props.lichessIDAdder(gameIndex, data['id']));
                        });
                    }} className='lichess-btn text-sm p-1 px-3 rounded-full disabled:opacity-40'>
                        lichess
                        <span>.org</span>
                    </button>
                </div>
                {iframe}
            </div>
        );
    });
}