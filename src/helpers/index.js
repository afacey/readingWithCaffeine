export function arraysAreEqual(arr1, arr2) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
  if (arr1.length !== arr2.length) return false;

  for(let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false
    }
  }

  return true;
}

export function randomizeArrayItems(arr) {
  // creating a copy of the array to randomize and reduce to 10
  let randomArr = [...arr];

  // standard fisher-yates randomizer to randomize entire array and prevent duplicates
  for (let i = randomArr.length - 1; i > 0; i--) {
    const compareIndex = Math.floor(Math.random() * (i + 1));
    let temp = randomArr[i];
    randomArr[i] = randomArr[compareIndex];
    randomArr[compareIndex] = temp;
  }

  return randomArr;

}
