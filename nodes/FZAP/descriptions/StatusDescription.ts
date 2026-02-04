import type { INodeProperties } from 'n8n-workflow';

export const statusOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['status'],
			},
		},
		options: [
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a status/story',
				action: 'Delete a status',
			},
			{
				name: 'Send Image',
				value: 'sendImage',
				description: 'Send image status/story',
				action: 'Send image status',
			},
			{
				name: 'Send Text',
				value: 'sendText',
				description: 'Send text status/story',
				action: 'Send text status',
			},
			{
				name: 'Send Video',
				value: 'sendVideo',
				description: 'Send video status/story',
				action: 'Send video status',
			},
		],
		default: 'sendText',
	},
];

export const statusFields: INodeProperties[] = [
	// ----------------------------------------
	//         Send Text
	// ----------------------------------------
	{
		displayName: 'Text',
		name: 'statusText',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		required: true,
		default: '',
		description: 'Text content of the status',
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['sendText'],
			},
		},
	},
	{
		displayName: 'Background Color',
		name: 'statusBackgroundColor',
		type: 'color',
		default: '',
		description: 'Background color in hex format',
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['sendText'],
			},
		},
	},
	{
		displayName: 'Text Color',
		name: 'statusTextColor',
		type: 'color',
		default: '',
		description: 'Text color in hex format',
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['sendText'],
			},
		},
	},
	{
		displayName: 'Font',
		name: 'statusFont',
		type: 'number',
		default: 0,
		description: 'Font type (0-5)',
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['sendText'],
			},
		},
	},
	{
		displayName: 'Status ID',
		name: 'statusId',
		type: 'string',
		default: '',
		description: 'Optional custom message ID',
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['sendText'],
			},
		},
	},

	// ----------------------------------------
	//         Send Image
	// ----------------------------------------
	{
		displayName: 'Image',
		name: 'statusImage',
		type: 'string',
		required: true,
		default: '',
		description: 'Image content (base64/data URL or URL)',
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['sendImage'],
			},
		},
	},
	{
		displayName: 'Caption',
		name: 'statusImageCaption',
		type: 'string',
		default: '',
		description: 'Image caption',
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['sendImage'],
			},
		},
	},
	{
		displayName: 'Mime Type',
		name: 'statusImageMimeType',
		type: 'string',
		default: '',
		description: 'MIME type (optional)',
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['sendImage'],
			},
		},
	},
	{
		displayName: 'Status ID',
		name: 'statusImageId',
		type: 'string',
		default: '',
		description: 'Optional custom message ID',
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['sendImage'],
			},
		},
	},

	// ----------------------------------------
	//         Send Video
	// ----------------------------------------
	{
		displayName: 'Video',
		name: 'statusVideo',
		type: 'string',
		required: true,
		default: '',
		description: 'Video content (base64/data URL or URL)',
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['sendVideo'],
			},
		},
	},
	{
		displayName: 'Caption',
		name: 'statusVideoCaption',
		type: 'string',
		default: '',
		description: 'Video caption',
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['sendVideo'],
			},
		},
	},
	{
		displayName: 'Mime Type',
		name: 'statusVideoMimeType',
		type: 'string',
		default: '',
		description: 'MIME type (optional)',
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['sendVideo'],
			},
		},
	},
	{
		displayName: 'Status ID',
		name: 'statusVideoId',
		type: 'string',
		default: '',
		description: 'Optional custom message ID',
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['sendVideo'],
			},
		},
	},

	// ----------------------------------------
	//         Delete Status
	// ----------------------------------------
	{
		displayName: 'Status ID',
		name: 'deleteStatusId',
		type: 'string',
		required: true,
		default: '',
		description: 'Message ID of the status to delete',
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['delete'],
			},
		},
	},
];
