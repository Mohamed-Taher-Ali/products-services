export function generateUniqueNumbers(count: number, max: number) {
  if (max < count) {
    throw new Error('Range too small to generate unique numbers');
  }

  const numbers = new Set<number>();
  while (numbers.size < count) {
    const randomNum = Math.floor(Math.random() * max) + 1;
    numbers.add(randomNum);
  }

  return Array.from(numbers);
}
