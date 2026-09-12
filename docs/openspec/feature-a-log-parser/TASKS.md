# Feature A: Log Parser — Tasks

## Completed

- [x] Define Zod schemas (`SetInputSchema`, `ExerciseInputSchema`, `WorkoutParseInputSchema`)
- [x] Define output schemas (`SetOutputSchema`, `ExerciseOutputSchema`, `WorkoutParseOutputSchema`)
- [x] Implement `POST /api/workouts/parse-log` endpoint
- [x] Add input validation with error responses
- [x] Integrate Brzycki 1RM calculation per set
- [x] Calculate volume_load and total_reps per exercise

## In Progress

- [ ] Add LLM integration for natural language parsing (OpenAI/Anthropic structured outputs)
- [ ] Implement canonical exercise name matching with fuzzy search
- [ ] Add support for audio transcription input

## Backlog

- [ ] Rate limiting on parse endpoint
- [ ] Caching of parsed workout patterns
- [ ] Multi-language support for exercise names
- [ ] Voice input via Web Speech API
