---
title: "Redis Basics and Node.js Integration"
description: "Learn the fundamentals of Redis including data types and methods, and how to integrate Redis into a Node.js application for caching and real-time features."
tags: ["redis", "nodejs", "cache", "database"]
image: "/images/blog/basic-redis/banner.png"
date: 2025-04-25
published: true
---

**Redis Basics and Node.js Integration**

Redis is an open-source, in-memory key-value data store known for its performance and versatility. It supports various data types, making it suitable for caching, real-time applications, pub/sub systems, and more.

In this guide, we'll cover:

- Redis Data Types
- Common Redis Commands
- How to integrate Redis into a Node.js project

---

# 📦 Redis Data Types & Commands

Redis supports a variety of data structures:

## 1. Strings

Strings are the most basic Redis data type. You can store any type of value as a string, including integers and serialized JSON.

::code-block
---
files:
  - title: bash
    language: bash
    content: |
      SET name "Jay"
      GET name
      INCR counter
---
::

## 2. Lists
Lists are ordered collections of strings. You can add elements to the head or tail of the list.
::code-block
---
files:
  - title: bash
    language: bash
    content: |
      LPUSH mylist "apple"
      RPUSH mylist "banana"
      LRANGE mylist 0 -1
---
::

## 3. Sets
Sets are unordered collections of unique strings. They support operations like union, intersection, and difference.
::code-block
---
files:
  - title: bash
    language: bash
    content: |
      SADD myset "apple"
      SADD myset "banana"
      SADD myset "apple" # Duplicate, won't be added
      SMEMBERS myset
---
::

## 4. Hashes
Hashes are maps between string field and string values, making them ideal for representing objects.
::code-block
---
files:
  - title: bash
    language: bash
    content: |
      HSET user:1000 name "Jay" age 30
      HGETALL user:1000
---
::

## 5. Sorted Sets
Sorted sets are similar to sets but with a score associated with each member, allowing for ordered retrieval.
::code-block
---
files:
  - title: bash
    language: bash
    content: |
      ZADD mysortedset 1 "apple"
      ZADD mysortedset 2 "banana"
      ZRANGE mysortedset 0 -1
---
::

## 6. Bitmaps, HyperLogLogs, Streams
These are more advanced structures:
Bitmaps are used for bit-level operations, allowing you to manipulate individual bits within a string.

::code-block
---
files:
  - title: bash
    language: bash
    content: |
      SETBIT mybitmap 0 1
      SETBIT mybitmap 1 1
      BITCOUNT mybitmap
---
::

HyperLogLogs are used to estimate the cardinality (number of unique elements) of a set, making them useful for scenarios like tracking unique visitors.

::code-block
---
files:
  - title: bash
    language: bash
    content: |
      PFADD myhll "apple" "banana" "orange"
      PFCOUNT myhll
---
::

Streams are designed for real-time data pipelines and event sourcing, enabling you to append and query time-series data.

::code-block
---
files:
  - title: bash
    language: bash
    content: |
      XADD mystream * name "Jay" age 30
      XRANGE mystream - +
---
::



# 🔧 Integrating Redis with Node.js
You can use the popular ioredis or redis client. Here’s an example with ioredis.

## 1. Install Redis and ioredis

::code-block
---
files:
  - title: bash
    language: bash
    content: |
      npm install ioredis
      # or
      yarn add ioredis
---
::

Make sure you have Redis installed and running. You can use Docker to run Redis easily:

::code-block
---
files:
  - title: bash
    language: bash
    content: |
      docker run -d -p 6379:6379 redis
---
::

## 2. Basic Setup

Create a file named `redis.js` and add the following code:

::code-block
---
files:
  - title: redis.js
    language: javascript
    content: |
      // redis.ts
      import Redis from 'ioredis';

      const redis = new Redis({
        host: '127.0.0.1',
        port: 6379,
        // password: 'your_password_if_any'
      });

      export default redis;
---
::

## 3. Using Redis in Your Application
You can now use Redis in your application. Here’s an example of setting and getting a value:

::code-block
---
files:
  - title: example.js
    language: javascript
    content: |
      // example.ts
      import redis from './redis';

      // String
      await redis.set('greeting', 'Hello Redis');
      const greeting = await redis.get('greeting');
      console.log(greeting); // Hello Redis

      // List
      await redis.lpush('queue', 'task1');
      const task = await redis.rpop('queue');
      console.log(task); // task1

      // Hash
      await redis.hset('user:1', { name: 'Jay', role: 'admin' });
      const user = await redis.hgetall('user:1');
      console.log(user); // { name: 'Jay', role: 'admin' }

      // Sorted Set
      await redis.zadd('scores', 100, 'Jay');
      const scores = await redis.zrange('scores', 0, -1, 'WITHSCORES');
      console.log(scores);

      // Pub/Sub
      redis.subscribe('news');
      redis.on('message', (channel, message) => {
        console.log(`Received message from ${channel}: ${message}`);
      });

      const publisher = new Redis();
      publisher.publish('news', 'Breaking news!');
---
::


## 4. Caching Example
You can use Redis as a cache to store frequently accessed data. Here’s an example of caching a database query result:
::code-block
---
files:
  - title: cache.js
    language: javascript
    content: |
      import redis from './redis';

      async function getUserData(userId) {
        const cacheKey = `user:${userId}`;
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
          return JSON.parse(cachedData);
        }

        // Simulate a database query
        const userData = await queryDatabase(userId);
        await redis.set(cacheKey, JSON.stringify(userData), 'EX', 3600); // Cache for 1 hour
        return userData;
      }

      async function queryDatabase(userId) {
        // Simulate a database query
        return { id: userId, name: 'Jay', age: 30 };
      }
---
::

## 5. Conclusion
Redis is a powerful tool for caching and real-time applications. By integrating Redis into your Node.js projects, you can significantly improve performance and scalability. This guide covered the basics of Redis data types, commands, and how to use it in a Node.js application.
Feel free to explore more advanced features like transactions, Lua scripting, and clustering as you become more familiar with Redis.
Redis is a versatile tool that can greatly enhance your applications. 

**Happy coding!**

## 6. Additional Resources

- <a href="https://redis.io/documentation" target="_blank">Redis Documentation</a>  
- <a href="https://github.com/redis/ioredis" target="_blank">ioredis Documentation</a>