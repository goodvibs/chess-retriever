import React from "react";
import {Game} from "../utils";
import {MONTHS_3L} from  '../utils';

export default function Results(props) {
    return props.games.map((game, gameIndex) => {
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
            const lichessID = props.lichessIDs[gameIndex];
            iframe = (
                <div className='flex flex-1 w-full flex-col'>
                    <iframe title={`${game.player.username} vs. ${game.opponent.username}`} src={'https://lichess.org/embed/' + lichessID + '?theme=auto&bg=light'}
                            className='rounded-t-2xl w-full h-96'>
                    </iframe>
                    <a className='flex bg-teal-800 rounded-b-2xl p-2 w-full justify-center text-white hover:bg-teal-900' target='_blank' href={`https://lichess.org/${lichessID}`} rel="noreferrer" >Open in Lichess</a>
                </div>
            );
        }

        return (
            <div className='flex flex-col gap-5 bg-amber-300 rounded-2xl w-full p-3 mb-2 items-center'>
                <div className='flex w-full items-center justify-around'>
                    <span className='flex justify-around text-sm font-semibold'>
                        <span className='flex flex-col w-16 items-center'>
                        <div>
                            {MONTHS_3L[game.endUTC.getMonth()] + ' ' + game.endUTC.getDate() + ','}
                        </div>
                        <div>
                            {game.endUTC.getFullYear()}
                        </div>
                        </span>
                        <span className='flex flex-col w-16 items-center'>
                            <div>
                                {game.timeControl.toString()}
                            </div>
                            <div>
                                {timeClasses[game.timeClass - 1]}
                            </div>
                        </span>
                    </span>
                    <div className='flex flex-col items-start ml-2 w-52 text-lg font-bold'>
                        <span className='flex flex-nowrap items-center gap-2'>
                            <span className={(game.white.username === game.player.username ? 'bg-white ' : 'bg-black ') + 'w-3 h-3 rounded-2xl'}></span>
                            <a href={game.player.url} target='_blank' rel='noreferrer' className='flex flex-nowrap items-center hover:text-blue-500'>
                                <span className='max-w-32 truncate'>{game.player.username}</span>
                                &nbsp;
                                <span className='text-sm font-semibold'>{`(${game.player.rating})`}</span>
                            </a>
                        </span>
                        <span className='flex flex-nowrap items-center gap-2'>
                            <span className={(game.white.username === game.opponent.username ? 'bg-white ' : 'bg-black ') + 'w-3 h-3 rounded-2xl'}></span>
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
                    }} className='lichess-btn text-sm p-1 px-3 rounded-2xl disabled:opacity-40'>
                        lichess
                        <span>.org</span>
                    </button>
                </div>
                {iframe}
            </div>
        );
    });
}