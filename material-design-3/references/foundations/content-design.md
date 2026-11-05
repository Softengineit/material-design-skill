# Content design and UX writing

Rules for every string in an M3 interface: labels, titles, dialogs, errors, empty states, notifications.
UI text must be understandable by anyone, anywhere, and must survive translation; base style is Associated Press (AP) unless stated otherwise.

## Principles

- Write for the user, about the user. Say what happens to them and what they can do.
- Be clear before being clever. No jokes, no mascots talking, no forced delight.
- People scan in an F pattern. Put the most important words first in titles, sentences and notifications.
- Use short, simple sentences. Break long text with headings, short paragraphs or bullets.
- Explain consequences in neutral language. Say what an action does and how to undo it. Do not scare, nag or steer ("Big birthday bash will be deleted after 30 days", not "Are you sure you want to move to trash?").
- Specific headings and titles help people avoid mistakes when hurrying.

## Capitalization

- Sentence case everywhere: titles, headings, labels, menu items, navigation destinations, app bar titles, tabs, buttons, chips. Only the first word and proper nouns are capitalized.
- No Title Case. No ALL CAPS blocks (they are hard to read and not accessible).
- Product names and branded terms keep their own capitalization.
- In code: do not apply `text-transform: uppercase` to buttons, tabs or labels (an M2 habit that M3 drops).

## Buttons, actions and labels

- Button labels are verbs or verb phrases that say what the button does: "Save", "Delete", "Send", "Add to cart". Avoid "OK", "Yes", "No" when a specific verb fits.
- Keep labels to 1 or 2 words. Icon-only buttons need an accessibility label with the purpose, not the icon shape.
- No ellipsis on buttons or menu items, even when they open a dialog or start a process ("Save as", not "Save as...").
- No period at the end of a label.
- Use the ampersand only in headlines, column and table headers, navigation labels and buttons when space is short. Spell out "and" in sentences, before the last item in a list of three or more, and in email subject lines.
- Dialog actions: the confirming action states the outcome ("Delete", "Discard"), the dismissing action is "Cancel".

## Pronouns and voice

- Address the user as "you" and "your" ("Your mail isn't available. Try checking your Wi-Fi connection").
- Never mix "my" and "your" on the same screen. Pick "your", or drop the pronoun ("Photos" instead of "My photos").
- Avoid "I" and "we" speaking for the company; it reads as robotic or jarring. Rewrite without the pronoun.
- Exception: legal consent uses first person for ownership ("I agree to the terms of service").
- Avoid "please", "sorry" and "thank you", especially in errors. "Please" is acceptable when asking for something inconvenient.

## Punctuation and grammar (English)

- No period after a single sentence in labels, tooltips, bullets, dialog body text, links and snackbars. Use periods when there are two or more sentences or one long complex sentence.
- Use contractions ("can't", "isn't"). Spell out "do not" only when extra emphasis is needed.
- Serial (Oxford) comma in lists of three or more, except before an ampersand. Commas go inside quotation marks.
- Numbers: commas from 1,000 up to 1 million ("1,185 reviews"). No commas in addresses, years, frequencies. Above 1 million, round and abbreviate with "M" when the point is scale ("23M views").
- No colons after list headings; use a colon to introduce a list inside body text.
- Exclamation points only for real celebrations ("Congratulations!"), never for empty states or routine tasks.
- Ellipsis only to show work in progress ("Saving...") or truncation; no space before it.
- Parentheses only to define a term or acronym or cite a source, never for asides.
- Em dashes: avoid; use a comma, period or new sentence. For a range, M3 allows an en dash with no spaces (the range "9 AM to noon" written with the en dash character between the two values); writing "to" is always safe. Hyphens never have spaces around them.
- Hyphenate multi-word adjectives ("case-by-case basis") and noun phrases built from a verb plus adverb ("sign-off", "check-in"). Do not hyphenate verb phrases ("check in to the room", "drop off your car"). Common phrases like "cell phone number" need no hyphen.
- Italics only for a single word or name, never a whole sentence. Use bold for emphasis.
- Abbreviations: spell words out when there is room. No Latin abbreviations ("e.g.", "etc."); write "for example", "and more". Time abbreviations (AM, PM) are fine when correctly formatted.

## Error messages and consequences

