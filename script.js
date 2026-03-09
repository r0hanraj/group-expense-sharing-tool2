// ============================================================
// EXPENSE SPLITTER — SplitSmart
// Subject 1 (Web Dev)  : CO3 - Apply JavaScript Programming Essentials
//                        CO4 - Apply JavaScript Interactivity, DOM
//                        CO5 - Apply Advanced Web Development & Deployment
// Subject 2 (DSA)      : CO1 - Searching & Sorting Algorithms
//                        CO2 - Abstract Data Types (Arrays, Linked Lists)
//                        CO3 - Stacks & Queues for real-world workflows
//                        CO4 - Hash-based data structures for fast lookup
//                        CO5 - Practical applications for linear Data Structures
// ============================================================


// ============================================================
// [DSA CO2 | BTL-4] ABSTRACT DATA TYPE: SINGLY LINKED LIST
// Design and implement an ADT using singly linked list.
// Supports insert (append), delete (remove), search (contains),
// and traverse (toArray) operations — core ADT operations per CO2.
// Trade-off: O(n) traversal vs O(1) array access; chosen here
// because membership list requires frequent insert/delete at ends.
// ============================================================

// [DSA CO2] Node class — the building block of the singly linked list
class MemberNode {
  constructor(name) {
    this.name = name;   // data field
    this.next = null;   // pointer to next node (singly linked)
  }
}

// [DSA CO2 | CO5] MemberLinkedList — practical ADT for member management
// Implements all typical ADT operations: insert, delete, search, traverse
class MemberLinkedList {
  constructor() {
    this.head = null; // pointer to first node
    this.size = 0;    // tracks length for O(1) size queries
  }

  // [DSA CO2] INSERT — append at tail: O(n) traversal to find end
  append(name) {
    const node = new MemberNode(name);
    if (!this.head) {
      // List is empty — new node becomes head
      this.head = node;
    } else {
      // Traverse to last node, then link new node
      let curr = this.head;
      while (curr.next) curr = curr.next;
      curr.next = node;
    }
    this.size++;
  }

  // [DSA CO2] DELETE — remove by value: O(n) search before unlinking
  remove(name) {
    if (!this.head) return false;
    // Edge case: target is the head node
    if (this.head.name === name) {
      this.head = this.head.next; // re-link head to second node
      this.size--;
      return true;
    }
    // General case: find predecessor and bypass target node
    let curr = this.head;
    while (curr.next) {
      if (curr.next.name === name) {
        curr.next = curr.next.next; // skip over the deleted node
        this.size--;
        return true;
      }
      curr = curr.next;
    }
    return false;
  }

  // [DSA CO2] TRAVERSE — convert linked list to array for UI rendering
  // Time: O(n) — visits every node once
  toArray() {
    const arr = [];
    let curr = this.head;
    while (curr) {
      arr.push(curr.name);
      curr = curr.next;
    }
    return arr;
  }

  // [DSA CO2] SEARCH — linear search through linked nodes: O(n)
  contains(name) {
    let curr = this.head;
    while (curr) {
      if (curr.name === name) return true;
      curr = curr.next;
    }
    return false;
  }
}


// ============================================================
// [DSA CO3 | BTL-3] ADT: STACK — Array-based implementation
// Apply stacks to model real-world workflows (expense undo history).
// LIFO (Last-In-First-Out): the most recent expense is undone first.
// Array-based implementation chosen for O(1) push/pop performance.
// Models: browser back-button, undo/redo, function call stack.
// ============================================================
class Stack {
  constructor() {
    this._data = []; // internal array backing the stack
  }

  // [DSA CO3] PUSH — add item to top of stack: O(1) amortized
  push(item)  { this._data.push(item); }

  // [DSA CO3] POP — remove and return top item: O(1)
  // Returns null if stack is empty (prevents underflow)
  pop()       { return this._data.length ? this._data.pop() : null; }

  // [DSA CO3] PEEK — inspect top without removing: O(1)
  peek()      { return this._data[this._data.length - 1]; }

  // [DSA CO3] Utility helpers
  isEmpty()   { return this._data.length === 0; }
  size()      { return this._data.length; }

