export default (arr, sortBy) => {
  return arr.sort((a, b) => a?.[sortBy].localeCompare(b?.[sortBy]));
}