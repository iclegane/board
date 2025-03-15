// TODO: Подумать
export class SuccessResponse<T = unknown> {
    readonly status = 'success';
    readonly message: string;
    readonly payload?: T;

    constructor(message: string, payload?: T) {
        this.message = message;
        this.payload = payload;
    }
}

export class ErrorResponse {
    readonly status = 'error';
    readonly message: string;

    constructor(message: string) {
        this.message = message;
    }
}
