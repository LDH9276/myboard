export const READ = "READ";
export const LOADING = "LOADING";

export function reading(writer, content) {
    return {
        type: content,
        payload: {
            writer: writer,
            content: content,
        },
    };
}

export function loading(trueOrFalse) {
    return {
        type: LOADING,
        payload: {
            isLoading: trueOrFalse,
        },
    };
}
