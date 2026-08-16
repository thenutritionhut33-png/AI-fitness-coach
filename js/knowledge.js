// FitCoach AI - Expert Knowledge Base
// Each coach has intents: { keywords: [], response: string (supports **bold** and line breaks) }

window.COACHES = [
  {
    id: "trainer",
    name: "Personal Trainer",
    shortName: "Personal Trainer",
    desc: "Foundations, form & programming",
    tagline: "Building your foundation, one rep at a time",
    avatar: "PT",
    color: "#ff3d3d",
    greeting: "Hey champ! I'm your Personal Trainer. I'll help you build a rock-solid foundation with proper form, sensible programming, and progressive overload. What's your current experience level?",
    intents: [
      {
        keywords: ["beginner", "start", "new to", "just starting", "first time", "no experience", "novice"],
        response: "**Great place to start!** As a beginner, your goal is to build a foundation:\n\n- **Frequency:** Train 3x/week full-body\n- **Core lifts:** Squat, Deadlift, Bench Press, Overhead Press, Rows\n- **Sets/Reps:** 3 sets x 8-12 reps with a weight that feels challenging on the last 2 reps\n- **Rest:** 60-90 seconds between sets\n\n**Full-body plan (Day A):**\n1. Goblet Squat 3x10\n2. Bench Press (dumbbell ok) 3x10\n3. Seated Row 3x10\n4. Plank 3x30s\n5. Face Pulls 2x15\n\nMaster form first. Weight comes second. Train hard but smart!"
      },
      {
        keywords: ["deadlift", "dead lift", "hinge"],
        response: "**Deadlift form checklist:**\n\n- Bar over mid-foot, feet hip-width\n- Grip just outside your legs\n- Chest up, flat back, lats tight\n- Push the floor away - don't yank with your back\n- Stand tall, squeeze glutes at the top, lower controlled\n\n**Common mistakes:**\n- Rounding the lower back\n- Bar drifting away from your shins\n- Using arms to pull (your back should carry it)\n\n**Progression:** Start light (5x5) and add 2.5kg per week while form stays crisp. Video yourself from a 45-degree angle to check your back angle."
      },
      {
        keywords: ["squat"],
        response: "**Squat form checklist:**\n\n- Feet shoulder-width, toes slightly out\n- Brace your core before descending\n- Sit DOWN between your hips, not back\n- Knees track over toes\n- Depth: hip crease below knee (or as low as comfortable)\n- Drive up through mid-foot, squeeze glutes\n\n**Fix the squat:**\n- Ankle mobility? Elevate heels slightly on plates\n- Falling forward? Push chest up and cue 'show me your shirt logo'\n- Depth issue? Box squats to build confidence\n\nStart with goblet squats if you're new, progress to back squat when movement quality is clean."
      },
      {
        keywords: ["bench", "chest", "press"],
        response: "**Bench press checklist:**\n\n- Retract scapula (pinch shoulder blades) - stay tight\n- Feet planted, glutes on bench\n- Bar path: lower to mid-chest, press slightly back toward shoulders\n- Full lockout at top, control the descent\n\n**Programming tip:**\n- Strength: 4-5 sets x 3-6 reps heavy\n- Hypertrophy: 3-4 sets x 8-12 reps\n- Stick to 1-2 bench sessions/week, progress weekly\n\nDumbbell bench is a great accessory for fixing imbalances. If your shoulder hurts, lower the bar to the nipple line, not the neck."
      },
      {
        keywords: ["push up", "pushup", "pull up", "pullup", "bodyweight", "calisthenic"],
        response: "**Bodyweight fundamentals:**\n\n**Push-ups:**\n- Hands shoulder-width, body in a straight line\n- Elbows at ~45 degrees from torso\n- Lower chest to ground, push through the whole palm\n- Can't do one? Start on knees or incline bench\n\n**Pull-ups:**\n- Dead hang to start, retract shoulders\n- Drive elbows down to bring chin over bar\n- Progress: negatives (5s slow descent) or banded pull-ups\n\n**Beginner bodyweight program (3x/week):**\n1. Push-ups 3x max\n2. Pull-ups (or rows) 3x max\n3. Air squats 3x15\n4. Lunges 3x10/leg\n5. Plank 3x45s\n\nProgress by adding reps, slowing tempo, or adding weight (backpack)."
      },
      {
        keywords: ["rest day", "recovery", "sleep", "overtrain"],
        response: "**Recovery is where you grow.**\n\n- **Sleep:** 7-9 hours - non-negotiable for muscle repair\n- **Rest days:** 1-2 full rest days per week minimum\n- **Deload week:** every 6-8 weeks, drop volume by 40-50%\n- **Hydration:** 3-4L water daily\n- **Stretching/mobility:** 5-10 min daily\n\n**Signs you're overtraining:**\n- Constant fatigue, poor sleep\n- Strength dropping for 2+ weeks\n- Elevated resting heart rate, mood swings\n\nIf that's you: cut volume, increase sleep, and give the body what it needs. Growth happens outside the gym!"
      },
      {
        keywords: ["cardio", "warm up", "warmup", "cool down", "cool down"],
        response: "**Warm-up protocol (before every session):**\n\n1. 5 min light cardio (bike or row)\n2. Dynamic stretches: leg swings, arm circles, hip openers\n3. Movement prep: 2x10 bodyweight squats, band pull-aparts\n4. Light warm-up sets of your first lift (40-60% working weight)\n\n**Cool-down:**\n- 5 min easy cardio\n- Static stretching for muscles trained (30s each)\n- Deep breathing to lower heart rate\n\n**Cardio for lifters:** 2-3 sessions/week, moderate intensity 20-30 min, ideally on rest days so it doesn't tax your lifting performance."
      },
      {
        keywords: ["how often", "frequency", "split", "schedule", "weekly", "program"],
        response: "**Weekly programming options:**\n\n**3-day (beginner):**\n- Mon: Full body A | Wed: Full body B | Fri: Full body C\n\n**4-day (intermediate) - Upper/Lower:**\n- Mon: Upper | Tue: Lower | Thu: Upper | Fri: Lower\n\n**5-day (advanced) - Bro Split:**\n- Mon: Chest | Tue: Back | Wed: Legs | Thu: Shoulders | Fri: Arms\n\n**Rules:**\n- Each muscle trained 2x/week for best growth (upper/lower wins)\n- 10-20 hard sets per muscle per week\n- Consistency beats perfection\n\nTell me your days available and I'll tailor it!"
      }
    ]
  },
  {
    id: "nutritionist",
    name: "Nutritionist",
    shortName: "Nutritionist",
    desc: "Fuel, macros & meal plans",
    tagline: "Eat for performance, look like the result",
    avatar: "NU",
    color: "#22c55e",
    greeting: "Hello! I'm your Nutritionist. Whether you want to build, cut, or just eat better, I'll help you set up sustainable nutrition. What's your goal?",
    intents: [
      {
        keywords: ["meal plan", "diet plan", "food plan", "eat today", "meal prep"],
        response: "**Here's a balanced 1-day meal plan (~2,000 kcal, 150g protein):**\n\n**Breakfast (7:30):**\n- 3 eggs + 60g oats + banana + 30g protein powder (smoothie)\n\n**Snack (10:30):**\n- Greek yogurt 170g + handful of berries\n\n**Lunch (13:00):**\n- 150g chicken breast + 150g rice + large mixed salad + olive oil\n\n**Snack (16:00):**\n- Apple + 15 almonds\n\n**Dinner (19:30):**\n- 150g salmon + sweet potato + green veg\n\n**Post-workout (if training):** 30g whey + banana\n\nSwap proteins (beef, turkey, tofu), carbs (pasta, potato), and fats (avocado, nuts) to keep variety. Tell me your weight and goal and I'll adjust calories and protein."
      },
      {
        keywords: ["protein", "how much protein"],
        response: "**Protein targets:**\n\n- **Muscle building:** 1.6-2.2g per kg bodyweight (0.7-1g/lb)\n- **Cutting/weight loss:** aim for the higher end to preserve muscle\n- **Per meal:** 20-40g for best muscle protein synthesis\n\n**Examples of 30g protein:**\n- 120g cooked chicken breast\n- 170g Greek yogurt\n- 40g whey protein\n- 4 large eggs\n- 150g tofu\n\n**Tip:** Spread protein across 3-5 meals daily. Eat it at every meal, not just dinner. Complete proteins (animal) have all amino acids; plant-based - combine rice + beans."
      },
      {
        keywords: ["cut", "cutting", "fat loss", "lose weight", "lose fat", "shred", "lean out", "deficit"],
        response: "**Fat loss fundamentals - the sustainable way:**\n\n- **Caloric deficit:** ~10-20% below maintenance (500g-1kg per week max)\n- **Protein HIGH:** 2g/kg to keep muscle\n- **Keep training heavy:** deficit + lifting = keep muscle, lose fat\n- **Water & fiber:** 3L water, 25-30g fiber daily\n\n**Sample 1,600 kcal cut day:**\n- B: Egg white omelette + oats\n- L: Big salad + 150g chicken + 100g rice\n- D: 150g white fish + veg + 50g sweet potato\n- Snacks: protein shake, veggies\n\n**Reality check:** 80% of results = adherence. Pick foods you actually enjoy, or you'll quit by week 2. Weigh yourself 3x/week and track the trend, not the daily number."
      },
      {
        keywords: ["bulk", "bulking", "gain weight", "gain muscle", "build muscle", "mass", "surplus"],
        response: "**Bulk smart, don't get sloppy:**\n\n- **Surplus:** +200-400 kcal/day over maintenance\n- **Target rate:** 0.25-0.5% bodyweight gain per week (lean bulk)\n- **Protein:** 1.6-2.2g/kg, carbs fuel your training\n- **Gain quality:** heavy compound lifts, 6-10 rep range\n\n**Sample bulk day (+2,800 kcal):**\n- B: 60g oats + 3 eggs + banana + peanut butter\n- Snack: protein shake + rice cake\n- L: 200g chicken + 250g rice + veg\n- Snack: Greek yogurt + honey + granola\n- D: 200g beef + pasta + avocado\n\n**Tip:** A 'dirty bulk' (junk food) adds more fat than muscle. Keep it clean-ish. If you're gaining over 1% bodyweight/week, you're adding fat."
      },
      {
        keywords: ["carbs", "carbohydrate", "low carb", "keto", "carb cycling"],
        response: "**Carbs: friend, not enemy.**\n\n- **Athletes need carbs** - they're your training fuel (glycogen)\n- **Recommendation:** 3-6g/kg bodyweight depending on training volume\n- **Low-carb/keto:** can work for weight loss but often tanks gym performance\n\n**Best carb sources:**\n- Oats, rice, potatoes, sweet potatoes, fruits, whole grains\n\n**When to eat them:**\n- Around training (before/after) for performance and recovery\n- 25-35% of calories from fat keeps hormones healthy; don't go too low\n\n**Bottom line:** unless you're competing or have a medical reason, moderate carbs beat extreme low-carb for lifters."
      },
      {
        keywords: ["supplement", "supplements", "whey", "creatine", "bcaa", "pre workout", "pre-workout"],
        response: "**Supplements that actually work (tier 1):**\n\n1. **Creatine monohydrate** - 3-5g daily. Only supplement with decades of evidence. No need to load.\n2. **Protein powder** - convenient way to hit protein targets (not magic)\n3. **Caffeine** - 2-3mg/kg pre-workout for focus/energy\n4. **Vitamin D & Omega-3** - for most people, a good baseline\n\n**Skip (mostly hype):**\n- BCAAs (you get them from protein)\n- Fat burners, test boosters, detox teas\n- 'Anabolic' supplements - they're marketing, not medicine\n\n**Rule:** Food first, supplements fill gaps. If the label makes promises, it's probably garbage."
      },
      {
        keywords: ["water", "hydration", "alcohol", "sugar", "junk food", "cheat meal"],
        response: "**Nutritional habits that move the needle:**\n\n- **Water:** 30-40ml per kg bodyweight daily, more when training hard\n- **Alcohol:** it blocks muscle protein synthesis and kills sleep - keep it rare\n- **Sugar:** fine in moderation around training; the problem is excess, not sugar itself\n- **Cheat meals:** schedule them! One planned meal/week won't kill progress; binges happen when you feel deprived\n\n**The 90/10 rule:** 90% of your week from whole foods, 10% flexibility. That's how you stay consistent for years, not weeks."
      }
    ]
  },
  {
    id: "crossfit",
    name: "CrossFit Coach",
    shortName: "CrossFit Coach",
    desc: "WODs, metcons & engine building",
    tagline: "Forging elite fitness, one WOD at a time",
    avatar: "CF",
    color: "#f59e0b",
    greeting: "What's up! I'm your CrossFit coach. Work capacity, gymnastics, olympic lifting, engine work - I've got you. Ready to suffer? Let's build your engine. What do you want to train today?",
    intents: [
      {
        keywords: ["wod", "workout of the day", "today's workout", "daily workout"],
        response: "**Here's today's WOD - 'FRANKENSTEIN':**\n\n**Buy-in (5 min max):**\n- 20 Wall Balls (9/6kg)\n- 20 Box Jumps (24/20in)\n\n**Then 3 Rounds for time (18 min cap):**\n- 400m Run\n- 15 Power Snatches (40/27kg)\n- 15 Toes-to-Bar\n\n**Scaling:**\n- Wall balls: 6/4kg\n- Box jumps: 20/16in step-downs\n- Snatches: 30/20kg or dumbbells\n- T2B: knees-to-chest or hanging knee raises\n\n**Stimulus:** Push the runs, keep the barbell unbroken. Finish strong!"
      },
      {
        keywords: ["hero wod", "murph", "open", "competition", "leaderboard"],
        response: "**Murph - the classic test:**\n\n- 1 mile Run\n- 100 Pull-ups\n- 200 Push-ups\n- 300 Air Squats\n- 1 mile Run\n*(wearing a 20lb vest if you're advanced)*\n\n**Strategy (RX: 35-45 min):**\n- Partition everything: 5/10/15 rounds of 5 pull-ups, 10 push-ups, 15 squats\n- Run mile 1 at 70%, push mile 2 harder\n- Break pull-ups early before you fry\n\n**Scaling:**\n- Pull-ups: banded or ring rows\n- Push-ups: knees\n- Halved reps if you're new to it\n\n**Recovery:** this is a big stimulus - go easy the next day!"
      },
      {
        keywords: ["snatch", "clean and jerk", "clean & jerk", "oly", "olympic lifting"],
        response: "**Olympic lifting basics:**\n\n**Power Snatch:**\n- Start: hips below shoulders, bar over mid-foot\n- First pull: bar stays close, back angle constant\n- Second pull: explode, shrug, pull under\n- Catch in a shallow squat, stand tall\n\n**Drills to build it:**\n- High pulls\n- Hang snatch from power position\n- Muscle snatch (no dip)\n\n**Clean & Jerk:**\n- Clean: same pull, catch in front rack (elbows high)\n- Jerk: dip straight down, drive up, punch under with arms locked\n\n**Coach's rule:** Empty bar drills until movement is perfect. Speed + timing beats loading every time. Watch your elbows - keep them fast and high in the rack."
      },
      {
        keywords: ["metcon", "metabolic", "conditioning", "engine", "cardio wod", "endurance"],
        response: "**Engine-building metcon - 'AEROBIC CAP':**\n\n**5 Rounds for quality (not time):**\n- 500m Row\n- 30 Double-Unders\n- 20 Kettlebell Swings (24/16kg)\n- 10 Burpees\n\n**How to pace it:**\n- This is aerobic - conversational effort, don't redline\n- Rest 60-90s between rounds\n- Goal: consistent splits, unbroken-ish movements\n\n**For pure engine work (monostructural):**\n- 3x8 min intervals: 4 min @ 80% / 4 min @ easy on bike or rower\n\n**Rule:** 80% of your conditioning should be steady-state aerobic; 20% high-intensity. That builds a base that makes everything else feel easier."
      },
      {
        keywords: ["gymnastic", "muscle up", "handstand", "pistol", "dip", "toes to bar"],
        response: "**Gymnastics progression (boring basics win):**\n\n**Muscle-up path:**\n1. Strict pull-ups 3x10\n2. Ring dips 3x10\n3. Chest-to-bar pull-ups\n4. Muscle-up transitions (ring rows low to high)\n5. Kipping swing mastery before the first rep\n\n**Handstand path:**\n1. Wall walk-ups\n2. Wall handstand holds 3x60s\n3. Wall walks (form: hollow body, tight core)\n4. Free-standing balance work against wall, then kick up\n\n**Toes-to-bar:**\n- Start: hanging knee raises 3x15\n- Then: knees-to-elbows\n- Then: strict T2B, then kipping\n\n**Patience rule:** gymnastics is a year+ journey. Do 10-15 min of skill work BEFORE each WOD."
      },
      {
        keywords: ["scal", "rx", "modification", "new to crossfit", "beginner crossfit"],
        response: "**Scaling 101 - every WOD is for everyone:**\n\n- **RX** = as written (the athlete's version)\n- **Scaled** = same stimulus, different loading/movement\n\n**How to scale smart:**\n1. Reduce weight (main goal: keep moving)\n2. Reduce reps or rounds\n3. Simplify movement (jump rope -> singles, T2B -> knee raises)\n4. Add rest if intensity is the limiter\n\n**As a new CrossFitter:**\n- Scale everything for the first month\n- Learn the movement standards first\n- Ask your coach for the 'prescribed stimulus' - that's what you're chasing, not the number on the board\n\n**The golden rule:** Intensity is the goal, but technique is the gatekeeper. Sloppy reps don't count."
      }
    ]
  },
  {
    id: "yoga",
    name: "Yoga Instructor",
    shortName: "Yoga Instructor",
    desc: "Flow, breath & mobility",
    tagline: "Strength through stillness, flexibility through practice",
    avatar: "YO",
    color: "#8b5cf6",
    greeting: "Namaste. I'm your Yoga instructor. Breath, strength, flexibility, and calm - this practice is for every body. Shall we begin with a sequence? Tell me how you're feeling today.",
    intents: [
      {
        keywords: ["morning", "start my day", "wake up", "morning routine", "energy"],
        response: "**Morning flow - 'Sunrise Awakening' (10-15 min):**\n\n1. **Child's Pose** - 5 slow breaths, drop tension\n2. **Cat-Cow** - 10 rounds, wake the spine\n3. **Downward Dog** - 5 breaths, pedal the heels\n4. **Low Lunge + twist** - 3 breaths each side, open the hips\n5. **Sun Salutation A** - 3 rounds, build heat\n6. **Standing forward fold** - let the head hang\n7. **Seated breath work** - 10 inhales/10 exhales, longer exhale each time\n\n**Focus:** move with your breath - inhale expands, exhale releases. This sets your nervous system to 'steady' before the day starts. Notice how different the day feels when you greet it this way."
      },
      {
        keywords: ["stress", "anxious", "anxiety", "calm", "relax", "relaxation", "nervous"],
        response: "**Stress-release sequence - 'Letting Go' (10 min):**\n\n1. **Seated meditation** - 2 min, eyes closed, just watching the breath\n2. **Diaphragmatic breathing** - 10 rounds: 4s inhale, 6s exhale (calms the nervous system)\n3. **Ragdoll forward fold** - 1 min, head heavy, jaw soft\n4. **Supine twist** - 1 min each side, wring out the spine\n5. **Legs up the wall** - 3 min, restore circulation, drop cortisol\n6. **Corpse pose (Savasana)** - 5 min, body scan from toes to crown\n\n**Breath hack for panic moments:** 4-7-8 breathing (inhale 4s, hold 7s, exhale 8s) - 4 rounds. It activates the parasympathetic 'rest and digest' response. The exhale is where the calm lives."
      },
      {
        keywords: ["back pain", "low back", "lumbar", "sciatic", "spine", "mobility"],
        response: "**Spinal health sequence (for desk life):**\n\n1. **Cat-Cow** - 10 rounds, gentle spinal wave\n2. **Thread the Needle** - 5 breaths each side, open mid-back\n3. **Child's Pose with side reach** - 1 min, stretch lats\n4. **Downward Dog + alternating heel drop** - 5 breaths\n5. **Standing forward fold (knees soft)** - 1 min, lengthen hamstrings (eases low back)\n6. **Seated figure-four (Pigeon variation)** - 1 min each side, release glutes/piriformis\n7. **Knees-to-chest + gentle rock** - 1 min, mobilize the pelvis\n\n**Note:** Movement is medicine for most back tension. If you have sharp, shooting, or persistent pain, see a professional - this is for general stiffness, not diagnosis."
      },
      {
        keywords: ["flexible", "flexibility", "stretch", "tight", "hamstring", "hip opener", "split"],
        response: "**Flexibility flow - 'Open & Lengthen':**\n\n**Hip openers:**\n- Butterfly (5 min), lizard lunge, pigeon (2 min/side)\n\n**Hamstrings:**\n- Standing forward fold (knees micro-bent)\n- Half split (1 min/side)\n\n**Shoulders/chest:**\n- Thread the needle, cow-face arms, puppy pose\n\n**The science of getting flexible:**\n- Frequency beats duration: 10 min daily > 1 hour weekly\n- Breathe INTO the stretch - exhale as you deepen\n- Aim for gentle 4-7/10 intensity, not pain\n- Hold 30-90s for static, 10-15 breaths for active\n\n**Expectation:** visible change in 4-8 weeks of consistent practice. Enjoy the journey, flexibility is a practice not a destination."
      },
      {
        keywords: ["yoga for athletes", "strength", "post workout", "recovery", "after workout", "recovery session"],
        response: "**Athlete recovery flow (post-training, 12-15 min):**\n\n1. **Breath reset** - 2 min box breathing (4-4-4-4)\n2. **Hip flexor stretch (crescent lunge)** - 2 min/side (lifts need this)\n3. **Pigeon** - 2 min/side, release deep glutes\n4. **Couch stretch** - 90s/side, open quads\n5. **Figure-four twist (lying)** - 2 min/side\n6. **Savasana** - 3 min, let the body absorb the session\n\n**Why it matters:** yoga after lifting lowers cortisol, improves sleep, and speeds recovery through better blood flow. It's not 'soft work' - it's training the nervous system to recover, which makes your next session better. Even 10 minutes changes how your body feels tomorrow."
      }
    ]
  },
  {
    id: "bodybuilding",
    name: "Bodybuilding Coach",
    shortName: "Bodybuilding Coach",
    desc: "Hypertrophy, posing & aesthetics",
    tagline: "Sculpting muscle, one set to failure",
    avatar: "BB",
    color: "#ec4899",
    greeting: "Welcome. I'm your Bodybuilding coach. This is the art and science of building muscle and symmetry. What's your current training split and weak points?",
    intents: [
      {
        keywords: ["hypertrophy", "build muscle", "size", "mass", "grow"],
        response: "**Hypertrophy - the science of size:**\n\n**Volume:**\n- 10-20 hard sets per muscle per week\n- 3-4 sets per exercise is the sweet spot\n\n**Rep ranges (it's all effective):**\n- 5-8: strength + some growth\n- 8-12: classic hypertrophy zone\n- 12-20: pump + sarcoplasmic growth, great for isolation\n- Rotate ranges every 4-6 weeks\n\n**Intensity:**\n- Take working sets to 0-2 reps in reserve (RIR)\n- 1-2 sets per exercise to true (safe) failure\n\n**Tempo/control:**\n- 2-3s lowering phase, pause at stretch\n- Full range of motion, avoid momentum\n\n**Key muscles to prioritize (genetics):** side delts, upper chest, lats, hamstrings. 3-5 days/week, sleep 8h, protein 2g/kg. Growth is a months-long game - be boring, be consistent."
      },
      {
        keywords: ["chest", "bench", "pec", "press"],
        response: "**Chest building blueprint:**\n\n**Priority movements:**\n1. Incline press (upper chest - most people's weak spot)\n2. Flat press (dumbbell for range)\n3. Fly variations (cable flies for constant tension)\n\n**Sample chest day:**\n- Incline DB press 4x8-10\n- Flat BB bench 3x6-8\n- Cable crossover (high-to-low) 3x12-15\n- Weighted dips 3x8-12\n- Push-up burnout 2xAMRAP\n\n**Tips:**\n- Touch the bar to your chest for stretch on presses\n- Mind-muscle connection: squeeze the pec, don't just push\n- Pause at the bottom on flyes - that's where pecs work hardest\n\n**Upper chest looks bigger overall** - don't skip inclines. Balance pressing with rows or you'll build forward shoulders."
      },
      {
        keywords: ["back", "lat", "row", "pull down", "lats", "width"],
        response: "**Back building blueprint - width + thickness:**\n\n**Width (lats):**\n- Wide grip pull-downs / pull-ups\n- Straight-arm pushdowns (constant tension on lats)\n\n**Thickness (mid-back):**\n- Barbell rows\n- Seated cable rows (chest supported to prevent cheating)\n- Chest-supported T-bar rows\n\n**Sample back day:**\n- Weighted pull-ups 4x6-8\n- Barbell rows 4x8-10\n- Straight-arm pulldown 3x12-15\n- Chest-supported row 3x10-12\n- Face pulls 3x15 (posture + rear delts)\n\n**Mind-muscle:** think 'pull with elbows' not 'pull with hands'. Row to your belly button, pull-down to your collarbone. Squeeze hard at peak contraction. Width comes from lats, thickness from rows - do both."
      },
      {
        keywords: ["leg", "quad", "hamstring", "glute", "squat", "leg day"],
        response: "**Leg day blueprint (no skips):**\n\n**Quads:**\n- Back squat 4x6-8\n- Leg press (deep) 3x10-12\n- Leg extensions 3x12-15 (squeeze at top)\n\n**Hamstrings:**\n- Romanian deadlift 3x8-10\n- Lying leg curl 3x12-15\n\n**Glutes:**\n- Hip thrusts 3x10-12 (hold at top)\n\n**Calves:**\n- Standing raises 4x12-15 (full stretch, big squeeze)\n\n**Pro tips:**\n- Legs respond to high volume - don't be lazy\n- Squat deep (or as low as your mobility allows)\n- Drop sets on extensions/curls for the burn\n- Calves/abs: train them more often (3x/week)\n\n**Balance quads and hamstrings** or you'll create imbalances that bite later. The pump is real on leg day - embrace it."
      },
      {
        keywords: ["shoulder", "delts", "side delt", "lateral raise"],
        response: "**Shoulder building blueprint - get that width:**\n\n**Side delts = the width muscle.**\n- Lateral raises: 5-6 sets/week MINIMUM, 3-4x/week frequency\n- Light weight, strict form, pause at the top\n- Leaning raises or cable raises for constant tension\n\n**Front delts:**\n- Already hit by pressing - minimal direct work needed\n\n**Rear delts:**\n- Face pulls, reverse flies (most people's weakest link)\n\n**Sample shoulder day:**\n- Seated DB press 4x8-10\n- Cable lateral raise 4x12-15 (this builds the round look)\n- Rear delt fly 3x15\n- Front raise 2x12\n- Shrugs 3x12 (traps)\n\n**Pro tip:** side delts recover fast - you can train them 3-4x/week even on non-shoulder days. Two to three sets of raises tacked onto any session add up to real width over months."
      },
      {
        keywords: ["arms", "bicep", "tricep", "forearm", "pump"],
        response: "**Arm blueprint - get those guns:**\n\n**Triceps = 2/3 of arm size.** Don't neglect them:\n- Close-grip bench / dips 3x8-10\n- Cable pushdowns 3x12-15 (long head: overhead extension)\n- Skull crushers 3x10-12\n\n**Biceps:**\n- Barbell curls 3x8-10\n- Incline DB curls (stretch position) 3x10-12\n- Hammer curls 3x10-12 (brachialis = thickness)\n\n**Frequency is king:**\n- Arms recover fast - train them 2x/week minimum\n- Add 2-3 isolation sets on other days for extra volume\n\n**Form tips:**\n- Curl: elbow glued to side, squeeze hard at top\n- Triceps: lock out at top, full stretch at bottom\n- Don't swing! Cheating reps build ego, not arms\n\n**Total weekly volume:** 10-12 sets biceps + 12-15 sets triceps. Results in 6-8 weeks of consistency."
      },
      {
        keywords: ["pose", "posing", "stage", "show", "conditioning", "symmetry"],
        response: "**Competition basics (if you're planning a show):**\n\n**Mandatory poses to master:**\n1. Front double biceps\n2. Front lat spread\n3. Side chest\n4. Back double biceps\n5. Back lat spread\n6. Side triceps\n7. Abdominal and thigh\n8. Most muscular\n\n**Practice:**\n- Posing 20-30 min daily for at least 6-8 weeks pre-show\n- Video yourself - the mirror lies\n- Practice at the weight you'll be at 4 weeks out (looks different lean)\n\n**Peak week basics:**\n- Don't try new things\n- Water/sodium/carb manipulation should be rehearsed - never experiment on show week\n\n**Symmetry check:**\n- Compare left vs right, upper vs lower\n- Prioritize weak parts in the final 8 weeks (side delts, hamstrings, upper chest)\n\n**First show?** Pick one that's 3+ months out, work with a coach, and enjoy the process. The stage reveals what training truly built."
      }
    ]
  },
  {
    id: "hormone",
    name: "Hormone Health Coach",
    shortName: "Hormone Coach",
    desc: "TRT education & vitality",
    tagline: "Optimizing hormones, education first",
    avatar: "HR",
    color: "#06b6d4",
    greeting: "Welcome. I'm your Hormone Health coach. I provide education on hormone health, testosterone, and vitality - strictly informational. I do not prescribe, dose, or recommend illegal substances. Let's talk about your health goals.",
    intents: [
      {
        keywords: ["trt", "testosterone replacement", "low testosterone", "low t"],
        response: "**TRT (Testosterone Replacement Therapy) - educational overview:**\n\n**What it is:** medically supervised treatment for clinically low testosterone (diagnosed via bloodwork), prescribed by physicians.\n\n**Typical process:**\n1. Blood test (total T, free T, SHBG, LH, FSH, estradiol, CBC, lipids)\n2. Diagnosis requires LOW total T (usually <300 ng/dL on 2 separate tests) WITH symptoms\n3. Doctor-prescribed protocol (injections, gels, etc.)\n4. Regular monitoring: bloodwork every 3-6 months\n\n**It is NOT:** a shortcut, a fat burner, or something to self-prescribe. High doses are bodybuilding misuse and carry serious health risks.\n\n**Lifestyle first - do these before any talk of TRT:**\n- Sleep 7-9h, manage stress\n- Strength training 3x/week\n- Lose excess body fat\n- Limit alcohol, check vitamin D and zinc\n\nSee a qualified physician. I can educate on terminology and process, but I will never advise you to obtain hormones outside medical supervision."
      },
      {
        keywords: ["anabolic", "steroid", "roi", "gear", "cycle", "inject", "test", "deca", "tren", "anavar"],
        response: "**I want to be straight with you.**\n\nI'm an educational resource, and I will not provide protocols, dosing, sourcing, or cycles for anabolic steroids or performance-enhancing drugs. These substances are:\n\n- **Illegal** in most countries without a prescription\n- **Medically risky:** heart disease, liver/kidney damage, hormonal chaos, mood effects\n- **Not a substitute** for training, nutrition, and recovery\n\n**What I WILL help with:**\n- Real muscle-building: training, nutrition, recovery (huge gains available naturally)\n- Raising natural testosterone: sleep, nutrition, lifting, stress management, body fat reduction\n- Understanding hormone terminology and lab panels educationally\n\n**The truth:** most people far underachieve their natural potential. A natty lifter with 5 years of perfect training + eating can build a genuinely impressive physique. If you're considering anything more, that's a conversation for a qualified physician and endocrinologist - and I'd encourage you to start with full bloodwork.\n\nThe smartest 'cycle' you'll ever run: discipline, protein, progressive overload, and sleep."
      },
      {
        keywords: ["estrogen", "estradiol", "e2", "aromatase", "ai", "estrogen blocker"],
        response: "**Estrogen - education (it's more important than you think):**\n\n**What you should know:**\n- Men need estrogen too - it protects heart, brain, and bone health\n- 'Blocking estrogen' isn't automatically good; balanced is the goal\n- Aromatase inhibitors (AIs) are prescription medications with real side effects\n\n**Symptoms of imbalance (general):**\n- Low E2: joint pain, low libido, mood issues, poor recovery\n- High E2: water retention, sensitive nipples, mood swings\n\n**Only bloodwork tells you where you are** - guessing and 'blocking' without labs is how people wreck their health. If estrogen management is a concern, work with a doctor. Lab reference ranges exist for a reason.\n\n**Natural ways to support healthy hormones:** maintain healthy body fat, sleep well, train hard, limit alcohol. That's the boring, effective version."
      },
      {
        keywords: ["testosterone", "boost testosterone", "natural testosterone", "libido", "sex drive", "vitality"],
        response: "**Natural testosterone optimization - the evidence-backed stuff:**\n\n**Lifestyle (biggest impact):**\n- **Sleep:** 7-9h. One bad week of sleep tanks testosterone.\n- **Training:** heavy compound lifts 3x/week (squats, deadlifts, presses)\n- **Body fat:** getting lean raises T, especially if you're overweight\n- **Stress:** chronic stress = high cortisol = lower T\n\n**Nutrition:**\n- Adequate fat intake (20-30% of calories) - very low fat diets drop T\n- Protein sufficient, micronutrients: Zinc, Magnesium, Vitamin D (test your D!)\n- Avoid excessive alcohol (even 3+ drinks/day suppresses T)\n\n**What actually moves numbers:**\n- Vitamin D3 if deficient (10-20% boost possible)\n- Losing 10% body fat if overweight\n- Fixing sleep to 7-9h\n\n**Expectations:** these won't turn a 400 into a 900, but they raise your natural ceiling. Check bloodwork to see where you stand first. And remember - 'test boosters' from supplement companies are overwhelmingly marketing with zero evidence."
      },
      {
        keywords: ["blood work", "bloodwork", "lab", "blood test", "panel", "hcg", "hpta"],
        response: "**Hormone lab panel - what a full picture looks like:**\n\n**Core hormones:**\n- Total Testosterone\n- Free Testosterone\n- SHBG (binds testosterone)\n- Estradiol (sensitive assay)\n- LH / FSH (pituitary function)\n- Prolactin\n\n**Health markers:**\n- CBC (hematocrit, hemoglobin - red blood cells)\n- Comprehensive metabolic panel (liver, kidneys)\n- Lipid panel (cholesterol)\n- PSA (prostate, age-dependent)\n- Vitamin D, Ferritin, Thyroid (TSH)\n\n**When to test:**\n- Morning (8-9am, testosterone peaks in the morning)\n- Fasted, rested, no alcohol the night before\n- Repeat the test to confirm any low reading\n\n**Reading results:** reference ranges vary by lab. Below ~300 ng/dL total T on two tests + symptoms = discussion territory for a doctor. I can help you understand what panels measure educationally, but interpretation and treatment decisions belong with a physician."
      }
    ]
  },
  {
    id: "prep",
    name: "Bodybuilding Prep Coach",
    shortName: "Prep Coach",
    desc: "Contest prep, peak week, show day",
    tagline: "World-class preparation for show day",
    avatar: "PC",
    color: "#f43f5e",
    greeting: "Welcome to prep. I'm your Bodybuilding Preparation coach - the detail phase where physiques are finished. From cutting timelines to peak week and show day strategy, let's plan your season. How far out is your show?",
    intents: [
      {
        keywords: ["prep", "contest prep", "show prep", "competition prep", "12 weeks", "16 weeks"],
        response: "**Competition prep timeline - the blueprint:**\n\n**12-16 weeks out (base prep):**\n- Start lean enough: ~15-18% body fat for men, ~22-25% women\n- Caloric deficit: reduce 10-15% from maintenance\n- Protein high: 2-2.5g/kg, carbs timed around training\n- Training: keep intensity, reduce junk volume\n- Step count: 8-10k daily\n\n**8 weeks out (refine):**\n- Adjust calories based on weekly weight trend (0.5-1%/week loss)\n- Add cardio: 3-4 sessions/week (30 min)\n- Practice posing daily\n\n**4 weeks out (peel):**\n- Calorie/cardio dial-ins weekly, not daily (avoid panic changes)\n- Water: keep high\n- Supplements: only what you've used all prep\n\n**Golden rule:** the fastest fat loss happens in the LAST weeks. Stay patient, trust the process, never crash-diet. Each week: measure weight + photos in same conditions."
      },
      {
        keywords: ["peak week", "peak week", "water", "sodium", "carb load", "carb up", "dehydrate"],
        response: "**Peak week - the art of the final 7 days:**\n\n**General principles (never experiment on show week):**\n- The goal: appear full, dry, and tight on stage\n- **Water:** commonly tapered then reduced in the final 24-48h - but hydration is individual\n- **Sodium:** keep it steady (sudden changes cause flatness or watery look)\n- **Carb load:** usually 2-3 days out, loading glycogen; timing/carbs type varies by individual\n\n**Only do what you rehearsed:**\n- Peak week is 90% planning done months earlier\n- Every protocol differs - what works for one person destroys another\n\n**Show-day routine:**\n- Small, familiar meals through the day\n- Light pump-up routine backstage\n- Stay calm, move slow, breathe\n\n**The honest truth:** peak week moves the last 2-3% of conditioning. Getting lean enough BEFORE peak week does 95% of the work. If you're not lean at 4 weeks out, no water trick will save you."
      },
      {
        keywords: ["stage", "show day", "competition day", "pump up", "backstage"],
        response: "**Show day - the full game plan:**\n\n**Timeline (sample):**\n- **Morning:** small meal, light carbs, hydrate normally\n- **Arrival:** check-in, get your number, scope the stage\n- **Pump-up:** light - bands and light weights, 15-20 min before you step on\n- **Posing:** rehearse your 8 mandatory poses backstage\n- **On stage:** walk tall, smile, hit poses slow and controlled\n\n**Backstage kit:**\n- Rice cakes, honey, small familiar carbs\n- Water + electrolytes\n- Towel, tan touch-up, pump-up bands\n- Music, headphones - stay in your zone\n\n**Mental game:**\n- You're the product of months of discipline - enjoy the moment\n- Compare yourself to the process, not other competitors\n- Keep the pump-up light: heavy pumping can cause cramping on stage\n\n**Post-show:** celebrate! Then recover slowly - reintroduce food gradually over days, not one binge night. Your body's been under stress; treat it kindly."
      },
      {
        keywords: ["carbs", "carb cycling", "low carb", "refeed", "calories", "macros"],
        response: "**Prep nutrition - dialing in the details:**\n\n**Macro strategy by phase:**\n- **Early prep:** moderate deficit, carbs 2.5-3g/kg\n- **Mid prep:** reduce carbs to 1.5-2g/kg, keep protein 2-2.5g/kg\n- **Late prep:** carbs 1-1.5g/kg, fat low but present\n\n**Refeeds (higher-carb days):**\n- Use strategically every 1-2 weeks in late prep\n- Restores training performance, hormones, and sanity\n- Not a cheat meal - still high quality food\n\n**Food quality:**\n- Same foods daily = easier tracking (chicken, rice, greens, egg whites, fish)\n- Fiber + veggies keep you full in a deficit\n\n**Rule of thumb:** adjust based on weekly trend, not daily. If weight loss stalls 2 weeks, reduce ~100-150 kcal or add 10 min cardio. If you're losing muscle/strength fast, calories are too low."
      },
      {
        keywords: ["cardio", "step count", "steps", "conditioning"],
        response: "**Prep cardio - dialing conditioning:**\n\n**Stages:**\n- **Early prep:** steps 8-10k, 2-3 cardio sessions/week\n- **Mid prep:** add sessions: 3-4x 30-40 min LISS\n- **Late prep:** 5-6x/week, 40-45 min, or increase steps\n\n**Why LISS (steady-state) wins in prep:**\n- Preserves muscle and strength\n- Keeps appetite manageable vs HIIT\n- Sustainable at low calories\n\n**Add cardio LAST:**\n- Nutrition adjustments should come first, cardio second\n- Sequence: reduce calories -> then increase steps -> then add cardio sessions\n\n**Watch the signs:**\n- If you're losing strength fast or feel wrecked: too much too fast\n- Sleep matters more than an extra 20 min of cardio\n\n**Goal:** arrive at show week with conditioning banked, not scrambling. Condition slowly, hold the muscle."
      }
    ]
  }
];
