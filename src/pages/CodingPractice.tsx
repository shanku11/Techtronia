import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ArrowLeft, Play, RotateCcw, CheckCircle, XCircle, Code, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fetchWithAuth } from "@/lib/api";
import MonacoCodeEditor from "@/components/MonacoCodeEditor";

// ─── Challenge Data ────────────────────────────────────────────────────────────

const challenges = [
  {
    id: 1, title: "Implement Stack Push Operation",
    description: "Write a function to push an element onto a stack and return the updated stack.\n\nA stack follows the Last-In-First-Out (LIFO) principle. The push operation adds an element to the top of the stack.",
    difficulty: "Easy", points: 50, topic: "stack",
    constraints: ["1 ≤ stack.length ≤ 1000", "Element can be any integer"],
    examples: [
      { input: "stack = [1, 2, 3], element = 4", output: "[1, 2, 3, 4]", explanation: "4 is pushed to the top of the stack" },
      { input: "stack = [], element = 1", output: "[1]", explanation: "Single element on empty stack" }
    ]
  },
  {
    id: 2, title: "Array Element Access",
    description: "Create a function that safely accesses an array element by index with bounds checking.\n\nReturn null if the index is out of bounds instead of throwing an error.",
    difficulty: "Easy", points: 40, topic: "array",
    constraints: ["0 ≤ index", "Array can be empty"],
    examples: [
      { input: "array = [10, 20, 30], index = 1", output: "20", explanation: "Valid index returns element" },
      { input: "array = [10, 20, 30], index = 5", output: "null", explanation: "Out-of-bounds returns null" }
    ]
  },
  {
    id: 3, title: "Linked List Insertion",
    description: "Implement a function to insert a node at the end of a linked list.\n\nIf the list is empty (head is null), the new node becomes the head.",
    difficulty: "Medium", points: 60, topic: "linkedlist",
    constraints: ["0 ≤ list length ≤ 10000", "Value can be any integer"],
    examples: [
      { input: "list = 1→2→3, value = 4", output: "1→2→3→4", explanation: "Node inserted at tail" },
      { input: "list = null, value = 1", output: "1", explanation: "Node becomes the head" }
    ]
  },
  {
    id: 4, title: "Queue Operations",
    description: "Implement enqueue and dequeue operations for a queue data structure.\n\nA queue follows First-In-First-Out (FIFO). Enqueue adds to the rear, dequeue removes from the front.",
    difficulty: "Easy", points: 50, topic: "queue",
    constraints: ["Queue can be empty", "1 ≤ elements ≤ 1000"],
    examples: [
      { input: "queue = [1, 2, 3], enqueue(4)", output: "[1, 2, 3, 4]", explanation: "4 added to rear" },
      { input: "queue = [1, 2, 3], dequeue()", output: "[2, 3]", explanation: "1 removed from front" }
    ]
  },
  {
    id: 5, title: "Binary Tree Traversal",
    description: "Implement inorder traversal (Left → Root → Right) for a binary tree.\n\nReturn the values in a list in inorder sequence.",
    difficulty: "Medium", points: 70, topic: "tree",
    constraints: ["0 ≤ nodes ≤ 1000", "Node values can be any integer"],
    examples: [
      { input: "root=50, left=30, right=70", output: "[30, 50, 70]", explanation: "Left, root, then right" },
      { input: "single node = 10", output: "[10]", explanation: "Single node is its own inorder" }
    ]
  },
  {
    id: 6, title: "Graph DFS Implementation",
    description: "Implement depth-first search (DFS) traversal for an adjacency-list graph.\n\nVisit all reachable nodes from the starting node, tracking visited nodes to avoid cycles.",
    difficulty: "Hard", points: 80, topic: "graph",
    constraints: ["Graph may have cycles", "Use a visited set to avoid infinite loops"],
    examples: [
      { input: "graph: A→[B,C], B→[D], start=A", output: "A → B → D → C", explanation: "DFS explores depth first" },
      { input: "disconnected graph", output: "Handle disconnected components", explanation: "Only reachable nodes are visited" }
    ]
  },
  {
    id: 7, title: "Round-Robin Scheduling",
    description: "Simulate round-robin CPU scheduling for multiple processes.\n\nEach process gets a fixed time quantum. If not finished, it goes back to the end of the queue.",
    difficulty: "Hard", points: 90, topic: "process",
    constraints: ["1 ≤ quantum ≤ 100", "1 ≤ burst_time ≤ 1000"],
    examples: [
      { input: "P1(5ms), P2(3ms), quantum=2ms", output: "P1→P2→P1→P2→P1", explanation: "Each gets 2ms turns" },
      { input: "P1(4ms), quantum=2ms", output: "P1→P1", explanation: "Single process finishes in 2 turns" }
    ]
  },
  {
    id: 8, title: "Dijkstra's Shortest Path",
    description: "Implement Dijkstra's algorithm to find the shortest path from a source node to all other nodes in a weighted graph.",
    difficulty: "Hard", points: 100, topic: "dijkstra",
    constraints: ["All edge weights must be non-negative", "Graph can be directed or undirected"],
    examples: [
      { input: "A→B(1), A→C(4), B→D(2), source=A", output: "{A:0, B:1, C:4, D:3}", explanation: "Shortest distances from A" },
      { input: "No path", output: "Infinity", explanation: "Unreachable nodes get ∞" }
    ]
  },
  {
    id: 9, title: "First-Fit Memory Allocation",
    description: "Implement the first-fit memory allocation algorithm.\n\nFind the first memory block large enough for the process and allocate it there.",
    difficulty: "Medium", points: 65, topic: "memory",
    constraints: ["1 ≤ block sizes ≤ 10000", "Return -1 if no block fits"],
    examples: [
      { input: "blocks=[100,500,200], process=212", output: "Allocated at block 2 (500)", explanation: "First block that fits" },
      { input: "blocks=[100,50], process=200", output: "-1 (Cannot allocate)", explanation: "No block is large enough" }
    ]
  }
];

