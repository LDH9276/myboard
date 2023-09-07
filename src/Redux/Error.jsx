export const ERROR_WINDOW_ON = "ERROR_WINDOW_ON";
export const ERROR_WINDOW_OFF = "ERROR_WINDOW_OFF";

export function errorWindowOn(error) {
    return {
        type: ERROR_WINDOW_ON,
        payload: {
            error: error,
            errorWindow: true,
        },
    };
}

export function errorWindowOff() {
    return {
        type: ERROR_WINDOW_OFF,
        payload: {
            errorWindow: false,
        },
    };
}
