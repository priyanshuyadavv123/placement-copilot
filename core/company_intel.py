"""
PlacementCopilot AI — Company Intelligence & Placement Vault
Curated database of campus recruitment patterns for Indian Universities (LPU, Tier-1/2/3).
"""

COMPANIES = {
    "amazon_sde": {
        "id": "amazon_sde",
        "name": "Amazon",
        "role": "SDE-1 (Software Development Engineer)",
        "ctc_range": "₹32 - ₹45 LPA",
        "tier": "Super Dream / Product",
        "rounds": [
            "Round 1: Online Assessment (2 LeetCode Medium/Hard + Work Style Survey)",
            "Round 2: Technical Interview 1 (DSA: Trees, Graphs, DP + 14 Leadership Principles)",
            "Round 3: Technical Interview 2 (System Design Fundamentals, OOPs, Edge Cases)",
            "Round 4: Bar Raiser (Customer Obsession, Deep Dive Behavioral, Scalability)"
        ],
        "ats_keywords": [
            "Data Structures", "Algorithms", "Object-Oriented Design", "Java", "C++", "Python",
            "Distributed Systems", "AWS", "REST APIs", "Multithreading", "SQL", "Git",
            "Time Complexity", "Space Complexity", "Microservices", "Scalability", "System Architecture"
        ],
        "focus_areas": [
            "Binary Trees & Lowest Common Ancestor",
            "Dynamic Programming (0/1 Knapsack, Coin Change)",
            "Graphs (BFS, DFS, Dijkstra, Topological Sort)",
            "Amazon Leadership Principles (STAR Method stories)"
        ],
        "sample_questions": [
            {
                "type": "technical",
                "question": "Given an array representing stock prices on consecutive days, how would you find the maximum profit with at most two transactions in O(n) time?",
                "category": "DSA (Dynamic Programming / Arrays)"
            },
            {
                "type": "technical",
                "question": "How does an LRU Cache work internally, and how would you implement get() and put() in O(1) time using standard data structures?",
                "category": "Data Structures & Design"
            },
            {
                "type": "behavioral",
                "question": "Tell me about a time when you faced a tight project deadline and had to make a trade-off between code quality and delivery speed. (Customer Obsession & Bias for Action)",
                "category": "Leadership Principles"
            }
        ]
    },
    "tcs_digital": {
        "id": "tcs_digital",
        "name": "TCS (Tata Consultancy Services)",
        "role": "TCS Digital / Prime",
        "ctc_range": "₹7.5 - ₹9.5 LPA",
        "tier": "Dream / IT Services",
        "rounds": [
            "Round 1: National Qualifier Test (Advanced Coding, Quantitative Aptitude, Verbal)",
            "Round 2: Technical Interview (DSA, SQL Queries, DBMS Normalization, Cloud/AI basics)",
            "Round 3: Managerial & HR Interview (Communication, Flexibility to Relocate, Project Viva)"
        ],
        "ats_keywords": [
            "Python", "Java", "SQL", "Database Management", "DBMS", "Normalization",
            "Data Structures", "Object Oriented Programming", "OOP", "Git", "REST APIs",
            "Cloud Computing", "Machine Learning", "FastAPI", "Full Stack Development"
        ],
        "focus_areas": [
            "SQL Joins, Subqueries & Window Functions",
            "String manipulation & Array sorting algorithms",
            "OOP Concepts (Polymorphism, Inheritance, Encapsulation with real examples)",
            "Operating Systems (Paging, Deadlocks, Semaphore vs Mutex)"
        ],
        "sample_questions": [
            {
                "type": "technical",
                "question": "Write an SQL query to find the second highest salary from an Employee table without using the LIMIT clause.",
                "category": "SQL & DBMS"
            },
            {
                "type": "technical",
                "question": "Explain the four pillars of OOP with a real-world scenario (e.g., an E-commerce system). How does polymorphism differ from abstraction?",
                "category": "Core CS Fundamentals"
            },
            {
                "type": "behavioral",
                "question": "Why do you want to join TCS Digital instead of Ninja? What emerging technology did you teach yourself outside the university syllabus?",
                "category": "Motivation & Learning Agility"
            }
        ]
    },
    "accenture_ase": {
        "id": "accenture_ase",
        "name": "Accenture",
        "role": "Associate Software Engineer (ASE / FSE)",
        "ctc_range": "₹4.5 - ₹6.5 LPA",
        "tier": "Core IT / Mass Recruiter",
        "rounds": [
            "Round 1: Cognitive & Technical Assessment (Critical Reasoning, Pseudo-Code, MS Office)",
            "Round 2: Coding Assessment (2 Problem-Solving Questions in C++/Java/Python)",
            "Round 3: Communication Assessment (Automated Voice/Spoken English Test)",
            "Round 4: Virtual Technical & HR Interview"
        ],
        "ats_keywords": [
            "C++", "Java", "Python", "JavaScript", "HTML", "CSS", "SQL",
            "Pseudo Code", "Analytical Thinking", "Agile", "Software Development Life Cycle",
            "SDLC", "Git", "Data Structures", "Debugging", "Team Collaboration"
        ],
        "focus_areas": [
            "Bitwise operations and recursive pseudo-code dry-runs",
            "Basic array search/sort (Binary Search, Bubble Sort, Merge Sort)",
            "SDLC Models (Agile vs Waterfall)",
            "Clear spoken communication and situational reasoning"
        ],
        "sample_questions": [
            {
                "type": "technical",
                "question": "Explain how Binary Search works and what makes its time complexity O(log n). What is the strict prerequisite condition for applying binary search?",
                "category": "Algorithms"
            },
            {
                "type": "technical",
                "question": "What is the difference between synchronous and asynchronous execution in software development? Give a practical example where async is mandatory.",
                "category": "Software Engineering"
            },
            {
                "type": "behavioral",
                "question": "Describe a conflict or disagreement you had with a team member during an academic project and how you resolved it without missing the deadline.",
                "category": "Team Collaboration"
            }
        ]
    },
    "infosys_sp": {
        "id": "infosys_sp",
        "name": "Infosys",
        "role": "Specialist Programmer (SP / DSE)",
        "ctc_range": "₹9.5 - ₹12 LPA",
        "tier": "Super Dream / Specialist",
        "rounds": [
            "Round 1: HackWithInfy / InfyTQ Coding Round (3 Hard Competitive Coding Problems)",
            "Round 2: In-Depth Technical Interview (Dynamic Programming, Segment Trees, System Internals)",
            "Round 3: Technical HR Evaluation"
        ],
        "ats_keywords": [
            "Dynamic Programming", "Graph Algorithms", "Competitive Programming", "C++",
            "Java", "Time Complexity Optimization", "Bit Manipulation", "Greedy Algorithms",
            "Segment Trees", "Disjoint Set Union", "Database Internals", "B-Trees"
        ],
        "focus_areas": [
            "Advanced Dynamic Programming (Digit DP, Matrix Exponentiation)",
            "Graph Theory (Shortest Path, Minimum Spanning Tree, Bipartite Graphs)",
            "Mathematical and Number Theory Algorithms"
        ],
        "sample_questions": [
            {
                "type": "technical",
                "question": "How do you detect a cycle in a directed graph using DFS? Explain why a visited array alone is insufficient and why a recursion stack tracker is required.",
                "category": "Advanced Graph Theory"
            },
            {
                "type": "technical",
                "question": "What is the difference between Process and Thread? How does context switching overhead differ between the two?",
                "category": "Operating Systems"
            },
            {
                "type": "behavioral",
                "question": "What is the most complex algorithmic problem you solved on LeetCode/CodeChef and what was the mental breakthrough that led to the optimal solution?",
                "category": "Problem Solving Passion"
            }
        ]
    },
    "google_swe": {
        "id": "google_swe",
        "name": "Google",
        "role": "Software Engineer (Campus / Early Career)",
        "ctc_range": "₹40 - ₹55 LPA",
        "tier": "Global Tech Leader",
        "rounds": [
            "Round 1: Google Online Challenge (GOC - 2 Algorithmic Questions)",
            "Round 2: Technical Phone Screen (Live Google Docs/CoderPad Coding & Complexity Analysis)",
            "Round 3: Onsite Interview 1 (DSA: Heaps, Trie, Combinatorics)",
            "Round 4: Onsite Interview 2 (Scalable Data Structures & Edge Case Thoroughness)",
            "Round 5: Googliness & Leadership (Ethics, Inclusivity, Intellectual Humility)"
        ],
        "ats_keywords": [
            "Algorithms", "Data Structures", "C++", "Go", "Java", "Python", "Trie", "Heaps",
            "Concurrency", "Distributed Computing", "Clean Code", "Unit Testing", "Scalability",
            "Big-O Analysis", "Memory Profiling", "Open Source"
        ],
        "focus_areas": [
            "Thinking aloud and validating edge cases before writing line 1 of code",
            "Optimal Big-O space and time complexity trade-offs",
            "Trie and Prefix Trees, Monotonic Stacks, Union-Find",
            "Googliness (Collaboration, Intellectual Humility, Learning from Mistakes)"
        ],
        "sample_questions": [
            {
                "type": "technical",
                "question": "Design an autocomplete system that suggests the top 5 most frequently searched terms matching a given prefix. What data structures would you combine for minimum latency?",
                "category": "Data Structures & Design"
            },
            {
                "type": "technical",
                "question": "Given an infinite stream of integers, how would you design an algorithm to return a random number from the stream with uniform probability? (Reservoir Sampling)",
                "category": "Probability & Algorithms"
            },
            {
                "type": "behavioral",
                "question": "Tell me about a time when you received constructive negative criticism on your code or idea. How did you react and what tangible change did you implement?",
                "category": "Googliness & Growth Mindset"
            }
        ]
    }
}

def get_all_companies():
    """Return summary list of all supported companies."""
    return [
        {
            "id": c["id"],
            "name": c["name"],
            "role": c["role"],
            "ctc_range": c["ctc_range"],
            "tier": c["tier"],
            "keywords_count": len(c["ats_keywords"]),
            "questions_count": len(c["sample_questions"])
        }
        for c in COMPANIES.values()
    ]

def get_company_intel(company_id):
    """Return complete placement intelligence for a company."""
    return COMPANIES.get(company_id, COMPANIES["tcs_digital"])
