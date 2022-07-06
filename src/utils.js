import * as errors from "./errors";

export const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

export const MONTHS_3L = [
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

export class YearMonth {
    year;
    month;

    static fromDate(date) {
        return new YearMonth(date.getFullYear(), date.getMonth() + 1);
    }

    constructor(year, month) {
        if (month < 1 || month > 12) {
            throw new errors.InvalidYearMonthError(`Invalid month: ${month}`);
        }
        this.year = year;
        this.month = month;
    }

    increment() {
        if (this.month === 12) {
            this.year++;
            this.month = 0;
        }
        else {
            this.month++;
        }
    }

    decrement() {
        if (this.month === 1) {
            this.year--;
            this.month = 11;
        }
        else {
            this.month--;
        }
    }

    getMM() {
        return this.month.toString().padStart(2, '0');
    }

    valueOf() {
        return this.year * 12 + this.month;
    }

    toString() {
        return `${this.year}-${this.getMM()}`;
    }
}

export class Game {
    endUTC;
    pgn;
    url;
    timeClass;
    timeControl;
    terminationCause;
    result;
    white;
    black;
    isRated;

    constructor(endUTC, pgn, url, timeClass, timeControl, terminationCause, result, white, black, isRated) {
        this.endUTC = endUTC; // Date
        this.pgn = pgn; // String
        this.url = url; // String
        this.timeClass = timeClass; // Number
        this.timeControl = timeControl; // TimeControl
        this.terminationCause = terminationCause; // Number
        this.result = result; // Number
        this.white = white; // Player
        this.black = black; // Player
        this.isRated = isRated; // Boolean
    }

    static get TIME_CLASSES() {
        return {
            BULLET: 1,
            BLITZ: 2,
            RAPID: 3,
            DAILY: 4
        };
    }

    static get RESULT() {
        return {
            WHITE_WON: 1,
            BLACK_WON: 2,
            DRAW: 3
        };
    }

    static get TERMINATION_CAUSE() {
        return {
            CHECKMATE: 1,
            RESIGNATION: 2,
            ABANDONMENT: 3,
            TIMEOUT: 4,
            STALEMATE: 5,
            AGREEMENT: 6,
            REPETITION: 7,
            INSUFFICIENT_MATERIAL: 8,
            TIMEOUT_VS_INSUFFICIENT_MATERIAL: 9,
            FIFTY_MOVE_RULE: 10
        };
    }

    static TimeControl = class {
        val;
        units;
        increment;

        // units can be 'min' or 'days'
        // increment is in seconds

        constructor(val, units, increment=0) {
            this.val = val;
            this.units = units;
            this.increment = increment;
        }

        toString() {
            if (this.units === 'minutes') {
                if (this.increment > 0) {
                    return this.val + '|' + this.increment
                }
                return this.val + ' min';
            }
            if (this.units === 'days') {
                if (this.units === 1) {
                    return this.val + ' day';
                }
                return this.val + ' days';
            }
            else {
                throw Error;
            }
        }
    }

    static Player = class {
        username;
        rating;
        url;

        constructor(username, rating) {
            this.username = username;
            this.rating = rating;
            this.url = `https://www.chess.com/member/${this.username}`;
        }
    };
}

export class PlayerGame extends Game {
    player;
    opponent;

    constructor(playerUsername, endUTC, pgn, url, timeClass, timeControl, terminationCause, result, white, black, isRated) {
        const pUsernameLower = playerUsername.toLowerCase();
        super(endUTC, pgn, url, timeClass, timeControl, terminationCause, result, white, black, isRated);
        if (this.white.username.toLowerCase() === pUsernameLower) {
            this.playerWhite = true;
            this.player = this.white;
            this.opponent = this.black;
        }
        else if (this.black.username.toLowerCase() === pUsernameLower) {
            this.playerWhite = false;
            this.player = this.black;
            this.opponent = this.white;
        }
        else {
            throw Error;
        }
    }
}

export async function fetchJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new errors.InvalidResponseError(`Response not ok: ${await response.text()}`);
    }
    return response.json(); // returns a promise, which resolves to this data value
}

export function isValidUsername(username) {
    // uncomment to disallow preceding or proceeding dashes/underscores: const re = /(?=^[a-zA-Z0-9][a-zA-Z0-9_-]{1,22}?[a-zA-Z0-9]$)(?=.*[a-zA-Z])(?=^(.(?!([-_]{2,})))*$)/;
    const re = /(?=[a-zA-Z\d_-]{3,25}$)(?=^(.(?!([-_]{2,})))*$)/;
    return re.test(username);
}