  // Returns items top-first (most recent first) for UI display
  toArray()   { return [...this._data].reverse(); }
}


// ============================================================
// [DSA CO3 | BTL-3] ADT: QUEUE — Array-based with front pointer
// Apply queues to model FIFO real-world workflows (join order).
// FIFO (First-In-First-Out): first member to join is processed first.
// Uses a front-pointer instead of shift() to keep dequeue at O(1)
// (Array.shift() is O(n); front-pointer amortises to O(1)).
// Models: task scheduling, print queues, member processing order.
// ============================================================
class Queue {
  constructor() {
    this._data  = [];  // backing array
    this._front = 0;   // index of the logical front (avoids O(n) shift)
  }

  // [DSA CO3] ENQUEUE — add item to rear: O(1)
  enqueue(item) { this._data.push(item); }

  // [DSA CO3] DEQUEUE — remove item from front: O(1) via front pointer
  dequeue() {
    if (this.isEmpty()) return null;
    return this._data[this._front++]; // advance pointer instead of splicing
  }

  // [DSA CO3] Utility helpers
  isEmpty()  { return this._front >= this._data.length; }
  size()     { return this._data.length - this._front; }
  toArray()  { return this._data.slice(this._front); } // active elements only
}


// ============================================================
// [DSA CO1 | BTL-4] SEARCHING ALGORITHM: BINARY SEARCH
// Implements binary search on a sorted array of member names.
// Pre-condition: input array must be sorted (enforced at insertion).
// Time complexity: O(log n) — halves search space each iteration.
// Compare to linear search O(n): far superior for large member lists.
// Aligns with CO1: "implement and analyze classical searching algorithms."
// ============================================================
function binarySearch(sortedArr, target) {
  let lo = 0, hi = sortedArr.length - 1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2); // find midpoint (avoids overflow)

    if (sortedArr[mid] === target) {
      return mid;              // target found at index mid
    } else if (sortedArr[mid] < target) {
      lo = mid + 1;            // target is in the RIGHT half
    } else {
      hi = mid - 1;            // target is in the LEFT half
    }
  }
  return -1; // target not present in array
}


// ============================================================
// [DSA CO1 | BTL-4] SEARCHING ALGORITHM: LINEAR SEARCH
// Sequential scan of the expenses array to find matching records.
// Time complexity: O(n) — must inspect every element in worst case.
// Used for expense description/payer search (data is unsorted).
// CO1: "implement and analyze classical searching algorithms in Java/JS."
// ============================================================
function linearSearch(arr, key, value) {
  for (let i = 0; i < arr.length; i++) {
    // Case-insensitive partial match — practical for real search UX
    if (arr[i][key] && arr[i][key].toLowerCase().includes(value.toLowerCase())) {
      return i; // return first matching index
    }
  }
  return -1; // no match found
}


// ============================================================
// [DSA CO1 | BTL-4] SORTING ALGORITHMS — Three implementations
// CO1: "Implement and analyze classical sorting algorithms including
// bubble, selection, insertion, merge, quick, and justify the choice
// of algorithm for different input characteristics and constraints."
//
// MERGE SORT  — O(n log n) stable, divide-and-conquer; used for
//               expense history (stability preserves equal-amount order)
// QUICK SORT  — O(n log n) avg, O(n^2) worst, in-place; used for
//               balance ranking (fast in practice, low memory)
// BUBBLE SORT — O(n^2), simple, stable; used for settlements (n is
//               always small: <= number of members; clarity > speed)
// ============================================================

// [DSA CO1] MERGE SORT — Stable, divide-and-conquer, O(n log n)
// Recursively splits array into halves, sorts each, then merges.
// Chosen for expense table: stability maintains insertion order for ties.
function mergeSort(arr, compareFn) {
  if (arr.length <= 1) return arr; // base case: single element is sorted

  const mid   = Math.floor(arr.length / 2);
  const left  = mergeSort(arr.slice(0, mid), compareFn); // sort left half
  const right = mergeSort(arr.slice(mid),    compareFn); // sort right half
  return merge(left, right, compareFn);                  // merge sorted halves
}

