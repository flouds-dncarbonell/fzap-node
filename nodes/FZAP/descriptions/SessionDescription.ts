import type { INodeProperties } from 'n8n-workflow';

export const sessionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['session'],
			},
		},
		options: [
			{
				name: 'Connect',
				value: 'connect',
				description: 'Connect to WhatsApp',
				action: 'Connect to whats app',
			},
			{
				name: 'Configure Call Rejection',
				value: 'setCallRejectionConfig',
				description: 'Configure automatic call rejection',
				action: 'Configure call rejection',
			},
			{
				name: 'Disconnect',
				value: 'disconnect',
				description: 'Disconnect from WhatsApp (preserves session)',
				action: 'Disconnect from whats app',
			},
			{
				name: 'Establish Session',
				value: 'establishSession',
				description: 'Establish a session with a contact',
				action: 'Establish session',
			},
			{
				name: 'Force Session',
				value: 'forceSession',
				description: 'Force a session via message',
				action: 'Force session',
			},
			{
				name: 'Get Call Rejection Config',
				value: 'getCallRejectionConfig',
				description: 'Get call rejection configuration',
				action: 'Get call rejection config',
			},
			{
				name: 'Get QR Code',
				value: 'getQr',
				description: 'Get QR code for authentication',
				action: 'Get QR code',
			},
			{
				name: 'Get S3 Config',
				value: 'getS3Config',
				description: 'Get S3 configuration',
				action: 'Get S3 config',
			},
			{
				name: 'Get S3 Status',
				value: 'getS3Status',
				description: 'Get S3 configuration status',
				action: 'Get S3 status',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				description: 'Get connection and login status',
				action: 'Get connection status',
			},
			{
				name: 'Logout',
				value: 'logout',
				description: 'Full logout from WhatsApp',
				action: 'Logout from whats app',
			},
			{
				name: 'Pair Phone',
				value: 'pairPhone',
				description: 'Get pairing code for phone number',
				action: 'Get phone pairing code',
			},
			{
				name: 'Set Proxy Config',
				value: 'setProxyConfig',
				description: 'Set proxy configuration',
				action: 'Set proxy configuration',
			},
			{
				name: 'Test Proxy Config',
				value: 'testProxyConfig',
				description: 'Test proxy configuration',
				action: 'Test proxy configuration',
			},
			{
				name: 'Set S3 Config',
				value: 'setS3Config',
				description: 'Configure S3 storage',
				action: 'Set S3 config',
			},
			{
				name: 'Test S3 Config',
				value: 'testS3Config',
				description: 'Test S3 connection',
				action: 'Test S3 config',
			},
			{
				name: 'Delete S3 Config',
				value: 'deleteS3Config',
				description: 'Delete S3 configuration',
				action: 'Delete S3 config',
			},
		],
		default: 'getStatus',
	},
];

export const sessionFields: INodeProperties[] = [
	// Pair Phone fields
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
				resource: ['session'],
				operation: ['pairPhone', 'establishSession', 'forceSession'],
			},
		},
	},
	{
		displayName: 'Call Rejection Enabled',
		name: 'callRejectionEnabled',
		type: 'boolean',
		required: true,
		default: false,
		description: 'Whether to enable automatic call rejection',
		displayOptions: {
			show: {
				resource: ['session'],
				operation: ['setCallRejectionConfig'],
			},
		},
	},
	{
		displayName: 'Rejection Message',
		name: 'callRejectionMessage',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		default: '',
		description: 'Optional message to send when rejecting calls',
		displayOptions: {
			show: {
				resource: ['session'],
				operation: ['setCallRejectionConfig'],
			},
		},
	},
	{
		displayName: 'Proxy URL',
		name: 'proxyUrl',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'socks5://user:pass@proxy.local:1080',
		description: 'Proxy URL to use or test',
		displayOptions: {
			show: {
				resource: ['session'],
				operation: ['setProxyConfig', 'testProxyConfig'],
			},
		},
	},
	{
		displayName: 'Proxy Enabled',
		name: 'proxyEnabled',
		type: 'boolean',
		required: true,
		default: false,
		description: 'Whether to enable proxy usage',
		displayOptions: {
			show: {
				resource: ['session'],
				operation: ['setProxyConfig'],
			},
		},
	},
	{
		displayName: 'S3 Config',
		name: 's3Config',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['session'],
				operation: ['setS3Config'],
			},
		},
		options: [
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description: 'Whether to enable S3 storage',
			},
			{
				displayName: 'Endpoint',
				name: 'endpoint',
				type: 'string',
				default: '',
				placeholder: 'https://s3.amazonaws.com',
				description: 'S3 endpoint URL',
			},
			{
				displayName: 'Region',
				name: 'region',
				type: 'string',
				default: '',
				placeholder: 'us-east-1',
				description: 'S3 region',
			},
			{
				displayName: 'Bucket',
				name: 'bucket',
				type: 'string',
				default: '',
				description: 'S3 bucket name',
			},
			{
				displayName: 'Access Key',
				name: 'accessKey',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'S3 access key',
			},
			{
				displayName: 'Secret Key',
				name: 'secretKey',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'S3 secret key',
			},
			{
				displayName: 'Path Style',
				name: 'pathStyle',
				type: 'boolean',
				default: false,
				description: 'Whether to use path-style URLs',
			},
			{
				displayName: 'Public URL',
				name: 'publicUrl',
				type: 'string',
				default: '',
				description: 'Public URL for media',
			},
			{
				displayName: 'Media Delivery',
				name: 'mediaDelivery',
				type: 'options',
				options: [
					{ name: 'Both', value: 'both' },
					{ name: 'Inline Only', value: 'inline' },
					{ name: 'S3 Only', value: 's3' },
				],
				default: 'both',
				description: 'How to deliver media files',
			},
			{
				displayName: 'Retention Days',
				name: 'retentionDays',
				type: 'number',
				default: 30,
				description: 'Days to retain files',
			},
		],
	},

	// Connect options
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['session'],
				operation: ['connect'],
			},
		},
		options: [
			{
				displayName: 'Subscribe Events',
				name: 'subscribe',
				type: 'multiOptions',
				options: [
					{ name: 'All', value: 'All' },
					{ name: 'Calls', value: 'Call' },
					{ name: 'Chats', value: 'Chat' },
					{ name: 'Connection', value: 'Connection' },
					{ name: 'Group', value: 'Group' },
					{ name: 'History Sync', value: 'HistorySync' },
					{ name: 'Message', value: 'Message' },
					{ name: 'Newsletter', value: 'Newsletter' },
					{ name: 'Presence', value: 'Presence' },
					{ name: 'Privacy', value: 'Privacy' },
					{ name: 'Receipt', value: 'Receipt' },
				],
				default: [],
				description: 'Events to subscribe to via webhook',
			},
			{
				displayName: 'Immediate',
				name: 'immediate',
				type: 'boolean',
				default: false,
				description: 'Whether to connect immediately without waiting for QR scan',
			},
		],
	},
];
