const discordApiLimit = 1950;

const splitMessageString = (msgString, charLimit = 1950, returnFirst = false) => {
    const messageArray = [];
  
    let lastSentCharacter = 0;
  
    const msgStringLength = returnFirst
      ? charLimit + 1
      : msgString.length;
  
    while (lastSentCharacter < msgStringLength) {
      if (msgStringLength - lastSentCharacter > charLimit) {
        const nextMessageSubset = msgString.slice(lastSentCharacter, lastSentCharacter + charLimit);
  
        let lastPos = nextMessageSubset.lastIndexOf('\n');
  
        if (lastPos < 0) {
          const lastWord = nextMessageSubset.lastIndexOf(' ');
  
          lastPos = lastWord < 0
            ? lastSentCharacter + charLimit
            : lastSentCharacter + lastWord;
        }
  
        const messageToSend = nextMessageSubset.slice(0, lastPos);
  
        messageArray.push(messageToSend);
  
        lastSentCharacter += lastPos;
      } else {
        messageArray.push(msgString.slice(lastSentCharacter, msgStringLength));
        lastSentCharacter = msgStringLength;
      }
    }
  
    return messageArray;
};

const sendMessageToChannel = (channel, message) => {
    const messageArray = splitMessageString(message, discordApiLimit);

    messageArray.forEach((msgSubSet) => { channel.send(msgSubSet); });
};

module.exports = {
    sendMessageToChannel,
};