# n8n-nodes-fzap

This is an n8n community node that integrates with [FZAP](https://flouds.com.br) WhatsApp API in your n8n workflows.

FZAP is a WhatsApp API service that allows you to send and receive messages, manage groups, handle media files, and more through a simple REST API.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Chat
- Send text, image, audio, document, video, sticker messages
- Send buttons, lists, templates, contacts, locations, polls
- Download media (image, audio, document, video)
- Edit and delete messages
- React to messages
- Archive, mute, pin chats
- Set chat presence (typing, recording, etc.)
- Mark messages as read

### Session
- Connect/disconnect WhatsApp
- Get QR code for authentication
- Pair phone number
- Get connection status
- Configure call rejection
- Configure S3 storage
- Configure proxy

### Group
- Create groups
- Get group info and invite links
- Add/remove/promote/demote participants
- Set group name, photo, topic
- Configure group settings (announce, locked, ephemeral)

### User
- Check if numbers are on WhatsApp
- Get user info and avatar
- Get/set privacy settings
- Set profile name and status
- Manage contacts

### Webhook (Trigger)
- Receive real-time events from WhatsApp
- Message received/sent/updated
- Connection status changes
- Group events
- Call events
- And more...

### Integrations
- Chatwoot integration
- Paid Traffic / Meta Conversions API
- Newsletter management
- Status/Stories

## Credentials

To use this node, you need:

1. A running FZAP instance
2. Create credentials in n8n with:
   - **Base URL**: Your FZAP API URL (e.g., `https://api.yourfzap.com`)
   - **API Key**: Your FZAP API key
   - **Instance Name**: Your WhatsApp instance name

## Compatibility

- Tested with n8n version 1.x
- Requires FZAP API

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [FZAP Documentation](https://flouds.com.br)

## Author

Daniel Carbonell ([flouds.com.br](https://flouds.com.br))
