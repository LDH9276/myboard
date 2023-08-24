export const READ = 'READ';

export function reading(writer, content) {
  return {
    type: content,
    payload: {
        writer: writer,
        content: content
      }
  };
}