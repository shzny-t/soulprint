export const PERSONALITY_TYPES = [
  {
    id: 'delulu-romantic',
    name: 'The Romantic Idealist',
    emoji: '🌹',
    gradient: 'linear-gradient(135deg, #be185d 0%, #7c3aed 100%)',
    tagline: "you don't just listen to music — you live inside it",
    traits: ['Deeply empathic', 'Emotionally fluent', 'Narrative thinker', 'Feels things loudly'],
    compatibleWith: 'The Nocturnalist',
    notCompatibleWith: 'The Cultural Mirror',
  },
  {
    id: 'villain-era',
    name: 'The Sovereign Shadow',
    emoji: '🖤',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #6d28d9 50%, #be185d 100%)',
    tagline: 'your emotional world is larger than most people can access',
    traits: ['Psychologically complex', 'High autonomy', 'Intensity as baseline', 'Principled iconoclast'],
    compatibleWith: 'The Aesthetic Absolutist',
    notCompatibleWith: 'The Cultural Mirror',
  },
  {
    id: 'main-pop-girl',
    name: 'The Synchronist',
    emoji: '✨',
    gradient: 'linear-gradient(135deg, #db2777 0%, #ea580c 100%)',
    tagline: 'you feel music as a collective experience, not a private one',
    traits: ['Socially attuned', 'Emotionally generous', 'Present-focused', 'Instinctive taste-maker'],
    compatibleWith: 'The Aspirational Self',
    notCompatibleWith: 'The Aesthetic Absolutist',
  },
  {
    id: '2am-spiral',
    name: 'The Liminal Mind',
    emoji: '🌙',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #3730a3 50%, #6d28d9 100%)',
    tagline: 'you are drawn to music that exists between states',
    traits: ['Introspective depth', 'Comfort in ambiguity', 'Late-night philosopher', 'Emotional archaeologist'],
    compatibleWith: 'The Romantic Idealist',
    notCompatibleWith: 'The Synchronist',
  },
  {
    id: 'unhinged-academia',
    name: 'The Aesthetic Absolutist',
    emoji: '📚',
    gradient: 'linear-gradient(135deg, #134e4a 0%, #0e7490 50%, #4f46e5 100%)',
    tagline: 'for you, music is not entertainment — it is evidence',
    traits: ['Analytical listener', 'Pattern recognition', 'Principled taste', 'Refuses the obvious'],
    compatibleWith: 'The Eclectic Contrarian',
    notCompatibleWith: 'The Cultural Mirror',
  },
  {
    id: 'that-girl-delusional',
    name: 'The Aspirational Self',
    emoji: '🏃‍♀️',
    gradient: 'linear-gradient(135deg, #b45309 0%, #be185d 100%)',
    tagline: 'your playlist is a portrait of who you are becoming',
    traits: ['Future-oriented', 'High self-concept', 'Motion as identity', 'Optimism as discipline'],
    compatibleWith: 'The Synchronist',
    notCompatibleWith: 'The Liminal Mind',
  },
  {
    id: 'cottagecore-burnout',
    name: 'The Pastoral Escapist',
    emoji: '🌿',
    gradient: 'linear-gradient(135deg, #14532d 0%, #4d7c0f 50%, #a16207 100%)',
    tagline: 'you are searching, through sound, for a life that moves differently',
    traits: ['Sensory sensitive', 'World-weary idealist', 'Seeks the quiet', 'Deeply imaginative'],
    compatibleWith: 'The Liminal Mind',
    notCompatibleWith: 'The Sensory Anarchist',
  },
  {
    id: 'hyperpop-menace',
    name: 'The Sensory Anarchist',
    emoji: '⚡',
    gradient: 'linear-gradient(135deg, #5b21b6 0%, #0891b2 50%, #65a30d 100%)',
    tagline: 'you use music the way some people use adrenaline',
    traits: ['Intensity-seeking', 'Refuses moderation', 'Texture over melody', 'Finds calm in chaos'],
    compatibleWith: 'The Aesthetic Absolutist',
    notCompatibleWith: 'The Pastoral Escapist',
  },
  {
    id: 'sad-indie-kid',
    name: 'The Melancholic Archivist',
    emoji: '🎸',
    gradient: 'linear-gradient(135deg, #1f2937 0%, #4c1d95 100%)',
    tagline: 'you collect feeling the way others collect objects',
    traits: ['High sensitivity', 'Memory-driven', 'Finds beauty in grief', 'The observer type'],
    compatibleWith: 'The Romantic Idealist',
    notCompatibleWith: 'The Aspirational Self',
  },
  {
    id: 'goblin-mode',
    name: 'The Eclectic Contrarian',
    emoji: '👹',
    gradient: 'linear-gradient(135deg, #1c1917 0%, #5b21b6 50%, #15803d 100%)',
    tagline: "your taste is a map of a mind that refuses to be categorized",
    traits: ['Cognitively restless', 'Anti-genre', 'Curiosity-driven', 'Immune to trend'],
    compatibleWith: 'The Aesthetic Absolutist',
    notCompatibleWith: 'The Cultural Mirror',
  },
  {
    id: 'industry-plant',
    name: 'The Cultural Mirror',
    emoji: '🪞',
    gradient: 'linear-gradient(135deg, #0369a1 0%, #4f46e5 100%)',
    tagline: 'you listen in sync with the world, and there is intelligence in that',
    traits: ['Culturally attuned', 'Trend-sensitive', 'Social listener', 'Comfort in consensus'],
    compatibleWith: 'The Synchronist',
    notCompatibleWith: 'The Aesthetic Absolutist',
  },
  {
    id: 'midnight-romantic',
    name: 'The Nocturnalist',
    emoji: '🌃',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #7c2d12 50%, #5b21b6 100%)',
    tagline: 'you listen most honestly when you think no one is watching',
    traits: ['Private emotional life', 'Slow to open', 'Deeply loyal to sound', 'The long game'],
    compatibleWith: 'The Romantic Idealist',
    notCompatibleWith: 'The Eclectic Contrarian',
  },
]