// [DSA CO1] MERGE helper — combines two sorted arrays into one: O(n)
function merge(left, right, compareFn) {
  const result = [];
  let i = 0, j = 0;

  // Compare front elements of each half; take the smaller one
  while (i < left.length && j < right.length) {
    if (compareFn(left[i], right[j]) <= 0) result.push(left[i++]);
    else                                    result.push(right[j++]);
  }
  // Append any remaining elements from either half
  return result.concat(left.slice(i)).concat(right.slice(j));
}

// [DSA CO1] QUICK SORT — In-place, O(n log n) average, O(n^2) worst
// Uses last-element pivot and Lomuto partition scheme.
// Chosen for balance ranking: in-place saves memory; average case is fast.
function quickSort(arr, compareFn, lo = 0, hi = arr.length - 1) {
  if (lo < hi) {
    const p = partition(arr, compareFn, lo, hi); // place pivot in final spot
    quickSort(arr, compareFn, lo, p - 1);         // recurse LEFT of pivot
    quickSort(arr, compareFn, p + 1, hi);         // recurse RIGHT of pivot
  }
  return arr;
}

// [DSA CO1] PARTITION helper — Lomuto scheme, places pivot in correct position
function partition(arr, compareFn, lo, hi) {
  const pivot = arr[hi]; // pivot = last element
  let i = lo - 1;        // i tracks boundary of elements <= pivot

  for (let j = lo; j < hi; j++) {
    if (compareFn(arr[j], pivot) <= 0) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]]; // swap smaller element left
    }
  }
  [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]]; // place pivot in final position
  return i + 1; // return pivot index
}

// [DSA CO1] BUBBLE SORT — O(n^2) time, O(1) space, stable
// Repeatedly compares adjacent elements and swaps if out of order.
// Justified here: settlement list has n <= members count (always tiny),
// so quadratic cost is negligible while code clarity is maximum.
function bubbleSort(arr, compareFn) {
  const a = [...arr]; // non-destructive copy
  for (let i = 0; i < a.length - 1; i++) {
    // Each pass bubbles the largest unsorted element to its final position
    for (let j = 0; j < a.length - i - 1; j++) {
      if (compareFn(a[j], a[j + 1]) > 0) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]]; // adjacent swap
      }
    }
  }
  return a;
}


// ============================================================
// [DSA CO4 | BTL-4] HASH MAP — JavaScript Object as Hash Table
// CO4: "Design and implement hash-based data structures (hash tables
// with chaining and open addressing) and leverage Java Collections
// (List, Queue, Deque, Map) to build efficient, scalable solutions
// to problems that demand fast lookup and updates."
//
// balances{} maps member name (key) -> net amount paid (value).
// JS objects use hash-based key lookup: O(1) average get/set.
// Far more efficient than linear O(n) scan of an array per update.
// ============================================================


// ============================================================
// APPLICATION STATE
// [Web Dev CO3] JavaScript Programming Essentials —
//               variable declarations, data structure initialisation
// ============================================================
const memberList   = new MemberLinkedList(); // [DSA CO2] Singly Linked List ADT
const expenseStack = new Stack();            // [DSA CO3] Stack LIFO — undo history
const memberQueue  = new Queue();            // [DSA CO3] Queue FIFO — join order
let expenses       = [];                     // [DSA CO2] Array — ordered expense records
let balances       = {};                     // [DSA CO4] Hash Map — O(1) balance lookup
let sortedMembers  = [];                     // [DSA CO1] Sorted array — enables binary search
let activeSort     = 'amount-desc';          // current sort mode for expense table
let searchQuery    = '';                     // current live-search filter string


