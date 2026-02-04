"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paidTrafficFields = exports.paidTrafficOperations = void 0;
exports.paidTrafficOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['paidTraffic'],
            },
        },
        options: [
            {
                name: 'Get Config',
                value: 'getConfig',
                description: 'Get paid traffic configuration',
                action: 'Get paid traffic config',
            },
            {
                name: 'Get Conversion Events',
                value: 'getConversionEvents',
                description: 'List conversion events',
                action: 'Get conversion events',
            },
            {
                name: 'Get Leads',
                value: 'getLeads',
                description: 'List paid traffic leads',
                action: 'Get paid traffic leads',
            },
            {
                name: 'Get Leads Export',
                value: 'exportLeads',
                description: 'Export paid traffic leads to CSV',
                action: 'Export paid traffic leads',
            },
            {
                name: 'Get Stats',
                value: 'getStats',
                description: 'Get paid traffic statistics',
                action: 'Get paid traffic stats',
            },
            {
                name: 'Save Config',
                value: 'saveConfig',
                description: 'Save paid traffic configuration',
                action: 'Save paid traffic config',
            },
            {
                name: 'Enrich Lead',
                value: 'enrichLead',
                description: 'Manually enrich a lead',
                action: 'Enrich a lead',
            },
            {
                name: 'Send Conversion',
                value: 'sendConversion',
                description: 'Send conversion event to Meta',
                action: 'Send conversion event',
            },
        ],
        default: 'getConfig',
    },
];
exports.paidTrafficFields = [
    {
        displayName: 'Lead ID',
        name: 'leadId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['paidTraffic'],
                operation: ['enrichLead', 'sendConversion'],
            },
        },
    },
    {
        displayName: 'Search',
        name: 'leadsSearch',
        type: 'string',
        default: '',
        description: 'Search term',
        displayOptions: {
            show: {
                resource: ['paidTraffic'],
                operation: ['getLeads', 'exportLeads'],
            },
        },
    },
    {
        displayName: 'Date From',
        name: 'leadsDateFrom',
        type: 'string',
        default: '',
        description: 'Start date (YYYY-MM-DD)',
        displayOptions: {
            show: {
                resource: ['paidTraffic'],
                operation: ['getLeads'],
            },
        },
    },
    {
        displayName: 'Date To',
        name: 'leadsDateTo',
        type: 'string',
        default: '',
        description: 'End date (YYYY-MM-DD)',
        displayOptions: {
            show: {
                resource: ['paidTraffic'],
                operation: ['getLeads'],
            },
        },
    },
    {
        displayName: 'Campaign',
        name: 'leadsCampaign',
        type: 'string',
        default: '',
        description: 'Campaign filter',
        displayOptions: {
            show: {
                resource: ['paidTraffic'],
                operation: ['getLeads'],
            },
        },
    },
    {
        displayName: 'Ad Set',
        name: 'leadsAdset',
        type: 'string',
        default: '',
        description: 'Ad set filter',
        displayOptions: {
            show: {
                resource: ['paidTraffic'],
                operation: ['getLeads'],
            },
        },
    },
    {
        displayName: 'Creative',
        name: 'leadsCreative',
        type: 'string',
        default: '',
        description: 'Creative filter',
        displayOptions: {
            show: {
                resource: ['paidTraffic'],
                operation: ['getLeads'],
            },
        },
    },
    {
        displayName: 'Limit',
        name: 'leadsLimit',
        type: 'number',
        default: 0,
        description: 'Number of records to return',
        displayOptions: {
            show: {
                resource: ['paidTraffic'],
                operation: ['getLeads'],
            },
        },
    },
    {
        displayName: 'Offset',
        name: 'leadsOffset',
        type: 'number',
        default: 0,
        description: 'Offset for pagination',
        displayOptions: {
            show: {
                resource: ['paidTraffic'],
                operation: ['getLeads'],
            },
        },
    },
    {
        displayName: 'Sort',
        name: 'leadsSort',
        type: 'string',
        default: '',
        description: 'Sort field',
        displayOptions: {
            show: {
                resource: ['paidTraffic'],
                operation: ['getLeads'],
            },
        },
    },
    {
        displayName: 'Order',
        name: 'leadsOrder',
        type: 'options',
        options: [
            { name: 'Ascending', value: 'asc' },
            { name: 'Descending', value: 'desc' },
        ],
        default: 'desc',
        description: 'Sort order',
        displayOptions: {
            show: {
                resource: ['paidTraffic'],
                operation: ['getLeads'],
            },
        },
    },
    {
        displayName: 'Week Start',
        name: 'statsWeekStart',
        type: 'string',
        default: '',
        description: 'Week start date (YYYY-MM-DD)',
        displayOptions: {
            show: {
                resource: ['paidTraffic'],
                operation: ['getStats'],
            },
        },
    },
    {
        displayName: 'Facebook Graph Access Token',
        name: 'fbGraphAccessToken',
        type: 'string',
        typeOptions: { password: true },
        default: '',
        description: 'Meta Graph API access token',
        displayOptions: {
            show: {
                resource: ['paidTraffic'],
                operation: ['saveConfig'],
            },
        },
    },
    {
        displayName: 'Auto Enrich Enabled',
        name: 'autoEnrichEnabled',
        type: 'boolean',
        default: false,
        description: 'Whether auto-enrich is enabled',
        displayOptions: {
            show: {
                resource: ['paidTraffic'],
                operation: ['saveConfig'],
            },
        },
    },
    {
        displayName: 'Event Name',
        name: 'conversionEventName',
        type: 'string',
        required: true,
        default: '',
        description: 'Conversion event name',
        displayOptions: {
            show: {
                resource: ['paidTraffic'],
                operation: ['sendConversion'],
            },
        },
    },
    {
        displayName: 'Value',
        name: 'conversionValue',
        type: 'number',
        required: true,
        default: 0,
        description: 'Conversion value',
        displayOptions: {
            show: {
                resource: ['paidTraffic'],
                operation: ['sendConversion'],
            },
        },
    },
    {
        displayName: 'Currency',
        name: 'conversionCurrency',
        type: 'string',
        required: true,
        default: '',
        description: 'Currency code (e.g. USD)',
        displayOptions: {
            show: {
                resource: ['paidTraffic'],
                operation: ['sendConversion'],
            },
        },
    },
];
//# sourceMappingURL=PaidTrafficDescription.js.map