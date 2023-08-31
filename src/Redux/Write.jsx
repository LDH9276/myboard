export const WRITING = 'WRITE_POST';

export function reading(content) {
    return {
        type: WRITING,
        payload: {
            content: content
        }
    };
}
