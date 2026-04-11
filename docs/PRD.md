# PRD — Dota 2 Draft Helper Schema Prototype

**Status:** Draft v0.1
**Owner:** Robert Bagares
**Target handoff:** Claude Code (implementation), continuing from existing Discord Activity starter project

---

## 1. Purpose

Validate a proposed hero data schema for a Dota 2 draft helper by building the smallest possible prototype that exercises it end-to-end on a hand-picked sample of heroes.

This prototype is **not** the draft helper. It is a **schema test harness** that answers one question:

> Can Layer 1 facts plus hand-curated ability tags reliably derive Layer 2 primitive scores that match an experienced player's intuition?

If the answer is yes, the schema is ready to scale to all ~125 heroes and the draft helper product can be built on top of it. If the answer is no, the schema needs revision before any further investment.

---

## 2. Background

The broader product vision is a **Discord Activity** that helps a squad draft Dota 2 matches by combining their personal match history with a trade-off matrix across game mechanics (Farm, Team Fight, Vision, Siege, Mobility) and phases (Lane, Mid, Closing). The matrix is populated by a layered data model:

- **Layer 1** — Facts from the game (attributes, abilities, talents, innates, facets) fetched from OpenDota, with hand-curated **tags** on abilities, talents, innates, and facets.
- **Layer 2** — **Primitives** (farm, teamfight, vision, siege, mobility sub-scores) derived automatically from Layer 1 tags via rules.
- **Layer 2B** — Judgment **modifiers** that tags can't express (power curve, execution difficulty, gold dependency). Hand-curated, ~6 fields per hero.
- **Layer 3** — Patch context (winrates, pickrates) fetched nightly.

The derivation from Layer 1 → Layer 2 is the novel part and the highest-risk assumption. This prototype tests it before we commit to hand-tagging the full hero pool.

---

## 3. Goals

1. Build a runnable Vite/React + Express prototype that displays the schema for 10 seed heroes.
2. Demonstrate the Layer 1 → Layer 2 derivation with a **visible trace** showing which tags contributed to each primitive score.
3. Surface the rule logic in code so it can be iterated on without touching the UI.
4. Produce a small set of hand-curated tag arrays and modifier values for the 10 seed heroes, stored as JSON in the repo.
5. Give the author a workflow for adjusting tags, re-running derivation, and seeing the impact immediately.

## 4. Non-goals

- Full hero pool. Ten heroes only.
- Matrix UI, phase columns, or draft-time aggregation across five heroes.
- Claude API integration for commentary.
- Discord Activity SDK features beyond what already exists in the starter project.
- STRATZ, Steam Web API, or any data source beyond OpenDota.
- Persistent storage (Supabase, database). JSON files in the repo are sufficient.
- Authentication, user profiles, match history.
- Styling polish. Function over form.

---

## 5. Success criteria

The prototype is successful if, after hand-tagging the 10 seed heroes:

1. **Derivation transparency** — For every primitive score shown in the UI, the user can see the list of ability/talent/innate/facet tags that contributed to it, with the rule name that matched.
2. **Intuition check** — The author (an experienced player) can review the derived primitive scores for all 10 heroes and agree with at least 80% of them without revising the underlying rules. Disagreements should be attributable to either (a) missing tags, (b) missing primitives, or (c) rule tuning — not schema shape problems.
3. **Edit loop** — The author can modify a tag in a JSON file, save, and see the derived primitive update in the UI within 2 seconds (hot reload).
4. **Portable output** — The final schema, tag vocabulary, seed hero data, and derivation rules can be handed to Claude Code as a clean starting point for the next phase of work.

---

## 6. Seed hero selection

Ten heroes chosen for archetype diversity, so the schema is stressed across the full range of Dota design space:

| Hero | Archetype | Why included |
|---|---|---|
| Anti-Mage | Farming carry, escape | Tests gold dependency, low teamfight contribution, mana-break mechanics |
| Invoker | Kit-flexibility caster | Tests innate/facet handling, execution difficulty, multi-primitive contribution |
| Tidehunter | Frontline initiator | Tests AoE hard CC, frontline, low-gold-dependency core |
| Nature's Prophet | Split-pusher, global | Tests siege, summons, global mobility |
| Crystal Maiden | Lane support, aura | Tests vision/fog reveal, low survivability, high utility |
| Pudge | Roamer, pick-off | Tests displacement, single-target CC, non-farming core |
| Zeus | Nuker, global scout | Tests vision denial, global presence, pure damage burst |
| Lina | Burst caster, flex role | Tests role viability across pos 2/4, execution difficulty 1 |
| Spectre | Late scaling carry | Tests power curve = late, global presence, sustained DPS |
| Earthshaker | Blink initiator | Tests displacement, AoE stun, high execution difficulty |

