import java.util.*;

// ============================================================
// SplitSmart — Group Based Expense Sharing Tool
// File: Expense.java  (public class name matches filename)
//
// DSA Concepts Used:
//   LinkedList  — member registry
//   Queue       — FIFO join order tracking
//   Stack       — LIFO expense undo history
//   HashMap     — O(1) balance lookup and update
//   Binary Search — O(log n) member search on sorted array
//   Greedy Algorithm — minimum settlement transactions
// ============================================================

public class Expense {

    // ── INNER CLASS: Expense data record ────────────────────
    // Renamed outer class to Expense (matches filename).
    // Data record is now a static inner class called Record.
    // ────────────────────────────────────────────────────────
    static class Record {

        int          id;           // unique ID for safe removal
        String       payer;
        double       amount;
        String       description;
        List<String> splitAmong;

        Record(int id, String payer, double amount,
               String description, List<String> splitAmong) {
            this.id          = id;
            this.payer       = payer;
            this.amount      = amount;
            this.description = description;
            this.splitAmong  = new ArrayList<>(splitAmong);
        }

        @Override
        public String toString() {
            return String.format("[#%d] %-10s | Rs.%8.2f | %-20s | Split: %s",
                    id, payer, amount, description, splitAmong);
        }
    }

    // ── APPLICATION STATE ────────────────────────────────────

    // DSA: LinkedList — ordered member registry, O(1) add at tail
    static LinkedList<String> members = new LinkedList<>();

    // DSA: Queue (FIFO) — tracks the order members joined the group
    static Queue<String> joinQueue = new LinkedList<>();

    // DSA: Stack (LIFO) — undo history; push on add, pop on undo
    static Stack<Record> expenseStack = new Stack<>();

    // DSA: ArrayList — ordered list of all expense records
    static List<Record> expenses = new ArrayList<>();

    // DSA: HashMap — O(1) per-member balance lookup and update
    static HashMap<String, Double> balances = new HashMap<>();

    // Sorted array maintained for Binary Search pre-condition
    static String[] sortedMembers = new String[0];

    // Auto-incrementing unique ID for each expense
    static int expenseIdCounter = 1;

    static Scanner sc = new Scanner(System.in);

    // ── MAIN ENTRY POINT ─────────────────────────────────────
    public static void main(String[] args) {

        System.out.println("=========================================");
        System.out.println("   SplitSmart - Group Expense Splitter  ");
        System.out.println("=========================================");

        while (true) {

            System.out.println("\n===== SplitSmart Menu =====");
            System.out.println("1. Add Member");
            System.out.println("2. Search Member     [Binary Search]");
            System.out.println("3. Add Expense       [Stack + HashMap]");
            System.out.println("4. Undo Expense      [Stack Pop - LIFO]");
            System.out.println("5. Show Balances     [HashMap]");
            System.out.println("6. Show Settlements  [Greedy Algorithm]");
            System.out.println("7. Show Join Queue   [Queue FIFO]");
            System.out.println("8. Show All Members  [LinkedList]");
            System.out.println("9. Exit");
            System.out.print("Choose option: ");

            // Read as String to prevent InputMismatchException on bad input
            String line = sc.nextLine().trim();
            int choice;
            try {
                choice = Integer.parseInt(line);
            } catch (NumberFormatException ex) {
                System.out.println("Invalid input. Please enter a number 1-9.");
                continue;
            }

            switch (choice) {
                case 1: addMember();    break;
                case 2: searchMember(); break;
                case 3: addExpense();   break;
                case 4: undoExpense();  break;
                case 5: showBalances(); break;
                case 6: settlements();  break;
                case 7: showQueue();    break;
                case 8: showMembers();  break;
                case 9:
                    System.out.println("Exiting... Goodbye!");
                    sc.close();
                    return;
                default:
                    System.out.println("Invalid choice. Enter 1-9.");
            }
        }
    }

    // ── 1. ADD MEMBER ────────────────────────────────────────
    // DSA: LinkedList.add()  — O(1) append to tail
    //      Queue.add()       — O(1) enqueue FIFO join order
    //      HashMap.put()     — O(1) initialise balance to 0
    //      Arrays.sort()     — O(n log n) rebuild sorted array
    // ─────────────────────────────────────────────────────────
    static void addMember() {

        System.out.print("Enter member name: ");
        String name = sc.nextLine().trim();

        if (name.isEmpty()) {
            System.out.println("Name cannot be empty.");
            return;
        }

        // Duplicate check before adding
        if (members.contains(name)) {
            System.out.println("\"" + name + "\" is already a member.");
            return;
        }

        // DSA LinkedList: append — O(1)
        members.add(name);

        // DSA Queue: enqueue join order — O(1) FIFO
        joinQueue.add(name);

        // DSA HashMap: initialise balance — O(1)
        balances.put(name, 0.0);

        // Rebuild sorted array so Binary Search pre-condition stays valid
        sortedMembers = members.toArray(new String[0]);
        Arrays.sort(sortedMembers);

        System.out.println("\"" + name + "\" added. Total members: " + members.size());
    }

