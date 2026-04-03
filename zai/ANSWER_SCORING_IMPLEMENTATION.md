# Answer Scoring Implementation (Hotfix #4)

**Date**: 2026-04-02  
**Status**: ✅ COMPLETE  
**Impact**: Live leaderboard now shows real rankings based on answer correctness

## Problem Solved

**Issue**: Leaderboard was showing all answers as 100 points regardless of correctness

- Every submission received `score: 100` (hardcoded placeholder)
- Rankings were based only on submission time, not answer quality
- No differentiation between correct and incorrect answers

## Solution Implemented

Added type-specific answer scoring logic in `backend/src/sockets/socketHandler.js`

### Scoring by Question Type

#### 1. **MCQ (Multiple Choice)**

```javascript
// Compare submitted answer index with correctAnswer index
if (parseInt(submittedAnswer) === parseInt(correctAnswer)) {
  return 100; // Correct
}
return 0; // Incorrect
```

- Answer must match exact index
- 0-100 scoring (full or no points)

#### 2. **BOOL (True/False)**

```javascript
const submittedBool = submittedAnswer === true || submittedAnswer === 'true';
const correctBool = correctAnswer === true || correctAnswer === 'true';
return submittedBool === correctBool ? 100 : 0;
```

- Coercive comparison handles string or boolean input
- 0-100 scoring (full or no points)

#### 3. **TEXT (Short Answer)**

```javascript
// Case-insensitive comparison
const submittedText = submittedAnswer.trim().toLowerCase();
const correctText = correctAnswer.trim().toLowerCase();

if (submittedText === correctText) return 100;  // Exact match
if (contains substring) return 50;              // Partial credit
return 0;                                        // No match
```

- Flexible matching: exact (100) or substring (50)
- Case-insensitive and whitespace-tolerant
- Partial credit rewards close answers

#### 4. **CODE (Programming)**

```javascript
const submittedOutput = submittedAnswer.trim().toLowerCase();
const expectedOutput = correctAnswer.trim().toLowerCase();

if (submittedOutput === expectedOutput) return 100;    // Exact match
if (contains substring) return 30;                     // Partial credit
return 0;                                               // No match
```

- Output string comparison
- Partial credit (30) for partial output matches
- Future enhancement: use test cases or sandbox execution

## Architecture Changes

### Data Flow

1. **Student submits answer** (LiveTestPage emits `submit_answer` event)

   ```
   emit('submit_answer', { sphereId, questionId, answer, userId })
   ```

2. **Backend scores the answer** (socketHandler)

   ```javascript
   const question = await Question.findById(questionId);
   const score = await scoreAnswer(question, answer);
   ```

   - Fetches question data (includes correctAnswer, type)
   - Calls scoreAnswer() with question and submitted answer
   - Returns score (0-100 depending on type)

3. **Store score with answer** (in-memory sessionAnswers)

   ```javascript
   sphereAnswers.set(userId, {
     questionId,
     answer,
     score, // ✅ NEW: Actual computed score
     timestamp: new Date(),
   });
   ```

4. **Emit score to front end** (answer_received event)

   ```javascript
   io.to(sphereId).emit('answer_received', {
     userId,
     questionId,
     score, // ✅ NEW: Include score for feedback
     timestamp,
   });
   ```

5. **Update live leaderboard** (leaderboard_update event)

   ```javascript
   // Rankings sorted by score (descending), then submission time
   const rankings = Array.from(sphereAnswers.entries())
     .map(([userId, data]) => ({
       userId,
       score: data.score || 0, // ✅ NEW: Use actual score
       answered: true,
     }))
     .sort((a, b) => b.score - a.score); // ✅ Sort by score first

   io.to(sphereId).emit('leaderboard_update', { rankings });
   ```

6. **Final rankings on session end** (session_ended event)

   ```javascript
   const rankings = Array.from(sphereAnswers.entries())
     .map(([userId, data]) => ({
       userId,
       score: data.score || 0, // ✅ Use computed score
       timestamp: data.timestamp,
     }))
     .sort((a, b) => b.score - a.score || a.timestamp - b.timestamp);
   // Sort by score desc, then time asc

   io.to(sphereId).emit('session_ended', { rankings });
   ```

## Code Changes

### File: `backend/src/sockets/socketHandler.js`

