export const calculateFare = (
  distance: number,
  surge: number
) => {
  return distance * 10 * surge;
};
