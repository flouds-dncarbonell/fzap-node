"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatFields = exports.chatOperations = void 0;
exports.chatOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['chat'],
            },
        },
        options: [
            {
                name: 'Archive',
                value: 'archive',
                description: 'Archive or unarchive a chat',
                action: 'Change archive status',
            },
            {
                name: 'Download Audio',
                value: 'downloadAudio',
                description: 'Download audio from a message',
                action: 'Download audio',
            },
            {
                name: 'Download Document',
                value: 'downloadDocument',
                description: 'Download document from a message',
                action: 'Download document',
            },
            {
                name: 'Download Image',
                value: 'downloadImage',
                description: 'Download image from a message',
                action: 'Download image',
            },
            {
                name: 'Download Video',
                value: 'downloadVideo',
                description: 'Download video from a message',
                action: 'Download video',
            },
            {
                name: 'Delete Message',
                value: 'delete',
                description: 'Delete a message',
                action: 'Delete a message',
            },
            {
                name: 'Edit Message',
                value: 'edit',
                description: 'Edit a sent message',
                action: 'Edit a message',
            },
            {
                name: 'Mark Message Read',
                value: 'markMessageRead',
                description: 'Mark specific messages as read',
                action: 'Mark message read',
            },
            {
                name: 'Mark Read',
                value: 'markRead',
                description: 'Mark messages as read',
                action: 'Mark messages as read',
            },
            {
                name: 'Mute',
                value: 'mute',
                description: 'Mute or unmute a chat',
                action: 'Change mute status',
            },
            {
                name: 'Pin',
                value: 'pin',
                description: 'Pin or unpin a chat',
                action: 'Change pin status',
            },
            {
                name: 'Set Presence',
                value: 'presence',
                description: 'Set chat presence',
                action: 'Set chat presence',
            },
            {
                name: 'React',
                value: 'react',
                description: 'React to a message with emoji',
                action: 'React to a message',
            },
            {
                name: 'Send Audio',
                value: 'sendAudio',
                description: 'Send an audio message',
                action: 'Send an audio message',
            },
            {
                name: 'Send Buttons',
                value: 'sendButtons',
                description: 'Send a buttons message',
                action: 'Send a buttons message',
            },
            {
                name: 'Send Contact',
                value: 'sendContact',
                description: 'Send a contact message',
                action: 'Send a contact message',
            },
            {
                name: 'Send Document',
                value: 'sendDocument',
                description: 'Send a document',
                action: 'Send a document',
            },
            {
                name: 'Send Image',
                value: 'sendImage',
                description: 'Send an image',
                action: 'Send an image',
            },
            {
                name: 'Send List',
                value: 'sendList',
                description: 'Send a list message',
                action: 'Send a list message',
            },
            {
                name: 'Send Location',
                value: 'sendLocation',
                description: 'Send a location message',
                action: 'Send a location message',
            },
            {
                name: 'Send Poll',
                value: 'sendPoll',
                description: 'Send a poll to a group',
                action: 'Send a poll',
            },
            {
                name: 'Send Sticker',
                value: 'sendSticker',
                description: 'Send a sticker message',
                action: 'Send a sticker message',
            },
            {
                name: 'Send Template',
                value: 'sendTemplate',
                description: 'Send a template message',
                action: 'Send a template message',
            },
            {
                name: 'Send Text',
                value: 'sendText',
                description: 'Send a text message',
                action: 'Send a text message',
            },
            {
                name: 'Send Video',
                value: 'sendVideo',
                description: 'Send a video message',
                action: 'Send a video message',
            },
        ],
        default: 'sendText',
    },
];
exports.chatFields = [
    {
        displayName: 'Phone Number',
        name: 'phone',
        type: 'string',
        required: true,
        default: '',
        placeholder: '5511999999999',
        description: 'Recipient phone number with country code, without + sign',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: [
                    'sendText',
                    'sendImage',
                    'sendAudio',
                    'sendDocument',
                    'sendVideo',
                    'sendSticker',
                    'sendContact',
                    'sendLocation',
                    'sendButtons',
                    'sendList',
                    'sendTemplate',
                    'archive',
                    'markRead',
                    'mute',
                    'pin',
                    'presence',
                ],
            },
        },
    },
    {
        displayName: 'Text',
        name: 'text',
        type: 'string',
        typeOptions: {
            rows: 4,
        },
        required: true,
        default: '',
        description: 'The text message to send',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendText'],
            },
        },
    },
    {
        displayName: 'Image',
        name: 'image',
        type: 'string',
        required: true,
        default: '',
        description: 'Image content (base64/data URL or URL)',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendImage'],
            },
        },
    },
    {
        displayName: 'Audio',
        name: 'audio',
        type: 'string',
        required: true,
        default: '',
        description: 'Audio content (base64/data URL or URL)',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendAudio'],
            },
        },
    },
    {
        displayName: 'Document',
        name: 'document',
        type: 'string',
        required: true,
        default: '',
        description: 'Document content (base64/data URL or URL)',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendDocument'],
            },
        },
    },
    {
        displayName: 'Filename',
        name: 'filename',
        type: 'string',
        required: true,
        default: '',
        description: 'Name of the document file',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendDocument'],
            },
        },
    },
    {
        displayName: 'Video',
        name: 'video',
        type: 'string',
        required: true,
        default: '',
        description: 'Video content (base64/data URL or URL)',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendVideo'],
            },
        },
    },
    {
        displayName: 'Video Options',
        name: 'videoOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendVideo'],
            },
        },
        options: [
            {
                displayName: 'Caption',
                name: 'caption',
                type: 'string',
                default: '',
                description: 'Caption for the video',
            },
            {
                displayName: 'File Name',
                name: 'fileName',
                type: 'string',
                default: '',
                description: 'File name (used when sending as document)',
            },
            {
                displayName: 'View Once',
                name: 'viewOnce',
                type: 'boolean',
                default: false,
                description: 'Whether to send as view-once',
            },
            {
                displayName: 'Mime Type',
                name: 'mimeType',
                type: 'string',
                default: '',
                description: 'Force MIME type (e.g. video/mp4)',
            },
            {
                displayName: 'Mention All',
                name: 'mentionAll',
                type: 'boolean',
                default: false,
                description: 'Whether to mention all group participants',
            },
            {
                displayName: 'Mentioned JIDs',
                name: 'mentionedJid',
                type: 'string',
                default: '',
                description: 'Comma-separated list of JIDs to mention (e.g., 5511999999999@s.whatsapp.net)',
            },
            {
                displayName: 'Custom Message ID',
                name: 'id',
                type: 'string',
                default: '',
                description: 'Custom message ID (auto-generated if omitted)',
            },
            {
                displayName: 'Reply To Message ID',
                name: 'replyTo',
                type: 'string',
                default: '',
                description: 'Message ID (stanzaId) to reply to',
            },
            {
                displayName: 'Reply To Participant',
                name: 'replyToParticipant',
                type: 'string',
                default: '',
                description: 'JID of the original message sender (required when replying in groups)',
            },
        ],
    },
    {
        displayName: 'Sticker',
        name: 'sticker',
        type: 'string',
        required: true,
        default: '',
        description: 'Sticker content (base64/data URL or URL)',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendSticker'],
            },
        },
    },
    {
        displayName: 'Sticker Options',
        name: 'stickerOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendSticker'],
            },
        },
        options: [
            {
                displayName: 'PNG Thumbnail',
                name: 'pngThumbnail',
                type: 'string',
                default: '',
                description: 'Base64 thumbnail override',
            },
            {
                displayName: 'Check WhatsApp',
                name: 'check',
                type: 'boolean',
                default: false,
                description: 'Whether to validate JID before sending',
            },
            {
                displayName: 'Mention All',
                name: 'mentionAll',
                type: 'boolean',
                default: false,
                description: 'Whether to mention all group participants',
            },
            {
                displayName: 'Mentioned JIDs',
                name: 'mentionedJid',
                type: 'string',
                default: '',
                description: 'Comma-separated list of JIDs to mention (e.g., 5511999999999@s.whatsapp.net)',
            },
            {
                displayName: 'Custom Message ID',
                name: 'id',
                type: 'string',
                default: '',
                description: 'Custom message ID (auto-generated if omitted)',
            },
            {
                displayName: 'Reply To Message ID',
                name: 'replyTo',
                type: 'string',
                default: '',
                description: 'Message ID (stanzaId) to reply to',
            },
            {
                displayName: 'Reply To Participant',
                name: 'replyToParticipant',
                type: 'string',
                default: '',
                description: 'JID of the original message sender (required when replying in groups)',
            },
        ],
    },
    {
        displayName: 'Contact Name',
        name: 'contactName',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendContact'],
            },
        },
    },
    {
        displayName: 'VCard',
        name: 'vcard',
        type: 'string',
        typeOptions: {
            rows: 5,
        },
        required: true,
        default: '',
        description: 'VCARD string',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendContact'],
            },
        },
    },
    {
        displayName: 'Contact Options',
        name: 'contactOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendContact'],
            },
        },
        options: [
            {
                displayName: 'Check WhatsApp',
                name: 'check',
                type: 'boolean',
                default: false,
                description: 'Whether to validate JID before sending',
            },
            {
                displayName: 'Reply To Message ID',
                name: 'replyTo',
                type: 'string',
                default: '',
                description: 'Message ID (stanzaId) to reply to',
            },
            {
                displayName: 'Reply To Participant',
                name: 'replyToParticipant',
                type: 'string',
                default: '',
                description: 'JID of the original message sender (required when replying in groups)',
            },
            {
                displayName: 'Mentioned JIDs',
                name: 'mentionedJid',
                type: 'string',
                default: '',
                description: 'Comma-separated list of JIDs to mention (e.g., 5511999999999@s.whatsapp.net)',
            },
            {
                displayName: 'Custom Message ID',
                name: 'id',
                type: 'string',
                default: '',
                description: 'Custom message ID (auto-generated if omitted)',
            },
        ],
    },
    {
        displayName: 'Latitude',
        name: 'latitude',
        type: 'number',
        required: true,
        default: 0,
        description: 'Latitude coordinate',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendLocation'],
            },
        },
    },
    {
        displayName: 'Longitude',
        name: 'longitude',
        type: 'number',
        required: true,
        default: 0,
        description: 'Longitude coordinate',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendLocation'],
            },
        },
    },
    {
        displayName: 'Location Name',
        name: 'locationName',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendLocation'],
            },
        },
    },
    {
        displayName: 'Address',
        name: 'locationAddress',
        type: 'string',
        typeOptions: {
            rows: 3,
        },
        default: '',
        description: 'Full address',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendLocation'],
            },
        },
    },
    {
        displayName: 'Location URL',
        name: 'locationUrl',
        type: 'string',
        default: '',
        description: 'Associated URL',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendLocation'],
            },
        },
    },
    {
        displayName: 'Location Options',
        name: 'locationOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendLocation'],
            },
        },
        options: [
            {
                displayName: 'Check WhatsApp',
                name: 'check',
                type: 'boolean',
                default: false,
                description: 'Whether to validate JID before sending',
            },
            {
                displayName: 'Reply To Message ID',
                name: 'replyTo',
                type: 'string',
                default: '',
                description: 'Message ID (stanzaId) to reply to',
            },
            {
                displayName: 'Reply To Participant',
                name: 'replyToParticipant',
                type: 'string',
                default: '',
                description: 'JID of the original message sender (required when replying in groups)',
            },
            {
                displayName: 'Mentioned JIDs',
                name: 'mentionedJid',
                type: 'string',
                default: '',
                description: 'Comma-separated list of JIDs to mention (e.g., 5511999999999@s.whatsapp.net)',
            },
            {
                displayName: 'Custom Message ID',
                name: 'id',
                type: 'string',
                default: '',
                description: 'Custom message ID (auto-generated if omitted)',
            },
        ],
    },
    {
        displayName: 'Group JID',
        name: 'groupJid',
        type: 'string',
        required: true,
        default: '',
        placeholder: '120363417042313103@g.us',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendPoll'],
            },
        },
    },
    {
        displayName: 'Question',
        name: 'pollHeader',
        type: 'string',
        required: true,
        default: '',
        description: 'Poll question',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendPoll'],
            },
        },
    },
    {
        displayName: 'Options',
        name: 'pollOptions',
        type: 'string',
        required: true,
        default: '',
        description: 'Comma-separated poll options',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendPoll'],
            },
        },
    },
    {
        displayName: 'Options',
        name: 'pollAdditionalOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendPoll'],
            },
        },
        options: [
            {
                displayName: 'Custom Message ID',
                name: 'id',
                type: 'string',
                default: '',
                description: 'Custom message ID (auto-generated if omitted)',
            },
        ],
    },
    {
        displayName: 'Mode',
        name: 'buttonsMode',
        type: 'options',
        options: [
            { name: 'Buttons', value: 'buttons' },
            { name: 'Interactive', value: 'interactive' },
        ],
        default: 'interactive',
        description: 'Buttons mode: "interactive" supports URL/Call/Copy actions',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendButtons'],
            },
        },
    },
    {
        displayName: 'Header',
        name: 'buttonsHeader',
        type: 'string',
        default: '',
        description: 'Header text',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendButtons'],
            },
        },
    },
    {
        displayName: 'Text',
        name: 'buttonsText',
        type: 'string',
        typeOptions: {
            rows: 3,
        },
        default: '',
        description: 'Main body text',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendButtons'],
            },
        },
    },
    {
        displayName: 'Footer',
        name: 'buttonsFooter',
        type: 'string',
        default: '',
        description: 'Footer text',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendButtons'],
            },
        },
    },
    {
        displayName: 'Media',
        name: 'buttonsMediaType',
        type: 'options',
        options: [
            { name: 'None', value: 'none' },
            { name: 'Image', value: 'image' },
            { name: 'Video', value: 'video' },
        ],
        default: 'none',
        description: 'Optional media to include with buttons',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendButtons'],
            },
        },
    },
    {
        displayName: 'Image',
        name: 'buttonsImage',
        type: 'string',
        default: '',
        required: true,
        description: 'Image URL or base64',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendButtons'],
                buttonsMediaType: ['image'],
            },
        },
    },
    {
        displayName: 'Video',
        name: 'buttonsVideo',
        type: 'string',
        default: '',
        required: true,
        description: 'Video URL or base64',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendButtons'],
                buttonsMediaType: ['video'],
            },
        },
    },
    {
        displayName: 'Buttons',
        name: 'buttonsList',
        type: 'fixedCollection',
        typeOptions: {
            multipleValues: true,
            maxValue: 3,
        },
        default: {},
        description: 'Up to 3 buttons',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendButtons'],
            },
        },
        options: [
            {
                name: 'buttons',
                displayName: 'Button',
                values: [
                    {
                        displayName: 'Button ID',
                        name: 'buttonId',
                        type: 'string',
                        default: '',
                        description: 'Optional button ID (auto-generated if omitted)',
                    },
                    {
                        displayName: 'Button Text',
                        name: 'buttonText',
                        type: 'string',
                        default: '',
                        required: true,
                        description: 'Text displayed on the button',
                    },
                    {
                        displayName: 'Copy Code',
                        name: 'copyCode',
                        type: 'string',
                        default: '',
                        description: 'Code/text to copy',
                    },
                    {
                        displayName: 'Phone Number',
                        name: 'phoneNumber',
                        type: 'string',
                        default: '',
                        description: 'Phone number to call',
                    },
                    {
                        displayName: 'Type',
                        name: 'type',
                        type: 'options',
                        options: [
                            {
                                name: 'Quick Reply',
                                value: 'quickReply',
                            },
                            {
                                name: 'URL',
                                value: 'url',
                            },
                            {
                                name: 'Call',
                                value: 'call',
                            },
                            {
                                name: 'Copy',
                                value: 'copy',
                            },
                        ],
                        default: 'quickReply',
                        description: 'Button type',
                    },
                    {
                        displayName: 'URL',
                        name: 'url',
                        type: 'string',
                        default: '',
                        description: 'URL to open',
                    },
                ],
            },
        ],
    },
    {
        displayName: 'Buttons Options',
        name: 'buttonsOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendButtons'],
            },
        },
        options: [
            {
                displayName: 'Buttons (JSON)',
                name: 'buttonsJson',
                type: 'string',
                typeOptions: {
                    rows: 4,
                },
                default: '',
                description: 'JSON array of buttons (alternative to visual editor). If provided, this takes precedence over the visual editor.',
            },
            {
                displayName: 'Caption',
                name: 'caption',
                type: 'string',
                default: '',
                description: 'Caption shown with media',
            },
            {
                displayName: 'Check WhatsApp',
                name: 'check',
                type: 'boolean',
                default: false,
                description: 'Whether to validate JID via IsOnWhatsApp before sending',
            },
            {
                displayName: 'File Name',
                name: 'fileName',
                type: 'string',
                default: '',
                description: 'Media file name',
            },
            {
                displayName: 'Mime Type',
                name: 'mimeType',
                type: 'string',
                default: '',
                description: 'Media MIME type (e.g., image/jpeg, video/mp4)',
            },
            {
                displayName: 'Reply To Message ID',
                name: 'replyTo',
                type: 'string',
                default: '',
                description: 'Message ID (stanzaId) to reply to',
            },
            {
                displayName: 'Reply To Participant',
                name: 'replyToParticipant',
                type: 'string',
                default: '',
                description: 'JID of the original message sender (required when replying in groups)',
            },
            {
                displayName: 'Title',
                name: 'title',
                type: 'string',
                default: '',
                description: 'Buttons title (legacy field)',
            },
        ],
    },
    {
        displayName: 'Title',
        name: 'listTitle',
        type: 'string',
        default: '',
        description: 'List title',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendList'],
            },
        },
    },
    {
        displayName: 'Text',
        name: 'listDescription',
        type: 'string',
        typeOptions: {
            rows: 3,
        },
        default: '',
        description: 'List text/description',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendList'],
            },
        },
    },
    {
        displayName: 'Footer',
        name: 'listFooter',
        type: 'string',
        default: '',
        description: 'Footer text',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendList'],
            },
        },
    },
    {
        displayName: 'Button Text',
        name: 'listButtonText',
        type: 'string',
        required: true,
        default: '',
        description: 'Text for the button that opens the list',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendList'],
            },
        },
    },
    {
        displayName: 'Sections',
        name: 'listSections',
        type: 'fixedCollection',
        typeOptions: {
            multipleValues: true,
        },
        default: {},
        description: 'List sections with rows',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendList'],
            },
        },
        options: [
            {
                name: 'sections',
                displayName: 'Section',
                values: [
                    {
                        displayName: 'Section Title',
                        name: 'title',
                        type: 'string',
                        default: '',
                        description: 'Title of this section',
                    },
                    {
                        displayName: 'Rows',
                        name: 'rows',
                        type: 'fixedCollection',
                        typeOptions: {
                            multipleValues: true,
                        },
                        default: {},
                        description: 'Items in this section',
                        options: [
                            {
                                name: 'items',
                                displayName: 'Row',
                                values: [
                                    {
                                        displayName: 'Title',
                                        name: 'title',
                                        type: 'string',
                                        default: '',
                                        required: true,
                                        description: 'Row title',
                                    },
                                    {
                                        displayName: 'Description',
                                        name: 'desc',
                                        type: 'string',
                                        default: '',
                                        description: 'Row description',
                                    },
                                    {
                                        displayName: 'Row ID',
                                        name: 'rowId',
                                        type: 'string',
                                        default: '',
                                        description: 'Optional row ID (auto-generated if omitted)',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        displayName: 'List Options',
        name: 'listOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendList'],
            },
        },
        options: [
            {
                displayName: 'Check WhatsApp',
                name: 'check',
                type: 'boolean',
                default: false,
                description: 'Whether to validate JID via IsOnWhatsApp before sending',
            },
            {
                displayName: 'List (JSON)',
                name: 'listItemsJson',
                type: 'string',
                typeOptions: {
                    rows: 5,
                },
                default: '',
                description: 'JSON array of list rows (legacy flat format)',
            },
            {
                displayName: 'Reply To Message ID',
                name: 'replyTo',
                type: 'string',
                default: '',
                description: 'Message ID (stanzaId) to reply to',
            },
            {
                displayName: 'Reply To Participant',
                name: 'replyToParticipant',
                type: 'string',
                default: '',
                description: 'JID of the original message sender (required when replying in groups)',
            },
            {
                displayName: 'Sections (JSON)',
                name: 'listSectionsJson',
                type: 'string',
                typeOptions: {
                    rows: 5,
                },
                default: '',
                description: 'JSON array of list sections (alternative to visual editor). If provided, this takes precedence.',
            },
        ],
    },
    {
        displayName: 'Title',
        name: 'templateTitle',
        type: 'string',
        default: '',
        description: 'Template title',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendTemplate'],
            },
        },
    },
    {
        displayName: 'Text',
        name: 'templateText',
        type: 'string',
        typeOptions: {
            rows: 3,
        },
        default: '',
        description: 'Template body text',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendTemplate'],
            },
        },
    },
    {
        displayName: 'Header',
        name: 'templateHeader',
        type: 'string',
        default: '',
        description: 'Template header',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendTemplate'],
            },
        },
    },
    {
        displayName: 'Footer',
        name: 'templateFooter',
        type: 'string',
        default: '',
        description: 'Template footer',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendTemplate'],
            },
        },
    },
    {
        displayName: 'Template Buttons (JSON)',
        name: 'templateButtonsJson',
        type: 'string',
        typeOptions: {
            rows: 4,
        },
        required: true,
        default: '',
        description: 'JSON array of template buttons',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendTemplate'],
            },
        },
    },
    {
        displayName: 'Options',
        name: 'templateOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendTemplate'],
            },
        },
        options: [
            {
                displayName: 'Custom Message ID',
                name: 'id',
                type: 'string',
                default: '',
                description: 'Custom message ID (auto-generated if omitted)',
            },
        ],
    },
    {
        displayName: 'Media URL',
        name: 'downloadUrl',
        type: 'string',
        required: true,
        default: '',
        description: 'WhatsApp media URL',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['downloadImage', 'downloadAudio', 'downloadDocument', 'downloadVideo'],
            },
        },
    },
    {
        displayName: 'Direct Path',
        name: 'downloadDirectPath',
        type: 'string',
        default: '',
        description: 'WhatsApp media direct path',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['downloadImage', 'downloadAudio', 'downloadDocument', 'downloadVideo'],
            },
        },
    },
    {
        displayName: 'Media Key',
        name: 'downloadMediaKey',
        type: 'string',
        required: true,
        default: '',
        description: 'Media encryption key',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['downloadImage', 'downloadAudio', 'downloadDocument', 'downloadVideo'],
            },
        },
    },
    {
        displayName: 'Mime Type',
        name: 'downloadMimeType',
        type: 'string',
        required: true,
        default: '',
        description: 'Media MIME type',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['downloadImage', 'downloadAudio', 'downloadDocument', 'downloadVideo'],
            },
        },
    },
    {
        displayName: 'File SHA256',
        name: 'downloadFileSha256',
        type: 'string',
        required: true,
        default: '',
        description: 'File SHA256 hash',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['downloadImage', 'downloadAudio', 'downloadDocument', 'downloadVideo'],
            },
        },
    },
    {
        displayName: 'File Encrypted SHA256',
        name: 'downloadFileEncSha256',
        type: 'string',
        default: '',
        description: 'Encrypted file SHA256 hash',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['downloadImage', 'downloadAudio', 'downloadDocument', 'downloadVideo'],
            },
        },
    },
    {
        displayName: 'File Length',
        name: 'downloadFileLength',
        type: 'number',
        required: true,
        default: 0,
        description: 'File size in bytes',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['downloadImage', 'downloadAudio', 'downloadDocument', 'downloadVideo'],
            },
        },
    },
    {
        displayName: 'Generate Link',
        name: 'downloadGenerateLink',
        type: 'boolean',
        default: false,
        description: 'Whether to generate a temporary download link instead of base64',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['downloadImage', 'downloadAudio', 'downloadDocument', 'downloadVideo'],
            },
        },
    },
    {
        displayName: 'Message ID',
        name: 'messageId',
        type: 'string',
        required: true,
        default: '',
        description: 'ID of the message to edit',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['edit', 'delete', 'react'],
            },
        },
    },
    {
        displayName: 'Chat JID',
        name: 'chatJid',
        type: 'string',
        required: true,
        default: '',
        placeholder: '5511999999999@s.whatsapp.net',
        description: 'Chat JID where the message is',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['edit', 'delete', 'react'],
            },
        },
    },
    {
        displayName: 'New Text',
        name: 'newText',
        type: 'string',
        typeOptions: {
            rows: 4,
        },
        required: true,
        default: '',
        description: 'The new text for the message',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['edit'],
            },
        },
    },
    {
        displayName: 'Emoji',
        name: 'emoji',
        type: 'string',
        required: true,
        default: '👍',
        description: 'Emoji to react with (empty to remove reaction)',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['react'],
            },
        },
    },
    {
        displayName: 'Action',
        name: 'archiveAction',
        type: 'options',
        options: [
            { name: 'Archive', value: 'archive' },
            { name: 'Unarchive', value: 'unarchive' },
        ],
        default: 'archive',
        description: 'Choose whether to archive or unarchive the chat',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['archive'],
            },
        },
    },
    {
        displayName: 'Action',
        name: 'muteAction',
        type: 'options',
        options: [
            { name: 'Mute', value: 'mute' },
            { name: 'Unmute', value: 'unmute' },
        ],
        default: 'mute',
        description: 'Choose whether to mute or unmute the chat',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['mute'],
            },
        },
    },
    {
        displayName: 'Action',
        name: 'pinAction',
        type: 'options',
        options: [
            { name: 'Pin', value: 'pin' },
            { name: 'Unpin', value: 'unpin' },
        ],
        default: 'pin',
        description: 'Choose whether to pin or unpin the chat',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['pin'],
            },
        },
    },
    {
        displayName: 'Message IDs',
        name: 'messageIds',
        type: 'string',
        required: true,
        default: '',
        description: 'Comma-separated message IDs to mark as read',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['markMessageRead'],
            },
        },
    },
    {
        displayName: 'Chat JID',
        name: 'markReadChatJid',
        type: 'string',
        required: true,
        default: '',
        description: 'Chat JID for the messages',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['markMessageRead'],
            },
        },
    },
    {
        displayName: 'Sender JID',
        name: 'markReadSenderJid',
        type: 'string',
        default: '',
        description: 'Sender JID (optional)',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['markMessageRead'],
            },
        },
    },
    {
        displayName: 'Presence State',
        name: 'presenceState',
        type: 'options',
        options: [
            { name: 'Composing', value: 'composing' },
            { name: 'Paused', value: 'paused' },
            { name: 'Recording', value: 'recording' },
            { name: 'Available', value: 'available' },
            { name: 'Unavailable', value: 'unavailable' },
        ],
        required: true,
        default: 'composing',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['presence'],
            },
        },
    },
    {
        displayName: 'Media',
        name: 'presenceMedia',
        type: 'string',
        default: '',
        description: 'Media type for presence (e.g. audio)',
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['presence'],
            },
        },
    },
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
            show: {
                resource: ['chat'],
                operation: ['sendText', 'sendImage', 'sendAudio', 'sendDocument'],
            },
        },
        options: [
            {
                displayName: 'Caption',
                name: 'caption',
                type: 'string',
                default: '',
                description: 'Caption for media messages',
                displayOptions: {
                    hide: {
                        '/operation': ['sendText'],
                    },
                },
            },
            {
                displayName: 'Check WhatsApp',
                name: 'check',
                type: 'boolean',
                default: false,
                description: 'Whether to validate JID via IsOnWhatsApp before sending',
            },
            {
                displayName: 'Custom Message ID',
                name: 'id',
                type: 'string',
                default: '',
                description: 'Custom message ID (auto-generated if omitted)',
                displayOptions: {
                    show: {
                        '/operation': ['sendText', 'sendImage', 'sendAudio', 'sendDocument'],
                    },
                },
            },
            {
                displayName: 'Link Preview',
                name: 'linkPreview',
                type: 'boolean',
                default: false,
                description: 'Whether to enable automatic link preview for URLs in the message',
                displayOptions: {
                    show: {
                        '/operation': ['sendText'],
                    },
                },
            },
            {
                displayName: 'Mention All',
                name: 'mentionAll',
                type: 'boolean',
                default: false,
                description: 'Whether to mention all group members (only works in groups)',
                displayOptions: {
                    show: {
                        '/operation': ['sendText', 'sendImage', 'sendAudio', 'sendDocument'],
                    },
                },
            },
            {
                displayName: 'Mentioned JIDs',
                name: 'mentionedJid',
                type: 'string',
                default: '',
                description: 'Comma-separated list of JIDs to mention (e.g., 5511999999999@s.whatsapp.net)',
                displayOptions: {
                    show: {
                        '/operation': ['sendText', 'sendImage', 'sendAudio', 'sendDocument'],
                    },
                },
            },
            {
                displayName: 'File Name',
                name: 'fileName',
                type: 'string',
                default: '',
                description: 'Custom file name for the media',
                displayOptions: {
                    show: {
                        '/operation': ['sendImage', 'sendAudio'],
                    },
                },
            },
            {
                displayName: 'Mime Type',
                name: 'mimeType',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        '/operation': ['sendImage', 'sendAudio', 'sendDocument'],
                    },
                },
            },
            {
                displayName: 'PTT (Voice Note)',
                name: 'ptt',
                type: 'boolean',
                default: true,
                description: 'Whether to send audio as voice note (PTT)',
                displayOptions: {
                    show: {
                        '/operation': ['sendAudio'],
                    },
                },
            },
            {
                displayName: 'Reply To Message ID',
                name: 'replyTo',
                type: 'string',
                default: '',
                description: 'Message ID (stanzaId) to reply to',
            },
            {
                displayName: 'Reply To Participant',
                name: 'replyToParticipant',
                type: 'string',
                default: '',
                description: 'JID of the original message sender (required when replying in groups, e.g., 5511999999999@s.whatsapp.net)',
            },
            {
                displayName: 'Typing Time (Ms)',
                name: 'typingTime',
                type: 'number',
                default: 0,
                description: 'Simulated typing time in milliseconds before sending (0-25000)',
            },
            {
                displayName: 'View Once',
                name: 'viewOnce',
                type: 'boolean',
                default: false,
                description: 'Whether to send the message as view-once',
                displayOptions: {
                    show: {
                        '/operation': ['sendImage', 'sendAudio'],
                    },
                },
            },
        ],
    },
];
//# sourceMappingURL=ChatDescription.js.map