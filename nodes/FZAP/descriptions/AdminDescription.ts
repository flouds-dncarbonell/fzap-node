import type { INodeProperties } from 'n8n-workflow';

export const adminOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['admin'],
			},
		},
		options: [
			{
				name: 'Create Folder',
				value: 'createFolder',
				description: 'Create a new folder for organizing instances',
				action: 'Create a folder',
			},
			{
				name: 'Create User',
				value: 'createUser',
				description: 'Create a new user',
				action: 'Create a user',
			},
			{
				name: 'Delete Folder',
				value: 'deleteFolder',
				description: 'Delete a folder (instances move to root)',
				action: 'Delete a folder',
			},
			{
				name: 'Delete User',
				value: 'deleteUser',
				description: 'Delete a user from the database',
				action: 'Delete a user',
			},
			{
				name: 'Delete User (Full)',
				value: 'deleteUserFull',
				description: 'Delete user completely: logout, disconnect, cleanup memory and S3',
				action: 'Delete user fully',
			},
			{
				name: 'Get Folder',
				value: 'getFolder',
				description: 'Get folder details',
				action: 'Get folder details',
			},
			{
				name: 'Get Folder Instances',
				value: 'getFolderInstances',
				description: 'Get all instances in a folder',
				action: 'Get folder instances',
			},
			{
				name: 'Get User',
				value: 'getUser',
				description: 'Get a user by ID',
				action: 'Get a user',
			},
			{
				name: 'List Folders',
				value: 'listFolders',
				description: 'List all folders',
				action: 'List all folders',
			},
			{
				name: 'List Users',
				value: 'listUsers',
				description: 'List all users with connection status',
				action: 'List all users',
			},
			{
				name: 'Update Folder',
				value: 'updateFolder',
				description: 'Update folder name, description, or color',
				action: 'Update a folder',
			},
			{
				name: 'Update Folder Order',
				value: 'updateFolderOrder',
				description: 'Update the display order for folders',
				action: 'Update folder order',
			},
			{
				name: 'Move Instance to Folder',
				value: 'moveInstanceToFolder',
				description: 'Move an instance into a folder',
				action: 'Move instance to folder',
			},
		],
		default: 'listUsers',
	},
];