    // ── 2. SEARCH MEMBER ─────────────────────────────────────
    // DSA: Binary Search — O(log n)
    //      Requires sorted input; sortedMembers is always kept sorted.
    // ─────────────────────────────────────────────────────────
    static void searchMember() {

        if (members.isEmpty()) {
            System.out.println("No members to search. Add members first.");
            return;
        }

        System.out.print("Enter member name to search: ");
        String name = sc.nextLine().trim();

        if (name.isEmpty()) {
            System.out.println("Search name cannot be empty.");
            return;
        }

        System.out.println("Sorted array: " + Arrays.toString(sortedMembers));

        // DSA Binary Search: O(log n) — halves search space each step
        int index = Arrays.binarySearch(sortedMembers, name);

        if (index >= 0) {
            System.out.println("Member \"" + name + "\" FOUND at sorted index: " + index);
        } else {
            System.out.println("Member \"" + name + "\" NOT FOUND.");
        }
    }

    // ── 3. ADD EXPENSE ───────────────────────────────────────
    // DSA: Stack.push()     — O(1) LIFO push for undo history
    //      HashMap.put()    — O(1) update balances
    //      ArrayList.add()  — O(1) append expense record
    // ─────────────────────────────────────────────────────────
    static void addExpense() {

        if (members.isEmpty()) {
            System.out.println("Add at least one member before adding an expense.");
            return;
        }

        System.out.println("Current members: " + members);

        // ── Payer ──
        System.out.print("Payer name: ");
        String payer = sc.nextLine().trim();

        // Validate payer exists in member list
        if (!members.contains(payer)) {
            System.out.println("\"" + payer + "\" is not a member. Add them first.");
            return;
        }

        // ── Amount ──
        System.out.print("Amount (Rs.): ");
        double amount;
        try {
            amount = Double.parseDouble(sc.nextLine().trim());
        } catch (NumberFormatException ex) {
            System.out.println("Invalid amount. Please enter a valid number.");
            return;
        }

        if (amount <= 0) {
            System.out.println("Amount must be greater than zero.");
            return;
        }

        // ── Description ──
        System.out.print("Description: ");
        String desc = sc.nextLine().trim();
        if (desc.isEmpty()) desc = "No description";

        // ── Split Among ──
        System.out.print("How many people split the expense? ");
        int n;
        try {
            n = Integer.parseInt(sc.nextLine().trim());
        } catch (NumberFormatException ex) {
            System.out.println("Invalid number.");
            return;
        }

        if (n <= 0) {
            System.out.println("Must split among at least 1 person.");
            return;
        }

        List<String> split = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            System.out.print("  Member name [" + (i + 1) + "]: ");
            String m = sc.nextLine().trim();
            // Validate each split member against the member list
            if (!members.contains(m)) {
                System.out.println("  \"" + m + "\" is not a member. Skipping.");
            } else if (split.contains(m)) {
                System.out.println("  \"" + m + "\" already added. Skipping duplicate.");
            } else {
                split.add(m);
            }
        }

        if (split.isEmpty()) {
            System.out.println("No valid members to split among. Expense not added.");
            return;
        }

        // Build Record with unique ID
        Record rec = new Record(expenseIdCounter++, payer, amount, desc, split);

        // DSA ArrayList: append — O(1) amortized
        expenses.add(rec);

        // DSA Stack: push for undo — O(1) LIFO
        expenseStack.push(rec);

        // DSA HashMap: update balances — O(1) per entry
        double share = amount / split.size();

        // Payer receives full credit for what they paid
        balances.put(payer, balances.getOrDefault(payer, 0.0) + amount);

        // Each split member (including payer if in list) is debited their share
        // Net effect on payer = +amount - share (if payer is in split group)
        for (String m : split) {
            balances.put(m, balances.getOrDefault(m, 0.0) - share);
        }

