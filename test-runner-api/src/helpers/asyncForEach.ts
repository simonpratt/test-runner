export default async function asyncForEach<T>(items: T[], fn: (item: T) => Promise<void>) {
  for (let i = 0; i < items.length; i++) {
    await fn(items[i]);
  }
}
