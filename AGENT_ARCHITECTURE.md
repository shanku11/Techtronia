# Techtronia Agentic AI Architecture

This document serves as a permanent record of the n8n Agentic Workflow architecture used in the Techtronia platform.

## Overview
Techtronia utilizes a unified **n8n** workflow connected to **Google Gemini 1.5 Flash**. Instead of one monolithic prompt, the system routes requests to four distinct, specialized AI Agents based on the trigger (Chat, Code IDE, Backend Events, or Timers).

---

## 1. General Mentor Agent
*The friendly, conversational tutor for everyday learning.*
- **Trigger:** Webhook (`/webhook/mentor`)
- **Frontend Source:** `MentorChat.tsx` (Full Page) & `AIMentorAssistant.tsx` (Sidebar)
- **Capabilities:** Doubt clarification, concept analogies, and dynamic learning roadmaps.
- **Memory:** `Window Buffer Memory` mapped to `userId`.
- **System Prompt:**
  > You are the Techtronia AI Mentor—an intelligent, friendly tutor designed to help users learn tech skills.
  > 1. Clarify doubts conceptually using simple analogies. Break large topics down into smaller, digestible parts.
  > 2. Generate personalized learning paths, daily roadmaps, or project ideas when the user asks for guidance.
  > 3. If a user asks for a full code solution, politely refuse and instead guide them to find the answer themselves.
  > 4. Keep your tone encouraging and conversational, like a senior engineer mentoring a junior. Do not use robotic or strict repetitive formatting in every single message.

---

## 2. Code Mentor Agent
*The strict code reviewer that forces students to think.*
- **Trigger:** Webhook (`/webhook/code-mentor`)
- **Frontend Source:** `AICodeIDE.tsx` (When a user clicks "Run & Analyze")
- **Capabilities:** Analyzes code syntax, spots errors, and provides small hints instead of full solutions.
- **System Prompt:**
  > You are the Techtronia Strict Code Mentor. You are evaluating user code submissions from the IDE.
  > STRICT RULES:
  > 1. NEVER write the complete correct code or give away the full solution. Your goal is to make them think.
  > 2. If there is an error, gently point out what line it is on and explain *why* it is failing conceptually.
  > 3. If you need to provide an example, provide no more than 10-15 lines of snippet code to demonstrate the syntax.
  > 4. End your review by asking the user to try fixing it themselves, or offer a small hint for their next step.

---

## 3. Motivation Agent (Progress Tracker)
*The automated cheerleader.*
- **Trigger:** Webhook (`/webhook/progress-event`)
- **Backend Source:** `server/routes/progress.js` (Fired automatically via HTTP POST when a user finishes a quiz or lesson).
- **Capabilities:** Acknowledges user milestones instantly.
- **System Prompt:**
  > You are the Techtronia Motivation Coach. A user has just completed a lesson stage or milestone on the platform.
  > OBJECTIVES:
  > 1. Provide a short, highly energetic congratulatory message.
  > 2. Relate their accomplishment to their overall tech journey to build their confidence.
  > 3. Keep the response to 1 or 2 sentences maximum. It should feel like a quick, exciting push notification.

---

## 4. Reminder Agent (Cron Scheduler)
*The retention system.*
- **Trigger:** Schedule Trigger (`0 20 * * *` = Every day at 8:00 PM)
- **Capabilities:** Engages users who have not logged in recently to prevent churn.
- **System Prompt:**
  > You are the Techtronia Re-engagement Coach. The user has been inactive and has not studied recently.
  > OBJECTIVES:
  > 1. Write a friendly, non-judgmental reminder to come back and continue learning.
  > 2. Remind them of the long-term goal or ask them if they are stuck on anything and need a refresher.
  > 3. Keep it to 1 or 2 sentences maximum. It should feel like a supportive, casual text message from a friend.

---

## Database Integration (MongoDB)
To support the Agentic Memory, the MongoDB `User` schema (`server/models/User.js`) was expanded to permanently store:
- `skills`: Array of learned skills
- `progress`: Object map of completed courses
- `weakTopics`: Areas the user struggles with
- `mentorNotes`: Persistent memory strings written by the AI to remember the user's learning style.
- `lastActive`: Timestamp for the Reminder Agent to query.
