"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupFields = exports.groupOperations = void 0;
exports.groupOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['group'],
            },
        },
        options: [
            {
                name: 'Announce',
                value: 'announce',
                description: 'Set group announce mode',
                action: 'Set group announce mode',
            },
            {
                name: 'Create',
                value: 'create',
                description: 'Create a new group',
                action: 'Create a group',
            },
            {
                name: 'Ephemeral',
                value: 'ephemeral',
                description: 'Set disappearing timer for group messages',
                action: 'Set group disappearing timer',
            },
            {
                name: 'Get Info',
                value: 'getInfo',
                description: 'Get group information',
                action: 'Get group info',
            },
            {
                name: 'Get Invite Link',
                value: 'getInviteLink',
                description: 'Get group invite link',
                action: 'Get group invite link',
            },
            {
                name: 'Invite Info',
                value: 'inviteInfo',
                description: 'Get information about a group invite code',
                action: 'Get invite info',
            },
            {
                name: 'Join',
                value: 'join',
                description: 'Join a group via invite code',
                action: 'Join a group',
            },
            {
                name: 'Leave',
                value: 'leave',
                description: 'Leave a group',
                action: 'Leave a group',
            },
            {
                name: 'List',
                value: 'list',
                description: 'List subscribed groups',
                action: 'List groups',
            },
            {
                name: 'Lock',
                value: 'locked',
                description: 'Set group locked status',
                action: 'Set group locked status',
            },
            {
                name: 'Remove Photo',
                value: 'removePhoto',
                description: 'Remove group photo',
                action: 'Remove group photo',
            },
            {
                name: 'Set Name',
                value: 'setName',
                description: 'Change group name',
                action: 'Change group name',
            },
            {
                name: 'Set Photo',
                value: 'setPhoto',
                description: 'Change group photo',
                action: 'Change group photo',
            },
            {
                name: 'Set Topic',
                value: 'setTopic',
                description: 'Set group topic/description',
                action: 'Set group topic',
            },
            {
                name: 'Update Participants',
                value: 'updateParticipants',
                description: 'Add, remove, promote or demote participants',
                action: 'Update group participants',
            },
        ],
        default: 'list',
    },
];
exports.groupFields = [
    {
        displayName: 'Group JID',
        name: 'groupJid',
        type: 'string',
        required: true,
        default: '',
        placeholder: '120362023605733675@g.us',
        displayOptions: {
            show: {
                resource: ['group'],
                operation: [
                    'getInfo',
                    'getInviteLink',
                    'announce',
                    'ephemeral',
                    'leave',
                    'locked',
                    'setName',
                    'setPhoto',
                    'removePhoto',
                    'setTopic',
                    'updateParticipants',
                ],
            },
        },
    },
    {
        displayName: 'Reset Invite Link',
        name: 'resetInvite',
        type: 'boolean',
        default: false,
        description: 'Whether to reset invite link before returning it',
        displayOptions: {
            show: {
                resource: ['group'],
                operation: ['getInviteLink'],
            },
        },
    },
    {
        displayName: 'Group Name',
        name: 'groupName',
        type: 'string',
        required: true,
        default: '',
        description: 'Name for the new group',
        displayOptions: {
            show: {
                resource: ['group'],
                operation: ['create'],
            },
        },
    },
    {
        displayName: 'Participants',
        name: 'participants',
        type: 'string',
        required: true,
        default: '',
        description: 'Comma-separated participant phone numbers or JIDs',
        displayOptions: {
            show: {
                resource: ['group'],
                operation: ['create'],
            },
        },
    },
    {
        displayName: 'Enabled',
        name: 'announceEnabled',
        type: 'boolean',
        required: true,
        default: true,
        description: 'Whether to enable announce mode',
        displayOptions: {
            show: {
                resource: ['group'],
                operation: ['announce'],
            },
        },
    },
    {
        displayName: 'Locked',
        name: 'lockedEnabled',
        type: 'boolean',
        required: true,
        default: true,
        description: 'Whether to lock group settings',
        displayOptions: {
            show: {
                resource: ['group'],
                operation: ['locked'],
            },
        },
    },
    {
        displayName: 'Duration',
        name: 'ephemeralDuration',
        type: 'options',
        options: [
            { name: '24 Hours', value: '24h' },
            { name: '7 Days', value: '7d' },
            { name: '90 Days', value: '90d' },
            { name: 'Off', value: 'off' },
        ],
        required: true,
        default: '24h',
        description: 'Disappearing timer duration',
        displayOptions: {
            show: {
                resource: ['group'],
                operation: ['ephemeral'],
            },
        },
    },
    {
        displayName: 'Invite Code',
        name: 'inviteCode',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['group'],
                operation: ['inviteInfo', 'join'],
            },
        },
    },
    {
        displayName: 'New Name',
        name: 'newGroupName',
        type: 'string',
        required: true,
        default: '',
        description: 'New group name',
        displayOptions: {
            show: {
                resource: ['group'],
                operation: ['setName'],
            },
        },
    },
    {
        displayName: 'Topic',
        name: 'groupTopic',
        type: 'string',
        required: true,
        default: '',
        description: 'Group topic/description',
        displayOptions: {
            show: {
                resource: ['group'],
                operation: ['setTopic'],
            },
        },
    },
    {
        displayName: 'Image',
        name: 'groupPhoto',
        type: 'string',
        required: true,
        default: '',
        description: 'Base64 image data or data URL',
        displayOptions: {
            show: {
                resource: ['group'],
                operation: ['setPhoto'],
            },
        },
    },
    {
        displayName: 'Action',
        name: 'participantAction',
        type: 'options',
        options: [
            { name: 'Add', value: 'add' },
            { name: 'Remove', value: 'remove' },
            { name: 'Promote', value: 'promote' },
            { name: 'Demote', value: 'demote' },
        ],
        required: true,
        default: 'add',
        description: 'Participant action',
        displayOptions: {
            show: {
                resource: ['group'],
                operation: ['updateParticipants'],
            },
        },
    },
    {
        displayName: 'Participants',
        name: 'participantPhones',
        type: 'string',
        required: true,
        default: '',
        description: 'Comma-separated participant phone numbers or JIDs',
        displayOptions: {
            show: {
                resource: ['group'],
                operation: ['updateParticipants'],
            },
        },
    },
];
//# sourceMappingURL=GroupDescription.js.map