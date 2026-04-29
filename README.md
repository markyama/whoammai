# WhoAmMAI

WhoAmMAI is an LLM-powered guessing game. Players ask short natural-language questions to uncover a hidden identity, then make a final guess when they think they know the answer.

The project is built around a lightweight web client and a Cloudflare Worker API. The intended architecture emphasizes request validation, structured LLM parsing, and a tight gameplay loop rather than open-ended chatbot behavior.

## What The App Does

- Presents a daily puzzle with fixed turn and length limits.
- Accepts free-form player questions.
- Uses structured LLM parsing to classify player intent before the application decides how to handle a turn.
- Returns short answers designed for a game loop rather than open-ended chat.

## Technical Highlights

- Serverless API on Cloudflare Workers for low-ops deployment and edge-friendly latency.
- LLM provider abstraction so model backends can change without rewriting the application flow.
- Structured parsing output so the application can reason about player intent before answering.
- Validation and standardized JSON error responses at the API boundary.
- Clear separation between parsing, validation, and answer-generation responsibilities.

## Why This Project Exists

This project explores how to turn LLM behavior into a tight interactive product instead of a generic chatbot. The goal is to build a game that feels playful and replayable while still keeping API behavior constrained, inspectable, and cheap enough for an MVP. A major focus is making natural-language input usable through structured parsing and validation instead of trusting raw model text alone.