// ============================================================
// ADD MEMBER
// [Web Dev CO4] DOM Interactivity — reads input, updates UI on event
// [DSA CO2]    Linked List APPEND + CO4 HashMap init + CO3 Queue ENQUEUE
// [DSA CO1]    Maintains sorted array after each insert for Binary Search
// ============================================================
function addMember() {
  // [Web Dev CO4] Access DOM input element and read its value
  const input = document.getElementById("memberInput");
  const name  = input.value.trim();

  if (!name) return showToast("Enter a member name", "warn");

  // [DSA CO2] Linked List CONTAINS — O(n) duplicate check before insert
  if (memberList.contains(name)) return showToast(`"${name}" already added`, "warn");

  // [DSA CO2] Linked List APPEND — O(n) insert at tail
  memberList.append(name);

  // [DSA CO4] Hash Map SET — O(1) initialise balance to zero
  balances[name] = 0;

  // [DSA CO3] Queue ENQUEUE — record member join order (FIFO): O(1)
  memberQueue.enqueue(name);

  // [DSA CO1] Maintain sorted array pre-condition for Binary Search
  // Array.sort() uses TimSort internally: O(n log n)
  sortedMembers = [...memberList.toArray()].sort();

  // [Web Dev CO4] DOM manipulation — refresh member list and dropdowns
  updateMembersUI();
  input.value = "";
  showToast(`${name} joined the group`, "success");
}


// ============================================================
// REMOVE MEMBER
// [Web Dev CO4] DOM Interactivity — inline onclick triggers removal
// [DSA CO2]    Linked List DELETE — O(n) traversal, then pointer re-link
// [DSA CO4]    Hash Map DELETE — O(1) key removal
// ============================================================
function removeMember(name) {
  // [DSA CO2] Linked List DELETE — O(n) traversal to unlink node
  memberList.remove(name);

  // [DSA CO4] Hash Map DELETE — O(1) remove key-value pair
  delete balances[name];

  // [DSA CO1] Re-sort after deletion to preserve Binary Search pre-condition
  sortedMembers = [...memberList.toArray()].sort();

  // [Web Dev CO4] DOM update triggered after state change
  updateMembersUI();
  calculateBalances();
  showToast(`${name} removed`, "info");
}


// ============================================================
// UPDATE MEMBERS UI
// [Web Dev CO4] DOM manipulation — createElement, appendChild,
//               innerHTML, dynamic <select> and checkbox population
// [DSA CO2]    toArray() — traverse linked list to get renderable array
// ============================================================
function updateMembersUI() {
  // [DSA CO2] Traverse linked list and convert to plain array for iteration
  const members = memberList.toArray();

  // [Web Dev CO4] Rebuild member <ul> dynamically
  const list = document.getElementById("memberList");
  list.innerHTML = ""; // clear stale DOM nodes before re-render

  members.forEach(m => {
    const li = document.createElement("li");
    // [Web Dev CO4] Attach inline event handler on dynamically created element
    li.innerHTML = `<span class="member-name">${m}</span>
      <button class="remove-btn" onclick="removeMember('${m}')">x</button>`;
    list.appendChild(li);
  });

  // [Web Dev CO4] Rebuild payer <select> dropdown from current member list
  const select = document.getElementById("payer");
  select.innerHTML = `<option value="">-- Select Payer --</option>`;
  members.forEach(m => {
    const opt = document.createElement("option");
    opt.value = opt.text = m;
    select.appendChild(opt);
  });

  // [Web Dev CO4] Rebuild split-among checkbox group dynamically
  const splitDiv = document.getElementById("splitAmong");
  splitDiv.innerHTML = "";
  members.forEach(m => {
    const label     = document.createElement("label");
    label.className = "checkbox-label";
    label.innerHTML = `<input type="checkbox" value="${m}" checked> ${m}`;
    splitDiv.appendChild(label);
  });

  // [Web Dev CO4] Reflect updated count and queue state in DOM
  document.getElementById("memberCount").innerText = memberList.size;

  // [DSA CO3] Display Queue contents — FIFO join order
  document.getElementById("queueDisplay").innerText =
    memberQueue.toArray().join(" -> ") || "--";
}


