const filterUserMessages = (messages, userId) => {
  return messages.filter((msg) =>
    msg.participants.some(
      (participantId) => participantId.toString() === userId
    )
  );
};

module.exports = { filterUserMessages };