- State what happened and what to do next, in that order, from the user's point of view: "Couldn't move photo. Check your connection and try again."
- Name the object, not "it" or "this": "Couldn't move photo", not "Couldn't move it".
- No blame, no alarm, no apology.
- Explain the result of a destructive action and the undo path before the user confirms.
- Match the visible error text to the accessibility announcement; set it as the field's supporting text and link it with `aria-describedby`; mark the field `aria-invalid="true"`.

## Global writing and localization

- Translated text averages 1.5 times the length of English (German is a common worst case). Leave room; never fix container widths to the English string.
- Short sentences, plain words, no idioms, no colloquialisms, no cultural references. "Let's go" works; "Let's get this party started" does not.
- Use global examples (holidays, not Christmas). When a local reference is unavoidable (city names, person names, currency, temperature, date format, internet providers), add a message description so translators can substitute.
- Avoid abbreviations; if used, explain them in the message description.
- Repeat the noun instead of "it", "this" or "that". Do not start a sentence with "this" or "that" unless the noun follows immediately.
- Avoid words that are both noun and verb ("filter", "change", "traffic") in the same string. Add context in the message description for ambiguous words ("home" as homepage versus house).
- Keep technical jargon out; descriptions should be simple and sometimes literal.
- Provide a message description (context note) for every string: where it appears, what the placeholders are, character limits.
- In code: externalize all strings; never concatenate sentence fragments; use ICU plural and gender forms; pass placeholders by name (`{count}`, `{name}`) so translators can reorder them; keep `lang` on `<html>` correct so screen readers pick the right voice.

## Notifications (push, in-app)

Principles: about the user, not the product; precise, timely, actionable, relevant; easy to opt out; never unsolicited ads.

| Part | Limit |
|---|---|
| Title | under 29 characters |
| Collapsed body | under 40 characters |
| Expanded body | under 80 characters (start with the collapsed body and extend it) |
| Buttons | 1 or 2, each 1 or 2 words |
| SMS, Latin script | under 160 characters |
| SMS, non-Latin script | under 134 characters |

- Lead with the point. Do not spend characters on the app name (the OS already shows it), greetings or filler.
- If the user should act, say what to do with a specific CTA; add the motivation if known.
- Target the segment that benefits; generic broadcasts lose value.
- Avoid dynamic text (user names, campaign names) in titles; it breaks limits after translation and truncated titles never expand. If needed, pair it with at most one other word and prepare a shorter fallback. Put dynamic text in the body.
- Say the day of the week, not "today", "tomorrow" or "tonight"; about 20% of people read a notification a day late. Exception: a notification that auto-dismisses at a fixed time.
- Emoji sparingly, only to add to the message, never to replace a word, never for bad news (negative-face emoji test badly). Faces and hand gestures read better than object emoji.
- No jokes. Useful beats cute.
- Do not fire onboarding-related notifications or emails during onboarding.
- Offer opt-out in context and state what the user gains or loses by changing it.
- SMS: urgent and important only; no full links or long text, since overflow splits into several messages and costs more.

## Captions, adjacent text and alt text

- Captions sit under an image, help both sighted and screen reader users, and explain how the image relates to the content. Do not duplicate the image in the caption or repeat the caption in the alt text.
- Text burned into an image is invisible to screen readers; repeat anything essential in alt text or nearby text.
- Alt text: short (140 characters at most; some guidance says 125), describes meaning in context, no "image of", `alt=""` for decorative images. Full rules in accessibility.md.

## Text in components (length limits)

- Text must not be lost when enlarged 200% or translated. Wrap, let containers grow, reflow, or scroll vertically.
- Truncate with an ellipsis only when the full text is reachable by tooltip, link or expansion.
- Fixed-space labels (app bar, navigation bar, navigation rail, fixed tabs) stay at 1x and show the enlarged text in a touch-and-hold tooltip.
- In code: `overflow-wrap: anywhere` on user-generated text, `text-overflow: ellipsis` only together with a `title` or tooltip, `min-height` not `height` on text containers.

## Pre-ship checklist for copy

- Sentence case, no title case, no caps.
- Buttons are verbs, 1 or 2 words, no ellipsis, no period.
- "You/your" only; no "my", no "we".
- No periods on single-sentence labels, tooltips or snackbars.
- No idioms, jargon, Latin abbreviations, local references without a translator note.
- Errors say what happened and what to do, naming the object.
- Notifications: title under 29, body under 40, day of week spelled out, no app name.
- Every string externalized with a message description and named placeholders.
