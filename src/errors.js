import ReactGA from "react-ga";

class AbstractError extends Error {
    constructor(message) {
        super(message);
        ReactGA.exception({
            description: message,
            fatal: false
        });
        this.name = 'AbstractError';
    }
}

export class InvalidYearMonthError extends AbstractError {
    constructor(message) {
        super(message);
        this.name = 'YearMonthError';
    }
}

export class InvalidGameAttrValueError extends AbstractError {
    constructor(message) {
        super(message);
        this.name = 'InvalidGameAttrValueError';
    }
}

export class InvalidResponseError extends AbstractError {
    constructor(message) {
        super(message);
        this.name = 'InvalidResponseError';
    }
}

export class InvalidUsernameError extends AbstractError {
    constructor(message) {
        super(message);
        this.name = 'InvalidUsernameError';
    }
}

export class InvalidDateError extends AbstractError {
    constructor(message) {
        super(message);
        this.name = 'InvalidDateError';
    }
}

export class InvalidTimeClassError extends InvalidGameAttrValueError {
    constructor(message) {
        super(message);
        this.name = 'InvalidTimeClassError';
    }
}

export class InvalidTerminationCauseError extends InvalidGameAttrValueError {
    constructor(message) {
        super(message);
        this.name = 'InvalidTerminationCauseError';
    }
}