export async function getGamesByMonth(username,
                                      yearMonth=YearMonth.fromDate(new Date()),
                                      timeClasses = [Game.TIME_CLASSES.BULLET, Game.TIME_CLASSES.BLITZ, Game.TIME_CLASSES.RAPID, Game.TIME_CLASSES.DAILY]
                                      ) {
    const today = YearMonth.fromDate(new Date());
    if (yearMonth.valueOf() > today.valueOf()) {
        throw new errors.InvalidDateError(`Invalid date: ${yearMonth.toString()}`)
    }
    let playerGames = [];
    const url = `https://api.chess.com/pub/player/${username}/games/${yearMonth.year}/${yearMonth.getMM()}`;
    await fetchJSON(url).then(json => {
        for (let i = 0; i < json.games.length; i++) {
            const game = json.games[i];
            if (game.rules !== 'chess') {
                continue;
            }
            const endUTC = new Date(game.end_time * 1000);
            const url = game.url;
            const pgn = game.pgn;
            const TIME_CLASS_CODES = {
                rapid: Game.TIME_CLASSES.RAPID,
                blitz: Game.TIME_CLASSES.BLITZ,
                bullet: Game.TIME_CLASSES.BULLET,
                daily: Game.TIME_CLASSES.DAILY
            };
            if (!(game.time_class in TIME_CLASS_CODES)) {
                throw new errors.InvalidTimeClassError(`Invalid time class: ${game.time_class}`);
            }
            const timeClass = TIME_CLASS_CODES[game.time_class];
            if (!timeClasses.includes(timeClass)) {
                continue;
            }
            let timeControlArgs;
            if (game.time_control.includes('+')) {
                const [seconds, increment] = game.time_control.split('+').map(x => parseInt(x));
                timeControlArgs = [seconds / 60, 'minutes', increment];
            }
            else if (game.time_control.includes('/')) {
                const seconds = parseInt(game.time_control.split('/')[1]);
                timeControlArgs = [seconds / 24 / 60 / 60, 'days', 0];
            }
            else {
                const seconds = parseInt(game.time_control);
                timeControlArgs = [seconds / 60, 'minutes', 0];
            }
            const timeControl = new Game.TimeControl(...timeControlArgs);
            const LOSS_CODES = {
                checkmated: Game.TERMINATION_CAUSE.CHECKMATE,
                resigned: Game.TERMINATION_CAUSE.RESIGNATION,
                timeout: Game.TERMINATION_CAUSE.TIMEOUT,
                abandoned: Game.TERMINATION_CAUSE.ABANDONMENT
            };
            const DRAW_CODES = {
                stalemate: Game.TERMINATION_CAUSE.STALEMATE,
                agreed: Game.TERMINATION_CAUSE.AGREEMENT,
                repetition: Game.TERMINATION_CAUSE.REPETITION,
                insufficient: Game.TERMINATION_CAUSE.INSUFFICIENT_MATERIAL,
                timevsinsufficient: Game.TERMINATION_CAUSE.TIMEOUT_VS_INSUFFICIENT_MATERIAL,
                '50move': Game.TERMINATION_CAUSE.FIFTY_MOVE_RULE
            };
            let result, terminationCause;
            if (game.white.result === 'win' && game.black.result in LOSS_CODES) {
                result = Game.RESULT.WHITE_WON;
                terminationCause = LOSS_CODES[game.black.result];
            }
            else if (game.black.result === 'win' && game.white.result in LOSS_CODES) {
                result = Game.RESULT.BLACK_WON;
                terminationCause = LOSS_CODES[game.white.result];
            }
            else if (game.white.result === game.black.result && game.white.result in DRAW_CODES) {
                result = Game.RESULT.DRAW;
                terminationCause = DRAW_CODES[game.white.result];
            }
            else {
                throw new errors.InvalidTerminationCauseError(`Invalid termination cause: {white result: ${game.white.result}, black result: ${game.black.result}}`);
            }
            const isRated = game.isRated;
            const white = new Game.Player(game.white.username, game.white.rating);
            const black = new Game.Player(game.black.username, game.black.rating);
            const playerGame = new PlayerGame(username, endUTC, pgn, url, timeClass, timeControl, terminationCause, result, white, black, isRated);
            playerGames.push(playerGame);
        }
    }).catch((reason) => {
        throw reason;
        //throw new InvalidUsernameError(`invalid username: ${username}`);
    });
    return playerGames;
}

