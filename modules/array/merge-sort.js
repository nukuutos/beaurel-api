const getPropertyForCompare = (element, property) => {
  if (property) return element[property];
  return element;
};

const merge = (array1, array2, property) => {
  const mergedArray = [];

  let i = 0;
  let j = 0;

  const handlePush = (element, counter) => {
    mergedArray.push(element);
    return counter + 1;
  };

  const handleRestElements = (array, counter) => {
    while (array.length !== counter) {
      const element = array[counter];
      counter = handlePush(element, counter);
    }
  };

  while (array1.length !== i && array2.length !== j) {
    const element1 = array1[i];
    const element2 = array2[j];

    const property1 = getPropertyForCompare(element1, property);
    const property2 = getPropertyForCompare(element2, property);

    if (property1 < property2) i = handlePush(element1, i);
    else j = handlePush(element2, j);
  }

  if (array1.length !== i) handleRestElements(array1, i);

  if (array2.length !== j) handleRestElements(array2, j);

  return mergedArray;
};

const main = (array, property = null) => {
  if (array.length === 1) return array;

  const middle = Math.floor(array.length / 2);

  const left = main(array.slice(0, middle), property);
  const right = main(array.slice(middle), property);

  return merge(left, right, property);
};

function mergeSort(property = null) {
  if (!this.length) return [];

  const copiedArray = [...this];
  const sortedArray = main(copiedArray, property);
  return sortedArray;
}

Array.prototype.mergeSort = mergeSort;
