import type { INodeProperties } from 'n8n-workflow';

export const downloadOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['download'],
			},
		},
		options: [
			{
				name: 'Get File',
				value: 'getFile',
				description: 'Download a file by token',
				action: 'Download a file',
			},
		],
		default: 'getFile',
	},
];

export const downloadFields: INodeProperties[] = [
	{
		displayName: 'Download Token',
		name: 'downloadToken',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['download'],
				operation: ['getFile'],
			},
		},
	},
	{
		displayName: 'Binary Property',
		name: 'downloadBinaryProperty',
		type: 'string',
		default: 'data',
		description: 'Binary property name to store the downloaded file',
		displayOptions: {
			show: {
				resource: ['download'],
				operation: ['getFile'],
			},
		},
	},
];
