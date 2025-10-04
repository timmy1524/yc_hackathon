export const SELECTORS = {
  messageList: '.msg-s-message-list-container',
  incomingMessage: '.msg-s-event-listitem:not(.msg-s-message-list__event--from-self)',
  messageBox: '.msg-form__contenteditable',
  sendButton: '.msg-form__send-button',
  messageText: '.msg-s-event-listitem__body',
  senderProfile: '.msg-s-message-group__profile-link',
  
  // Connection request selectors
  connectButton: 'button[aria-label*="Invite"][aria-label*="connect"], button:has-text("Connect")',
  connectWithNoteButton: 'button[aria-label="Add a note"]',
  noteTextarea: '#custom-message',
  sendInviteButton: 'button[aria-label="Send invitation"]',
  
  // Profile selectors
  profileName: '.text-heading-xlarge',
  profileTitle: '.text-body-medium',
  profileCompany: '.inline-show-more-text--is-collapsed-with-line-clamp'
} as const