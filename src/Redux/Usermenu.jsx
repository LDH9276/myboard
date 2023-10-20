export const USERBTN = "USERBTN";

export function userBtn(type) {
    return {
        type: USERBTN,
        payload: {
            type : type,
        },
    };
}
