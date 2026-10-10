# UX writing

> Reference file for `DESIGN.md` (Inspera Design System). Read it when you write or review any UI text: labels, buttons, messages, errors, empty states, dates and numbers. `DESIGN.md` wins if the two disagree.

This follows Inspera's writing guidelines (Writing goals, Writing principles, Content structure, Grammar and mechanics). It applies to all UI text on all product surfaces and for every role. Readers include non-native speakers, educators and students under stress.

## Writing goals

Every piece of UI text aims to be:

| Goal | Means | In short |
| --- | --- | --- |
| **Clear** | Every sentence reduces friction. No jargon, no ambiguity. | Direct, simple, unambiguous |
| **Calm and confident** | Sound expert without sounding rigid. | No urgency unless necessary |
| **Neutral** | Encourage users without emotional overreach. | No emotional language |
| **Efficient and precise** | Short sentences, purposeful words, no fluff. | Specific instructions |
| **Accessible and inclusive** | Language that works for non-native speakers and neurodiverse users. | Accessible to all users |

## Writing principles

| Principle | Do | Don't |
| --- | --- | --- |
| **Be clear:** direct, simple, unambiguous | Use simple words: everyday language over technical terms. Be specific: say exactly what will happen. Use short sentences. Front-load the key information. | Use jargon or domain-heavy terms. Hedge ("maybe", "possibly", "sort of"). Bury instructions; keep steps visible and in order. Use metaphors; they confuse non-native speakers. |
| **Be calm and confident:** expert and steady, reassuring without being emotional | Use steady language ("Your progress is saved."). Sound competent with clear, factual statements. Reduce stress with guidance. Be predictable; consistent phrasing builds trust. | Use urgency ("Hurry!", "Quick!"). Use emotional reassurance ("Don't worry!", "You're doing great!"). Dramatise issues; keep errors calm and factual. Over-explain; confidence comes from brevity. |
| **Be neutral:** helpful, unbiased, non-judgemental | Offer options neutrally ("Choose the option that fits best."). Guide without pushing: suggest, don't pressure. Use non-judgemental phrasing that doesn't imply mistakes. Acknowledge user autonomy: users stay in control. | Blame users ("You failed to…"). Assume intent ("You must want to…"). Praise or criticise ("Great job!", "Incorrect!"). Add emotional colour. |
| **Be efficient:** minimal, purposeful, friction-reducing | Cut unnecessary words. Use action-oriented phrasing ("Upload file", "Start exam"). Keep steps linear: one action per sentence. Use consistent patterns. | Add fluff or filler phrases. Repeat information; users skim. Stack actions in multi-step sentences. Write long paragraphs; break text into digestible pieces. |
| **Be accessible:** understandable for non-native speakers, neurodiverse users and stressed users | Use plain language and simple vocabulary. Write for scanning: short lines, clear structure. Use consistent terminology; no synonyms for the same concept. Support cognitive ease. | Use idioms. Use complex grammar. Rely on cultural references or region-specific phrasing. Hide instructions; make actions explicit. |

## Content structure

| Pattern | Rule | Do | Don't |
| --- | --- | --- | --- |
| **Clarity** | When a phrase describes a goal and the action needed to reach it, start with the **objective** and end with the **action**. Use short, factual sentences that confirm outcomes. | "To submit your exam, click Submit." / "Your file is uploaded." | "Click Submit to finish your exam." (action before goal) / "We think your file has been uploaded successfully!" (hedging, emotional) |
| **Calm confidence** | Reassure through clarity, not emotion. State facts calmly and show recovery. | "Connection lost. Reconnecting…" / "Your progress is saved." | "Oh no! You've lost your connection!" / "Don't worry, we've saved your progress!" |
| **Supportive neutrality** | Guide without judgement or emotional bias. Encourage autonomy, and offer flexibility without pressure. | "Choose the option that fits best." / "You can edit your response anytime." | "Pick the right answer." (implies judgement) / "Make sure your answer is perfect before submitting." (anxiety, perfection framing) |
| **Efficiency** | Keep copy short and purposeful. One clear action per sentence. | "Upload file." / "Start exam." | "Please take a moment to upload your file so we can proceed." (filler) / "Begin your exam by clicking the Start button." (repeats the label) |

## Grammar and mechanics

**Basics**

- **Write for all readers.** Keep sentences short, direct and easy to scan.
- **Focus your message.** Lead with the main point. One idea per sentence.
- **Be concise.** Use short words and sentences, and remove unnecessary modifiers and filler.
- **Be specific.** Replace vague words ("soon", "some", "a few") with exact details.
- **Be consistent.** Use the same tone and terminology across all components.

**Guidelines**

| Topic | Rule | Do | Don't |
| --- | --- | --- | --- |
| Abbreviations and acronyms | Spell out the first mention, then use the abbreviation. Widely known ones (API, HTML) can be used directly. | First use: "Coordinated Universal Time (UTC)". Then: "UTC" | Leading with the acronym: "UTC (Coordinated Universal Time)" |
| Active voice | Use active voice. Avoid "was", "were" and "by" unless the action matters more than the actor. | "The system saved your response." | "Your response was saved by the system." |
| Capitalisation | Sentence case for all UI text and headings: capitalise only the first word and proper nouns. Never capitalise words for emphasis. | "Submit answers" | "Submit Answers" |
| Contractions | Use contractions to sound natural ("you're", "can't", "don't"). | "You can't change this after submitting." | Overly formal phrasing: "You are required to…" |
| Numbers | Use numerals, except at the start of a sentence. Use commas for thousands. Abbreviate large numbers only when space is limited. | "You can upload up to 1,000 files." | "You can upload up to one thousand files." |
| Dates | Spell out the day and month. | "Exam starts Monday, 24 August at 14:00." | "Exam starts Mon., Aug. 24 at 2 PM." |
| Time | 24-hour format; no AM/PM. | "Exam starts at 09:00." | "Exam starts at 9 AM." |
| Percentages | Use the % symbol. | "You've completed 75% of the exam." | "You've completed seventy-five percent of the exam." |
| Ranges and spans | Use a hyphen. | "The exam lasts 20-30 minutes." | "The exam lasts between 20 to 30 minutes." |
| Currency | Symbol before the amount; decimals only when needed. | "€20" | "20 euros" |
| Temperature | Degree symbol and capital C. | "22°C" | "22 degrees Celsius" |
| Telephone numbers | Dashes, no spaces; include the country code when relevant. | "+47-123-4567" | "+47 123 4567" |

## Applying it to common UI text

- **Buttons and actions:** a verb plus the object ("Save changes", "Delete assessment"), in sentence case. Never "OK", "Yes" or "Submit" alone.
- **Same words everywhere:** if the list says "Assessments", the button says "New assessment" and the dialog says "Delete assessment?".
- **Errors:** what's wrong and how to fix it, calmly and without blame: "Enter an end date after the start date", not "Invalid date" or "You entered a wrong date!".
- **Empty states:** what's missing and what to do next: "No assessments yet. Create one to get started." + "New assessment".
- **Destructive confirmations:** name the object and the consequence: "Delete 'Algebra Quiz'? Candidates' responses will be deleted. You can't undo this."
- **Status and system messages:** state the fact and the recovery ("Connection lost. Reconnecting…"). Use no exclamation marks.
- **Form fields:** use one convention per form for marking required or optional fields, never both.
- **Dates and times in components:** format displayed dates and times by the rules above ("Monday, 24 August 2026", "14:00"). Store and send ISO values (`YYYY-MM-DD`) underneath.