// ============================================================
// ADD EXPENSE
// [Web Dev CO4] DOM form reading, event handling, interactivity
// [Web Dev CO3] Input validation, object construction, JS essentials
// [DSA CO3]    Stack PUSH — record expense for LIFO undo: O(1)
// [DSA CO4]    Hash Map UPDATE — O(1) balance increment for payer
// [DSA CO2]    Array PUSH — append expense to records list: O(1)
// ============================================================
function addExpense() {
  // [Web Dev CO4] Read all form values from DOM
  const payer    = document.getElementById("payer").value;
  const amount   = parseFloat(document.getElementById("amount").value);
  const desc     = document.getElementById("desc").value.trim();
  const category = document.getElementById("category").value;

  // [Web Dev CO3] Guard clauses — validate inputs before processing
  if (!payer)                return showToast("Select a payer", "warn");
  if (!amount || amount <= 0) return showToast("Enter a valid amount", "warn");

  // [Web Dev CO4] querySelectorAll — collect all checked checkboxes
  const checkboxes = document.querySelectorAll("#splitAmong input[type=checkbox]:checked");
  const splitAmong = Array.from(checkboxes).map(cb => cb.value);
  if (splitAmong.length === 0) return showToast("Select at least one member to split among", "warn");

  // [DSA CO2] Build expense object — structured record for Array storage
  const expense = {
    id: Date.now(),           // unique timestamp ID for identification
    payer,
    amount,
    desc: desc || "No description",
    category,
    splitAmong,               // members sharing this expense
    date: new Date().toLocaleDateString()
  };

  // [DSA CO2] Array PUSH — append to expense records: O(1) amortized
  expenses.push(expense);

  // [DSA CO3] Stack PUSH — record for undo (LIFO): O(1)
  expenseStack.push(expense);

  // [DSA CO4] Hash Map UPDATE — O(1) increment payer's balance
  balances[payer] = (balances[payer] || 0) + amount;

  // [Web Dev CO4] Trigger DOM refresh after state mutation
  updateHistoryUI();
  calculateBalances();
  updateStackUI();

  // [Web Dev CO4] Clear input fields after successful submission
  document.getElementById("amount").value = "";
  document.getElementById("desc").value   = "";
  showToast(`Rs.${amount} added by ${payer}`, "success");
}


// ============================================================
// UNDO LAST EXPENSE
// [Web Dev CO4] DOM Interactivity — button click triggers stack op
// [DSA CO3]    Stack POP — O(1) remove most recent expense (LIFO)
//              Real-world workflow: undo/redo history using stack
// [DSA CO4]    Hash Map UPDATE — reverse the payer's balance: O(1)
// [DSA CO2]    Array FILTER — remove expense from records list: O(n)
// ============================================================
function undoExpense() {
  if (expenseStack.isEmpty()) return showToast("Nothing to undo", "warn");

  // [DSA CO3] Stack POP — retrieve and remove the top (most recent) expense
  const last = expenseStack.pop();

  // [DSA CO2] Array FILTER — remove by ID from expense records: O(n)
  expenses = expenses.filter(e => e.id !== last.id);

  // [DSA CO4] Hash Map UPDATE — reverse the payer's credit: O(1)
  balances[last.payer] -= last.amount;

  // [Web Dev CO4] Refresh all affected DOM sections
  updateHistoryUI();
  calculateBalances();
  updateStackUI();
  showToast(`Undone: Rs.${last.amount} by ${last.payer}`, "info");
}


// ============================================================
// HANDLE EXPENSE SEARCH — triggers Linear Search
// [Web Dev CO4] DOM event — oninput enables real-time filtering
// [DSA CO1]    LINEAR SEARCH O(n) — scans unsorted expense array
//              CO1: "implement and analyze classical searching algorithms
//              and justify choice for different input characteristics."
//              Linear search chosen because expense array is unsorted.
// ============================================================
function handleSearch() {
  // [Web Dev CO4] Read live search input from DOM
  searchQuery = document.getElementById("searchInput").value.trim();

  // [Web Dev CO4] Re-render table filtered by search query
  updateHistoryUI();

  if (searchQuery) {
    // [DSA CO1] LINEAR SEARCH — O(n) sequential scan on description field
    const idx = linearSearch(expenses, 'desc', searchQuery);
    showToast(
      idx !== -1 ? `Found match at record #${idx + 1}` : "No match found",
      idx !== -1 ? "success" : "warn"
    );
  }
}


