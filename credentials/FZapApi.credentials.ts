import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class FZapApi implements ICredentialType {
	name = 'fZapApi';
	displayName = 'FZAP API';
	documentationUrl = 'https://flouds.com.br/openapi/fzap-openapi.en.yaml';
	icon = 'file:fzap.svg' as const;

	properties: INodeProperties[] = [
		{
			displayName: 'Authentication',
			name: 'authType',
			type: 'options',
			options: [
				{
					name: 'Instance Token',
					value: 'instanceToken',
				},
				{
					name: 'Admin Token',
					value: 'adminToken',
				},
			],
			default: 'instanceToken',
			description: 'Select how to authenticate with FZAP',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: '',
			placeholder: 'https://your-fzap-instance.com',
			required: true,
			description: 'The base URL of your FZAP instance',
		},
		{
			displayName: 'Token',
			name: 'token',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your FZAP user token (for instance access)',
			displayOptions: {
				show: {
					authType: ['instanceToken'],
				},
			},
		},
		{
			displayName: 'Admin Token',
			name: 'adminToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Admin token for administrative operations',
			displayOptions: {
				show: {
					authType: ['adminToken'],
				},
			},
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				token:
					'={{$credentials.authType === "instanceToken" ? $credentials.token : undefined}}',
				Authorization:
					'={{$credentials.authType === "adminToken" ? $credentials.adminToken : undefined}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '={{$credentials.authType === "adminToken" ? "/admin/users" : "/session/status"}}',
			method: 'GET',
			headers: {
				token:
					'={{$credentials.authType === "instanceToken" ? $credentials.token : undefined}}',
				Authorization:
					'={{$credentials.authType === "adminToken" ? $credentials.adminToken : undefined}}',
			},
		},
	};
}
