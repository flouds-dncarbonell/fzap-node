import type { INodeProperties } from 'n8n-workflow';

export const newsletterOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['newsletter'],
			},
		},
		options: [
			{
				name: 'List',
				value: 'list',
				description: 'List subscribed newsletters',
				action: 'List newsletters',
			},
		],
		default: 'list',
	},
];

export const newsletterFields: INodeProperties[] = [];
