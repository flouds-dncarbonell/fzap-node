"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFields = exports.userOperations = void 0;
exports.userOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['user'],
            },
        },
        options: [
            {
                name: 'Check WhatsApp',
                value: 'checkWhatsApp',
                description: 'Check if phone numbers are registered on WhatsApp',
                action: 'Check if numbers are on whats app',
            },
            {
                name: 'Get Avatar',
                value: 'getAvatar',
                description: 'Get profile picture URL',
                action: 'Get profile picture',
            },
            {
                name: 'Get Contacts',
                value: 'getContacts',
                description: 'Get all contacts from the account',
                action: 'Get all contacts',
            },
            {
                name: 'Get Info',
                value: 'getInfo',
                description: 'Get detailed information about users',
                action: 'Get user information',
            },
            {
                name: 'Get LID',
                value: 'getLid',
                description: 'Convert JID/Phone to LID format (GET)',
                action: 'Get LID',
            },
            {
                name: 'Get LID (POST)',
                value: 'getLidPost',
                description: 'Convert JID/Phone to LID format (POST)',
                action: 'Get LID via POST',
            },
            {
                name: 'Get LID List',
                value: 'listLid',
                description: 'List LID mappings information',
                action: 'List LID mappings',
            },
            {
                name: 'Get Privacy Settings',
                value: 'getPrivacySettings',
                description: 'Get current privacy settings',
                action: 'Get privacy settings',
            },
            {
                name: 'Get Profile Name',
                value: 'getProfileName',
                description: 'Get current profile push name',
                action: 'Get profile push name',
            },
            {
                name: 'Reverse LID',
                value: 'reverseLid',
                description: 'Convert LID to JID/Phone format (GET)',
                action: 'Reverse LID',
            },
            {
                name: 'Reverse LID (POST)',
                value: 'reverseLidPost',
                description: 'Convert LID to JID/Phone format (POST)',
                action: 'Reverse LID via POST',
            },
            {
                name: 'Set Presence',
                value: 'setPresence',
                description: 'Set user presence (available/unavailable)',
                action: 'Set user presence',
            },
            {
                name: 'Set Profile Name',
                value: 'setProfileName',
                description: 'Update profile push name',
                action: 'Set profile push name',
            },
            {
                name: 'Set Profile Status',
                value: 'setProfileStatus',
                description: 'Update profile status/about text',
                action: 'Set profile status',
            },
            {
                name: 'Update Privacy Settings',
                value: 'updatePrivacySettings',
                action: 'Update privacy settings',
            },
        ],
        default: 'getInfo',
    },
];
exports.userFields = [
    {
        displayName: 'Phone Numbers',
        name: 'phones',
        type: 'string',
        required: true,
        default: '',
        placeholder: '5511999999999, 5511888888888',
        description: 'Phone numbers with country code (comma-separated for multiple)',
        displayOptions: {
            show: {
                resource: ['user'],
                operation: ['getInfo', 'checkWhatsApp'],
            },
        },
    },
    {
        displayName: 'Phone',
        name: 'lidPhone',
        type: 'string',
        required: true,
        default: '',
        placeholder: '5511999999999@s.whatsapp.net',
        description: 'Phone or JID to convert to LID',
        displayOptions: {
            show: {
                resource: ['user'],
                operation: ['getLid', 'getLidPost'],
            },
        },
    },
    {
        displayName: 'LID',
        name: 'lidValue',
        type: 'string',
        required: true,
        default: '',
        placeholder: '2:hash@lid',
        description: 'LID to convert to JID/Phone',
        displayOptions: {
            show: {
                resource: ['user'],
                operation: ['reverseLid', 'reverseLidPost'],
            },
        },
    },
    {
        displayName: 'Phone Number',
        name: 'phone',
        type: 'string',
        required: true,
        default: '',
        placeholder: '5511999999999',
        description: 'Phone number with country code, without + sign',
        displayOptions: {
            show: {
                resource: ['user'],
                operation: ['getAvatar'],
            },
        },
    },
    {
        displayName: 'Preview Only',
        name: 'preview',
        type: 'boolean',
        default: false,
        description: 'Whether to get preview (thumbnail) instead of full image',
        displayOptions: {
            show: {
                resource: ['user'],
                operation: ['getAvatar'],
            },
        },
    },
    {
        displayName: 'Presence',
        name: 'presence',
        type: 'options',
        options: [
            { name: 'Available', value: 'available' },
            { name: 'Unavailable', value: 'unavailable' },
        ],
        default: 'available',
        description: 'Presence status to set',
        displayOptions: {
            show: {
                resource: ['user'],
                operation: ['setPresence'],
            },
        },
    },
    {
        displayName: 'Profile Name',
        name: 'profileName',
        type: 'string',
        required: true,
        default: '',
        placeholder: 'John Doe',
        description: 'Profile push name (display name shown to recipients)',
        displayOptions: {
            show: {
                resource: ['user'],
                operation: ['setProfileName'],
            },
        },
    },
    {
        displayName: 'Status Text',
        name: 'statusText',
        type: 'string',
        required: true,
        default: '',
        placeholder: 'Available for work',
        description: 'Profile status/about text (max 139 characters)',
        displayOptions: {
            show: {
                resource: ['user'],
                operation: ['setProfileStatus'],
            },
        },
    },
    {
        displayName: 'Privacy Settings',
        name: 'privacySettings',
        type: 'collection',
        placeholder: 'Add Setting',
        default: {},
        displayOptions: {
            show: {
                resource: ['user'],
                operation: ['updatePrivacySettings'],
            },
        },
        options: [
            {
                displayName: 'Group Add',
                name: 'groupAdd',
                type: 'options',
                options: [
                    { name: 'All', value: 'all' },
                    { name: 'Contacts', value: 'contacts' },
                    { name: 'Contact Blacklist', value: 'contact_blacklist' },
                    { name: 'None', value: 'none' },
                ],
                default: 'contacts',
                description: 'Who can add you to groups',
            },
            {
                displayName: 'Last Seen',
                name: 'lastSeen',
                type: 'options',
                options: [
                    { name: 'All', value: 'all' },
                    { name: 'Contacts', value: 'contacts' },
                    { name: 'Contact Blacklist', value: 'contact_blacklist' },
                    { name: 'None', value: 'none' },
                ],
                default: 'contacts',
                description: 'Who can see your last seen',
            },
            {
                displayName: 'Status',
                name: 'status',
                type: 'options',
                options: [
                    { name: 'All', value: 'all' },
                    { name: 'Contacts', value: 'contacts' },
                    { name: 'Contact Blacklist', value: 'contact_blacklist' },
                    { name: 'None', value: 'none' },
                ],
                default: 'contacts',
                description: 'Who can see your status updates',
            },
            {
                displayName: 'Profile Photo',
                name: 'profile',
                type: 'options',
                options: [
                    { name: 'All', value: 'all' },
                    { name: 'Contacts', value: 'contacts' },
                    { name: 'Contact Blacklist', value: 'contact_blacklist' },
                    { name: 'None', value: 'none' },
                ],
                default: 'contacts',
                description: 'Who can see your profile photo',
            },
            {
                displayName: 'Read Receipts',
                name: 'readReceipts',
                type: 'options',
                options: [
                    { name: 'All', value: 'all' },
                    { name: 'None', value: 'none' },
                ],
                default: 'all',
                description: 'Read receipts visibility',
            },
            {
                displayName: 'Call Add',
                name: 'callAdd',
                type: 'options',
                options: [
                    { name: 'All', value: 'all' },
                    { name: 'Known', value: 'known' },
                ],
                default: 'known',
                description: 'Who can call you',
            },
            {
                displayName: 'Online',
                name: 'online',
                type: 'options',
                options: [
                    { name: 'All', value: 'all' },
                    { name: 'Match Last Seen', value: 'match_last_seen' },
                ],
                default: 'match_last_seen',
                description: 'Who can see you online',
            },
        ],
    },
];
//# sourceMappingURL=UserDescription.js.map