// ============================================================
// SEARCH MEMBER — triggers Binary Search
// [Web Dev CO4] DOM Interactivity — reads input, updates result div
// [DSA CO1]    BINARY SEARCH O(log n) on sorted member array
//              Pre-condition: sortedMembers kept sorted at all times.
//              CO1: "justify the choice of algorithm for different
//              input characteristics and constraints."
//              Binary search chosen because member array is always sorted.
// ============================================================
function searchMember() {
  // [Web Dev CO4] Read member search term from DOM
  const name     = document.getElementById("memberSearchInput").value.trim();
  if (!name) return;

  // [DSA CO1] BINARY SEARCH — O(log n) divide-and-conquer on sorted array
  const idx      = binarySearch(sortedMembers, name);
  const resultEl = document.getElementById("memberSearchResult");

  // [Web Dev CO4] Update result element in DOM based on search outcome
  if (idx !== -1) {
    resultEl.innerText = `Found "${name}" at sorted index: ${idx}`;
    resultEl.className = "search-result found";
  } else {
    resultEl.innerText = `"${name}" not found in member list`;
    resultEl.className = "search-result not-found";
  }
}


// ============================================================
// SET SORT MODE
// [Web Dev CO4] DOM Interactivity — button group controls sort order
// [DSA CO1]    Mode switch selects appropriate sorting algorithm
// ============================================================
function setSortMode(mode) {
  activeSort = mode;
  // [Web Dev CO4] Toggle active class across sort button group
  document.querySelectorAll(".sort-btn").forEach(b => b.classList.remove("active"));
  event.target.classList.add("active");
  updateHistoryUI(); // re-render with new sort
}


// ============================================================
// GET SORTED EXPENSES — applies Merge Sort
// [DSA CO1]    MERGE SORT O(n log n) applied to expense array.
//              Stable sort: equal-amount entries keep insertion order.
//              CO1: "implement merge sort and justify algorithm choice."
// ============================================================
function getSortedExpenses(arr) {
  switch (activeSort) {
    case 'amount-desc':
      // [DSA CO1] Merge Sort — descending by rupee amount
      return mergeSort([...arr], (a, b) => b.amount - a.amount);
    case 'amount-asc':
      // [DSA CO1] Merge Sort — ascending by rupee amount
      return mergeSort([...arr], (a, b) => a.amount - b.amount);
    case 'payer':
      // [DSA CO1] Merge Sort — alphabetical order by payer name
      return mergeSort([...arr], (a, b) => a.payer.localeCompare(b.payer));
    case 'date':
      // [DSA CO1] Merge Sort — chronological order by timestamp ID
      return mergeSort([...arr], (a, b) => a.id - b.id);
    default:
      return arr;
  }
}