// ─── Code Templates ─────────────────────────────────────────────────────────────

const codeTemplates: Record<string, Record<string, string>> = {
  javascript: {
    stack: `function pushElement(stack, element) {
  // Your code here
  return stack;
}

// Test
const stack = [1, 2, 3];
console.log(pushElement(stack, 4));`,
    array: `function safeAccess(array, index) {
  // Your code here
  return null;
}

console.log(safeAccess([10, 20, 30], 1));`,
    linkedlist: `class Node {
  constructor(data) { this.data = data; this.next = null; }
}

function insertAtEnd(head, value) {
  // Your code here
  return head;
}`,
    queue: `function enqueue(queue, element) {
  // Your code here
  return queue;
}

console.log(enqueue([1, 2, 3], 4));`,
    tree: `class TreeNode {
  constructor(val) { this.val = val; this.left = null; this.right = null; }
}

function inorderTraversal(root) {
  const result = [];
  // Your code here
  return result;
}`,
    graph: `function dfs(graph, node, visited = new Set()) {
  // Your code here
  return visited;
}

const graph = { A: ['B','C'], B: ['D'], C: [], D: [] };
console.log([...dfs(graph, 'A')]);`,
    process: `function roundRobin(processes, quantum) {
  // processes: [{name, burstTime}]
  // Your code here
}

roundRobin([{name:'P1',burstTime:5},{name:'P2',burstTime:3}], 2);`,
    dijkstra: `function dijkstra(graph, start) {
  const distances = {};
  // Your code here
  return distances;
}

const graph = { A: {B:1,C:4}, B: {D:2}, C: {D:5}, D: {} };
console.log(dijkstra(graph, 'A'));`,
    memory: `function firstFit(blocks, processSize) {
  // Your code here
  return -1;
}

console.log(firstFit([100, 500, 200, 300, 600], 212));`
  },
  python: {
    stack: `def push_element(stack, element):
    # Your code here
    return stack

print(push_element([1, 2, 3], 4))`,
    array: `def safe_access(array, index):
    # Your code here
    return None

print(safe_access([10, 20, 30], 1))`,
    linkedlist: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

def insert_at_end(head, value):
    # Your code here
    return head`,
    queue: `from collections import deque

def enqueue(queue, element):
    # Your code here
    return queue

queue = deque([1, 2, 3])
print(list(enqueue(queue, 4)))`,
    tree: `class TreeNode:
    def __init__(self, val):
        self.val = val; self.left = None; self.right = None

def inorder_traversal(root):
    result = []
    # Your code here
    return result`,
    graph: `def dfs(graph, node, visited=None):
    if visited is None: visited = set()
    # Your code here
    return visited

graph = {'A':['B','C'],'B':['D'],'C':[],'D':[]}
print(dfs(graph, 'A'))`,
    process: `def round_robin(processes, quantum):
    # processes: list of (name, burst_time)
    # Your code here
    pass

round_robin([('P1',5),('P2',3)], 2)`,
    dijkstra: `import heapq

def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    # Your code here
    return distances`,
    memory: `def first_fit(blocks, process_size):
    # Your code here
    return -1

print(first_fit([100,500,200,300,600], 212))`
  },
  java: {
    stack: `import java.util.*;

public class Solution {
    public static List<Integer> pushElement(List<Integer> stack, int element) {
        // Your code here
        return stack;
    }
    public static void main(String[] args) {
        List<Integer> stack = new ArrayList<>(Arrays.asList(1, 2, 3));
        System.out.println(pushElement(stack, 4));
    }
}`,
    array: `public class Solution {
    public static Integer safeAccess(int[] array, int index) {
        // Your code here
        return null;
    }
    public static void main(String[] args) {
        int[] arr = {10, 20, 30};
        System.out.println(safeAccess(arr, 1));
    }
}`,
    linkedlist: `class Node { int data; Node next; Node(int d){data=d;} }

public class Solution {
    public static Node insertAtEnd(Node head, int value) {
        // Your code here
        return head;
    }
}`,
    queue: `import java.util.*;

public class Solution {
    public static Queue<Integer> enqueue(Queue<Integer> queue, int element) {
        // Your code here
        return queue;
    }
}`,
    tree: `import java.util.*;

class TreeNode { int val; TreeNode left, right; TreeNode(int v){val=v;} }

public class Solution {
    public static List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        // Your code here
        return result;
    }
}`,
    graph: `import java.util.*;

public class Solution {
    public static void dfs(Map<String,List<String>> graph, String node, Set<String> visited) {
        // Your code here
    }
}`,
    process: `import java.util.*;

class Process { String name; int burstTime; Process(String n, int b){name=n;burstTime=b;} }

public class Solution {
    public static void schedule(List<Process> processes, int quantum) {
        // Your code here
    }
}`,
    dijkstra: `import java.util.*;

public class Solution {
    public static Map<String,Integer> dijkstra(Map<String,Map<String,Integer>> graph, String start) {
        Map<String,Integer> distances = new HashMap<>();
        // Your code here
        return distances;
    }
}`,
    memory: `public class Solution {
    public static int firstFit(int[] blocks, int processSize) {
        // Your code here
        return -1;
    }
    public static void main(String[] args) {
        int[] blocks = {100,500,200,300,600};
        System.out.println(firstFit(blocks, 212));
    }
}`
  },
  cpp: {
    stack: `#include <iostream>
#include <vector>
using namespace std;

vector<int> pushElement(vector<int> stack, int element) {
    // Your code here
    return stack;
}

int main() {
    vector<int> stack = {1, 2, 3};
    auto result = pushElement(stack, 4);
    for(int v : result) cout << v << " ";
}`,
    array: `#include <iostream>
#include <vector>
using namespace std;

int safeAccess(vector<int> arr, int index) {
    // Your code here
    return -1;
}

int main() {
    cout << safeAccess({10,20,30}, 1);
}`,
    linkedlist: `#include <iostream>
using namespace std;

struct Node { int data; Node* next; Node(int v):data(v),next(nullptr){} };

Node* insertAtEnd(Node* head, int value) {
    // Your code here
    return head;
}`,
    queue: `#include <iostream>
#include <queue>
using namespace std;

queue<int> enqueue(queue<int> q, int element) {
    // Your code here
    return q;
}`,
    tree: `#include <vector>
using namespace std;

struct TreeNode { int val; TreeNode *left,*right; TreeNode(int x):val(x),left(nullptr),right(nullptr){} };

vector<int> inorderTraversal(TreeNode* root) {
    vector<int> result;
    // Your code here
    return result;
}`,
    graph: `#include <map>
#include <vector>
#include <set>
using namespace std;

void dfs(map<char,vector<char>>& graph, char node, set<char>& visited) {
    // Your code here
}`,
    process: `#include <vector>
#include <string>
using namespace std;

struct Process { string name; int burstTime; };

void roundRobin(vector<Process> processes, int quantum) {
    // Your code here
}`,
    dijkstra: `#include <map>
#include <limits>
using namespace std;

map<char,int> dijkstra(map<char,map<char,int>>& graph, char start) {
    map<char,int> distances;
    // Your code here
    return distances;
}`,
    memory: `#include <vector>
using namespace std;

int firstFit(vector<int> blocks, int processSize) {
    // Your code here
    return -1;
}`
  }
};

const difficultyColor: Record<string, string> = {
  Easy: "text-green-500 bg-green-500/10 border-green-500/20",
  Medium: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  Hard: "text-red-500 bg-red-500/10 border-red-500/20",
};

const languages = [
  { value: "javascript", label: "JavaScript", icon: "🟨" },
  { value: "python", label: "Python", icon: "🐍" },
  { value: "java", label: "Java", icon: "☕" },
  { value: "cpp", label: "C++", icon: "⚡" },
];

// ─── Component ─────────────────────────────────────────────────────────────────

const CodingPractice = () => {
  const { courseId } = useParams();
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [selectedChallenge, setSelectedChallenge] = useState(challenges[0]);
  const [code, setCode] = useState(codeTemplates.javascript.stack);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<Array<{ test: string; passed: boolean }>>([]);
  const [activeTab, setActiveTab] = useState<"description" | "output">("description");
  const [expandedExample, setExpandedExample] = useState<number | null>(0);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setCode(codeTemplates[language]?.[selectedChallenge.topic] ?? "// Start coding...");
  };

  const handleChallengeChange = (challenge: typeof challenges[0]) => {
    setSelectedChallenge(challenge);
    setCode(codeTemplates[selectedLanguage]?.[challenge.topic] ?? "// Start coding...");
    setOutput("");
    setTestResults([]);
    setActiveTab("description");
  };

  const runCode = async () => {
    setIsRunning(true);
    setActiveTab("output");
    setOutput("🤖 AI is evaluating your code...");

    try {
      const data = await fetchWithAuth("/ai/evaluate-code", {
        method: 'POST',
        body: JSON.stringify({ code, language: selectedLanguage, challenge: selectedChallenge.title }),
      });

      if (!data.evaluation) {
        toast.error("Failed to evaluate code. Please try again.");
        setOutput("❌ AI evaluation failed. Please try again.");
        setIsRunning(false);
        return;
      }

      const { evaluation, score } = data;
      setOutput(`✅ Score: ${score}/100\n\n${evaluation}`);

      const passed = Math.round((score / 100) * 3);
      setTestResults([
        { test: "Basic functionality", passed: passed >= 1 },
        { test: "Edge case handling", passed: passed >= 2 },
        { test: "Code quality & best practices", passed: passed >= 3 },
      ]);

      const xpGained = Math.round(selectedChallenge.points * (score / 100));
      toast.success(`Evaluation complete! Score: ${score}/100 · +${xpGained} XP`);
    } catch (err) {
      console.error(err);
      setOutput("❌ An error occurred during evaluation.");
      toast.error("Failed to evaluate code.");
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(codeTemplates[selectedLanguage]?.[selectedChallenge.topic] ?? "");
    setOutput("");
    setTestResults([]);
    setActiveTab("description");
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* ── Top Bar ── */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-card flex-shrink-0">
        <Link to={`/course/${courseId}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        {/* Challenge tabs */}
        <div className="flex items-center gap-1 overflow-x-auto flex-1 min-w-0">
          {challenges.map((c) => (
            <button
              key={c.id}
              onClick={() => handleChallengeChange(c)}
              className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                selectedChallenge.id === c.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {c.id}. {c.title}
            </button>
          ))}
        </div>

        {/* Language + actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="h-8 w-36 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((l) => (
                <SelectItem key={l.value} value={l.value} className="text-xs">
                  {l.icon} {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={resetCode}>
            <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
          </Button>
          <Button
            size="sm"
            className="h-8 text-xs bg-green-600 hover:bg-green-500 text-white"
            onClick={runCode}
            disabled={isRunning}
          >
            {isRunning ? (
              <><Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> Running...</>
            ) : (
              <><Play className="h-3.5 w-3.5 mr-1" /> Run & Analyze</>
            )}
          </Button>
        </div>
      </div>

      {/* ── Split Panel ── */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">

          {/* ── LEFT: Problem Description ── */}
          <ResizablePanel defaultSize={38} minSize={25} maxSize={55}>
            <div className="h-full flex flex-col overflow-hidden">
              {/* Problem header */}
              <div className="px-5 pt-4 pb-3 border-b border-border flex-shrink-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-muted-foreground">{selectedChallenge.id}.</span>
                  <h2 className="text-base font-bold">{selectedChallenge.title}</h2>
                </div>
                <Badge className={`text-xs border ${difficultyColor[selectedChallenge.difficulty]}`} variant="outline">
                  {selectedChallenge.difficulty}
                </Badge>
                <span className="ml-2 text-xs text-muted-foreground">{selectedChallenge.points} XP</span>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border flex-shrink-0">
                {(["description", "output"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-xs font-medium capitalize transition-colors border-b-2 -mb-px ${
                      activeTab === tab
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                    {tab === "output" && testResults.length > 0 && (
                      <span className={`ml-1.5 px-1 rounded text-[10px] font-bold ${
                        testResults.every(r => r.passed) ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                      }`}>
                        {testResults.filter(r => r.passed).length}/{testResults.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {activeTab === "description" ? (
                  <>
                    {/* Description */}
                    <div>
                      <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/90">
                        {selectedChallenge.description}
                      </p>
                    </div>

                    {/* Examples */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Examples</h3>
                      {selectedChallenge.examples.map((ex, i) => (
                        <div key={i} className="border border-border rounded-lg overflow-hidden">
                          <button
                            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium hover:bg-muted/50 transition-colors"
                            onClick={() => setExpandedExample(expandedExample === i ? null : i)}
                          >
                            <span>Example {i + 1}</span>
                            {expandedExample === i ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                          </button>
                          {expandedExample === i && (
                            <div className="px-3 pb-3 space-y-2 border-t border-border">
                              <div className="mt-2">
                                <span className="text-xs text-muted-foreground font-medium">Input:</span>
                                <code className="block mt-1 text-xs bg-muted px-2 py-1.5 rounded font-mono">{ex.input}</code>
                              </div>
                              <div>
                                <span className="text-xs text-muted-foreground font-medium">Output:</span>
                                <code className="block mt-1 text-xs bg-muted px-2 py-1.5 rounded font-mono">{ex.output}</code>
                              </div>
                              {ex.explanation && (
                                <div>
                                  <span className="text-xs text-muted-foreground font-medium">Explanation:</span>
                                  <p className="text-xs text-muted-foreground mt-0.5">{ex.explanation}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Constraints */}
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Constraints</h3>
                      <ul className="space-y-1">
                        {selectedChallenge.constraints.map((c, i) => (
                          <li key={i} className="text-xs text-foreground/80 font-mono flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-primary/60 flex-shrink-0" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  /* Output tab */
                  <div className="space-y-4">
                    {/* Test results */}
                    {testResults.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Test Cases</h3>
                        {testResults.map((r, i) => (
                          <div
                            key={i}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs border ${
                              r.passed
                                ? "bg-green-500/5 border-green-500/20 text-green-600"
                                : "bg-red-500/5 border-red-500/20 text-red-500"
                            }`}
                          >
                            {r.passed
                              ? <CheckCircle className="h-3.5 w-3.5 flex-shrink-0" />
                              : <XCircle className="h-3.5 w-3.5 flex-shrink-0" />}
                            {r.test}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Full AI output */}
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">AI Evaluation</h3>
                      <pre className="text-xs bg-muted/50 border border-border p-3 rounded-lg whitespace-pre-wrap font-mono leading-relaxed min-h-[200px]">
                        {output || "Run your code to see evaluation results here..."}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* ── RIGHT: Monaco Editor ── */}
          <ResizablePanel defaultSize={62} minSize={40}>
            <div className="h-full flex flex-col overflow-hidden">
              {/* Editor label bar */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card/50 flex-shrink-0">
                <Code className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-mono">
                  solution.{selectedLanguage === "cpp" ? "cpp" : selectedLanguage === "java" ? "java" : selectedLanguage === "python" ? "py" : "js"}
                </span>
                <div className="ml-auto flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-muted-foreground">AI Analysis Ready</span>
                </div>
              </div>

              {/* Monaco Editor — fills remaining height */}
              <div className="flex-1 overflow-hidden">
                <MonacoCodeEditor
                  value={code}
                  onChange={setCode}
                  language={selectedLanguage}
                  height="100%"
                />
              </div>
            </div>
          </ResizablePanel>

        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default CodingPractice;