        System.out.println("Expense added: " + rec);
    }

    // ── 4. UNDO EXPENSE ──────────────────────────────────────
    // DSA: Stack.pop() — O(1) LIFO: most recent expense removed first
    //      HashMap.put() — O(1) reverse the balance changes
    // ─────────────────────────────────────────────────────────
    static void undoExpense() {

        if (expenseStack.isEmpty()) {
            System.out.println("Nothing to undo. Stack is empty.");
            return;
        }

        // DSA Stack: pop most recent expense — O(1)
        Record rec = expenseStack.pop();

        // Remove by ID — reliable even without equals() override
        expenses.removeIf(e -> e.id == rec.id);

        // Reverse balance changes using getOrDefault() to avoid NullPointerException
        double share = rec.amount / rec.splitAmong.size();

        for (String m : rec.splitAmong) {
            balances.put(m, balances.getOrDefault(m, 0.0) + share);
        }
        balances.put(rec.payer, balances.getOrDefault(rec.payer, 0.0) - rec.amount);

        System.out.println("Undone (Stack POP): " + rec);
    }

    // ── 5. SHOW BALANCES ─────────────────────────────────────
    // DSA: HashMap iteration — O(n)
    //      TreeMap used for consistent sorted output
    // ─────────────────────────────────────────────────────────
    static void showBalances() {

        if (balances.isEmpty()) {
            System.out.println("No balances to show. Add members first.");
            return;
        }

        System.out.println("\n--- Balances ---");

        // TreeMap gives alphabetical, consistent output (HashMap order is random)
        Map<String, Double> sorted = new TreeMap<>(balances);

        for (Map.Entry<String, Double> entry : sorted.entrySet()) {

            double bal = entry.getValue();
            String tag = bal >  0.005 ? " [gets back]"
                       : bal < -0.005 ? " [owes]"
                       : " [settled]";

            // %.2f prevents floating-point noise like Rs.10.000000004
            System.out.printf("  %-15s : Rs.%+.2f%s%n",
                    entry.getKey(), bal, tag);
        }
    }

    // ── 6. SHOW SETTLEMENTS ──────────────────────────────────
    // DSA: Greedy two-pointer algorithm
    //      Creditors and debtors sorted before pairing to
    //      minimise total number of payment transactions.
    // ─────────────────────────────────────────────────────────
    static void settlements() {

        if (balances.isEmpty()) {
            System.out.println("Add members and expenses first.");
            return;
        }

        // Build separate mutable copies of creditor/debtor data
        // (avoids mutating live HashMap entries directly)
        List<String> creditorNames = new ArrayList<>();
        List<Double> creditorAmts  = new ArrayList<>();
        List<String> debtorNames   = new ArrayList<>();
        List<Double> debtorAmts    = new ArrayList<>();

        for (Map.Entry<String, Double> e : balances.entrySet()) {
            double val = e.getValue();
            if (val > 0.005) {
                creditorNames.add(e.getKey());
                creditorAmts.add(val);
            } else if (val < -0.005) {
                debtorNames.add(e.getKey());
                debtorAmts.add(val);    // stored as negative
            }
        }

        // Sort creditors: highest credit first (Bubble Sort)
        for (int i = 0; i < creditorAmts.size() - 1; i++) {
            for (int j = i + 1; j < creditorAmts.size(); j++) {
                if (creditorAmts.get(j) > creditorAmts.get(i)) {
                    Collections.swap(creditorAmts, i, j);
                    Collections.swap(creditorNames, i, j);
                }
            }
        }

        // Sort debtors: most negative (largest debt) first (Bubble Sort)
        for (int i = 0; i < debtorAmts.size() - 1; i++) {
            for (int j = i + 1; j < debtorAmts.size(); j++) {
                if (debtorAmts.get(j) < debtorAmts.get(i)) {
                    Collections.swap(debtorAmts, i, j);
                    Collections.swap(debtorNames, i, j);
                }
            }
        }

        System.out.println("\n--- Settlements (Greedy Algorithm) ---");

        int i = 0, j = 0;
        boolean anyTransaction = false;

        // Greedy: pair largest debtor with largest creditor each iteration
        while (i < debtorNames.size() && j < creditorNames.size()) {

            double debt   = -debtorAmts.get(i);
            double credit =  creditorAmts.get(j);
            double settle =  Math.min(debt, credit);

            System.out.printf("  %-12s  pays  %-12s  Rs.%.2f%n",
                    debtorNames.get(i), creditorNames.get(j), settle);

            anyTransaction = true;

            // Update independent copies — not the live HashMap
            debtorAmts.set(i,   debtorAmts.get(i)  + settle);
            creditorAmts.set(j, creditorAmts.get(j) - settle);

            if (Math.abs(debtorAmts.get(i))  < 0.005) i++;
            if (Math.abs(creditorAmts.get(j)) < 0.005) j++;
        }

        if (!anyTransaction) {
            System.out.println("  All members are settled up! No payments needed.");
        }
    }

    // ── 7. SHOW JOIN QUEUE ───────────────────────────────────
    // DSA: Queue FIFO — displays member join order without consuming
    // ─────────────────────────────────────────────────────────
    static void showQueue() {

        if (joinQueue.isEmpty()) {
            System.out.println("Queue is empty. Add some members first.");
            return;
        }

        System.out.println("\n--- Member Join Queue (FIFO order) ---");
        System.out.print("  FRONT -> ");

        Iterator<String> it = joinQueue.iterator();
        while (it.hasNext()) {
            System.out.print("[" + it.next() + "]");
            if (it.hasNext()) System.out.print(" -> ");
        }
        System.out.println(" <- REAR");
        System.out.println("  Total in queue: " + joinQueue.size());
    }

    // ── 8. SHOW ALL MEMBERS ──────────────────────────────────
    // DSA: LinkedList traversal — O(n)
    // ─────────────────────────────────────────────────────────
    static void showMembers() {

        if (members.isEmpty()) {
            System.out.println("No members added yet.");
            return;
        }

        System.out.println("\n--- Members (LinkedList) ---");
        int idx = 1;
        for (String m : members) {
            System.out.println("  " + idx++ + ". " + m);
        }
        System.out.println("  Total: " + members.size());
        System.out.println("  Sorted array (Binary Search): "
                + Arrays.toString(sortedMembers));
    }
}
