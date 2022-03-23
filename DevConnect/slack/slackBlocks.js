const getFeatureBlock = (outputTitle) => {
  const blocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "Feature Request :pencil2: ",
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "plain_text",
        text: "Title: " + outputTitle,
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "plain_text",
        text: "Please elaborate your request in this thread so that developers can build it ASAP :rocket:",
        emoji: true,
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Not a feature request?",
      },
      accessory: {
        type: "button",
        style: "danger",
        text: {
          type: "plain_text",
          text: "Delete :wastebasket:",
          emoji: true,
        },
        value: "click_me_123",
        action_id: "button-action",
      },
    },
  ];
  return blocks;
};

const getBugBlock = (outputTitle,priority) => {
  const blocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "Bug Reported:ladybug:",
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "plain_text",
        text: "Title: " + outputTitle,
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "plain_text",
        text: "Priority: " + priority,
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "plain_text",
        text: "Add details in this thread so that developers can solve it ASAP :rocket:",
        emoji: true,
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Not a bug?",
      },
      accessory: {
        type: "button",
        style: "danger",
        text: {
          type: "plain_text",
          text: "Delete :wastebasket:",
          emoji: true,
        },
        value: "click_me_123",
        action_id: "button-action",
      },
    },
  ];
  return blocks;
};

module.exports = {
    getBugBlock,
    getFeatureBlock
}