// ============================================================
// UPDATE HISTORY UI
// [Web Dev CO4] DOM manipulation — table rows built dynamically
// [Web Dev CO5] Advanced JS — Array.filter, forEach, template literals
// [DSA CO1]    Applies Merge Sort via getSortedExpenses before render
// [DSA CO2]    Array.filter + forEach — O(n) traversal of expense records
// ============================================================
function updateHistoryUI() {
  const tbody = document.getElementById("historyBody");
  tbody.innerHTML = ""; // clear existing rows before re-render

  // [DSA CO2] Array FILTER — O(n) narrow records by live search query
  let filtered = searchQuery
    ? expenses.filter(e =>
        e.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.payer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : expenses;

  // [DSA CO1] Apply Merge Sort to filtered results before DOM render
  const sorted = getSortedExpenses(filtered);

  if (sorted.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-row">No expenses recorded yet.</td></tr>`;
    return;
  }

  // [Web Dev CO4] Dynamically build table rows using DOM API
  sorted.forEach(e => {
    const tr = document.createElement("tr");
    // [Web Dev CO3] Template literals — clean HTML string interpolation
    tr.innerHTML = `
      <td><span class="category-badge cat-${e.category}">${e.category}</span></td>
      <td>${e.payer}</td>
      <td class="amount-cell">Rs.${e.amount.toFixed(2)}</td>
      <td>${e.desc}</td>
      <td>${e.splitAmong.join(", ")}</td>`;
    tbody.appendChild(tr);
  });

  // [Web Dev CO4] Update expense count display in DOM
  document.getElementById("expenseCount").innerText = expenses.length;
}


// ============================================================
// CALCULATE BALANCES
// [DSA CO4]    Hash Map ITERATION — O(n) to sum all paid amounts
//              Demonstrates fast O(1) per-entry update with hash map
// [DSA CO1]    Quick Sort — rank members by net balance descending
// [DSA CO2]    Array.map() — transform member names into balance objects
// [Web Dev CO5] Advanced JS — proportional share computation per split group
// ============================================================
function calculateBalances() {
  // [DSA CO2] Linked List toArray() — get current member list: O(n)
  const members = memberList.toArray();
  if (members.length === 0) return;

  // [DSA CO4] Hash Map ITERATION — sum total of all paid amounts: O(n)
  let total = 0;
  for (let m in balances) total += balances[m];

  // [DSA CO4] Hash Map INIT — reset net balances before recalculation
  const netBalance = {};
  members.forEach(m => netBalance[m] = 0);

  // [DSA CO2] Array ITERATION — calculate each member's net position
  expenses.forEach(e => {
    const share = e.amount / e.splitAmong.length; // proportional share per member

    // [DSA CO4] Hash Map UPDATE — O(1) credit to payer
    netBalance[e.payer] = (netBalance[e.payer] || 0) + e.amount;

    // [DSA CO4] Hash Map UPDATE — O(1) debit from each split member
    e.splitAmong.forEach(m => {
      netBalance[m] = (netBalance[m] || 0) - share;
    });
  });

  // [Web Dev CO4] Update summary statistics in DOM
  document.getElementById("totalExpense").innerText = `Rs.${total.toFixed(2)}`;
  document.getElementById("equalShare").innerText   = `Rs.${(total / members.length).toFixed(2)}`;

  // [DSA CO2] Array.map() — create sortable balance array from hash map values
  let arr = members.map(m => ({ name: m, balance: netBalance[m] || 0 }));

  // [DSA CO1] QUICK SORT — rank balances descending (creditors first)
  // Chosen: in-place O(1) extra space; n = member count (small, fast)
  quickSort(arr, (a, b) => b.balance - a.balance);

  showBalancesUI(arr);
  settle(arr);
}


// ============================================================
// SHOW BALANCES UI
// [Web Dev CO4] DOM manipulation — dynamic div creation with styling
// [Web Dev CO5] Proportional bar width computed from max balance ratio
// [DSA CO5]    Practical visual application of linear data structure output
// ============================================================
function showBalancesUI(arr) {
  const div = document.getElementById("balances");
  div.innerHTML = "";

  arr.forEach(b => {
    const p     = document.createElement("div");
    // Classify member as creditor (+), debtor (-), or neutral (0)
    p.className = `balance-item ${b.balance > 0 ? 'creditor' : b.balance < 0 ? 'debtor' : 'neutral'}`;

    // [Web Dev CO5] Compute proportional bar width relative to max absolute balance
    const maxAbs = Math.max(...arr.map(x => Math.abs(x.balance)), 1);
    const bar    = Math.min(Math.abs(b.balance) / maxAbs * 100, 100);

    // [Web Dev CO4] Construct DOM structure with inline dynamic style attribute
    p.innerHTML = `
      <div class="balance-header">
        <span class="balance-name">${b.name}</span>
        <span class="balance-amount">${b.balance >= 0 ? '+' : ''}Rs.${b.balance.toFixed(2)}</span>
      </div>
      <div class="balance-bar-track">
        <div class="balance-bar" style="width:${bar}%"></div>
      </div>`;
    div.appendChild(p);
  });
}


// ============================================================
// SETTLEMENT ALGORITHM — Greedy Two-Pointer
// [DSA CO1]    BUBBLE SORT O(n^2) applied to settlement list
//              Justified: n = member count (always small); clarity wins
// [DSA CO5]    CO5: "Design, Develop and evaluate common practical
//              applications for linear Data Structures" —
//              greedy settlement is a direct practical application
// [Web Dev CO4] DOM — dynamically renders each settlement transaction
// Algorithm:   Match largest creditor with largest debtor each step
//              to minimise total number of payment transactions.
// ============================================================
function settle(arr) {
  // [DSA CO1] BUBBLE SORT — sort non-zero balances descending
  // n is always <= member count: O(n^2) is negligible here
  const bubbleSorted = bubbleSort(
    arr.filter(a => Math.abs(a.balance) > 0.001),
    (a, b) => b.balance - a.balance
  );

  // Partition into creditors (owed money) and debtors (owe money)
  let creditors = bubbleSorted.filter(a => a.balance >  0.001).map(a => ({ ...a }));
  let debtors   = bubbleSorted.filter(a => a.balance < -0.001).map(a => ({ ...a }));

  const div = document.getElementById("settlements");
  div.innerHTML = "";
  let count = 0;

  // [DSA CO5] Greedy loop — resolve largest imbalance first each iteration
  // Each pass eliminates at least one creditor or debtor from the list
  while (creditors.length && debtors.length) {
    const c   = creditors[0];               // head = largest creditor
    const d   = debtors[0];                 // head = largest debtor
    const amt = Math.min(c.balance, -d.balance); // settle minimum of the two

    // [Web Dev CO4] Create and append settlement row to DOM
    const p     = document.createElement("div");
    p.className = "settlement-item";
    p.innerHTML = `
      <span class="debtor-name">${d.name}</span>
      <span class="arrow">pays</span>
      <span class="creditor-name">${c.name}</span>
      <span class="settle-amount">Rs.${amt.toFixed(2)}</span>`;
    div.appendChild(p);

    // Reduce both parties' outstanding balances by settled amount
    c.balance -= amt;
    d.balance += amt;

    // Remove fully settled members from their queues
    if (c.balance <  0.001) creditors.shift();
    if (d.balance > -0.001) debtors.shift();
    count++;
  }

  if (count === 0) div.innerHTML = `<p class="all-settled">All settled up!</p>`;

  // [Web Dev CO4] Update settlement transaction count in DOM
  document.getElementById("settlementCount").innerText = count;
}


// ============================================================
// UPDATE STACK UI
// [Web Dev CO4] DOM manipulation — visualise Stack state in real time
// [DSA CO3]    Stack toArray() — renders top-first to demonstrate LIFO
//              CO3: "apply stacks to model real-world workflows"
// ============================================================
function updateStackUI() {
  const div   = document.getElementById("stackDisplay");
  div.innerHTML = "";

  // [DSA CO3] Get stack contents ordered top-first (LIFO view)
  const items = expenseStack.toArray();

  if (items.length === 0) {
    div.innerHTML = `<div class="stack-empty">Stack is empty</div>`;
    return;
  }

  // [Web Dev CO4] Render up to 5 stack frames; mark index 0 as TOP
  items.slice(0, 5).forEach((e, i) => {
    const el     = document.createElement("div");
    el.className = `stack-item ${i === 0 ? 'stack-top' : ''}`;
    el.innerHTML = `${i === 0 ? '<span class="top-label">TOP</span>' : ''} ${e.payer} -- Rs.${e.amount}`;
    div.appendChild(el);
  });

  // Show overflow indicator if stack has more than 5 entries
  if (items.length > 5) {
    const more     = document.createElement("div");
    more.className = "stack-more";
    more.innerText = `+${items.length - 5} more`;
    div.appendChild(more);
  }
}


// ============================================================
// TOAST NOTIFICATIONS
// [Web Dev CO4] DOM Interactivity — programmatic UI feedback system
// [Web Dev CO3] JS Essentials — setTimeout, classList, dynamic
//               element creation and auto-removal lifecycle
// ============================================================
function showToast(msg, type = "info") {
  // [Web Dev CO4] Dynamically create and inject toast into DOM
  const container = document.getElementById("toastContainer");
  const toast     = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerText = msg;
  container.appendChild(toast);

  // [Web Dev CO3] setTimeout — trigger CSS transition after browser paint
  setTimeout(() => toast.classList.add("visible"), 10);

  // [Web Dev CO3] Auto-dismiss after 2.8s then remove element from DOM
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 300); // wait for CSS fade-out transition
  }, 2800);
}


// ============================================================
// INITIALISATION
// [Web Dev CO3] JS Essentials — entry-point executed on page load
// [DSA CO3]    Render initial empty Stack frame on first load
// ============================================================
updateStackUI(); // render empty stack visualiser on page ready
