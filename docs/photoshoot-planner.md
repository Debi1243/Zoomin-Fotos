# Plan My Photoshoot (phones only)

A visitor uploads or takes a photo of a place and gets 8 to 10 poses made for that spot: where to stand,
step-by-step posing, hands, head and legs, why it works there, camera angle and phone lens, lighting with
alternatives, outfit ideas, and a ready-to-copy AI image prompt for each pose.

- Page: `/plan`, linked only from the phone menu. On a computer the page shows a short "phone tool" note and nothing runs.
- AI: OpenAI (`gpt-5.4` by default, change with `OPENAI_MODEL`) when `OPENAI_API_KEY` is set; otherwise Anthropic's Claude
  (`claude-opus-5-5`) when `ANTHROPIC_API_KEY` is set. Called from a server action (`src/app/plan/actions.ts`) with structured
  output, so every plan has the same shape (`src/lib/shoot-plan.ts`). The API key never reaches the browser.
- Photos: resized in the browser to 1568px on the longer side, sent once for analysis, not stored by the website.
- Person reference: the visitor can say they will use a photo of the person in their own AI image app. That photo is
  never uploaded here; it only changes how the prompts are written (keep the same face and identity).
- Saved poses, edited prompts and favourites stay in the visitor's browser.
- "Use this pose" builds a shot list that the visitor can send to the studio on WhatsApp to book the shoot.
- Image generation is not built in: the site has no image-generation service, so visitors copy the prompt into their own app.

## Switching it on

1. Create an API key at https://platform.openai.com/api-keys and make sure the account has billing credit.
   Never paste the key into a chat, email or the code.
2. On the server, add to `deploy/.env` (the file is not in git):

   ```
   OPENAI_API_KEY=sk-proj-...
   PLANNER_DAILY_LIMIT=150
   ```

   Optional: `OPENAI_MODEL=...` to use a different OpenAI model, or `ANTHROPIC_API_KEY=...` instead of OpenAI to use Claude.

3. Restart the site container (`docker compose up -d` in `deploy/`). Until the key is set, the page explains that the
   planner isn't switched on yet and points visitors to WhatsApp.

## Cost and limits

- Each plan is one request with one photo; expect roughly a few rupees to around ₹25 per plan depending on length
  (check the OpenAI usage page for real costs).
- Each visitor can make 5 plans an hour, and the whole site `PLANNER_DAILY_LIMIT` plans a day (default 150).
  Limits reset when the container restarts.
- The GitHub Pages copy of the site has no server, so the planner there only says to use zoominfotos.in.