Rationale for 10: large enough to surface schema gaps (a sample of 3 won't catch the siege row problems), small enough that hand-tagging is a single evening's work.

---

## 7. Architecture

### Stack

- **Frontend:** Vite + React + TypeScript (already in place from Discord Activity starter)
- **Backend:** Express + TypeScript, new service added to the existing project
- **Data:** JSON files in `packages/schema/data/`, no database
- **Package structure:** Monorepo-lite — frontend, backend, and schema package share types via a workspace

```
/
├── apps/
│   ├── client/              ← existing Vite/React (Discord Activity starter)
│   │   └── src/
│   │       └── pages/
│   │           └── SchemaInspector.tsx   ← new
│   └── server/              ← new Express service
│       └── src/
│           ├── index.ts
│           ├── routes/
│           │   ├── heroes.ts
│           │   └── primitives.ts
│           └── derivation/
│               ├── rules.ts              ← the Layer 1 → Layer 2 logic
│               └── traces.ts             ← derivation trace builder
└── packages/
    └── schema/
        ├── src/
        │   ├── types.ts                  ← TypeScript types for Layer 1/2/2B/3
        │   └── tagVocabulary.ts          ← closed set of allowed tags
        └── data/
            ├── heroes/
            │   ├── antimage.json         ← Layer 1 + 2B, hand-curated tags
            │   ├── invoker.json
            │   └── ...8 more
            └── opendota-cache/           ← raw OpenDota fetches, committed
```

### Data flow

1. **Ingest (one-time script):** Fetch OpenDota `/heroes`, `/constants/abilities`, `/constants/hero_abilities` for the 10 seed heroes. Write raw JSON to `opendota-cache/`.
2. **Author (manual):** For each of the 10 heroes, create a `{slug}.json` that:
   - References the cached OpenDota data for Layer 1 numeric fields
   - Adds hand-curated `tags` arrays to each ability, talent, innate, and facet
   - Adds the 6 `modifiers` values
   - Adds `roles_viable` scores
3. **Derive (runtime):** Express endpoint `GET /api/heroes/:slug` loads the hero JSON, runs Layer 1 → Layer 2 derivation rules, and returns Layer 1 + Layer 2 + derivation traces.
4. **Display (frontend):** React page renders the hero, its primitives, and an expandable trace per primitive showing which tags matched which rules.

### API surface

Minimal, just enough for the test harness:

- `GET /api/heroes` — list of 10 seed heroes (slug + name + primary_attr)
- `GET /api/heroes/:slug` — full Layer 1 + derived Layer 2 + traces for one hero
- `GET /api/vocabulary` — the tag vocabulary (returned so the frontend can validate and autocomplete)

No POST/PUT endpoints. Editing happens by modifying JSON files on disk and relying on hot reload.

---

## 8. The derivation layer (the part that matters)

This is the core of the prototype. Everything else is scaffolding.

### Rules format

Each rule is a named function that takes a hero's Layer 1 data and returns a primitive score (0–3) plus a trace. Rules live in `apps/server/src/derivation/rules.ts` and are organized by primitive.

Example:

```ts
// Simplified illustration
export const burstAoeRule: Rule = {
  primitive: "teamfight.burst_aoe",
  compute: (hero) => {
    const contributions: Contribution[] = [];

    for (const ability of hero.abilities) {
      const isAoE = ability.tags.some(t =>
        ["aoe_circle", "aoe_line", "aoe_cone"].includes(t)
      );
      const isBurst = ability.tags.includes("burst_aoe");

      if (isAoE && isBurst) {
        const damage = ability.numeric?.damage ?? 0;
        const score = Math.min(3, damage / 150);
        contributions.push({
          source: ability.name,
          sourceType: "ability",
          tags: ability.tags.filter(t => ["aoe_circle", "aoe_line", "aoe_cone", "burst_aoe"].includes(t)),
          scoreContribution: score,
          note: `${damage} AoE burst damage`
        });
      }
    }

    // Also check talents for burst_buff + aoe combos
    // ...

    const total = Math.min(3, contributions.reduce((sum, c) => sum + c.scoreContribution, 0));
    return { score: Math.round(total), trace: contributions };
  }
};
```

The important part is not the exact formula — those need tuning — but that **every primitive score is accompanied by a structured trace** listing which abilities/talents/tags produced it.

### Rule coverage for v1

The prototype needs rules for the primitives that appear in the schema. Exhaustive list:

- **Farm:** last_hit, waveclear, jungle_solo, stack_farm, ranged_creep_secure
- **Teamfight:** burst_single, burst_aoe, sustained_dps, cc_hard, cc_soft, displacement, disarm_pressure, break_presence, dispel_pressure, save_ally, frontline, init_range
- **Vision:** range_advantage, fog_reveal, deward, detection, scout_global, vision_denial
- **Siege:** tower_damage, summons_push, spell_push, rosh_burst, smoke_gank
- **Mobility:** native_speed, blink_mechanic, self_mobile, global_presence

32 primitives. Each needs at least a stub rule. Some rules read the same tags, which is fine — the rules are cheap.

### Tag vocabulary

Locked as a closed enum in `packages/schema/src/tagVocabulary.ts`. Adding a tag requires editing this file; hero JSON files validated against it. Starting vocabulary (~50 tags) is carried over from the schema design conversation and tuned during hero authoring.

---

## 9. UI requirements

One page. No routing, no navigation, no authentication.

**Layout:**
- Left: list of 10 seed heroes. Click to select.
- Right: selected hero view with four sections stacked vertically:
  1. **Header** — name, primary attribute, attack type, portrait (hotlinked from Valve CDN for simplicity)
  2. **Layer 1 facts** — attributes table, innate, facets, abilities (collapsible), talents
  3. **Layer 2 primitives** — the five rows (farm, teamfight, vision, siege, mobility) with primitive scores rendered as 0–3 dots or bars
  4. **Derivation trace** — for each primitive, click to expand a list showing: rule name, contributing abilities/talents, matched tags, score contribution, note

**Interaction goals:**
- Click a primitive score → see why it got that score
- Click a tag on an ability → see which primitives it feeds into
- The whole page re-renders when a hero JSON changes on disk (Vite HMR handles the client; the Express endpoint re-reads from disk on every request so there's no cache to bust)

**What the UI is deliberately NOT:**
- Pretty. Use basic flexbox and default fonts. This is a test harness.
- Interactive in the "edit tags in the browser" sense. Edits happen in JSON files.
- Responsive. Desktop only, fixed width is fine.

---

## 10. Acceptance checklist

The prototype is done when:

- [ ] 10 seed hero JSON files exist in `packages/schema/data/heroes/` with complete Layer 1 + tags + modifiers + roles_viable
- [ ] Tag vocabulary file exists and all hero JSONs validate against it
- [ ] OpenDota cache fetch script exists and is runnable via `npm run fetch-opendota`
- [ ] Express server runs on a known port and serves the 3 API endpoints
- [ ] Vite client loads, lists the 10 heroes, and renders the full schema inspector page for any selected hero
- [ ] Derivation traces are visible and correct for at least 5 primitives on 3 different heroes
- [ ] Hot reload works: edit a tag in a hero JSON, see the primitive score update in the UI within 2 seconds
- [ ] The author has reviewed all 10 heroes' derived primitives and recorded agreement/disagreement in a `notes.md` file for the next iteration
- [ ] README explains how to run the project and where to edit tags

---

## 11. Open questions for the implementer

Intentionally left open. Claude Code should propose answers during implementation:

1. **Monorepo tooling** — does the existing Discord Activity starter use npm workspaces, pnpm, or something else? Match whatever's already there.
2. **Express + Vite dev experience** — single dev command (concurrently) or two terminals? Either is fine; pick the simpler one.
3. **Portrait URLs** — hotlink from `cdn.cloudflare.steamstatic.com` or cache locally? Hotlink for v1 unless CSP blocks it inside the Discord Activity iframe.
4. **Score rounding** — primitives are 0–3 integers in the schema, but derivation produces floats. Round at display time or at derivation time? Probably display time, so traces can show the raw float.
5. **Facet handling** — the schema has facets as first-class, but for v1 the prototype can ignore facet switching and use the first facet by default. Flag this in the UI.

---

## 12. Explicit next steps after prototype

Once the prototype validates the schema:

1. Expand to full hero pool (~125 heroes), hand-tagging driven by the vocabulary and rule set proven in v1.
2. Add STRATZ integration for pre-computed matchup data.
3. Begin the actual draft helper UI (the three-pane layout: individual panels, team draft board, enemy draft, hero picker).
4. Add Claude API integration for commentary and strategy narration.
5. Wire up Supabase Realtime for multi-player state sync inside the Discord Activity.

None of these are in scope for this PRD. They exist only to make clear what the prototype is setting up.

---

## Appendix A — Reference schema shape

See the schema design conversation for the full shape. Summary:

```
Layer 1 (facts + tags)
├── attributes (base_str, str_gain, move_speed, vision_day/night, ...)
├── innate { id, name, tags[] }
├── facets[] { facet_id, name, tags[] }
├── abilities[] { id, slot, name, type, affects, tags[], numeric{} }
└── talents[] { level, option_left{text, tags[]}, option_right{text, tags[]} }

Layer 2 (derived primitives)
├── farm { last_hit, waveclear, jungle_solo, stack_farm, ranged_creep_secure }
├── teamfight { burst_single, burst_aoe, sustained_dps, cc_hard, cc_soft, displacement, disarm_pressure, break_presence, dispel_pressure, save_ally, frontline, init_range }
├── vision { range_advantage, fog_reveal, deward, detection, scout_global, vision_denial }
├── siege { tower_damage, summons_push, spell_push, rosh_burst, smoke_gank }
└── mobility { native_speed, blink_mechanic, self_mobile, global_presence }

Layer 2B (judgment modifiers)
├── power_curve (early|mid|late|flex)
├── gold_dependency (0-3)
├── mana_dependency (0-3)
├── execution_difficulty (0-3)
├── ally_dependency (0-3)
└── skill_floor_cooldown (0-3)

roles_viable { pos_1..pos_5, each 0-3 }

Layer 3 (patch context, fetched)
└── patch_meta { patch_version, global_winrate, pickrate, last_updated }
```