/*
STORAGE:
export async function getGamesByMonth(username,
                                      since=YearMonth.fromDate(new Date()),
                                      until=YearMonth.fromDate(new Date()),
                                      validTimeClasses=[Game.TIME_CLASSES.BULLET, Game.TIME_CLASSES.BLITZ, Game.TIME_CLASSES.RAPID, Game.TIME_CLASSES.DAILY],
                                      recentFirst=true) {
    const today = YearMonth.fromDate(new Date());
    if (since.valueOf() > today.valueOf() || until.valueOf() > today.valueOf() || since.valueOf() > until.valueOf()) {
        throw Error;
    }
    let playerGames = [];
    let iter = since;
    while (iter.valueOf() <= until.valueOf()) {
        const url = `https://api.chess.com/pub/player/${username}/games/${iter.year}/${iter.getMM()}`;
        await fetchJSON(url).then(json => {
            for (let i = 0; i < json.games.length; i++) {
                const game = json.games[i];
                if (game.rules !== 'chess') {
                    continue;
                }
                const endUTC = new Date(game.end_time * 1000);
                const url = game.url;
                const pgn = game.pgn;
                const TIME_CLASS_CODES = {
                    rapid: Game.TIME_CLASSES.RAPID,
                    blitz: Game.TIME_CLASSES.BLITZ,
                    bullet: Game.TIME_CLASSES.BULLET,
                    daily: Game.TIME_CLASSES.DAILY
                };
                const timeClass = TIME_CLASS_CODES[game.time_class];
                if (!validTimeClasses.includes(timeClass)) {
                    continue;
                }
                let timeControlArgs;
                if (game.time_control.includes('+')) {
                    const [seconds, increment] = game.time_control.split('+').map(x => parseInt(x));
                    timeControlArgs = [seconds / 60, 'minutes', increment];
                }
                else if (game.time_control.includes('/')) {
                    const seconds = parseInt(game.time_control.split('/')[1]);
                    timeControlArgs = [seconds / 24 / 60 / 60, 'days', 0];
                }
                else {
                    const seconds = parseInt(game.time_control);
                    timeControlArgs = [seconds / 60, 'minutes', 0];
                }
                const timeControl = new Game.TimeControl(...timeControlArgs);
                const LOSS_CODES = {
                    checkmated: Game.TERMINATION_CAUSE.CHECKMATE,
                    resigned: Game.TERMINATION_CAUSE.RESIGNATION,
                    timeout: Game.TERMINATION_CAUSE.TIMEOUT,
                    abandoned: Game.TERMINATION_CAUSE.ABANDONMENT
                };
                const DRAW_CODES = {
                    stalemate: Game.TERMINATION_CAUSE.STALEMATE,
                    agreed: Game.TERMINATION_CAUSE.AGREEMENT,
                    repetition: Game.TERMINATION_CAUSE.REPETITION,
                    insufficient: Game.TERMINATION_CAUSE.INSUFFICIENT_MATERIAL,
                    timevsinsufficient: Game.TERMINATION_CAUSE.TIMEOUT_VS_INSUFFICIENT_MATERIAL,
                    '50move': Game.TERMINATION_CAUSE.FIFTY_MOVE_RULE
                };
                let result, terminationCause;
                if (game.white.result === 'win' && game.black.result in LOSS_CODES) {
                    result = Game.RESULT.WHITE_WON;
                    terminationCause = LOSS_CODES[game.black.result];
                }
                else if (game.black.result === 'win' && game.white.result in LOSS_CODES) {
                    result = Game.RESULT.BLACK_WON;
                    terminationCause = LOSS_CODES[game.white.result];
                }
                else if (game.white.result === game.black.result && game.white.result in DRAW_CODES) {
                    result = Game.RESULT.DRAW;
                    terminationCause = DRAW_CODES[game.white.result];
                }
                else {
                    throw Error;
                }
                const isRated = game.isRated;
                const white = new Game.Player(game.white.username, game.white.rating);
                const black = new Game.Player(game.black.username, game.black.rating);
                const playerGame = new PlayerGame(username, endUTC, pgn, url, timeClass, timeControl, terminationCause, result, white, black, isRated);
                playerGames.push(playerGame);
            }
        });
        iter.increment();
    }
    if (recentFirst) {
        playerGames.reverse();
    }
    return playerGames;
}
*/