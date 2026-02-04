"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookFields = exports.webhookOperations = void 0;
exports.webhookOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['webhook'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create a new webhook',
                action: 'Create a webhook',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete a webhook',
                action: 'Delete a webhook',
            },
            {
                name: 'List',
                value: 'list',
                description: 'List all webhooks',
                action: 'List all webhooks',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update a webhook',
                action: 'Update a webhook',
            },
        ],
        default: 'list',
    },
];
const eventOptions = [
    { name: 'All', value: 'All' },
    { name: 'Message', value: 'Message' },
    { name: 'Automation Message', value: 'AutomationMessage' },
    { name: 'Undecryptable Message', value: 'UndecryptableMessage' },
    { name: 'Receipt', value: 'Receipt' },
    { name: 'Media Retry', value: 'MediaRetry' },
    { name: 'Read Receipt', value: 'ReadReceipt' },
    { name: 'Group Info', value: 'GroupInfo' },
    { name: 'Joined Group', value: 'JoinedGroup' },
    { name: 'Picture', value: 'Picture' },
    { name: 'Blocklist Change', value: 'BlocklistChange' },
    { name: 'Blocklist', value: 'Blocklist' },
    { name: 'Connected', value: 'Connected' },
    { name: 'Disconnected', value: 'Disconnected' },
    { name: 'Connect Failure', value: 'ConnectFailure' },
    { name: 'Keep Alive Restored', value: 'KeepAliveRestored' },
    { name: 'Keep Alive Timeout', value: 'KeepAliveTimeout' },
    { name: 'Logged Out', value: 'LoggedOut' },
    { name: 'Presence', value: 'Presence' },
    { name: 'Chat Presence', value: 'ChatPresence' },
    { name: 'Call Offer', value: 'CallOffer' },
    { name: 'Call Accept', value: 'CallAccept' },
    { name: 'Call Terminate', value: 'CallTerminate' },
    { name: 'Call Offer Notice', value: 'CallOfferNotice' },
    { name: 'Call Relay Latency', value: 'CallRelayLatency' },
    { name: 'App State', value: 'AppState' },
    { name: 'App State Sync Complete', value: 'AppStateSyncComplete' },
    { name: 'History Sync', value: 'HistorySync' },
    { name: 'Offline Sync Completed', value: 'OfflineSyncCompleted' },
    { name: 'Offline Sync Preview', value: 'OfflineSyncPreview' },
    { name: 'Privacy Settings', value: 'PrivacySettings' },
    { name: 'Push Name Setting', value: 'PushNameSetting' },
    { name: 'User About', value: 'UserAbout' },
    { name: 'Newsletter Join', value: 'NewsletterJoin' },
    { name: 'Newsletter Leave', value: 'NewsletterLeave' },
    { name: 'Newsletter Mute Change', value: 'NewsletterMuteChange' },
    { name: 'Newsletter Live Update', value: 'NewsletterLiveUpdate' },
    { name: 'Identity Change', value: 'IdentityChange' },
    { name: 'CAT Refresh Error', value: 'CATRefreshError' },
    { name: 'FB Message', value: 'FBMessage' },
    { name: 'QR', value: 'QR' },
    { name: 'Pair Success', value: 'PairSuccess' },
    { name: 'Pair Error', value: 'PairError' },
];
exports.webhookFields = [
    {
        displayName: 'Webhook ID',
        name: 'webhookId',
        type: 'string',
        required: true,
        default: '',
        description: 'ID of the webhook to update or delete',
        displayOptions: {
            show: {
                resource: ['webhook'],
                operation: ['update', 'delete'],
            },
        },
    },
    {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        required: true,
        default: '',
        placeholder: 'https://your-server.com/webhook',
        description: 'URL that will receive webhook events',
        displayOptions: {
            show: {
                resource: ['webhook'],
                operation: ['create'],
            },
        },
    },
    {
        displayName: 'Events',
        name: 'events',
        type: 'multiOptions',
        options: eventOptions,
        default: ['All'],
        description: 'Events to subscribe to',
        displayOptions: {
            show: {
                resource: ['webhook'],
                operation: ['create'],
            },
        },
    },
    {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['webhook'],
                operation: ['update'],
            },
        },
        options: [
            {
                displayName: 'URL',
                name: 'url',
                type: 'string',
                default: '',
                placeholder: 'https://your-server.com/webhook',
                description: 'New URL for the webhook',
            },
            {
                displayName: 'Events',
                name: 'events',
                type: 'multiOptions',
                options: eventOptions,
                default: [],
                description: 'Events to subscribe to',
            },
        ],
    },
];
//# sourceMappingURL=WebhookDescription.js.map