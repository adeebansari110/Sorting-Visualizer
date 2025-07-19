let array = [];
const container = document.getElementById('container');

// Global speed variable (default 250ms)
let speed = 250;

// Update speed from slider
const speedRange = document.getElementById('speedRange');
const speedValue = document.getElementById('speedValue');
if (speedRange && speedValue) {
    speedRange.addEventListener('input', function() {
        speed = Number(this.value);
        speedValue.textContent = this.value;
    });
}

// Helper: sleep for 'speed' ms
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getNumValues() {
    const numInput = document.getElementById('numValues');
    let val = 20;
    if (numInput) {
        val = Math.max(5, parseInt(numInput.value, 10) || 20);
    }
    return val;
}

init();

function init() {
    const n = getNumValues();
    array = [];
    for (let i = 0; i < n; i++) {
        array.push(Math.floor(Math.random() * 91) + 10); // values from 10 to 100
    }
    showBars();
}

function play(algorithm) {
    const copy = [...array];
    let swaps;
    let isMergeSort = false;
    switch (algorithm) {
        case 'bubbleSort':
            swaps = bubbleSort(copy);
            break;
        case 'selectionSort':
            swaps = selectionSort(copy);
            break;
        case 'insertionSort':
            swaps = insertionSort(copy);
            break;
        case 'mergeSort':
            swaps = mergeSort(copy);
            isMergeSort = true;
            break;
        case 'quickSort':
            swaps = quickSort(copy);
            break;
        default:
            return;
    }
    animate(swaps, isMergeSort);
}

async function animate(swaps, isMergeSort = false) {
    if (swaps.length === 0) {
        showBars();
        return;
    }
    if (isMergeSort) {
        const [i, value] = swaps.shift();
        array[i] = value;
        showBars([i]);
        await sleep(speed);
        animate(swaps, true);
    } else {
        const [i, j] = swaps.shift();
        [array[i], array[j]] = [array[j], array[i]];
        showBars([i, j]);
        await sleep(speed);
        animate(swaps);
    }
}

function bubbleSort(arr) {
    const swaps = [];
    let swapped;
    do {
        swapped = false;
        for (let i = 1; i < arr.length; i++) {
            if (arr[i - 1] > arr[i]) {
                swaps.push([i - 1, i]);
                [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
                swapped = true;
            }
        }
    } while (swapped);
    return swaps;
}

function selectionSort(arr) {
    const swaps = [];
    for (let i = 0; i < arr.length; i++) {
        let minIndex = i;
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            swaps.push([i, minIndex]);
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        }
    }
    return swaps;
}

function insertionSort(arr) {
    const swaps = [];
    for (let i = 1; i < arr.length; i++) {
        let j = i;
        while (j > 0 && arr[j - 1] > arr[j]) {
            swaps.push([j - 1, j]);
            [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
            j--;
        }
    }
    return swaps;
}

// Synchronous quickSort
function quickSort(arr) {
    const swaps = [];
    function quickSortHelper(start, end) {
        if (start >= end) return;
        const pivotIndex = partition(start, end);
        quickSortHelper(start, pivotIndex - 1);
        quickSortHelper(pivotIndex + 1, end);
    }
    function partition(start, end) {
        const pivot = arr[end];
        let i = start;
        for (let j = start; j < end; j++) {
            if (arr[j] < pivot) {
                swaps.push([i, j]);
                [arr[i], arr[j]] = [arr[j], arr[i]];
                i++;
            }
        }
        swaps.push([i, end]);
        [arr[i], arr[end]] = [arr[end], arr[i]];
        return i;
    }
    quickSortHelper(0, arr.length - 1);
    return swaps;
}
function mergeSort(arr) {
    const actions = [];

    function mergeSortHelper(start, end) {
        if (start >= end) return;

        const mid = Math.floor((start + end) / 2);
        mergeSortHelper(start, mid);
        mergeSortHelper(mid + 1, end);
        merge(start, mid, end);
    }

    function merge(start, mid, end) {
        const left = arr.slice(start, mid + 1);
        const right = arr.slice(mid + 1, end + 1);

        let i = 0, j = 0, k = start;

        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                arr[k] = left[i];
                actions.push([k, left[i]]);
                i++;
            } else {
                arr[k] = right[j];
                actions.push([k, right[j]]);
                j++;
            }
            k++;
        }

        while (i < left.length) {
            arr[k] = left[i];
            actions.push([k, left[i]]);
            i++;
            k++;
        }

        while (j < right.length) {
            arr[k] = right[j];
            actions.push([k, right[j]]);
            j++;
            k++;
        }
    }

    mergeSortHelper(0, arr.length - 1);
    return actions;
}


function showBars(swappedIndices = []) {
    container.innerHTML = "";
    // Find max value for scaling (optional, for better visuals)
    const maxVal = Math.max(...array, 1);
    const barWidth = `calc(${100 / array.length}% - 2px)`;
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement("div");
        // Scale height to max 90% of container (optional)
        const height = (array[i] / maxVal) * 220; // 220px is container min-height
        bar.style.height = height + "px";
        bar.style.width = barWidth;
        bar.classList.add("bar");
        if (swappedIndices.includes(i)) {
            bar.classList.add("swap");
        }
        // Add value label inside the bar
        const label = document.createElement("span");
        label.className = "bar-value";
        label.textContent = array[i];
        bar.appendChild(label);
        container.appendChild(bar);
    }
}

// Re-initialize when the number of values changes
const numInput = document.getElementById('numValues');
if (numInput) {
    numInput.addEventListener('change', () => {
        let val = Math.max(5, parseInt(numInput.value, 10) || 20);
        numInput.value = val; // enforce min
        init();
    });
}