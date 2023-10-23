export const USERBTN = "USERBTN";
export const USERTHEME = "USERTHEME";

export function userBtn(type) {
    return {
        type: USERBTN,
        payload: {
            type : type,
        },
    };
}

export function userTheme(theme) {
    return {
        type: USERTHEME,
        payload: {
            theme : theme,
        },
    };
}