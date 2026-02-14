# Typing Engine Input Handling Design

This document defines the typing input behavior for the Typecode app. It focuses on
how the engine should handle characters, whitespace, tabs, and backspace in both
stop-on-error and proceed-on-error modes.

## Goals

- Make typing feel deterministic and forgiving for indentation-heavy code.
- Prevent the cursor from getting stuck on whitespace due to mismatched tab input.
- Ensure backspace always lets the user recover cleanly.
- Keep the error model consistent and easy to reason about.

## Non-goals

- Support multi-line selections or text editing beyond simple backspace.
- Support IME composition or complex input methods.
- Implement a full code editor (no cursor moves via arrows, no mouse selection).

## Terms

- **Source text**: The canonical string the user must type.
- **Cursor index**: The current character index in the source text.
- **Leading whitespace**: Spaces at the start of a line before the first non-space.
- **Indent unit**: The smallest non-zero indentation width observed in the snippet.

## Source Text Normalization

Normalization happens before the typing session begins:

- Convert Windows newlines to `\n`.
- Preserve tabs so we can distinguish tabs vs spaces.

## Engine State

- `currentIndex`: current position in source text.
- `errors`: set of indices with mistakes.
- `stopOnError`: boolean.

Errors are indexed by the source character position they correspond to.

## Core Input Rules

### Printable characters
- If `inputChar === expectedChar`, advance cursor by 1 and clear any error at that index.
- If not equal:
  - Add error at `currentIndex`.
  - If `stopOnError`: do not advance.
  - If proceed-on-error: advance by 1.

### Enter
- Treated as `\n`.
- Must match expected character to advance.

### Space
- Only advances if expected character is a space.
- Otherwise treated as a wrong key.

### Tab (Strict mode)

Tabs are treated as **literal characters** in the source text. The user must
press Tab when a tab is expected, and must press Space when a space is expected.

Rules:

1. **If expected char is `\t`:**
   - Tab advances by 1.

2. **If expected char is space:**
   - Tab is treated as a wrong key.

### Backspace

Backspace should always allow recovery.

Rules:

- Move cursor back by 1 (if already at start, no-op).
- Clear any error at the new cursor index.
- Clear **all errors at indices >= new cursor index**.
  - Rationale: any future errors are invalid once the user rewinds.

## Indentation Display

- Tabs are preserved in the source and rendered with a visible marker so the
  user can distinguish tabs vs spaces.
- Spaces remain blank to avoid visual clutter.

## Happy Paths

1. **Normal typing**
   - Exact character matches advance cursor 1 by 1.

2. **Typing indentation with spaces**
   - Space advances per character.

3. **Typing indentation with Tab**
   - Works only when the source uses tabs.

4. **Backspacing after a mistake**
   - Backspace rewinds, clears future errors, allows correct retype.

## Edge Cases

1. **Tab pressed when spaces are expected**
   - Should be treated as a wrong key and not skip content.

2. **Line with no indentation**
   - Tab should be treated as a wrong key.

3. **Empty line ("\n" immediately)**
   - Tab should not advance (wrong key).

4. **Mixed tab/space indentation**
   - Must match the source exactly; no auto-conversion.

5. **Stop-on-error ON**
   - Wrong key never advances cursor.

6. **Proceed-on-error**
   - Wrong key advances cursor, error remains until backspace rewinds past it.

## Test Matrix

- Correct typing of the sample snippet with spaces only.
- Tab at line start should land at `return` (no errors).
- Tab mid-line should register error and stay (stop-on-error).
- Backspace should remove all error highlights at and after cursor.
- Space should not scroll or bubble when typing.

## Implementation Notes

- Keydown handler must `preventDefault()` and `stopPropagation()` for handled keys
  to avoid page scrolling and focus loss.
- Tab should not trigger navigation.
- Enter can be used as a global "focus editor" shortcut when not already focused.
