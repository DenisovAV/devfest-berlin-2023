export function sessionsSpeakersMap(sessionsRaw, speakersRaw) {
  const sessions = {};
  const speakers = {};

  for (let index = 0; index < Object.keys(sessionsRaw).length; index++) {
    console.log('ALDE INDEX', index)
    const sessionId = Object.keys(sessionsRaw)[index];
    const currentSession = sessionsRaw[sessionId];
    console.log('ALDE sessionId', sessionId)
    console.log('ALDE currentSession', currentSession)
    const sessionSpeakers = [];
    const mainTag =
      currentSession.tags && currentSession.tags.length ? currentSession.tags[0] : 'General';

    console.log('ALDE mainTag', mainTag)  

    currentSession.speakers &&
      currentSession.speakers.forEach((speakerId) => {
        console.log('ALDE speakerId', speakerId)  
        if (!speakersRaw[speakerId]) return;
        sessionSpeakers.push({ id: speakerId, ...speakersRaw[speakerId] });

        const generatedSpeaker = speakers[speakerId];
        console.log('ALDE generatedSpeaker', generatedSpeaker)  
        const sessionBySpeaker = {
          id: sessionId,
          mainTag: mainTag,
          ...currentSession,
        };

        if (generatedSpeaker) {
          const speakerTags = generatedSpeaker.tags ? [...generatedSpeaker.tags] : [];
          sessionBySpeaker.tags &&
            sessionBySpeaker.tags.forEach((tag) => {
              if (!speakerTags.includes(tag)) speakerTags.push(tag);
            });
          const speakerSessions = generatedSpeaker.sessions
            ? [...generatedSpeaker.sessions, sessionBySpeaker]
            : [sessionBySpeaker];

          speakers[speakerId] = {
            ...generatedSpeaker,
            tags: [...speakerTags],
            sessions: speakerSessions,
          };
        } else {
          speakers[speakerId] = {
            ...speakersRaw[speakerId],
            id: speakerId,
            tags: sessionBySpeaker.tags,
            sessions: [sessionBySpeaker],
          };
        }
      });

    sessions[sessionId] = {
      ...currentSession,
      id: sessionId,
      mainTag: mainTag,
      speakers: sessionSpeakers,
    };
  }

  return { sessions, speakers };
}