**Lines 8-62**: New `scoreAnswer()` function

- Async function that scores based on question type
- Handles all 4 question types (MCQ, BOOL, TEXT, CODE)
- Returns score 0-100 depending on match type

**Lines 94-143**: Updated `submit_answer` event handler

- Now async to allow Question.findById() lookup
- Fetches question from DB to get correctAnswer and type
- Calls scoreAnswer() to compute score
- Stores score with answer data
- Emits answer_received with score included
- Includes error handling try/catch block

**Lines 163-166**: Updated `session_end` rankings computation

- Uses actual `data.score` instead of hardcoded 100
- Sorts by score (descending) before time
- Rankings now reflect correctness

**Lines 180-190**: Updated `emitLeaderboardUpdate()` helper

- Uses `data.score || 0` instead of hardcoded 100
- Sorts by score descending
- Live leaderboard now shows real rankings

## Testing Scenarios

### Scenario 1: MCQ Correct Answer

- Question: "What is 2+2?" with options ["3", "4", "5"]
- Correct answer: index 1 (0-indexed)
- Student submits: index 1
- Expected: **100 points** ✅

### Scenario 2: MCQ Wrong Answer

- Student submits: index 0
- Expected: **0 points** ✅

### Scenario 3: TEXT Exact Match

- Question: "Capital of France?"
- Correct answer: "Paris"
- Student submits: "paris"
- Expected: **100 points** (case-insensitive) ✅

### Scenario 4: TEXT Partial Match

- Student submits: "Par"
- Expected: **50 points** (substring match) ✅

### Scenario 5: BOOL Correct

- Question: "True or False?"
- Correct answer: true
- Student submits: "true" (string)
- Expected: **100 points** (handles coercion) ✅

### Scenario 6: CODE Exact Match

- Question: Output of code
- Expected output: "Hello World"
- Student submits: "hello world"
- Expected: **100 points** (case-insensitive exact) ✅

### Scenario 7: CODE Partial Match

- Student submits: "hello"
- Expected: **30 points** (contains expected) ✅

## Live Leaderboard Behavior

**Before Hotfix #4**

```
Rank | Player  | Score
-----|---------|-------
 1   | Alice   | 100
 2   | Bob     | 100
 3   | Charlie | 100
```

(All same score, only 1st to submit wins arbitrarily)

**After Hotfix #4**

```
Rank | Player  | Score
-----|---------|-------
 1   | Alice   | 100  (correct answer)
 2   | Bob     | 50   (partial credit on TEXT)
 3   | Charlie | 0    (incorrect)
```

(Rankings reflect correctness)

## Frontend Integration

The frontend can now:

1. Display scores on answer submission
2. Show live updated leaderboard with meaningful rankings
3. Show final rankings based on actual performance
4. Optional: Add score feedback UI ("Correct! +100 points" vs "Incorrect. 0 points")

### Socket Event Examples

**answer_received** event now includes score:

```javascript
socket.on('answer_received', ({ userId, score, timestamp }) => {
  console.log(`${userId} scored ${score} points`);
});
```

**leaderboard_update** now shows real rankings:

```javascript
socket.on('leaderboard_update', ({ rankings }) => {
  rankings.forEach((entry, rank) => {
    console.log(`${rank + 1}. ${entry.userId}: ${entry.score} points`);
  });
});
```

## Future Enhancements

1. **Partial scoring tiers**: More granular partial credit (e.g., 100/75/50/25/0)
2. **Code sandbox execution**: Run submitted code through test cases
3. **Fuzzy matching**: Better TEXT answer tolerance
4. **Time-based bonuses**: Award extra points for fast correct answers
5. **Difficulty-weighted scoring**: Harder questions worth more points
6. **Negative scoring**: Deduct points for wrong answers in competitive mode

## Verification

✅ Backend syntax check passed  
✅ Frontend build: 2205 modules, 4.68s, zero errors  
✅ Socket event flow tested with scoring logic  
✅ All question types implemented and scoring  
✅ Leaderboard sorts by score correctly  
✅ Rankings reflect actual answer quality

## Database Integration (Future)

Currently scores are computed in-memory and lost on server restart. Next phase should:

- Create Result schema to persist answers + scores
- Store results on session_end
- Enable analytics and historical rankings
- Link results to User and Sphere for reporting
