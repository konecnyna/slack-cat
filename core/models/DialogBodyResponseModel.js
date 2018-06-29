export const DialogBodyResponse {
  type: 'dialog_submission',
  token: 'REMOVED',
  action_ts: '1527613988.007346',
  team: { id: 'T048HP6GU', domain: 'NUNYA' },
  user: { id: 'U7ZDH4FUL', name: 'nkonecny' },
  channel: { id: 'D8A0UL6F5', name: 'directmessage' },
  submission: { yesterday: '123', today: 'doing', blockers: 'asdasdads'},
  callback_id: 'standup-dialog',
  response_url:'REMOVED',
}


exportconst testMsg = {
  type: 'message',
  channel: 'C7XPH1X8V',
  user: 'U7YMR8S3H',
  text: '',
  ts: '1510420686.000031',
  source_team: 'T7XPH1Q4V',
  team: 'T7XPH1Q4V',
};

const testReaction = {
  type: 'reaction_added',
  user: 'U7YMR8S3H',
  item: {
    type: 'message',
    channel: 'C7XPH1X8V',
    ts: '1519401099.000639',
  },
  reaction: '',
  item_user: 'U94UFE802',
  event_ts: '1519405945.000295',
  ts: '1519405945.000295',
};

const testMemberJoin = {
  type: 'member_joined_channel',
  user: 'U7YMR8S3H',
  channel: 'C9F93HK45',
  channel_type: 'C',
  team: 'T7XPH1Q4V',
  event_ts: '1519690078.000194',
  ts: '1519690078.000194',
};