function avg(arr) {
  if (!arr.length) return 0
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

function variance(arr) {
  const mean = avg(arr)
  return avg(arr.map((v) => Math.pow(v - mean, 2)))
}

function buildContrast(tracks, features) {
  const combined = tracks.slice(0, 10).map((t, i) => ({
    name: t.name,
    artist: t.artists?.[0]?.name ?? '',
    energy: features[i]?.energy,
    valence: features[i]?.valence,
  })).filter(x => x.energy !== undefined && x.valence !== undefined)

  if (combined.length < 2) return null

  const byEnergy = [...combined].sort((a, b) => b.energy - a.energy)
  const byValence = [...combined].sort((a, b) => a.valence - b.valence)

  const loudest   = byEnergy[0]
  const quietest  = byEnergy[byEnergy.length - 1]
  const darkest   = byValence[0]
  const brightest = byValence[byValence.length - 1]

  const energySpread  = loudest.energy - quietest.energy
  const valenceSpread = brightest.valence - darkest.valence

  const avgE = avg(combined.map(x => x.energy))
  const avgV = avg(combined.map(x => x.valence))

  return {
    loudest,
    quietest,
    darkest,
    brightest,
    energySpread,
    valenceSpread,
    avgEnergy: avgE,
    avgValence: avgV,
    // key patterns
    loudButDark:      avgE > 0.55 && avgV < 0.48,   // high energy, low mood — using noise as armor
    quietButBright:   avgE < 0.45 && avgV > 0.58,   // calm but content
    chaotic:          energySpread > 0.45,            // huge energy range
    hiddenDarkness:   avgV > 0.55 && darkest.valence < 0.32, // seems positive but has dark corners
    hiddenIntensity:  avgE < 0.45 && loudest.energy > 0.75,  // mostly quiet but spikes hard
    uniformlyDark:    avgV < 0.38 && valenceSpread < 0.25,   // consistently heavy
    uniformlyLight:   avgV > 0.62 && energySpread < 0.25,    // consistently bright
  }
}

function generateDescription(id, tracks, stats, features) {
  const c = buildContrast(tracks, features)

  const s1name = tracks[0]?.name ?? 'your most-played song'
  const s2name = tracks[1]?.name ?? null
  const s3name = tracks[2]?.name ?? null
  const a1 = tracks[0]?.artists?.[0]?.name ?? 'your most-played artist'
  const a2 = tracks[1]?.artists?.[0]?.name ?? null

  const loud  = c?.loudest?.name  ?? s1name
  const quiet = c?.quietest?.name ?? s2name ?? s1name
  const dark  = c?.darkest?.name  ?? quiet

  const hasContrast = c && (c.chaotic || c.loudButDark || c.hiddenDarkness || c.hiddenIntensity)

  // ---------- mood/energy qualifiers based on actual stats ----------
  const moodPhrase =
    stats.valence < 35  ? "and you are not okay, or you are almost okay, which is somehow worse"
    : stats.valence < 52 ? "and you are somewhere between fine and not fine and you have been there for a while"
    : stats.valence < 68 ? "and things are decent, though you are watching them closely"
    : "and you are doing well, which still surprises you a little"

  const energyPhrase =
    stats.energy < 35 ? "You have been very still lately."
    : stats.energy < 55 ? "You have been moving, but slowly."
    : stats.energy < 75 ? "You have been moving fast enough that you have not had to think too much."
    : "You have been running at a pace that other people find difficult to watch."

  // ---------- contrast sentence ----------
  const contrastLine = !c ? null
    : c.loudButDark ? `You have "${loud}" on here and also "${dark}" — and the thing is, they are doing the same job. One of them is louder about it.`
    : c.hiddenDarkness ? `You put on "${loud}" and it sounds like you are fine. Then somewhere in the middle of the rotation there is "${dark}", and that one is the more honest entry.`
    : c.hiddenIntensity ? `Most of this is quiet — "${quiet}" and the softer corners of ${a1}. But then there is "${loud}", and it is almost violent by comparison. You needed that one for a reason.`
    : c.chaotic ? `You have "${loud}" sitting two songs away from "${quiet}" and you did not think twice about it. Your taste does not have a consistent explanation and neither do you, probably.`
    : null

  const quotes = {
    'delulu-romantic':      "you kept the voicemail just in case",
    'villain-era':          "you stopped explaining yourself and that looked like confidence from the outside",
    'main-pop-girl':        "you made the room better just by knowing all the words",
    '2am-spiral':           "you think at 2am the way other people dream — without permission",
    'unhinged-academia':    "you have opinions about things no one asked about and you are usually right",
    'that-girl-delusional': "you play the version of yourself you are becoming and hope the rest catches up",
    'cottagecore-burnout':  "you keep looking for a life that moves at a different speed",
    'hyperpop-menace':      "calm is a setting you have not found the button for yet",
    'sad-indie-kid':        "you find the beauty in it before you find your way out of it",
    'goblin-mode':          "there is no genre for what you are and you stopped looking for one",
    'industry-plant':       "you always knew the song and you always knew why it was everywhere",
    'midnight-romantic':    "you love best in the hours when no one is keeping score",
  }

  const bodies = {
    'delulu-romantic': () => {
      const opening = contrastLine
        ?? `You have been listening to "${s1name}" ${s2name ? `and "${s2name}"` : ""} like they were written specifically for you. They probably were not, but that is not really the point.`
      const armorLine = c?.loudButDark
        ? `The louder songs are what you put on when you need to feel like you are moving through something. The truth is in the quiet ones.`
        : `The music you return to most is the kind that says the thing you are not ready to say out loud yet.`
      return `${opening} ${armorLine} In relationships, you are already three steps into a feeling before the other person has noticed you have feelings at all. You rehearse the conversation in your head for weeks and sometimes you never have it. Your friends would call you the one who remembers everything — the dates, the details, the thing someone said once — and they mean it as a compliment even though it costs you something. At work you care more than you are supposed to, which makes you very good at it and quietly exhausted by it. You probably drive at night more than you admit. You have a playlist for it. "${dark}" is on there.`
    },

    'villain-era': () => {
      const opening = contrastLine
        ?? `You have been on "${s1name}" lately ${moodPhrase}.`
      const softReveal = c?.darkest && c.darkest.name !== s1name
        ? `"${c.darkest.name}" is also in here, which you would not broadcast, but it tells on you.`
        : `There is a softness in here somewhere that you have not mentioned to anyone.`
      return `${opening} ${energyPhrase} ${softReveal} In relationships you are more than people expect and you have stopped apologizing for it — the ones who stay are the ones who were meant to. Your friendships are small, chosen carefully, and those people know they earned it. At work you are the one people are slightly careful around, not because you are cruel but because you are honest and that has become unusual. You do not hold grudges but you do not forget either, which is its own kind of power. You already know what you want. You are just deciding if you are ready.`
    },

    'main-pop-girl': () => {
      const opening = contrastLine
        ?? `You have been on "${s1name}" ${s2name ? `and "${s2name}"` : ""} ${moodPhrase}.`
      const depthLine = c?.hiddenDarkness
        ? `But "${dark}" is also in here, which means the bright surface has a underneath to it that most people do not get to see.`
        : `You have been genuinely okay lately, which you do not always trust, but it is real.`
      return `${opening} ${depthLine} In relationships you are generous in the way that people take for granted — you show up, you remember, you make the effort, and you notice when it is not returned but you let it go longer than you should. Your friends rotate around you like you are a home base, which is true and also occasionally a lot. At work you are the one who gets things done and also knows everyone's birthday, and both of those things are underestimated. You feel things in real time and you are not embarrassed about it. That is rarer than it sounds.`
    },

    '2am-spiral': () => {
      const opening = contrastLine
        ?? `You have been sitting with "${s1name}" and "${quiet}" and ${moodPhrase}.`
      const processLine = c?.loudButDark
        ? `The louder ones here are not about energy — they are about filling the room so you do not have to be alone with the thought.`
        : `The music you reach for most does not try to fix anything. It just sits with you. You need that.`
      return `${opening} ${processLine} In relationships, you take a long time to let someone in and then you let them in completely, which is a lot for some people and exactly right for others. Your friends call you at 2am and you answer, and they know you will, and they do not take it lightly. At work you are the one who noticed the problem first, said it once quietly, and were right. ${energyPhrase} You have a running list of things you want to say. Most of them you will not.`
    },

    'unhinged-academia': () => {
      const opening = contrastLine
        ?? `You are listening to "${s1name}"${a2 ? ` and ${a2}` : ""} like you are building a case.`
      const niche = c?.hiddenDarkness
        ? `Most of this is composed, deliberate. But "${dark}" is in here and that one you did not choose for its production value.`
        : `Everything you listen to is selected with intent. Even the things that seem casual are not casual.`
      return `${opening} ${niche} ${moodPhrase.charAt(0).toUpperCase() + moodPhrase.slice(1)}, and your listening reflects it — specific, controlled, not interested in being easy. In relationships you are looking for someone who can actually keep up, and most people cannot, and you have learned to be patient about that even when you are not. Your friends know not to recommend you something unless they want the full analysis. At work you have a very high tolerance for being right without credit, because the alternative is explaining yourself and you do not have time. ${energyPhrase} You find most things slightly disappointing. "${s1name}" is not one of them, and that matters more than it sounds.`
    },

    'that-girl-delusional': () => {
      const opening = contrastLine
        ?? `You have been playing "${s1name}" everywhere ${moodPhrase}.`
      const delusion = c?.hiddenDarkness
        ? `"${dark}" is also in here though, which is the version of you that you listen to when the momentum runs out.`
        : `The music you are reaching for right now is the kind that tells you things are possible, and you need to hear that.`
      return `${opening} ${delusion} ${energyPhrase} In relationships you have a clear vision of what you want, which is good until you are more attached to the potential than the actual person — you are working on this. Your friends think you have your life together, which is partially true and partially a very convincing performance. At work you are either the most effective person in the room or completely somewhere else, and it somehow averages out. You have made a list of things you are going to start doing. Some of them you actually started. That is more than most people.`
    },

    'cottagecore-burnout': () => {
      const opening = contrastLine
        ?? `"${s1name}" is the tell. You have been reaching for ${a1} and the quieter corners of your library.`
      const burnout = c?.hiddenIntensity
        ? `But "${loud}" is also in here, which means the need to slow down is fighting with something that will not stay still.`
        : `Everything you have been listening to lately moves slowly, and that is not an accident.`
      return `${opening} ${burnout} ${moodPhrase.charAt(0).toUpperCase() + moodPhrase.slice(1)}. You listen to this music like you are searching for a version of your life that does not feel this fast. In relationships you want something unhurried and real, which is a reasonable thing to want and apparently very hard to find. Your friends describe you as calm, which is half accurate — the other half you keep to yourself. At work you do the job well and you do not love that it takes as much from you as it does, and you think about that on the drive home. You have googled moving somewhere smaller. You meant it a little.`
    },

    'hyperpop-menace': () => {
      const opening = contrastLine
        ?? `You put "${loud}" on and turned it up.`
      const intensity = c?.hiddenDarkness
        ? `The chaotic ones are obvious. But "${dark}" is in here too, and that one is not about energy — that one is about something you are moving through by going faster.`
        : `The volume is not incidental. You need music that matches the speed your brain runs at, and most things do not.`
      return `${opening} ${intensity} ${energyPhrase} In relationships you are a lot in the best way — intense and present and entirely committed — and the people who stay know exactly what they signed up for. Your friends have learned not to ask if you want to talk about it; you would rather do something. At work you accomplish more in forty minutes of full chaos than most people do in a careful day. ${moodPhrase.charAt(0).toUpperCase() + moodPhrase.slice(1)}, and silence makes it worse, which is why you keep the music loud. You already know this about yourself.`
    },

    'sad-indie-kid': () => {
      const opening = contrastLine
        ?? `You have been on "${s1name}" for a while now. Longer than makes sense, maybe.`
      const armorLine = c?.loudButDark
        ? `You have "${loud}" in here too, and people might assume that one is the distraction. It is not. It is the same feeling at a different volume — you are just louder about it sometimes.`
        : c?.hiddenIntensity
        ? `"${loud}" is in here, which surprised even you when you noticed. You needed the volume for a minute. You always come back to the quiet.`
        : `The music you keep returning to does not try to cheer you up, and you prefer it that way. A song that tells the truth is worth more than one that tells you it will be fine.`
      return `${opening} ${armorLine} ${moodPhrase.charAt(0).toUpperCase() + moodPhrase.slice(1)}, and you are giving yourself time with it. In relationships you feel everything first and understand it much later, which creates a specific kind of whiplash for people who love you — and they do. Your friends know you remember the things they wish someone would remember. At work you are better than you have been told, and you do not know that yet. You cried at something this month that you would not mention to anyone. It was "${dark}".`
    },

    'goblin-mode': () => {
      const opening = contrastLine
        ?? `"${loud}" and "${quiet}" are both in your recent rotation and you did not think twice about that.`
      const chaos = `The spread of what you have been listening to — ${[s1name, s2name, s3name].filter(Boolean).map(x => `"${x}"`).join(', ')} — does not follow a line you could explain to someone, and you stopped trying.`
      return `${opening} ${chaos} ${moodPhrase.charAt(0).toUpperCase() + moodPhrase.slice(1)}, and your music right now is a map of that. In relationships you are unpredictable in ways that are genuinely interesting to the right person and genuinely exhausting to the wrong one; you cannot always tell the difference in time. Your friends do not put you in a box and you love them for it. At work you solve problems with a completely different approach every time, which is either a gift or a liability depending on who is watching. You have recommended a song to someone, watched their face, and never done it again.`
    },

    'industry-plant': () => {
      const opening = contrastLine
        ?? `You have been on "${s1name}" and "${s2name ?? s1name}" — exactly what is in the air right now — ${moodPhrase}.`
      const depth = c?.hiddenDarkness
        ? `But "${dark}" is in here, which does not match the rest. You found that one on your own, and it is closer to the truth of where you are.`
        : `You listen to what is happening in the world right now, and there is a real intelligence in knowing what everyone needs to feel before they know it themselves.`
      return `${opening} ${depth} In relationships you are easy to be with and good at reading the room, which makes you well-liked and occasionally too accommodating — you know the difference but you do not always act on it. Your friends come to you for recommendations and you never miss. At work you know how to be in a room — when to speak, when to listen, who to talk to — and people notice without understanding why. ${energyPhrase} You knew "${s1name}" was going to be everywhere before it was everywhere. You were right.`
    },

    'midnight-romantic': () => {
      const opening = contrastLine
        ?? `You have been coming back to "${s1name}" in the late hours.`
      const soloLine = c?.hiddenDarkness
        ? `"${dark}" is also here, and that one you listen to alone. That is the version of you that does not perform anything.`
        : c?.hiddenIntensity
        ? `"${loud}" is in here too, which is unusual. You needed something louder than usual, which means something has been louder than usual inside.`
        : `You listen differently when no one is around. More honestly. The songs you return to at night are the ones that know that.`
      return `${opening} ${soloLine} ${moodPhrase.charAt(0).toUpperCase() + moodPhrase.slice(1)}. In relationships you take your time — a long time — and then you are fully there, and the people who wait for that know it was worth it. Your friends have a version of you that comes out late, that does not edit itself, and they would say that is the real one. At work you are reliable in the way that people forget to appreciate because they have started assuming it. You have had a whole conversation in your head about someone that they will probably never know about. It went well, in the version you wrote.`
    },
  }

  const bodyFn = bodies[id]
  const body = bodyFn ? bodyFn() : `You have been listening to "${s1name}" and ${moodPhrase}. ${energyPhrase} The music says more about where you are right now than most things you would say out loud.`

  return {
    quote: quotes[id] ?? "the songs know something you have not said yet",
    body,
  }
}

export function analyzePersonality(features, tracks) {
  const valence        = avg(features.map((f) => f.valence))
  const energy         = avg(features.map((f) => f.energy))
  const danceability   = avg(features.map((f) => f.danceability))
  const acousticness   = avg(features.map((f) => f.acousticness))
  const instrumentalness = avg(features.map((f) => f.instrumentalness))
  const tempo          = avg(features.map((f) => f.tempo))
  const loudness       = avg(features.map((f) => f.loudness))
  const speechiness    = avg(features.map((f) => f.speechiness))

  const valenceVariance = variance(features.map((f) => f.valence))
  const energyVariance  = variance(features.map((f) => f.energy))
  const chaosScore      = valenceVariance + energyVariance

  const popularity = avg(tracks.map((t) => t.popularity))

  const scores = {
    'delulu-romantic':      valence * 1.2 + (1 - energy) * 1.5 + acousticness * 0.8 - danceability * 0.5,
    'villain-era':          (1 - valence) * 1.5 + energy * 1.2 + (1 - acousticness) * 0.5,
    'main-pop-girl':        danceability * 1.5 + energy * 0.8 + valence * 0.8 + (popularity / 100) * 0.4,
    '2am-spiral':           (1 - valence) * 1.2 + (1 - energy) * 1.2 + (1 - danceability) * 0.8 + acousticness * 0.8,
    'unhinged-academia':    instrumentalness * 1.5 + chaosScore * 2 + (1 - popularity / 100) * 1.2,
    'that-girl-delusional': energy * 1.5 + valence * 0.8 + danceability * 1.0,
    'cottagecore-burnout':  acousticness * 1.8 + (1 - energy) * 1.0 + valence * 0.5,
    'hyperpop-menace':      energy * 1.2 + (tempo / 200) * 1.5 + (1 - acousticness) * 0.8 + (Math.abs(loudness) < 5 ? 1 : 0),
    'sad-indie-kid':        (1 - valence) * 1.0 + acousticness * 0.8 + (1 - danceability) * 0.6,
    'goblin-mode':          chaosScore * 3 + speechiness * 0.5,
    'industry-plant':       (popularity / 100) * 2.0 + danceability * 0.5 + speechiness * 0.3,
    'midnight-romantic':    (1 - energy) * 1.2 + valence * 0.4 + acousticness * 1.0 + (1 - danceability) * 0.8,
  }

  const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]
  const personality = PERSONALITY_TYPES.find((p) => p.id === winner)

  const stats = {
    valence:       Math.round(valence * 100),
    energy:        Math.round(energy * 100),
    danceability:  Math.round(danceability * 100),
    acousticness:  Math.round(acousticness * 100),
    chaosLevel:    Math.min(100, Math.round(chaosScore * 1000)),
    avgTempo:      Math.round(tempo),
    avgPopularity: Math.round(popularity),
  }

  const description = generateDescription(winner, tracks, stats, features)

  return { personality, stats, description }
}