export const adminFields: INodeProperties[] = [
	// ----------------------------------------
	//         User ID (for delete operations)
	// ----------------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the user to delete',
		displayOptions: {
			show: {
				resource: ['admin'],
				operation: ['deleteUser', 'deleteUserFull', 'getUser'],
			},
		},
	},

	// ----------------------------------------
	//         Create User
	// ----------------------------------------
	{
		displayName: 'Name',
		name: 'userName',
		type: 'string',
		required: true,
		default: '',
		description: 'Name for the new user',
		displayOptions: {
			show: {
				resource: ['admin'],
				operation: ['createUser'],
			},
		},
	},
	{
		displayName: 'Token',
		name: 'userToken',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		default: '',
		description: 'API token for the new user',
		displayOptions: {
			show: {
				resource: ['admin'],
				operation: ['createUser'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'createUserFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['admin'],
				operation: ['createUser'],
			},
		},
		options: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'string',
				default: 'All',
				description: 'Events to subscribe to (comma-separated or "All")',
			},
			{
				displayName: 'Proxy Enabled',
				name: 'proxyEnabled',
				type: 'boolean',
				default: false,
				description: 'Whether to enable proxy for this user',
			},
			{
				displayName: 'Proxy URL',
				name: 'proxyUrl',
				type: 'string',
				default: '',
				placeholder: 'socks5://user:pass@proxy.local:1080',
				description: 'Proxy URL (if proxy is enabled)',
			},
			{
				displayName: 'S3 Access Key',
				name: 's3AccessKey',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'S3 access key for authentication',
			},
			{
				displayName: 'S3 Bucket',
				name: 's3Bucket',
				type: 'string',
				default: '',
				description: 'S3 bucket name',
			},
			{
				displayName: 'S3 Enabled',
				name: 's3Enabled',
				type: 'boolean',
				default: false,
				description: 'Whether to enable S3 storage for this user',
			},
			{
				displayName: 'S3 Endpoint',
				name: 's3Endpoint',
				type: 'string',
				default: '',
				placeholder: 'https://s3.amazonaws.com',
				description: 'S3 endpoint URL',
			},
			{
				displayName: 'S3 Media Delivery',
				name: 's3MediaDelivery',
				type: 'options',
				options: [
					{ name: 'Both (S3 + Inline)', value: 'both' },
					{ name: 'Inline Only', value: 'inline' },
					{ name: 'S3 Only', value: 's3' },
				],
				default: 'both',
				description: 'How to deliver media files',
			},
			{
				displayName: 'S3 Path Style',
				name: 's3PathStyle',
				type: 'boolean',
				default: false,
				description: 'Whether to use path-style S3 URLs',
			},
			{
				displayName: 'S3 Public URL',
				name: 's3PublicUrl',
				type: 'string',
				default: '',
				placeholder: 'https://cdn.example.com',
				description: 'Public URL for S3 files',
			},
			{
				displayName: 'S3 Region',
				name: 's3Region',
				type: 'string',
				default: '',
				placeholder: 'us-east-1',
				description: 'S3 region for the bucket',
			},
			{
				displayName: 'S3 Retention Days',
				name: 's3RetentionDays',
				type: 'number',
				default: 30,
				description: 'Days to retain files in S3',
			},
			{
				displayName: 'S3 Secret Key',
				name: 's3SecretKey',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'S3 secret key for authentication',
			},
			{
				displayName: 'Webhook URL',
				name: 'webhook',
				type: 'string',
				default: '',
				placeholder: 'https://your-server.com/webhook',
				description: 'Webhook URL for receiving events',
			},
		],
	},

	// ----------------------------------------
	//         Folder ID (for folder operations)
	// ----------------------------------------
	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the folder',
		displayOptions: {
			show: {
				resource: ['admin'],
				operation: ['getFolder', 'updateFolder', 'deleteFolder', 'getFolderInstances'],
			},
		},
	},

	// ----------------------------------------
	//         Create Folder
	// ----------------------------------------
	{
		displayName: 'Folder Name',
		name: 'folderName',
		type: 'string',
		required: true,
		default: '',
		description: 'Name for the folder',
		displayOptions: {
			show: {
				resource: ['admin'],
				operation: ['createFolder'],
			},
		},
	},
	{
		displayName: 'Folder Token',
		name: 'folderToken',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		default: '',
		description: 'Token used for folder-level API access',
		displayOptions: {
			show: {
				resource: ['admin'],
				operation: ['createFolder'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'createFolderFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['admin'],
				operation: ['createFolder'],
			},
		},
		options: [
			{
				displayName: 'Color',
				name: 'color',
				type: 'color',
				default: '#4CAF50',
				description: 'Folder color in hex format',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Folder description',
			},
			{
				displayName: 'Display Order',
				name: 'displayOrder',
				type: 'number',
				default: 0,
				description: 'Display order for sorting',
			},
			{
				displayName: 'Parent Folder ID',
				name: 'parentId',
				type: 'string',
				default: '',
				description: 'Parent folder ID (for nested folders)',
			},
		],
	},

	// ----------------------------------------
	//         Update Folder
	// ----------------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFolderFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['admin'],
				operation: ['updateFolder'],
			},
		},
		options: [
			{
				displayName: 'Color',
				name: 'color',
				type: 'color',
				default: '#4CAF50',
				description: 'New folder color',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'New folder description',
			},
			{
				displayName: 'Display Order',
				name: 'displayOrder',
				type: 'number',
				default: 0,
				description: 'New display order',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New folder name',
			},
			{
				displayName: 'Token',
				name: 'token',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'New folder access token',
			},
			{
				displayName: 'Parent Folder ID',
				name: 'parentId',
				type: 'string',
				default: '',
				description: 'New parent folder ID',
			},
		],
	},
	{
		displayName: 'Parent Folder ID',
		name: 'parentId',
		type: 'string',
		default: '',
		description: 'Filter folders by parent ID',
		displayOptions: {
			show: {
				resource: ['admin'],
				operation: ['listFolders'],
			},
		},
	},
	{
		displayName: 'Folder Orders (JSON)',
		name: 'folderOrders',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		default: '',
		description: 'JSON mapping of folder IDs to display order, e.g. {"f1":0,"f2":1}',
		displayOptions: {
			show: {
				resource: ['admin'],
				operation: ['updateFolderOrder'],
			},
		},
	},
	{
		displayName: 'Instance ID',
		name: 'instanceId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the instance to move',
		displayOptions: {
			show: {
				resource: ['admin'],
				operation: ['moveInstanceToFolder'],
			},
		},
	},
	{
		displayName: 'Target Folder ID',
		name: 'moveTargetFolderId',
		type: 'string',
		default: '',
		description: 'Target folder ID (leave empty for root)',
		displayOptions: {
			show: {
				resource: ['admin'],
				operation: ['moveInstanceToFolder'],
			},
		},
	},
];
