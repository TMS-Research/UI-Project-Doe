import { LearningContent } from "@/components/LearningContentPanel";

export const sampleLearningContent: LearningContent = {
  conceptExplanation: `# Data Structures: Fundamental Concepts

## Main Concepts
- Data structures are ways of organizing data in a computer so that it can be used efficiently
- Arrays are collections of elements stored at contiguous memory locations
- Linked lists consist of nodes where each node contains a data field and a reference to the next node
- Time complexity measures how the running time of an algorithm increases with the size of the input
- Space complexity measures the amount of memory an algorithm uses relative to its input size

## Key Terms
### Data Structure
A way of organizing data in a computer so that it can be used efficiently. Different types of data structures are suited for different kinds of applications, and some are highly specialized for specific tasks.

### Array
A collection of elements stored at contiguous memory locations. The idea is to store multiple items of the same type together. This makes it easier to calculate the position of each element by simply adding an offset to a base value.

### Linked List
A linear data structure where elements are stored in nodes, and each node points to the next node in the sequence. This creates a chain-like structure where each element knows where to find the next one.

### Time Complexity
A measure of how the running time of an algorithm increases with the size of the input. It's usually expressed using Big O notation, which describes the worst-case scenario.

### Space Complexity
A measure of the amount of memory an algorithm uses relative to its input size. Like time complexity, it's often expressed using Big O notation.

## Formulas
### Array Index Calculation
**Formula:** Base Address + (Index × Element Size)
**Explanation:** To find the memory address of an element in an array, multiply its index by the size of each element and add the base address of the array.

### Linked List Traversal
**Formula:** Current = Current.Next
**Explanation:** To move through a linked list, update the current pointer to point to the next node in the sequence.

### Binary Search Time Complexity
**Formula:** O(log n)
**Explanation:** Binary search has a logarithmic time complexity because it divides the search interval in half with each step.

## Examples
### Array vs Linked List
Arrays provide fast access to elements using index but have fixed size. Linked lists allow dynamic size but require traversal to access elements.

### Time Complexity Comparison
Linear search has O(n) time complexity while binary search has O(log n), making binary search much faster for large datasets.

### Memory Layout
Arrays use contiguous memory while linked lists use scattered memory with pointers connecting elements.`,
  problems: [
    {
      id: "P1",
      question: "Implement a function to find the middle element of a linked list in a single pass.",
      steps: [
        "Initialize two pointers: slow and fast",
        "Move slow pointer one step at a time",
        "Move fast pointer two steps at a time",
        "When fast pointer reaches the end, slow pointer will be at the middle",
        "Return the value at slow pointer",
      ],
      hints: [
        "Think about using two pointers moving at different speeds",
        "Consider what happens when the list has an even number of nodes",
        "Make sure to handle edge cases like empty list or single node",
      ],
      solution:
        "The slow pointer will be at the middle when the fast pointer reaches the end. For even-length lists, you might want to return the second middle node.",
      alternativeSolutions: [
        "Count the length first, then traverse half the length",
        "Use a stack to store the first half of the list",
      ],
      relatedTopics: ["Linked Lists", "Two Pointers", "Traversal"],
    },
    {
      id: "P2",
      question: "Given an array of integers, find the maximum subarray sum.",
      steps: [
        "Initialize variables for current sum and maximum sum",
        "Iterate through the array",
        "For each element, update current sum by adding the element",
        "If current sum becomes negative, reset it to 0",
        "Update maximum sum if current sum is greater",
        "Return maximum sum",
      ],
      hints: [
        "Consider using Kadane's algorithm",
        "Think about how to handle all negative numbers",
        "Consider what happens when you encounter a negative number",
      ],
      solution:
        "Kadane's algorithm provides an O(n) solution by keeping track of the maximum sum ending at each position.",
      alternativeSolutions: [
        "Divide and conquer approach with O(n log n) complexity",
        "Brute force approach with O(n²) complexity",
      ],
      relatedTopics: ["Dynamic Programming", "Arrays", "Kadane's Algorithm"],
    },
  ],
  practiceSets: [
    {
      id: "Q1",
      type: "mcq",
      question: "What is the time complexity of accessing an element in an array?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      answer: "O(1)",
    },
    {
      id: "Q2",
      type: "short-answer",
      question: "Explain why linked lists are better than arrays for insertions and deletions.",
      answer:
        "Linked lists are better for insertions and deletions because they don't require shifting elements. In an array, inserting or deleting an element requires shifting all subsequent elements, which is O(n). In a linked list, you only need to update pointers, which is O(1) if you have a reference to the node.",
    },
    {
      id: "Q3",
      type: "essay",
      question: "Compare and contrast arrays and linked lists. Discuss their advantages, disadvantages, and use cases.",
      answer:
        "Arrays and linked lists are fundamental data structures with different characteristics. Arrays provide O(1) access time but have fixed size and expensive insertions/deletions. Linked lists allow dynamic size and O(1) insertions/deletions but require O(n) access time. Arrays are better for random access and when the size is known in advance. Linked lists are better for dynamic data and when insertions/deletions are frequent.",
    },
    {
      id: "Q4",
      type: "flashcard",
      question: "What is the time complexity of binary search?",
      answer: "O(log n)",
    },
  ],
  summary: {
    keyTakeaways: [
      "Data structures are essential for efficient data organization and manipulation",
      "Arrays provide fast access but have fixed size and expensive insertions/deletions",
      "Linked lists allow dynamic size and efficient insertions/deletions but have slower access",
      "Time and space complexity are crucial metrics for algorithm analysis",
      "Choosing the right data structure depends on the specific requirements of your application",
    ],
    observations: [
      "Arrays are better for random access and when the size is known in advance",
      "Linked lists are better for dynamic data and when insertions/deletions are frequent",
      "Time complexity often involves trade-offs between different operations",
      "Understanding these fundamentals is essential for designing efficient algorithms",
      "Visual representations can help understand the differences between data structures",
    ],
  },
};
