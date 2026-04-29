# WhoAmMAI

WhoAmMai is an LLM-powered guessing game where players ask short natural-language questions to uncover a hidden identity, then make a final guess when they think they know the answer.

The system is designed around a lightweight web client and a serverless API. Instead of behaving like a general chatbot, it emphasizes structured LLM parsing, strict validation, and a tightly controlled gameplay loop.

## What The App Does

- Presents a daily puzzle with fixed turn and length limits.
- Accepts free-form player questions.
- Uses structured LLM parsing to classify player intent before handling each turn.
- Returns short, game-focused responses rather than open-ended chat.

## Technical Highlights

- Serverless API using Cloudflare Workers for low-ops deployment and edge-friendly latency.
- LLM provider abstraction to allow model changes without rewriting application logic.
- Structured JSON outputs to convert natural language into predictable, typed actions.
- Validation at the API boundary with consistent, structured error responses.
- Clear separation between parsing, validation, and answer-generation responsibilities.

## Why This Project Exists

This project explores how to turn LLM behavior into a structured, interactive product instead of a generic chatbot.

The goal is to build a game that feels playful and replayable while keeping API behavior constrained, inspectable, and cost-efficient for an MVP. A key focus is making natural-language input usable through structured parsing and validation rather than relying on raw model text alone.