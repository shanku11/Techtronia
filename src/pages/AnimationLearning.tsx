import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Play, RotateCcw, Plus, Minus, Eye, Trash2, Clock, Zap, BookOpen, Code2 } from "lucide-react";
import { toast } from "sonner";

const AnimationLearning = () => {
  const { courseId, topic } = useParams();
  const [stackItems, setStackItems] = useState<string[]>(["Bottom", "Middle"]);
  const [arrayItems, setArrayItems] = useState<string[]>(["10", "20", "30", "40"]);
  const [linkedListItems, setLinkedListItems] = useState<{value: string, id: number}[]>([
    {value: "Head", id: 1}, {value: "Node2", id: 2}, {value: "Tail", id: 3}
  ]);
  const [processes, setProcesses] = useState([
    {id: 1, name: "P1", state: "ready", burstTime: 5, priority: 1},
    {id: 2, name: "P2", state: "running", burstTime: 3, priority: 2},
    {id: 3, name: "P3", state: "waiting", burstTime: 8, priority: 3}
  ]);
  const [queueItems, setQueueItems] = useState<string[]>(["First", "Second", "Third"]);
  const [treeNodes, setTreeNodes] = useState([
    {id: 1, value: "50", x: 200, y: 50, level: 0},
    {id: 2, value: "30", x: 100, y: 120, level: 1},
    {id: 3, value: "70", x: 300, y: 120, level: 1},
    {id: 4, value: "20", x: 50, y: 190, level: 2},
    {id: 5, value: "40", x: 150, y: 190, level: 2}
  ]);
  const [graphNodes, setGraphNodes] = useState([
    {id: 'A', x: 100, y: 100, visited: false, color: 'default'},
    {id: 'B', x: 250, y: 80, visited: false, color: 'default'},
    {id: 'C', x: 400, y: 120, visited: false, color: 'default'},
    {id: 'D', x: 180, y: 200, visited: false, color: 'default'},
    {id: 'E', x: 320, y: 220, visited: false, color: 'default'}
  ]);
  const [networkNodes, setNetworkNodes] = useState([
    {id: 'A', x: 100, y: 100, distance: 0, visited: false},
    {id: 'B', x: 200, y: 150, distance: Infinity, visited: false},
    {id: 'C', x: 300, y: 100, distance: Infinity, visited: false},
    {id: 'D', x: 200, y: 50, distance: Infinity, visited: false}
  ]);
  const [newValue, setNewValue] = useState("");
  const [arrayIndex, setArrayIndex] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("java");
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  const [currentProcess, setCurrentProcess] = useState(0);
  const [timeQuantum, setTimeQuantum] = useState(2);

  const languages = [
    { value: "java", label: "Java", icon: "☕" },
    { value: "python", label: "Python", icon: "🐍" },
    { value: "javascript", label: "JavaScript", icon: "🟨" },
    { value: "cpp", label: "C++", icon: "⚡" },
    { value: "c", label: "C", icon: "🔧" }
  ];

  const topicData = {
    stacks: {
      title: "Stack Data Structure",
      description: "A stack is a linear data structure that follows LIFO (Last In, First Out) principle",
      operations: ["Push", "Pop", "Peek", "IsEmpty"],
      realLifeExample: "🔄 Undo/Redo in MS Word: Every action is pushed onto a stack, Ctrl+Z pops the last action",
      category: "dsa"
    },
    arrays: {
      title: "Array Data Structure", 
      description: "An array is a collection of elements stored at contiguous memory locations",
      operations: ["Insert", "Delete", "Access", "Search"],
      realLifeExample: "📱 Contact list in your phone: Each contact has an index, you can access, add, or remove contacts",
      category: "dsa"
    },
    "linked-lists": {
      title: "Linked List Data Structure",
      description: "A linked list is a sequence of nodes where each node contains data and a reference to the next node",
      operations: ["Insert", "Delete", "Search", "Traverse"],
      realLifeExample: "🚂 Train cars: Each car is linked to the next one, you can add/remove cars anywhere in the sequence",
      category: "dsa"
    },
    queues: {
      title: "Queue Data Structure",
      description: "A queue is a linear data structure that follows FIFO (First In, First Out) principle",
      operations: ["Enqueue", "Dequeue", "Front", "IsEmpty"],
      realLifeExample: "🏦 Bank queue: First person to arrive is first to be served, new people join at the back",
      category: "dsa"
    },
    processes: {
      title: "Process Management",
      description: "Managing process states and transitions in an operating system",
      operations: ["Create", "Schedule", "Block", "Terminate"],
      realLifeExample: "🏢 Office workflow: Tasks move from ready → running → waiting → completed states",
      category: "os"
    },
    scheduling: {
      title: "CPU Scheduling - Round Robin",
      description: "Round Robin is a preemptive scheduling algorithm with time quantum",
      operations: ["Schedule Next", "Context Switch", "Update Queue"],
      realLifeExample: "🎮 Multiplayer game turns: Each player gets equal time, then turn passes to next player",
      category: "os"
    },
    dijkstra: {
      title: "Dijkstra's Shortest Path",
      description: "Algorithm to find shortest path between nodes in a weighted graph",
      operations: ["Select Node", "Update Distances", "Mark Visited"],
      realLifeExample: "🗺️ GPS Navigation: Finding shortest route from your location to destination",
      category: "cn"
    },
    trees: {
      title: "Binary Tree Data Structure",
      description: "A hierarchical data structure where each node has at most two children",
      operations: ["Insert", "Delete", "Search", "Traverse"],
      realLifeExample: "🌳 Family tree: Each person has at most two parents, relationships form tree structure",
      category: "dsa"
    },
    graphs: {
      title: "Graph Data Structure",
      description: "A collection of nodes connected by edges, representing relationships",
      operations: ["Add Node", "Add Edge", "DFS", "BFS"],
      realLifeExample: "🌐 Social network: People are nodes, friendships are edges connecting them",
      category: "dsa"
    }
  };

  const currentTopic = topicData[topic as keyof typeof topicData];

  if (!currentTopic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Topic not found</h1>
          <Link to={`/course/${courseId}`}>
            <Button>Back to Course</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleStackPush = () => {
    if (!newValue.trim()) {
      toast.error("Please enter a value to push");
      return;
    }
    
    const newStack = [...stackItems, newValue];
    setStackItems(newStack);
    setCodeSnippet(getCodeSnippet("stack_push", newValue));
    setNewValue("");
    toast.success(`Pushed "${newValue}" to stack`);
    
    // Simulate AI evaluation
    setTimeout(() => {
      toast.success("AI Evaluation: Excellent! Stack push operation completed correctly. +10 XP");
    }, 1000);
  };

  const handleStackPop = () => {
    if (stackItems.length === 0) {
      toast.error("Stack is empty!");
      return;
    }
    
    const poppedItem = stackItems[stackItems.length - 1];
    const newStack = stackItems.slice(0, -1);
    setStackItems(newStack);
    setCodeSnippet(getCodeSnippet("stack_pop", poppedItem));
    toast.success(`Popped "${poppedItem}" from stack`);
    
    // Simulate AI evaluation
    setTimeout(() => {
      toast.success("AI Evaluation: Great work! Pop operation executed perfectly. +8 XP");
    }, 1000);
  };

  const handleStackPeek = () => {
    if (stackItems.length === 0) {
      toast.error("Stack is empty!");
      return;
    }
    
    const topItem = stackItems[stackItems.length - 1];
    setCodeSnippet(getCodeSnippet("stack_peek", topItem));
    toast.info(`Top item: "${topItem}"`);
  };

  const handleArrayInsert = () => {
    if (!newValue.trim() || !arrayIndex.trim()) {
      toast.error("Please enter both value and index");
      return;
    }
    
    const index = parseInt(arrayIndex);
    if (index < 0 || index > arrayItems.length) {
      toast.error("Invalid index!");
      return;
    }
    
    const newArray = [...arrayItems];
    newArray.splice(index, 0, newValue);
    setArrayItems(newArray);
    setAnimatingIndex(index);
    setCodeSnippet(getCodeSnippet("array_insert", index, newValue));
    setNewValue("");
    setArrayIndex("");
    
    setTimeout(() => setAnimatingIndex(null), 500);
    toast.success(`Inserted "${newValue}" at index ${index}`);
    
    // Simulate AI evaluation
    setTimeout(() => {
      toast.success("AI Evaluation: Perfect insertion! Array manipulation mastered. +12 XP");
    }, 1000);
  };

  const handleArrayDelete = () => {
    if (!arrayIndex.trim()) {
      toast.error("Please enter an index to delete");
      return;
    }
    
    const index = parseInt(arrayIndex);
    if (index < 0 || index >= arrayItems.length) {
      toast.error("Invalid index!");
      return;
    }
    
    const deletedItem = arrayItems[index];
    const newArray = arrayItems.filter((_, i) => i !== index);
    setArrayItems(newArray);
    setCodeSnippet(getCodeSnippet("array_delete", index, deletedItem));
    setArrayIndex("");
    toast.success(`Deleted "${deletedItem}" from index ${index}`);
    
    // Simulate AI evaluation
    setTimeout(() => {
      toast.success("AI Evaluation: Excellent deletion! Understanding array operations well. +10 XP");
    }, 1000);
  };

  const handleArrayAccess = () => {
    if (!arrayIndex.trim()) {
      toast.error("Please enter an index to access");
      return;
    }
    
    const index = parseInt(arrayIndex);
    if (index < 0 || index >= arrayItems.length) {
      toast.error("Invalid index!");
      return;
    }
    
    const accessedItem = arrayItems[index];
    setCodeSnippet(getCodeSnippet("array_access", index, accessedItem));
    setArrayIndex("");
    toast.info(`Value at index ${index}: "${accessedItem}"`);
  };

  const handleLinkedListInsert = () => {
    if (!newValue.trim()) {
      toast.error("Please enter a value to insert");
      return;
    }
    
    const newNode = {value: newValue, id: Date.now()};
    const newList = [...linkedListItems, newNode];
    setLinkedListItems(newList);
    setCodeSnippet(getCodeSnippet("linkedlist_insert", newValue));
    setNewValue("");
    toast.success(`Inserted "${newValue}" into linked list`);
    
    setTimeout(() => {
      toast.success("AI Evaluation: Great linked list manipulation! Understanding pointers well. +15 XP");
    }, 1000);
  };

  const handleProcessScheduling = () => {
    const nextProcess = (currentProcess + 1) % processes.length;
    const updatedProcesses = processes.map((proc, index) => ({
      ...proc,
      state: index === nextProcess ? "running" : 
             index === currentProcess ? "ready" : proc.state
    }));
    
    setProcesses(updatedProcesses);
    setCurrentProcess(nextProcess);
    setCodeSnippet(getCodeSnippet("round_robin", nextProcess));
    toast.success(`Context switch to ${updatedProcesses[nextProcess].name}`);
    
    setTimeout(() => {
      toast.success("AI Evaluation: Perfect scheduling understanding! Grasping OS concepts. +20 XP");
    }, 1000);
  };

  // Queue operations
  const handleQueueEnqueue = () => {
    if (!newValue.trim()) {
      toast.error("Please enter a value to enqueue");
      return;
    }
    
    const newQueue = [...queueItems, newValue];
    setQueueItems(newQueue);
    setCodeSnippet(getCodeSnippet("queue_enqueue", newValue));
    setNewValue("");
    toast.success(`Enqueued "${newValue}" to queue`);
    
    setTimeout(() => {
      toast.success("AI Evaluation: Perfect queue operation! Understanding FIFO principle. +12 XP");
    }, 1000);
  };

  const handleQueueDequeue = () => {
    if (queueItems.length === 0) {
      toast.error("Queue is empty!");
      return;
    }
    
    const dequeuedItem = queueItems[0];
    const newQueue = queueItems.slice(1);
    setQueueItems(newQueue);
    setCodeSnippet(getCodeSnippet("queue_dequeue", dequeuedItem));
    toast.success(`Dequeued "${dequeuedItem}" from queue`);
    
    setTimeout(() => {
      toast.success("AI Evaluation: Excellent! Queue dequeue mastered. +10 XP");
    }, 1000);
  };

  const handleQueueFront = () => {
    if (queueItems.length === 0) {
      toast.error("Queue is empty!");
      return;
    }
    
    const frontItem = queueItems[0];
    setCodeSnippet(getCodeSnippet("queue_front", frontItem));
    toast.info(`Front item: "${frontItem}"`);
  };

  // Tree operations
  const handleTreeInsert = () => {
    if (!newValue.trim()) {
      toast.error("Please enter a value to insert");
      return;
    }
    
    const newNode = {
      id: Date.now(),
      value: newValue,
      x: Math.random() * 300 + 50,
      y: Math.random() * 100 + 150,
      level: Math.floor(Math.random() * 3)
    };
    
    setTreeNodes(prev => [...prev, newNode]);
    setCodeSnippet(getCodeSnippet("tree_insert", newValue));
    setNewValue("");
    toast.success(`Inserted "${newValue}" into tree`);
    
    setTimeout(() => {
      toast.success("AI Evaluation: Great tree insertion! Understanding BST properties. +18 XP");
    }, 1000);
  };

  const handleTreeTraverse = () => {
    const values = treeNodes.map(node => node.value).join(" → ");
    setCodeSnippet(getCodeSnippet("tree_traverse", values));
    toast.info(`Inorder traversal: ${values}`);
    
    setTimeout(() => {
      toast.success("AI Evaluation: Perfect tree traversal understanding! +15 XP");
    }, 1000);
  };

  const handleTreeSearch = () => {
    if (!newValue.trim()) {
      toast.error("Please enter a value to search");
      return;
    }
    
    const found = treeNodes.find(node => node.value === newValue);
    setCodeSnippet(getCodeSnippet("tree_search", newValue, found ? "found" : "not found"));
    
    if (found) {
      toast.success(`Found "${newValue}" in the tree!`);
    } else {
      toast.info(`"${newValue}" not found in the tree`);
    }
    
    setNewValue("");
  };

  // Graph operations
  const handleGraphDFS = () => {
    let visitedCount = 0;
    const updatedNodes = graphNodes.map((node, index) => {
      if (visitedCount < 3) {
        visitedCount++;
        return {...node, visited: true, color: 'primary'};
      }
      return node;
    });
    
    setGraphNodes(updatedNodes);
    setCodeSnippet(getCodeSnippet("graph_dfs", "DFS"));
    toast.success("DFS traversal started!");
    
    setTimeout(() => {
      toast.success("AI Evaluation: Excellent DFS implementation! Graph algorithms mastered. +20 XP");
    }, 1000);
  };

  const handleGraphBFS = () => {
    let visitedCount = 0;
    const updatedNodes = graphNodes.map((node, index) => {
      if (visitedCount < 3) {
        visitedCount++;
        return {...node, visited: true, color: 'secondary'};
      }
      return node;
    });
    
    setGraphNodes(updatedNodes);
    setCodeSnippet(getCodeSnippet("graph_bfs", "BFS"));
    toast.success("BFS traversal started!");
    
    setTimeout(() => {
      toast.success("AI Evaluation: Perfect BFS understanding! Level-order traversal mastered. +20 XP");
    }, 1000);
  };

  const handleGraphReset = () => {
    setGraphNodes(prev => prev.map(node => ({...node, visited: false, color: 'default'})));
    setCodeSnippet("");
    toast.info("Graph reset to initial state");
  };

  const handleDijkstraStep = () => {
    const unvisited = networkNodes.filter(node => !node.visited);
    if (unvisited.length === 0) {
      toast.info("Algorithm complete!");
      return;
    }
    
    const current = unvisited.reduce((min, node) => 
      node.distance < min.distance ? node : min
    );
    
    const updatedNodes = networkNodes.map(node => 
      node.id === current.id ? {...node, visited: true} : node
    );
    
    setNetworkNodes(updatedNodes);
    setCodeSnippet(getCodeSnippet("dijkstra", current.id));
    toast.success(`Visited node ${current.id}, distance: ${current.distance}`);
    
    setTimeout(() => {
      toast.success("AI Evaluation: Excellent graph algorithm execution! Mastering CN concepts. +25 XP");
    }, 1000);
  };

  const getCodeSnippet = (operation: string, ...params: unknown[]) => {
    const codeTemplates = {
      java: {
        stack_push: `// Complete Stack Implementation
import java.util.*;

class Stack<T> {
    private List<T> items = new ArrayList<>();
    
    public void push(T item) {
        items.add(item);
        System.out.println("Pushed: " + item);
    }
    
    public T pop() {
        if (isEmpty()) throw new EmptyStackException();
        return items.remove(items.size() - 1);
    }
    
    public boolean isEmpty() {
        return items.isEmpty();
    }
}

// Usage: stack.push("${params[0]}");`,
        stack_pop: `// Complete Pop Operation
public T pop() {
    if (isEmpty()) {
        throw new EmptyStackException("Stack is empty!");
    }
    T poppedItem = items.remove(items.size() - 1);
    System.out.println("Popped: " + poppedItem);
    return poppedItem; // "${params[0]}"
}`,
        stack_peek: `// Complete Peek Operation
public T peek() {
    if (isEmpty()) {
        throw new EmptyStackException("Stack is empty!");
    }
    T topItem = items.get(items.size() - 1);
    System.out.println("Top item: " + topItem);
    return topItem; // "${params[0]}"
}`,
        array_access: `// Complete Array Access
public class SafeArrayAccess {
    public static String safeGet(String[] array, int index) {
        if (index < 0 || index >= array.length) {
            System.out.println("Index out of bounds!");
            return null;
        }
        String value = array[${params[0]}];
        System.out.println("Accessed: " + value);
        return value; // "${params[1]}"
    }
}`,
        array_insert: `// Complete Array Insert Implementation
import java.util.*;

public class DynamicArray {
    private List<String> items = new ArrayList<>();
    
    public void insert(int index, String value) {
        if (index < 0 || index > items.size()) {
            throw new IndexOutOfBoundsException();
        }
        items.add(${params[0]}, "${params[1]}");
        System.out.println("Inserted " + value + " at index " + index);
    }
}`,
        queue_enqueue: `// Complete Queue Implementation
import java.util.*;

class Queue<T> {
    private LinkedList<T> items = new LinkedList<>();
    
    public void enqueue(T item) {
        items.addLast(item);
        System.out.println("Enqueued: " + item);
    }
    
    public T dequeue() {
        if (isEmpty()) throw new NoSuchElementException();
        return items.removeFirst();
    }
    
    public boolean isEmpty() {
        return items.isEmpty();
    }
}

// Usage: queue.enqueue("${params[0]}");`,
        tree_insert: `// Complete Binary Tree Insert
class TreeNode {
    String data;
    TreeNode left, right;
    
    TreeNode(String data) {
        this.data = data;
        left = right = null;
    }
}

public TreeNode insert(TreeNode root, String data) {
    if (root == null) return new TreeNode(data);
    
    if (data.compareTo(root.data) < 0)
        root.left = insert(root.left, data);
    else
        root.right = insert(root.right, data);
        
    return root;
}

// Inserted: "${params[0]}"`,
        linkedlist_insert: `// Complete Linked List Implementation
class ListNode {
    String data;
    ListNode next;
    
    ListNode(String data) {
        this.data = data;
        this.next = null;
    }
}

public class LinkedList {
    private ListNode head;
    
    public void insert(String data) {
        ListNode newNode = new ListNode("${params[0]}");
        if (head == null) {
            head = newNode;
        } else {
            ListNode current = head;
            while (current.next != null) {
                current = current.next;
            }
            current.next = newNode;
        }
        System.out.println("Inserted: " + data);
    }
}`,
        round_robin: `// Complete Round Robin Scheduler
class Process {
    String name;
    int burstTime, remainingTime;
    
    Process(String name, int burstTime) {
        this.name = name;
        this.burstTime = burstTime;
        this.remainingTime = burstTime;
    }
}

public void roundRobinScheduling(Process[] processes, int quantum) {
    Queue<Process> readyQueue = new LinkedList<>();
    int currentProcess = ${params[0]};
    
    System.out.println("Context switch to: " + processes[currentProcess].name);
    System.out.println("Time quantum: ${timeQuantum}ms");
}`,
        dijkstra: `// Complete Dijkstra's Algorithm
import java.util.*;

class Graph {
    private Map<String, List<Node>> adjList = new HashMap<>();
    
    class Node {
        String vertex;
        int weight;
        
        Node(String vertex, int weight) {
            this.vertex = vertex;
            this.weight = weight;
        }
    }
    
    public void dijkstra(String start) {
        Map<String, Integer> distances = new HashMap<>();
        PriorityQueue<Node> pq = new PriorityQueue<>(
            Comparator.comparing(n -> distances.getOrDefault(n.vertex, Integer.MAX_VALUE))
        );
        
        distances.put(start, 0);
        pq.offer(new Node(start, 0));
        
        while (!pq.isEmpty()) {
            Node current = pq.poll();
            String currentNode = "${params[0]}";
            System.out.println("Visiting: " + currentNode);
        }
    }
}`
      },
      python: {
        stack_push: `# Complete Stack Implementation
class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        self.items.append(item)
        print(f"Pushed: {item}")
        
    def pop(self):
        if self.is_empty():
            raise Exception("Stack is empty!")
        return self.items.pop()
        
    def peek(self):
        if self.is_empty():
            raise Exception("Stack is empty!")
        return self.items[-1]
        
    def is_empty(self):
        return len(self.items) == 0

# Usage: stack.push("${params[0]}")`,
        queue_enqueue: `# Complete Queue Implementation
from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()
    
    def enqueue(self, item):
        self.items.append(item)
        print(f"Enqueued: {item}")
        
    def dequeue(self):
        if self.is_empty():
            raise Exception("Queue is empty!")
        return self.items.popleft()
        
    def front(self):
        if self.is_empty():
            raise Exception("Queue is empty!")
        return self.items[0]
        
    def is_empty(self):
        return len(self.items) == 0

# Usage: queue.enqueue("${params[0]}")`,
        tree_insert: `# Complete Binary Tree Implementation
class TreeNode:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None

class BinaryTree:
    def __init__(self):
        self.root = None
    
    def insert(self, data):
        if not self.root:
            self.root = TreeNode(data)
        else:
            self._insert_recursive(self.root, data)
        print(f"Inserted: {data}")
    
    def _insert_recursive(self, node, data):
        if data < node.data:
            if not node.left:
                node.left = TreeNode(data)
            else:
                self._insert_recursive(node.left, data)
        else:
            if not node.right:
                node.right = TreeNode(data)
            else:
                self._insert_recursive(node.right, data)

# Inserted: "${params[0]}"`,
        array_access: `# Complete Safe Array Access
def safe_array_access(array, index):
    """Safely access array element with bounds checking"""
    if index < 0 or index >= len(array):
        print("Index out of bounds!")
        return None
    
    value = array[${params[0]}]
    print(f"Accessed: {value}")
    return value  # "${params[1]}"

# Example usage
array = ["item1", "item2", "item3"]
result = safe_array_access(array, ${params[0]})`,
        linkedlist_insert: `# Complete Linked List Implementation
class ListNode:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
    
    def insert(self, data):
        new_node = ListNode(data)
        if not self.head:
            self.head = new_node
        else:
            current = self.head
            while current.next:
                current = current.next
            current.next = new_node
        print(f"Inserted: {data}")
    
    def display(self):
        elements = []
        current = self.head
        while current:
            elements.append(current.data)
            current = current.next
        return elements

# Usage: linked_list.insert("${params[0]}")`,
        round_robin: `# Complete Round Robin Scheduler
from collections import deque

class Process:
    def __init__(self, name, burst_time):
        self.name = name
        self.burst_time = burst_time
        self.remaining_time = burst_time

class RoundRobinScheduler:
    def __init__(self, quantum):
        self.quantum = quantum
        self.ready_queue = deque()
        
    def schedule(self, processes):
        current_process = ${params[0]}
        process = processes[current_process]
        
        print(f"Context switch to: {process.name}")
        print(f"Time quantum: {self.quantum}ms")
        
        # Execute for quantum or remaining time
        execution_time = min(self.quantum, process.remaining_time)
        process.remaining_time -= execution_time
        
        if process.remaining_time > 0:
            self.ready_queue.append(process)

# Current process: ${params[0]} with quantum ${timeQuantum}ms`,
        dijkstra: `# Complete Dijkstra's Algorithm Implementation
import heapq
from collections import defaultdict

class Graph:
    def __init__(self):
        self.graph = defaultdict(list)
    
    def add_edge(self, u, v, weight):
        self.graph[u].append((v, weight))
        self.graph[v].append((u, weight))
    
    def dijkstra(self, start):
        distances = defaultdict(lambda: float('inf'))
        distances[start] = 0
        pq = [(0, start)]
        visited = set()
        
        while pq:
            current_dist, current_node = heapq.heappop(pq)
            
            if current_node in visited:
                continue
                
            visited.add(current_node)
            print(f"Visiting: {current_node}, Distance: {current_dist}")
            
            for neighbor, weight in self.graph[current_node]:
                distance = current_dist + weight
                if distance < distances[neighbor]:
                    distances[neighbor] = distance
                    heapq.heappush(pq, (distance, neighbor))
        
        return distances

# Currently visiting node: "${params[0]}"`,
        stack_pop: `# Complete Stack Pop Operation
def pop(self):
    if self.is_empty():
        raise Exception("Stack underflow! Cannot pop from empty stack")
    
    popped_item = self.items.pop()
    print(f"Popped: {popped_item}")
    return popped_item  # "${params[0]}"
    
def is_empty(self):
    return len(self.items) == 0`,
        stack_peek: `# Complete Stack Peek Operation  
def peek(self):
    if self.is_empty():
        raise Exception("Stack is empty! Cannot peek")
    
    top_item = self.items[-1]
    print(f"Top item: {top_item}")
    return top_item  # "${params[0]}"`,
        array_insert: `# Complete Dynamic Array Insert
class DynamicArray:
    def __init__(self):
        self.items = []
    
    def insert(self, index, value):
        if index < 0 or index > len(self.items):
            raise IndexError("Index out of bounds")
        
        self.items.insert(${params[0]}, "${params[1]}")
        print(f"Inserted {value} at index {index}")
        return self.items

# Usage example
arr = DynamicArray()
arr.insert(${params[0]}, "${params[1]}")`,
        array_delete: `# Complete Array Delete Operation
def delete_at_index(self, index):
    if index < 0 or index >= len(self.items):
        raise IndexError("Index out of bounds")
    
    deleted_item = self.items.pop(${params[0]})
    print(f"Deleted {deleted_item} from index {index}")
    return deleted_item  # "${params[1]}"`
      },
      javascript: {
        stack_push: `// Complete Stack Implementation
class Stack {
    constructor() {
        this.items = [];
    }
    
    push(element) {
        this.items.push(element);
        console.log(\`Pushed: \${element}\`);
        return this.items.length;
    }
    
    pop() {
        if (this.isEmpty()) {
            throw new Error("Stack is empty!");
        }
        const poppedElement = this.items.pop();
        console.log(\`Popped: \${poppedElement}\`);
        return poppedElement;
    }
    
    peek() {
        if (this.isEmpty()) {
            throw new Error("Stack is empty!");
        }
        return this.items[this.items.length - 1];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
}

// Usage: stack.push("${params[0]}");`,
        queue_enqueue: `// Complete Queue Implementation
class Queue {
    constructor() {
        this.items = [];
    }
    
    enqueue(element) {
        this.items.push(element);
        console.log(\`Enqueued: \${element}\`);
        return this.items.length;
    }
    
    dequeue() {
        if (this.isEmpty()) {
            throw new Error("Queue is empty!");
        }
        const dequeuedElement = this.items.shift();
        console.log(\`Dequeued: \${dequeuedElement}\`);
        return dequeuedElement;
    }
    
    front() {
        if (this.isEmpty()) {
            throw new Error("Queue is empty!");
        }
        return this.items[0];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
}

// Usage: queue.enqueue("${params[0]}");`,
        tree_insert: `// Complete Binary Search Tree Implementation
class TreeNode {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }
    
    insert(data) {
        const newNode = new TreeNode(data);
        
        if (!this.root) {
            this.root = newNode;
        } else {
            this.insertNode(this.root, newNode);
        }
        console.log(\`Inserted: \${data}\`);
    }
    
    insertNode(node, newNode) {
        if (newNode.data < node.data) {
            if (!node.left) {
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode);
            }
        } else {
            if (!node.right) {
                node.right = newNode;
            } else {
                this.insertNode(node.right, newNode);
            }
        }
    }
    
    inorderTraversal(node = this.root, result = []) {
        if (node) {
            this.inorderTraversal(node.left, result);
            result.push(node.data);
            this.inorderTraversal(node.right, result);
        }
        return result;
    }
}

// Inserted: "${params[0]}"`,
        array_access: `// Complete Safe Array Access Implementation
class SafeArray {
    constructor(initialArray = []) {
        this.items = [...initialArray];
    }
    
    safeGet(index) {
        if (index < 0 || index >= this.items.length) {
            console.error("Index out of bounds!");
            return null;
        }
        
        const value = this.items[${params[0]}];
        console.log(\`Accessed: \${value} at index \${index}\`);
        return value; // "${params[1]}"
    }
    
    length() {
        return this.items.length;
    }
    
    isValidIndex(index) {
        return index >= 0 && index < this.items.length;
    }
}

// Example usage
const safeArray = new SafeArray(['item1', 'item2', 'item3']);
const result = safeArray.safeGet(${params[0]}); // "${params[1]}"`,
        linkedlist_insert: `// Complete Linked List Implementation
class ListNode {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }
    
    insert(data) {
        const newNode = new ListNode(data);
        
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        
        this.size++;
        console.log(\`Inserted: \${data}\`);
        return this.size;
    }
    
    insertAt(index, data) {
        if (index < 0 || index > this.size) {
            throw new Error("Index out of bounds");
        }
        
        if (index === 0) {
            const newNode = new ListNode(data);
            newNode.next = this.head;
            this.head = newNode;
        } else {
            const newNode = new ListNode(data);
            let current = this.head;
            for (let i = 0; i < index - 1; i++) {
                current = current.next;
            }
            newNode.next = current.next;
            current.next = newNode;
        }
        
        this.size++;
        console.log(\`Inserted \${data} at index \${index}\`);
    }
    
    toArray() {
        const result = [];
        let current = this.head;
        while (current) {
            result.push(current.data);
            current = current.next;
        }
        return result;
    }
}

// Usage: linkedList.insert("${params[0]}");`,
        round_robin: `// Complete Round Robin Scheduler Implementation
class Process {
    constructor(name, burstTime, priority = 0) {
        this.name = name;
        this.burstTime = burstTime;
        this.remainingTime = burstTime;
        this.priority = priority;
        this.waitingTime = 0;
        this.turnaroundTime = 0;
    }
}

class RoundRobinScheduler {
    constructor(quantum) {
        this.quantum = quantum;
        this.readyQueue = [];
        this.completedProcesses = [];
        this.currentTime = 0;
    }
    
    schedule(processes) {
        this.readyQueue = [...processes];
        
        while (this.readyQueue.length > 0) {
            const currentProcess = this.readyQueue.shift();
            const currentProcessIndex = ${params[0]};
            
            console.log(\`Context switch to: \${currentProcess.name}\`);
            console.log(\`Time quantum: \${this.quantum}ms\`);
            
            const executionTime = Math.min(this.quantum, currentProcess.remainingTime);
            currentProcess.remainingTime -= executionTime;
            this.currentTime += executionTime;
            
            if (currentProcess.remainingTime > 0) {
                this.readyQueue.push(currentProcess);
                console.log(\`\${currentProcess.name} preempted, remaining: \${currentProcess.remainingTime}ms\`);
            } else {
                currentProcess.turnaroundTime = this.currentTime;
                this.completedProcesses.push(currentProcess);
                console.log(\`\${currentProcess.name} completed\`);
            }
        }
        
        return this.completedProcesses;
    }
    
    calculateAverageWaitingTime() {
        const totalWaiting = this.completedProcesses.reduce((sum, p) => sum + p.waitingTime, 0);
        return totalWaiting / this.completedProcesses.length;
    }
}

// Current process: ${params[0]} with quantum ${timeQuantum}ms`,
        dijkstra: `// Complete Dijkstra's Algorithm Implementation
class Graph {
    constructor() {
        this.adjacencyList = new Map();
    }
    
    addVertex(vertex) {
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, []);
        }
    }
    
    addEdge(vertex1, vertex2, weight) {
        this.addVertex(vertex1);
        this.addVertex(vertex2);
        
        this.adjacencyList.get(vertex1).push({ node: vertex2, weight });
        this.adjacencyList.get(vertex2).push({ node: vertex1, weight });
    }
    
    dijkstra(startVertex) {
        const distances = new Map();
        const previous = new Map();
        const visited = new Set();
        const priorityQueue = [];
        
        // Initialize distances
        for (const vertex of this.adjacencyList.keys()) {
            distances.set(vertex, vertex === startVertex ? 0 : Infinity);
            previous.set(vertex, null);
        }
        
        priorityQueue.push({ vertex: startVertex, distance: 0 });
        
        while (priorityQueue.length > 0) {
            // Sort by distance (simple implementation)
            priorityQueue.sort((a, b) => a.distance - b.distance);
            const { vertex: currentVertex } = priorityQueue.shift();
            
            if (visited.has(currentVertex)) continue;
            
            visited.add(currentVertex);
            console.log(\`Visiting: \${currentVertex}, Distance: \${distances.get(currentVertex)}\`);
            
            const neighbors = this.adjacencyList.get(currentVertex) || [];
            
            for (const neighbor of neighbors) {
                const { node: neighborVertex, weight } = neighbor;
                const totalDistance = distances.get(currentVertex) + weight;
                
                if (totalDistance < distances.get(neighborVertex)) {
                    distances.set(neighborVertex, totalDistance);
                    previous.set(neighborVertex, currentVertex);
                    priorityQueue.push({ vertex: neighborVertex, distance: totalDistance });
                }
            }
        }
        
        return { distances, previous };
    }
    
    getShortestPath(startVertex, endVertex) {
        const { distances, previous } = this.dijkstra(startVertex);
        const path = [];
        let currentVertex = endVertex;
        
        while (currentVertex !== null) {
            path.unshift(currentVertex);
            currentVertex = previous.get(currentVertex);
        }
        
        return {
            path,
            distance: distances.get(endVertex)
        };
    }
}

// Currently visiting node: "${params[0]}"`,
        stack_pop: `// Complete Stack Pop Operation
pop() {
    if (this.isEmpty()) {
        throw new Error("Stack underflow! Cannot pop from empty stack");
    }
    
    const poppedItem = this.items.pop();
    console.log(\`Popped: \${poppedItem}\`);
    return poppedItem; // "${params[0]}"
}

isEmpty() {
    return this.items.length === 0;
}`,
        stack_peek: `// Complete Stack Peek Operation
peek() {
    if (this.isEmpty()) {
        throw new Error("Stack is empty! Cannot peek");
    }
    
    const topItem = this.items[this.items.length - 1];
    console.log(\`Top item: \${topItem}\`);
    return topItem; // "${params[0]}"
}`,
        array_insert: `// Complete Dynamic Array Insert
class DynamicArray {
    constructor() {
        this.items = [];
    }
    
    insert(index, value) {
        if (index < 0 || index > this.items.length) {
            throw new Error("Index out of bounds");
        }
        
        this.items.splice(${params[0]}, 0, "${params[1]}");
        console.log(\`Inserted \${value} at index \${index}\`);
        return this.items.length;
    }
    
    getArray() {
        return [...this.items];
    }
}

// Usage example
const arr = new DynamicArray();
arr.insert(${params[0]}, "${params[1]}");`,
        array_delete: `// Complete Array Delete Operation
delete(index) {
    if (index < 0 || index >= this.items.length) {
        throw new Error("Index out of bounds");
    }
    
    const deletedItem = this.items.splice(${params[0]}, 1)[0];
    console.log(\`Deleted \${deletedItem} from index \${index}\`);
    return deletedItem; // "${params[1]}"
}`
      },
      cpp: {
        stack_push: `// Complete Stack Implementation in C++
#include <iostream>
#include <vector>
#include <stdexcept>

template<typename T>
class Stack {
private:
    std::vector<T> items;
    
public:
    void push(const T& item) {
        items.push_back(item);
        std::cout << "Pushed: " << item << std::endl;
    }
    
    T pop() {
        if (isEmpty()) {
            throw std::underflow_error("Stack is empty!");
        }
        T topItem = items.back();
        items.pop_back();
        std::cout << "Popped: " << topItem << std::endl;
        return topItem;
    }
    
    T peek() const {
        if (isEmpty()) {
            throw std::underflow_error("Stack is empty!");
        }
        return items.back();
    }
    
    bool isEmpty() const {
        return items.empty();
    }
    
    size_t size() const {
        return items.size();
    }
};

// Usage: stack.push("${params[0]}");`,
        queue_enqueue: `// Complete Queue Implementation in C++
#include <iostream>
#include <queue>
#include <stdexcept>

template<typename T>
class Queue {
private:
    std::queue<T> items;
    
public:
    void enqueue(const T& item) {
        items.push(item);
        std::cout << "Enqueued: " << item << std::endl;
    }
    
    T dequeue() {
        if (isEmpty()) {
            throw std::underflow_error("Queue is empty!");
        }
        T frontItem = items.front();
        items.pop();
        std::cout << "Dequeued: " << frontItem << std::endl;
        return frontItem;
    }
    
    T front() const {
        if (isEmpty()) {
            throw std::underflow_error("Queue is empty!");
        }
        return items.front();
    }
    
    bool isEmpty() const {
        return items.empty();
    }
    
    size_t size() const {
        return items.size();
    }
};

// Usage: queue.enqueue("${params[0]}");`,
        tree_insert: `// Complete Binary Search Tree Implementation
#include <iostream>
#include <memory>

template<typename T>
class TreeNode {
public:
    T data;
    std::shared_ptr<TreeNode<T>> left;
    std::shared_ptr<TreeNode<T>> right;
    
    TreeNode(const T& value) : data(value), left(nullptr), right(nullptr) {}
};

template<typename T>
class BinarySearchTree {
private:
    std::shared_ptr<TreeNode<T>> root;
    
    std::shared_ptr<TreeNode<T>> insertRecursive(std::shared_ptr<TreeNode<T>> node, const T& data) {
        if (!node) {
            return std::make_shared<TreeNode<T>>(data);
        }
        
        if (data < node->data) {
            node->left = insertRecursive(node->left, data);
        } else {
            node->right = insertRecursive(node->right, data);
        }
        
        return node;
    }
    
public:
    BinarySearchTree() : root(nullptr) {}
    
    void insert(const T& data) {
        root = insertRecursive(root, data);
        std::cout << "Inserted: " << data << std::endl;
    }
    
    void inorderTraversal(std::shared_ptr<TreeNode<T>> node) const {
        if (node) {
            inorderTraversal(node->left);
            std::cout << node->data << " ";
            inorderTraversal(node->right);
        }
    }
    
    void displayInorder() const {
        std::cout << "Inorder traversal: ";
        inorderTraversal(root);
        std::cout << std::endl;
    }
};

// Inserted: "${params[0]}"`,
        array_access: `// Complete Safe Array Access in C++
#include <iostream>
#include <vector>
#include <stdexcept>

template<typename T>
class SafeArray {
private:
    std::vector<T> items;
    
public:
    SafeArray(const std::vector<T>& initialData = {}) : items(initialData) {}
    
    T safeGet(size_t index) const {
        if (index >= items.size()) {
            throw std::out_of_range("Index out of bounds!");
        }
        
        T value = items[${params[0]}];
        std::cout << "Accessed: " << value << " at index " << index << std::endl;
        return value; // "${params[1]}"
    }
    
    void safeSet(size_t index, const T& value) {
        if (index >= items.size()) {
            throw std::out_of_range("Index out of bounds!");
        }
        items[index] = value;
        std::cout << "Set: " << value << " at index " << index << std::endl;
    }
    
    size_t size() const {
        return items.size();
    }
    
    bool isValidIndex(size_t index) const {
        return index < items.size();
    }
};

// Example usage
// SafeArray<std::string> arr({"item1", "item2", "item3"});
// std::string result = arr.safeGet(${params[0]}); // "${params[1]}"`,
        linkedlist_insert: `// Complete Linked List Implementation in C++
#include <iostream>
#include <memory>

template<typename T>
class ListNode {
public:
    T data;
    std::shared_ptr<ListNode<T>> next;
    
    ListNode(const T& value) : data(value), next(nullptr) {}
};

template<typename T>
class LinkedList {
private:
    std::shared_ptr<ListNode<T>> head;
    size_t listSize;
    
public:
    LinkedList() : head(nullptr), listSize(0) {}
    
    void insert(const T& data) {
        auto newNode = std::make_shared<ListNode<T>>(data);
        
        if (!head) {
            head = newNode;
        } else {
            auto current = head;
            while (current->next) {
                current = current->next;
            }
            current->next = newNode;
        }
        
        listSize++;
        std::cout << "Inserted: " << data << std::endl;
    }
    
    void insertAt(size_t index, const T& data) {
        if (index > listSize) {
            throw std::out_of_range("Index out of bounds");
        }
        
        auto newNode = std::make_shared<ListNode<T>>(data);
        
        if (index == 0) {
            newNode->next = head;
            head = newNode;
        } else {
            auto current = head;
            for (size_t i = 0; i < index - 1; i++) {
                current = current->next;
            }
            newNode->next = current->next;
            current->next = newNode;
        }
        
        listSize++;
        std::cout << "Inserted " << data << " at index " << index << std::endl;
    }
    
    void display() const {
        std::cout << "List: ";
        auto current = head;
        while (current) {
            std::cout << current->data << " -> ";
            current = current->next;
        }
        std::cout << "NULL" << std::endl;
    }
    
    size_t size() const {
        return listSize;
    }
};

// Usage: linkedList.insert("${params[0]}");`,
        round_robin: `// Complete Round Robin Scheduler in C++
#include <iostream>
#include <vector>
#include <queue>

class Process {
public:
    std::string name;
    int burstTime;
    int remainingTime;
    int waitingTime;
    int turnaroundTime;
    int priority;
    
    Process(const std::string& processName, int bt, int prio = 0) 
        : name(processName), burstTime(bt), remainingTime(bt), 
          waitingTime(0), turnaroundTime(0), priority(prio) {}
};

class RoundRobinScheduler {
private:
    int quantum;
    std::queue<Process*> readyQueue;
    std::vector<Process*> completedProcesses;
    int currentTime;
    
public:
    RoundRobinScheduler(int timeQuantum) : quantum(timeQuantum), currentTime(0) {}
    
    void schedule(std::vector<Process*>& processes) {
        // Add all processes to ready queue
        for (auto& process : processes) {
            readyQueue.push(process);
        }
        
        while (!readyQueue.empty()) {
            Process* currentProcess = readyQueue.front();
            readyQueue.pop();
            
            int currentProcessIndex = ${params[0]};
            
            std::cout << "Context switch to: " << currentProcess->name << std::endl;
            std::cout << "Time quantum: " << quantum << "ms" << std::endl;
            
            int executionTime = std::min(quantum, currentProcess->remainingTime);
            currentProcess->remainingTime -= executionTime;
            currentTime += executionTime;
            
            if (currentProcess->remainingTime > 0) {
                readyQueue.push(currentProcess);
                std::cout << currentProcess->name << " preempted, remaining: " 
                         << currentProcess->remainingTime << "ms" << std::endl;
            } else {
                currentProcess->turnaroundTime = currentTime;
                completedProcesses.push_back(currentProcess);
                std::cout << currentProcess->name << " completed" << std::endl;
            }
        }
    }
    
    double calculateAverageWaitingTime() const {
        int totalWaiting = 0;
        for (const auto& process : completedProcesses) {
            totalWaiting += process->waitingTime;
        }
        return static_cast<double>(totalWaiting) / completedProcesses.size();
    }
};

// Current process: ${params[0]} with quantum ${timeQuantum}ms`,
        dijkstra: `// Complete Dijkstra's Algorithm in C++
#include <iostream>
#include <vector>
#include <queue>
#include <unordered_map>
#include <limits>

class Graph {
public:
    struct Edge {
        std::string to;
        int weight;
        
        Edge(const std::string& destination, int w) : to(destination), weight(w) {}
    };
    
    struct Node {
        std::string vertex;
        int distance;
        
        Node(const std::string& v, int d) : vertex(v), distance(d) {}
        
        bool operator>(const Node& other) const {
            return distance > other.distance;
        }
    };
    
private:
    std::unordered_map<std::string, std::vector<Edge>> adjacencyList;
    
public:
    void addVertex(const std::string& vertex) {
        if (adjacencyList.find(vertex) == adjacencyList.end()) {
            adjacencyList[vertex] = std::vector<Edge>();
        }
    }
    
    void addEdge(const std::string& from, const std::string& to, int weight) {
        addVertex(from);
        addVertex(to);
        
        adjacencyList[from].emplace_back(to, weight);
        adjacencyList[to].emplace_back(from, weight); // For undirected graph
    }
    
    std::unordered_map<std::string, int> dijkstra(const std::string& start) {
        std::unordered_map<std::string, int> distances;
        std::unordered_map<std::string, bool> visited;
        std::priority_queue<Node, std::vector<Node>, std::greater<Node>> pq;
        
        // Initialize distances
        for (const auto& pair : adjacencyList) {
            distances[pair.first] = (pair.first == start) ? 0 : std::numeric_limits<int>::max();
            visited[pair.first] = false;
        }
        
        pq.push(Node(start, 0));
        
        while (!pq.empty()) {
            Node current = pq.top();
            pq.pop();
            
            if (visited[current.vertex]) continue;
            
            visited[current.vertex] = true;
            std::cout << "Visiting: " << current.vertex 
                     << ", Distance: " << current.distance << std::endl;
            
            for (const Edge& edge : adjacencyList[current.vertex]) {
                int newDistance = distances[current.vertex] + edge.weight;
                
                if (newDistance < distances[edge.to]) {
                    distances[edge.to] = newDistance;
                    pq.push(Node(edge.to, newDistance));
                }
            }
        }
        
        return distances;
    }
    
    std::vector<std::string> getShortestPath(const std::string& start, const std::string& end) {
        std::unordered_map<std::string, std::string> previous;
        std::unordered_map<std::string, int> distances = dijkstra(start);
        
        std::vector<std::string> path;
        std::string current = end;
        
        while (current != start && previous.find(current) != previous.end()) {
            path.insert(path.begin(), current);
            current = previous[current];
        }
        
        if (current == start) {
            path.insert(path.begin(), start);
        }
        
        return path;
    }
};

// Currently visiting node: "${params[0]}"`,
        stack_pop: `// Complete Stack Pop Operation
T pop() {
    if (isEmpty()) {
        throw std::underflow_error("Stack underflow! Cannot pop from empty stack");
    }
    
    T poppedItem = items.back();
    items.pop_back();
    std::cout << "Popped: " << poppedItem << std::endl;
    return poppedItem; // "${params[0]}"
}

bool isEmpty() const {
    return items.empty();
}`,
        stack_peek: `// Complete Stack Peek Operation
T peek() const {
    if (isEmpty()) {
        throw std::underflow_error("Stack is empty! Cannot peek");
    }
    
    T topItem = items.back();
    std::cout << "Top item: " << topItem << std::endl;
    return topItem; // "${params[0]}"
}`,
        array_insert: `// Complete Dynamic Array Insert
template<typename T>
class DynamicArray {
private:
    std::vector<T> items;
    
public:
    void insert(size_t index, const T& value) {
        if (index > items.size()) {
            throw std::out_of_range("Index out of bounds");
        }
        
        items.insert(items.begin() + ${params[0]}, "${params[1]}");
        std::cout << "Inserted " << value << " at index " << index << std::endl;
    }
    
    std::vector<T> getArray() const {
        return items;
    }
    
    size_t size() const {
        return items.size();
    }
};

// Usage example
// DynamicArray<std::string> arr;
// arr.insert(${params[0]}, "${params[1]}");`,
        array_delete: `// Complete Array Delete Operation
T deleteAt(size_t index) {
    if (index >= items.size()) {
        throw std::out_of_range("Index out of bounds");
    }
    
    T deletedItem = items[${params[0]}];
    items.erase(items.begin() + ${params[0]});
    std::cout << "Deleted " << deletedItem << " from index " << index << std::endl;
    return deletedItem; // "${params[1]}"
}`
      },
      c: {
        stack_push: `// Complete Stack Implementation in C
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

#define MAX_SIZE 100
#define MAX_STRING_SIZE 50

typedef struct {
    char items[MAX_SIZE][MAX_STRING_SIZE];
    int top;
} Stack;

void initStack(Stack* stack) {
    stack->top = -1;
}

bool isEmpty(Stack* stack) {
    return stack->top == -1;
}

bool isFull(Stack* stack) {
    return stack->top == MAX_SIZE - 1;
}

void push(Stack* stack, const char* item) {
    if (isFull(stack)) {
        printf("Stack overflow! Cannot push more elements\\n");
        return;
    }
    
    stack->top++;
    strcpy(stack->items[stack->top], item);
    printf("Pushed: %s\\n", item);
}

char* pop(Stack* stack) {
    if (isEmpty(stack)) {
        printf("Stack underflow! Cannot pop from empty stack\\n");
        return NULL;
    }
    
    char* poppedItem = stack->items[stack->top];
    printf("Popped: %s\\n", poppedItem);
    stack->top--;
    return poppedItem;
}

char* peek(Stack* stack) {
    if (isEmpty(stack)) {
        printf("Stack is empty! Cannot peek\\n");
        return NULL;
    }
    
    return stack->items[stack->top];
}

int size(Stack* stack) {
    return stack->top + 1;
}

void display(Stack* stack) {
    if (isEmpty(stack)) {
        printf("Stack is empty\\n");
        return;
    }
    
    printf("Stack elements (top to bottom): ");
    for (int i = stack->top; i >= 0; i--) {
        printf("%s ", stack->items[i]);
    }
    printf("\\n");
}

// Usage: push(&stack, "${params[0]}");`,
        queue_enqueue: `// Complete Queue Implementation in C
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

#define MAX_SIZE 100
#define MAX_STRING_SIZE 50

typedef struct {
    char items[MAX_SIZE][MAX_STRING_SIZE];
    int front;
    int rear;
    int count;
} Queue;

void initQueue(Queue* queue) {
    queue->front = 0;
    queue->rear = -1;
    queue->count = 0;
}

bool isEmpty(Queue* queue) {
    return queue->count == 0;
}

bool isFull(Queue* queue) {
    return queue->count == MAX_SIZE;
}

void enqueue(Queue* queue, const char* item) {
    if (isFull(queue)) {
        printf("Queue overflow! Cannot enqueue more elements\\n");
        return;
    }
    
    queue->rear = (queue->rear + 1) % MAX_SIZE;
    strcpy(queue->items[queue->rear], item);
    queue->count++;
    printf("Enqueued: %s\\n", item);
}

char* dequeue(Queue* queue) {
    if (isEmpty(queue)) {
        printf("Queue underflow! Cannot dequeue from empty queue\\n");
        return NULL;
    }
    
    char* dequeuedItem = queue->items[queue->front];
    printf("Dequeued: %s\\n", dequeuedItem);
    queue->front = (queue->front + 1) % MAX_SIZE;
    queue->count--;
    return dequeuedItem;
}

char* front(Queue* queue) {
    if (isEmpty(queue)) {
        printf("Queue is empty! Cannot get front element\\n");
        return NULL;
    }
    
    return queue->items[queue->front];
}

int size(Queue* queue) {
    return queue->count;
}

void display(Queue* queue) {
    if (isEmpty(queue)) {
        printf("Queue is empty\\n");
        return;
    }
    
    printf("Queue elements (front to rear): ");
    int index = queue->front;
    for (int i = 0; i < queue->count; i++) {
        printf("%s ", queue->items[index]);
        index = (index + 1) % MAX_SIZE;
    }
    printf("\\n");
}

// Usage: enqueue(&queue, "${params[0]}");`,
        tree_insert: `// Complete Binary Search Tree Implementation in C
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct TreeNode {
    char data[50];
    struct TreeNode* left;
    struct TreeNode* right;
} TreeNode;

typedef struct {
    TreeNode* root;
} BinarySearchTree;

TreeNode* createNode(const char* data) {
    TreeNode* newNode = (TreeNode*)malloc(sizeof(TreeNode));
    if (!newNode) {
        printf("Memory allocation failed!\\n");
        return NULL;
    }
    
    strcpy(newNode->data, data);
    newNode->left = NULL;
    newNode->right = NULL;
    return newNode;
}

void initBST(BinarySearchTree* bst) {
    bst->root = NULL;
}

TreeNode* insertRecursive(TreeNode* root, const char* data) {
    if (root == NULL) {
        return createNode(data);
    }
    
    int comparison = strcmp(data, root->data);
    
    if (comparison < 0) {
        root->left = insertRecursive(root->left, data);
    } else if (comparison > 0) {
        root->right = insertRecursive(root->right, data);
    }
    // If comparison == 0, data already exists, don't insert
    
    return root;
}

void insert(BinarySearchTree* bst, const char* data) {
    bst->root = insertRecursive(bst->root, data);
    printf("Inserted: %s\\n", data);
}

void inorderTraversal(TreeNode* node) {
    if (node != NULL) {
        inorderTraversal(node->left);
        printf("%s ", node->data);
        inorderTraversal(node->right);
    }
}

void displayInorder(BinarySearchTree* bst) {
    printf("Inorder traversal: ");
    inorderTraversal(bst->root);
    printf("\\n");
}

TreeNode* search(TreeNode* root, const char* data) {
    if (root == NULL || strcmp(root->data, data) == 0) {
        return root;
    }
    
    int comparison = strcmp(data, root->data);
    
    if (comparison < 0) {
        return search(root->left, data);
    } else {
        return search(root->right, data);
    }
}

void freeBST(TreeNode* root) {
    if (root != NULL) {
        freeBST(root->left);
        freeBST(root->right);
        free(root);
    }
}

// Inserted: "${params[0]}"`,
        array_access: `// Complete Safe Array Access in C
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

#define MAX_ARRAY_SIZE 100
#define MAX_STRING_SIZE 50

typedef struct {
    char items[MAX_ARRAY_SIZE][MAX_STRING_SIZE];
    int size;
    int capacity;
} SafeArray;

void initArray(SafeArray* array) {
    array->size = 0;
    array->capacity = MAX_ARRAY_SIZE;
}

bool isValidIndex(SafeArray* array, int index) {
    return index >= 0 && index < array->size;
}

char* safeGet(SafeArray* array, int index) {
    if (!isValidIndex(array, index)) {
        printf("Error: Index %d out of bounds! Array size is %d\\n", index, array->size);
        return NULL;
    }
    
    char* value = array->items[${params[0]}];
    printf("Accessed: %s at index %d\\n", value, index);
    return value; // "${params[1]}"
}

bool safeSet(SafeArray* array, int index, const char* value) {
    if (!isValidIndex(array, index)) {
        printf("Error: Index %d out of bounds! Array size is %d\\n", index, array->size);
        return false;
    }
    
    strcpy(array->items[index], value);
    printf("Set: %s at index %d\\n", value, index);
    return true;
}

bool append(SafeArray* array, const char* value) {
    if (array->size >= array->capacity) {
        printf("Error: Array is full! Cannot append more elements\\n");
        return false;
    }
    
    strcpy(array->items[array->size], value);
    array->size++;
    printf("Appended: %s at index %d\\n", value, array->size - 1);
    return true;
}

void display(SafeArray* array) {
    printf("Array elements: [");
    for (int i = 0; i < array->size; i++) {
        printf("%s", array->items[i]);
        if (i < array->size - 1) {
            printf(", ");
        }
    }
    printf("]\\n");
}

int getSize(SafeArray* array) {
    return array->size;
}

// Example usage
// SafeArray arr;
// initArray(&arr);
// char* result = safeGet(&arr, ${params[0]}); // "${params[1]}"`,
        linkedlist_insert: `// Complete Linked List Implementation in C
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct ListNode {
    char data[50];
    struct ListNode* next;
} ListNode;

typedef struct {
    ListNode* head;
    int size;
} LinkedList;

void initList(LinkedList* list) {
    list->head = NULL;
    list->size = 0;
}

ListNode* createNode(const char* data) {
    ListNode* newNode = (ListNode*)malloc(sizeof(ListNode));
    if (!newNode) {
        printf("Memory allocation failed!\\n");
        return NULL;
    }
    
    strcpy(newNode->data, data);
    newNode->next = NULL;
    return newNode;
}

void insert(LinkedList* list, const char* data) {
    ListNode* newNode = createNode(data);
    if (!newNode) return;
    
    if (list->head == NULL) {
        list->head = newNode;
    } else {
        ListNode* current = list->head;
        while (current->next != NULL) {
            current = current->next;
        }
        current->next = newNode;
    }
    
    list->size++;
    printf("Inserted: %s\\n", data);
}

void insertAt(LinkedList* list, int index, const char* data) {
    if (index < 0 || index > list->size) {
        printf("Error: Index %d out of bounds!\\n", index);
        return;
    }
    
    ListNode* newNode = createNode(data);
    if (!newNode) return;
    
    if (index == 0) {
        newNode->next = list->head;
        list->head = newNode;
    } else {
        ListNode* current = list->head;
        for (int i = 0; i < index - 1; i++) {
            current = current->next;
        }
        newNode->next = current->next;
        current->next = newNode;
    }
    
    list->size++;
    printf("Inserted %s at index %d\\n", data, index);
}

void display(LinkedList* list) {
    if (list->head == NULL) {
        printf("List is empty\\n");
        return;
    }
    
    printf("List: ");
    ListNode* current = list->head;
    while (current != NULL) {
        printf("%s", current->data);
        if (current->next != NULL) {
            printf(" -> ");
        }
        current = current->next;
    }
    printf(" -> NULL\\n");
}

int search(LinkedList* list, const char* data) {
    ListNode* current = list->head;
    int index = 0;
    
    while (current != NULL) {
        if (strcmp(current->data, data) == 0) {
            return index;
        }
        current = current->next;
        index++;
    }
    
    return -1; // Not found
}

void freeList(LinkedList* list) {
    ListNode* current = list->head;
    ListNode* next;
    
    while (current != NULL) {
        next = current->next;
        free(current);
        current = next;
    }
    
    list->head = NULL;
    list->size = 0;
}

int getSize(LinkedList* list) {
    return list->size;
}

// Usage: insert(&list, "${params[0]}");`,
        round_robin: `// Complete Round Robin Scheduler in C
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_PROCESSES 10
#define MAX_NAME_LENGTH 20

typedef struct {
    char name[MAX_NAME_LENGTH];
    int burstTime;
    int remainingTime;
    int waitingTime;
    int turnaroundTime;
    int priority;
} Process;

typedef struct {
    Process* processes[MAX_PROCESSES];
    int front;
    int rear;
    int count;
} ProcessQueue;

void initQueue(ProcessQueue* queue) {
    queue->front = 0;
    queue->rear = -1;
    queue->count = 0;
}

int isEmpty(ProcessQueue* queue) {
    return queue->count == 0;
}

int isFull(ProcessQueue* queue) {
    return queue->count == MAX_PROCESSES;
}

void enqueue(ProcessQueue* queue, Process* process) {
    if (isFull(queue)) {
        printf("Queue is full!\\n");
        return;
    }
    
    queue->rear = (queue->rear + 1) % MAX_PROCESSES;
    queue->processes[queue->rear] = process;
    queue->count++;
}

Process* dequeue(ProcessQueue* queue) {
    if (isEmpty(queue)) {
        return NULL;
    }
    
    Process* process = queue->processes[queue->front];
    queue->front = (queue->front + 1) % MAX_PROCESSES;
    queue->count--;
    return process;
}

void roundRobinScheduling(Process processes[], int numProcesses, int quantum) {
    ProcessQueue readyQueue;
    initQueue(&readyQueue);
    
    int currentTime = 0;
    int completed = 0;
    
    // Add all processes to ready queue
    for (int i = 0; i < numProcesses; i++) {
        processes[i].remainingTime = processes[i].burstTime;
        enqueue(&readyQueue, &processes[i]);
    }
    
    while (completed < numProcesses) {
        Process* currentProcess = dequeue(&readyQueue);
        if (!currentProcess) break;
        
        int currentProcessIndex = ${params[0]};
        
        printf("Context switch to: %s\\n", currentProcess->name);
        printf("Time quantum: %dms\\n", quantum);
        
        int executionTime = (currentProcess->remainingTime > quantum) ? quantum : currentProcess->remainingTime;
        currentProcess->remainingTime -= executionTime;
        currentTime += executionTime;
        
        if (currentProcess->remainingTime > 0) {
            enqueue(&readyQueue, currentProcess);
            printf("%s preempted, remaining: %dms\\n", currentProcess->name, currentProcess->remainingTime);
        } else {
            currentProcess->turnaroundTime = currentTime;
            currentProcess->waitingTime = currentProcess->turnaroundTime - currentProcess->burstTime;
            completed++;
            printf("%s completed\\n", currentProcess->name);
        }
    }
}

double calculateAverageWaitingTime(Process processes[], int numProcesses) {
    int totalWaiting = 0;
    for (int i = 0; i < numProcesses; i++) {
        totalWaiting += processes[i].waitingTime;
    }
    return (double)totalWaiting / numProcesses;
}

void displayProcessInfo(Process processes[], int numProcesses) {
    printf("\\nProcess Information:\\n");
    printf("Process\\tBurst Time\\tWaiting Time\\tTurnaround Time\\n");
    for (int i = 0; i < numProcesses; i++) {
        printf("%s\\t%d\\t\\t%d\\t\\t%d\\n", 
               processes[i].name, 
               processes[i].burstTime, 
               processes[i].waitingTime, 
               processes[i].turnaroundTime);
    }
}

// Current process: ${params[0]} with quantum ${timeQuantum}ms`,
        dijkstra: `// Complete Dijkstra's Algorithm in C
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <limits.h>
#include <stdbool.h>

#define MAX_VERTICES 10
#define MAX_NAME_LENGTH 10
#define INFINITY INT_MAX

typedef struct {
    char name[MAX_NAME_LENGTH];
    int distance;
    bool visited;
} Vertex;

typedef struct {
    int adjacencyMatrix[MAX_VERTICES][MAX_VERTICES];
    Vertex vertices[MAX_VERTICES];
    int numVertices;
} Graph;

void initGraph(Graph* graph) {
    graph->numVertices = 0;
    
    for (int i = 0; i < MAX_VERTICES; i++) {
        strcpy(graph->vertices[i].name, "");
        graph->vertices[i].distance = INFINITY;
        graph->vertices[i].visited = false;
        
        for (int j = 0; j < MAX_VERTICES; j++) {
            graph->adjacencyMatrix[i][j] = 0;
        }
    }
}

int findVertex(Graph* graph, const char* name) {
    for (int i = 0; i < graph->numVertices; i++) {
        if (strcmp(graph->vertices[i].name, name) == 0) {
            return i;
        }
    }
    return -1;
}

void addVertex(Graph* graph, const char* name) {
    if (graph->numVertices >= MAX_VERTICES) {
        printf("Maximum vertices reached!\\n");
        return;
    }
    
    if (findVertex(graph, name) != -1) {
        printf("Vertex %s already exists!\\n", name);
        return;
    }
    
    strcpy(graph->vertices[graph->numVertices].name, name);
    graph->vertices[graph->numVertices].distance = INFINITY;
    graph->vertices[graph->numVertices].visited = false;
    graph->numVertices++;
}

void addEdge(Graph* graph, const char* from, const char* to, int weight) {
    int fromIndex = findVertex(graph, from);
    int toIndex = findVertex(graph, to);
    
    if (fromIndex == -1 || toIndex == -1) {
        printf("One or both vertices not found!\\n");
        return;
    }
    
    graph->adjacencyMatrix[fromIndex][toIndex] = weight;
    graph->adjacencyMatrix[toIndex][fromIndex] = weight; // For undirected graph
}

int findMinDistanceVertex(Graph* graph) {
    int minDistance = INFINITY;
    int minVertex = -1;
    
    for (int i = 0; i < graph->numVertices; i++) {
        if (!graph->vertices[i].visited && graph->vertices[i].distance < minDistance) {
            minDistance = graph->vertices[i].distance;
            minVertex = i;
        }
    }
    
    return minVertex;
}

void dijkstra(Graph* graph, const char* startVertex) {
    int startIndex = findVertex(graph, startVertex);
    if (startIndex == -1) {
        printf("Start vertex not found!\\n");
        return;
    }
    
    // Initialize distances
    graph->vertices[startIndex].distance = 0;
    
    for (int count = 0; count < graph->numVertices; count++) {
        int currentVertex = findMinDistanceVertex(graph);
        if (currentVertex == -1) break;
        
        graph->vertices[currentVertex].visited = true;
        
        printf("Visiting: %s, Distance: %d\\n", 
               graph->vertices[currentVertex].name, 
               graph->vertices[currentVertex].distance);
        
        // Update distances of adjacent vertices
        for (int i = 0; i < graph->numVertices; i++) {
            if (!graph->vertices[i].visited && 
                graph->adjacencyMatrix[currentVertex][i] != 0 && 
                graph->vertices[currentVertex].distance != INFINITY) {
                
                int newDistance = graph->vertices[currentVertex].distance + 
                                graph->adjacencyMatrix[currentVertex][i];
                
                if (newDistance < graph->vertices[i].distance) {
                    graph->vertices[i].distance = newDistance;
                }
            }
        }
    }
}

void printShortestPaths(Graph* graph, const char* startVertex) {
    printf("\\nShortest distances from %s:\\n", startVertex);
    for (int i = 0; i < graph->numVertices; i++) {
        printf("To %s: ", graph->vertices[i].name);
        if (graph->vertices[i].distance == INFINITY) {
            printf("No path\\n");
        } else {
            printf("%d\\n", graph->vertices[i].distance);
        }
    }
}

// Currently visiting node: "${params[0]}"`,
        stack_pop: `// Complete Stack Pop Operation in C
char* pop(Stack* stack) {
    if (isEmpty(stack)) {
        printf("Stack underflow! Cannot pop from empty stack\\n");
        return NULL;
    }
    
    char* poppedItem = stack->items[stack->top];
    printf("Popped: %s\\n", poppedItem);
    stack->top--;
    return poppedItem; // "${params[0]}"
}

bool isEmpty(Stack* stack) {
    return stack->top == -1;
}`,
        stack_peek: `// Complete Stack Peek Operation in C
char* peek(Stack* stack) {
    if (isEmpty(stack)) {
        printf("Stack is empty! Cannot peek\\n");
        return NULL;
    }
    
    char* topItem = stack->items[stack->top];
    printf("Top item: %s\\n", topItem);
    return topItem; // "${params[0]}"
}`,
        array_insert: `// Complete Array Insert Operation in C
bool insertAt(SafeArray* array, int index, const char* value) {
    if (index < 0 || index > array->size) {
        printf("Error: Index %d out of bounds!\\n", index);
        return false;
    }
    
    if (array->size >= array->capacity) {
        printf("Error: Array is full!\\n");
        return false;
    }
    
    // Shift elements to the right
    for (int i = array->size; i > ${params[0]}; i--) {
        strcpy(array->items[i], array->items[i - 1]);
    }
    
    strcpy(array->items[${params[0]}], "${params[1]}");
    array->size++;
    printf("Inserted %s at index %d\\n", value, index);
    return true;
}

// Usage example
// SafeArray arr;
// initArray(&arr);
// insertAt(&arr, ${params[0]}, "${params[1]}");`,
        array_delete: `// Complete Array Delete Operation in C
char* deleteAt(SafeArray* array, int index) {
    if (index < 0 || index >= array->size) {
        printf("Error: Index %d out of bounds!\\n", index);
        return NULL;
    }
    
    static char deletedItem[MAX_STRING_SIZE];
    strcpy(deletedItem, array->items[${params[0]}]);
    
    // Shift elements to the left
    for (int i = ${params[0]}; i < array->size - 1; i++) {
        strcpy(array->items[i], array->items[i + 1]);
    }
    
    array->size--;
    printf("Deleted %s from index %d\\n", deletedItem, index);
    return deletedItem; // "${params[1]}"
}`
      }
    };
    
    return codeTemplates[selectedLanguage as keyof typeof codeTemplates][operation] || "// Complete code implementation not available";
  };

  const renderVisualization = () => {
    if (topic === "stacks") {
      return (
        <div className="space-y-4">
          <div className="flex flex-col-reverse items-center space-y-reverse space-y-2 min-h-[300px] justify-end">
            {stackItems.map((item, index) => (
              <div
                key={index}
                className={`w-32 h-12 bg-primary/20 border-2 border-primary rounded-lg flex items-center justify-center font-mono font-bold transition-all duration-500 ${
                  index === stackItems.length - 1 ? 'animate-push tech-glow' : ''
                }`}
              >
                {item}
              </div>
            ))}
            <div className="text-sm text-muted-foreground">← Top</div>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            <div className="flex gap-2">
              <Input
                placeholder="Enter value"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="w-32"
              />
              <Button onClick={handleStackPush} className="tech-gradient">
                <Plus className="h-4 w-4 mr-1" />
                Push
              </Button>
            </div>
            <Button onClick={handleStackPop} variant="outline">
              <Minus className="h-4 w-4 mr-1" />
              Pop
            </Button>
            <Button onClick={handleStackPeek} variant="outline">
              <Eye className="h-4 w-4 mr-1" />
              Peek
            </Button>
          </div>
        </div>
      );
    }

    if (topic === "arrays") {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-1 min-h-[100px]">
            {arrayItems.map((item, index) => (
              <div key={index} className="text-center">
                <div
                  className={`w-16 h-16 bg-accent/20 border-2 border-accent rounded-lg flex items-center justify-center font-mono font-bold transition-all duration-500 ${
                    animatingIndex === index ? 'animate-push tech-glow' : ''
                  }`}
                >
                  {item}
                </div>
                <div className="text-xs text-muted-foreground mt-1">[{index}]</div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            <div className="flex gap-2">
              <Input
                placeholder="Value"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="w-20"
              />
              <Input
                placeholder="Index"
                value={arrayIndex}
                onChange={(e) => setArrayIndex(e.target.value)}
                className="w-20"
                type="number"
              />
              <Button onClick={handleArrayInsert} className="tech-gradient">
                <Plus className="h-4 w-4 mr-1" />
                Insert
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Index"
                value={arrayIndex}
                onChange={(e) => setArrayIndex(e.target.value)}
                className="w-20"
                type="number"
              />
              <Button onClick={handleArrayDelete} variant="outline">
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
              <Button onClick={handleArrayAccess} variant="outline">
                <Eye className="h-4 w-4 mr-1" />
                Access
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (topic === "linked-lists") {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-4 min-h-[150px] overflow-x-auto">
            {linkedListItems.map((node, index) => (
              <div key={node.id} className="flex items-center">
                <div className="text-center">
                  <div className="w-20 h-16 bg-purple-500/20 border-2 border-purple-500 rounded-lg flex flex-col items-center justify-center font-mono font-bold">
                    <div className="text-sm">{node.value}</div>
                    <div className="text-xs text-muted-foreground">#{node.id}</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Node {index}</div>
                </div>
                {index < linkedListItems.length - 1 && (
                  <div className="flex items-center mx-2">
                    <div className="w-8 h-0.5 bg-purple-500"></div>
                    <div className="w-0 h-0 border-l-4 border-l-purple-500 border-y-2 border-y-transparent"></div>
                  </div>
                )}
              </div>
            ))}
            <div className="text-xs text-muted-foreground">→ NULL</div>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Input
              placeholder="Enter value"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="w-32"
            />
            <Button onClick={handleLinkedListInsert} className="tech-gradient">
              <Plus className="h-4 w-4 mr-1" />
              Insert
            </Button>
          </div>
        </div>
      );
    }

    if (topic === "processes") {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 min-h-[200px]">
            {['ready', 'running', 'waiting', 'terminated'].map((state) => (
              <div key={state} className="border-2 border-dashed border-muted-foreground rounded-lg p-4">
                <h4 className="text-sm font-medium text-center mb-2 capitalize">{state}</h4>
                <div className="space-y-2">
                  {processes.filter(p => p.state === state).map((process) => (
                    <div
                      key={process.id}
                      className={`p-2 rounded-lg text-center text-sm font-mono transition-all duration-500 ${
                        process.state === 'ready' ? 'bg-yellow-500/20 border border-yellow-500' :
                        process.state === 'running' ? 'bg-green-500/20 border border-green-500 animate-pulse' :
                        process.state === 'waiting' ? 'bg-blue-500/20 border border-blue-500' :
                        'bg-red-500/20 border border-red-500'
                      }`}
                    >
                      <div>{process.name}</div>
                      <div className="text-xs">Burst: {process.burstTime}ms</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button onClick={handleProcessScheduling} className="tech-gradient">
              <Clock className="h-4 w-4 mr-1" />
              Next Process
            </Button>
          </div>
        </div>
      );
    }

    if (topic === "scheduling") {
      return (
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Round Robin Queue (Time Quantum: {timeQuantum}ms)</h4>
            <div className="flex space-x-2 overflow-x-auto">
              {processes.map((process, index) => (
                <div
                  key={process.id}
                  className={`min-w-20 h-16 rounded-lg flex flex-col items-center justify-center text-sm font-mono transition-all duration-500 ${
                    index === currentProcess ? 'bg-green-500/20 border-2 border-green-500 animate-pulse' : 'bg-muted-foreground/20 border border-muted-foreground'
                  }`}
                >
                  <div>{process.name}</div>
                  <div className="text-xs">{process.burstTime}ms</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2 justify-center items-center">
            <Input
              placeholder="Quantum"
              value={timeQuantum}
              onChange={(e) => setTimeQuantum(parseInt(e.target.value) || 2)}
              className="w-24"
              type="number"
            />
            <Button onClick={handleProcessScheduling} className="tech-gradient">
              <Zap className="h-4 w-4 mr-1" />
              Context Switch
            </Button>
          </div>
        </div>
      );
    }

    if (topic === "queues") {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2 min-h-[150px] bg-muted/20 rounded-lg p-4">
            <div className="text-sm text-muted-foreground">FRONT →</div>
            {queueItems.map((item, index) => (
              <div
                key={index}
                className={`w-20 h-16 bg-blue-500/20 border-2 border-blue-500 rounded-lg flex items-center justify-center font-mono font-bold transition-all duration-500 ${
                  index === 0 ? 'animate-pulse tech-glow' : ''
                }`}
              >
                {item}
              </div>
            ))}
            <div className="text-sm text-muted-foreground">← REAR</div>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Input
              placeholder="Enter value"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="w-32"
            />
            <Button onClick={handleQueueEnqueue} className="tech-gradient">
              <Plus className="h-4 w-4 mr-1" />
              Enqueue
            </Button>
            <Button onClick={handleQueueDequeue} variant="outline">
              <Minus className="h-4 w-4 mr-1" />
              Dequeue
            </Button>
            <Button onClick={handleQueueFront} variant="outline">
              <Eye className="h-4 w-4 mr-1" />
              Front
            </Button>
          </div>
        </div>
      );
    }

    if (topic === "trees") {
      return (
        <div className="space-y-4">
          <div className="relative bg-muted/20 rounded-lg p-6 min-h-[400px] overflow-hidden">
            <svg viewBox="0 0 400 300" className="w-full h-full">
              {/* Tree edges */}
              <g>
                <line x1="200" y1="70" x2="100" y2="140" stroke="hsl(var(--muted-foreground))" strokeWidth="2" />
                <line x1="200" y1="70" x2="300" y2="140" stroke="hsl(var(--muted-foreground))" strokeWidth="2" />
                <line x1="100" y1="140" x2="50" y2="210" stroke="hsl(var(--muted-foreground))" strokeWidth="2" />
                <line x1="100" y1="140" x2="150" y2="210" stroke="hsl(var(--muted-foreground))" strokeWidth="2" />
              </g>
              
              {/* Tree nodes */}
              {treeNodes.map((node) => (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="25"
                    fill="hsl(var(--primary) / 0.2)"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                  <text
                    x={node.x}
                    y={node.y + 5}
                    fill="hsl(var(--foreground))"
                    fontSize="14"
                    textAnchor="middle"
                    className="font-bold"
                  >
                    {node.value}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Input
              placeholder="Enter value"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="w-32"
            />
            <Button onClick={handleTreeInsert} className="tech-gradient">
              <Plus className="h-4 w-4 mr-1" />
              Insert
            </Button>
            <Button onClick={handleTreeTraverse} variant="outline">
              <Play className="h-4 w-4 mr-1" />
              Traverse
            </Button>
            <Button onClick={handleTreeSearch} variant="outline">
              <Eye className="h-4 w-4 mr-1" />
              Search
            </Button>
          </div>
        </div>
      );
    }

    if (topic === "graphs") {
      const graphEdges = [
        {from: 'A', to: 'B'}, {from: 'A', to: 'D'},
        {from: 'B', to: 'C'}, {from: 'B', to: 'E'},
        {from: 'C', to: 'E'}, {from: 'D', to: 'E'}
      ];
      
      return (
        <div className="space-y-4">
          <div className="relative bg-muted/20 rounded-lg p-6 min-h-[300px]">
            <svg viewBox="0 0 500 300" className="w-full h-full">
              {/* Graph edges */}
              {graphEdges.map((edge, index) => {
                const fromNode = graphNodes.find(n => n.id === edge.from);
                const toNode = graphNodes.find(n => n.id === edge.to);
                if (!fromNode || toNode) return null;
                
                return (
                  <line
                    key={index}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth="2"
                  />
                );
              })}
              
              {/* Graph nodes */}
              {graphNodes.map((node) => (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="20"
                    fill={node.visited ? "hsl(var(--primary) / 0.3)" : "hsl(var(--background))"}
                    stroke={node.visited ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                    strokeWidth="2"
                    className={node.visited ? "animate-pulse" : ""}
                  />
                  <text
                    x={node.x}
                    y={node.y + 5}
                    fill="hsl(var(--foreground))"
                    fontSize="14"
                    textAnchor="middle"
                    className="font-bold"
                  >
                    {node.id}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button onClick={handleGraphDFS} className="tech-gradient">
              <Play className="h-4 w-4 mr-1" />
              DFS
            </Button>
            <Button onClick={handleGraphBFS} variant="outline">
              <Zap className="h-4 w-4 mr-1" />
              BFS
            </Button>
            <Button onClick={handleGraphReset} variant="outline">
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      );
    }

    if (topic === "dijkstra") {
      const edges = [
        {from: 'A', to: 'B', weight: 4},
        {from: 'A', to: 'D', weight: 2},
        {from: 'B', to: 'C', weight: 3},
        {from: 'D', to: 'C', weight: 7},
        {from: 'B', to: 'D', weight: 1}
      ];
      
      return (
        <div className="space-y-4">
          <div className="relative bg-muted/20 rounded-lg p-6 min-h-[300px]">
            <svg viewBox="0 0 400 200" className="w-full h-full">
              {/* Edges */}
              {edges.map((edge, index) => {
                const fromNode = networkNodes.find(n => n.id === edge.from);
                const toNode = networkNodes.find(n => n.id === edge.to);
                if (!fromNode || !toNode) return null;
                
                return (
                  <g key={index}>
                    <line
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth="2"
                    />
                    <text
                      x={(fromNode.x + toNode.x) / 2}
                      y={(fromNode.y + toNode.y) / 2 - 5}
                      fill="hsl(var(--foreground))"
                      fontSize="12"
                      textAnchor="middle"
                      className="font-mono"
                    >
                      {edge.weight}
                    </text>
                  </g>
                );
              })}
              
              {/* Nodes */}
              {networkNodes.map((node) => (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="20"
                    fill={node.visited ? "hsl(var(--primary) / 0.2)" : "hsl(var(--background))"}
                    stroke={node.visited ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                    strokeWidth="2"
                    className={node.visited ? "animate-pulse" : ""}
                  />
                  <text
                    x={node.x}
                    y={node.y + 5}
                    fill="hsl(var(--foreground))"
                    fontSize="14"
                    textAnchor="middle"
                    className="font-bold"
                  >
                    {node.id}
                  </text>
                  <text
                    x={node.x}
                    y={node.y + 35}
                    fill="hsl(var(--muted-foreground))"
                    fontSize="12"
                    textAnchor="middle"
                    className="font-mono"
                  >
                    {node.distance === Infinity ? '∞' : node.distance}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button onClick={handleDijkstraStep} className="tech-gradient">
              <Play className="h-4 w-4 mr-1" />
              Next Step
            </Button>
            <Button 
              onClick={() => {
                setNetworkNodes(prev => prev.map(node => ({...node, visited: false, distance: node.id === 'A' ? 0 : Infinity})));
                setCodeSnippet("");
              }} 
              variant="outline"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center py-12">
        <p className="text-lg">Visualization for {currentTopic.title} coming soon!</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to={`/course/${courseId}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{currentTopic.title}</h1>
            <p className="text-muted-foreground mt-1">{currentTopic.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-blue-500">{currentTopic.realLifeExample}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className="bg-green-500/10 text-green-500">Interactive Learning</Badge>
            <Badge className={`${
              currentTopic.category === 'dsa' ? 'bg-purple-500/10 text-purple-500' :
              currentTopic.category === 'os' ? 'bg-blue-500/10 text-blue-500' :
              'bg-orange-500/10 text-orange-500'
            }`}>
              {currentTopic.category.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visualization */}
          <div className="lg:col-span-2">
            <Card className="tech-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Interactive Visualization
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderVisualization()}
              </CardContent>
            </Card>
          </div>

          {/* Controls & Code */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Operations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentTopic.operations.map((op, index) => (
                    <Badge key={index} variant="outline" className="mr-2">
                      {op}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="h-5 w-5" />
                    Code Snippet
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.icon} {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setCodeSnippet("")}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm min-h-[100px]">
                  {codeSnippet || `// Perform operations to see ${languages.find(l => l.value === selectedLanguage)?.label} code here`}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Evaluation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Accuracy</span>
                    <span className="text-green-500">95%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Efficiency</span>
                    <span className="text-blue-500">88%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Understanding</span>
                    <span className="text-purple-500">92%</span>
                  </div>
                  <div className="pt-2 text-center">
                    <Badge className="tech-gradient text-white">
                      Current Score: A+
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimationLearning;