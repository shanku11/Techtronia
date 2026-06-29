const mongoose = require('mongoose');
const Course = require('./models/Course');
const Topic = require('./models/Topic');
require('dotenv').config();

const primaryURI = process.env.MONGODB_URI;
const localFallbackURI = 'mongodb://127.0.0.1:27017/techtronia';

const dbOptions = {
  serverSelectionTimeoutMS: 5000,
  family: 4 // Force IPv4 to fix DNS resolution issues with mongodb+srv
};

const seedDatabase = async () => {
  try {
    if (primaryURI) {
      try {
        await mongoose.connect(primaryURI, dbOptions);
        console.log('Connected to primary Atlas database for seeding');
      } catch (err) {
        console.log('Primary DB failed:', err.message);
        console.log('Falling back to local database...');
        await mongoose.connect(localFallbackURI, dbOptions);
        console.log('Connected to local database for seeding');
      }
    } else {
      await mongoose.connect(localFallbackURI, dbOptions);
      console.log('Connected to local database for seeding');
    }

    // Clear existing
    await Course.deleteMany({});
    await Topic.deleteMany({});

    // Create Courses
    const dsaCourse = await Course.create({
      name: 'Data Structures & Algorithms',
      slug: 'dsa',
      description: 'Master core CS concepts through interactive visualizations',
      icon: 'Database',
      orderIndex: 1
    });

    const cnCourse = await Course.create({
      name: 'Computer Networks',
      slug: 'cn',
      description: 'Understand networks, routing, and protocols',
      icon: 'Network',
      orderIndex: 2
    });

    const osCourse = await Course.create({
      name: 'Operating Systems',
      slug: 'os',
      description: 'Learn processes, threads, and memory management',
      icon: 'Cpu',
      orderIndex: 3
    });

    const dpCourse = await Course.create({
      name: 'Dynamic Programming',
      slug: 'dp',
      description: 'Master algorithmic optimization techniques',
      icon: 'Code',
      orderIndex: 4
    });

    const mlCourse = await Course.create({
      name: 'Machine Learning',
      slug: 'ml',
      description: 'Explore neural networks, regressions, and AI',
      icon: 'Brain',
      orderIndex: 5
    });

    // Create Topics
    await Topic.insertMany([
      // DSA
      { courseId: dsaCourse._id, name: 'Stack', slug: 'stack', description: 'LIFO data structure', orderIndex: 1 },
      { courseId: dsaCourse._id, name: 'Queue', slug: 'queue', description: 'FIFO data structure', orderIndex: 2 },
      { courseId: dsaCourse._id, name: 'Linked List', slug: 'linkedlist', description: 'Dynamic collections', orderIndex: 3 },
      { courseId: dsaCourse._id, name: 'Trees', slug: 'trees', description: 'Hierarchical data structures', orderIndex: 4 },
      { courseId: dsaCourse._id, name: 'Graphs', slug: 'graphs', description: 'Nodes and edges', orderIndex: 5 },
      { courseId: dsaCourse._id, name: 'Sorting', slug: 'sorting', description: 'Organizing data efficiently', orderIndex: 6 },
      { courseId: dsaCourse._id, name: 'Searching', slug: 'searching', description: 'Finding elements fast', orderIndex: 7 },
      
      // CN
      { courseId: cnCourse._id, name: 'OSI Model', slug: 'osi-model', description: 'Network layers explained', orderIndex: 1 },
      { courseId: cnCourse._id, name: 'TCP/IP', slug: 'tcp-ip', description: 'The internet protocol suite', orderIndex: 2 },
      { courseId: cnCourse._id, name: 'DNS & DHCP', slug: 'dns-dhcp', description: 'Naming and addressing', orderIndex: 3 },
      { courseId: cnCourse._id, name: 'HTTP & HTTPS', slug: 'http-https', description: 'Web protocols', orderIndex: 4 },
      { courseId: cnCourse._id, name: 'Routing Algorithms', slug: 'routing', description: 'Path finding in networks', orderIndex: 5 },
      { courseId: cnCourse._id, name: 'Network Security', slug: 'network-security', description: 'Protecting data transmission', orderIndex: 6 },
      { courseId: cnCourse._id, name: 'Socket Programming', slug: 'sockets', description: 'Building network apps', orderIndex: 7 },
      
      // OS
      { courseId: osCourse._id, name: 'Process Management', slug: 'processes', description: 'Program execution', orderIndex: 1 },
      { courseId: osCourse._id, name: 'Threads & Concurrency', slug: 'threads', description: 'Parallel execution', orderIndex: 2 },
      { courseId: osCourse._id, name: 'CPU Scheduling', slug: 'cpu-scheduling', description: 'Resource allocation', orderIndex: 3 },
      { courseId: osCourse._id, name: 'Memory Management', slug: 'memory', description: 'RAM usage and paging', orderIndex: 4 },
      { courseId: osCourse._id, name: 'Deadlocks', slug: 'deadlocks', description: 'Resource contention', orderIndex: 5 },
      { courseId: osCourse._id, name: 'File Systems', slug: 'file-systems', description: 'Data storage organization', orderIndex: 6 },
      { courseId: osCourse._id, name: 'I/O Systems', slug: 'io-systems', description: 'Device communication', orderIndex: 7 },

      // DP
      { courseId: dpCourse._id, name: 'DP Fundamentals', slug: 'dp-basics', description: 'Intro to dynamic programming', orderIndex: 1 },
      { courseId: dpCourse._id, name: 'Fibonacci Patterns', slug: 'fibonacci', description: 'State transitions', orderIndex: 2 },
      { courseId: dpCourse._id, name: 'Knapsack Problems', slug: 'knapsack', description: 'Optimization with constraints', orderIndex: 3 },
      { courseId: dpCourse._id, name: 'LCS & LIS', slug: 'lcs-lis', description: 'Sequence matching', orderIndex: 4 },
      { courseId: dpCourse._id, name: 'Matrix Chain', slug: 'matrix-chain', description: 'Order optimization', orderIndex: 5 },
      { courseId: dpCourse._id, name: 'DP on Trees', slug: 'dp-trees', description: 'Hierarchical DP', orderIndex: 6 },
      { courseId: dpCourse._id, name: 'DP on Graphs', slug: 'dp-graphs', description: 'Network DP', orderIndex: 7 },

      // ML
      { courseId: mlCourse._id, name: 'ML Fundamentals', slug: 'ml-basics', description: 'Intro to machine learning', orderIndex: 1 },
      { courseId: mlCourse._id, name: 'Linear Regression', slug: 'linear-regression', description: 'Predicting continuous values', orderIndex: 2 },
      { courseId: mlCourse._id, name: 'Logistic Regression', slug: 'logistic-regression', description: 'Classification techniques', orderIndex: 3 },
      { courseId: mlCourse._id, name: 'Decision Trees', slug: 'decision-trees', description: 'Tree-based modeling', orderIndex: 4 },
      { courseId: mlCourse._id, name: 'Neural Networks', slug: 'neural-networks', description: 'Deep learning basics', orderIndex: 5 },
      { courseId: mlCourse._id, name: 'CNN', slug: 'cnn', description: 'Computer vision', orderIndex: 6 },
      { courseId: mlCourse._id, name: 'NLP Basics', slug: 'nlp', description: 'Text processing', orderIndex: 7 }
    ]);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();
