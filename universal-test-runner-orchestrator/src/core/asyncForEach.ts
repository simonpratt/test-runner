export const asyncForEach = async <T>(array: T[], handler: (item: T) => Promise<void>) => {
  for (let i = 0; i < array.length; i++) {
    await handler(array[i]);
  }
};
