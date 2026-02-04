import type {
	IExecuteFunctions,
	IHttpRequestMethods,
	IDataObject,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

type FZapInstance = {
	name: string;
	token: string;
	connected: boolean;
};

async function fetchAdminInstances(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	baseUrl: string,
	adminToken: string,
): Promise<FZapInstance[]> {
	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `${baseUrl}/admin/users`,
		headers: {
			'Content-Type': 'application/json',
			Authorization: adminToken,
		},
	};

	const response = (await this.helpers.httpRequest(options)) as IDataObject;
	const data = (response.data as IDataObject[]) || [];

	return data.map((user) => ({
		name: String(user.name ?? user.id ?? user.token ?? 'Unknown'),
		token: String(user.token ?? ''),
		connected: Boolean(user.connected),
	}));
}

export async function getFzapInstanceOptions(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const credentials = await this.getCredentials('fZapApi');
	const authType = credentials.authType as string;

	if (authType !== 'adminToken') {
		return [];
	}

	const adminToken = credentials.adminToken as string;
	if (!adminToken) {
		return [];
	}

	const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');
	const instances = await fetchAdminInstances.call(this, baseUrl, adminToken);
	const sorted = instances.slice().sort((a, b) => {
		if (a.connected !== b.connected) {
			return a.connected ? -1 : 1;
		}
		return a.name.localeCompare(b.name);
	});

	return sorted.map((instance) => ({
		name: instance.connected ? instance.name : `${instance.name} (offline)`,
		value: instance.token,
	}));
}

export async function fzapApiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject | number = {},
	query: IDataObject | number = {},
	itemIndex = 0,
): Promise<IDataObject | IDataObject[]> {
	let requestBody: IDataObject = {};
	let requestQuery: IDataObject = {};
	let resolvedItemIndex = itemIndex;

	if (typeof body === 'number') {
		resolvedItemIndex = body;
	} else {
		requestBody = body;
	}

	if (typeof query === 'number') {
		resolvedItemIndex = query;
	} else {
		requestQuery = query;
	}

	const credentials = await this.getCredentials('fZapApi');
	const authType = credentials.authType as string;
	const accessMode = this.getNodeParameter('accessMode', resolvedItemIndex) as string;

	// Remove trailing slash from baseUrl if present
	const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

	let token = credentials.token as string;

	if (accessMode === 'admin' && authType !== 'adminToken') {
		throw new NodeApiError(this.getNode(), {
			message: 'Access Mode is Admin but the credentials use Instance Token',
			description: 'Switch the credential to Admin Token or set Access Mode to Instance',
		});
	}

	if (accessMode === 'instance' && authType === 'adminToken') {
		throw new NodeApiError(this.getNode(), {
			message: 'Access Mode is Instance but the credentials use Admin Token',
			description: 'Switch the credential to Instance Token or set Access Mode to Admin',
		});
	}

	if (authType === 'adminToken') {
		const adminToken = credentials.adminToken as string;
		if (!adminToken) {
			throw new NodeApiError(this.getNode(), {
				message: 'Admin token is required when using Admin authentication',
				description: 'Please configure the Admin Token in your FZAP credentials',
			});
		}

		const instanceToken = this.getNodeParameter('instanceToken', resolvedItemIndex) as string;
		if (!instanceToken) {
			throw new NodeApiError(this.getNode(), {
				message: 'Instance token is required when using Admin authentication',
				description: 'Set the Instance Token field to select which instance to use',
			});
		}

		const cachedInstances =
			(this as unknown as { __fzapInstances?: FZapInstance[] }).__fzapInstances ||
			(await fetchAdminInstances.call(this, baseUrl, adminToken));

		(this as unknown as { __fzapInstances?: FZapInstance[] }).__fzapInstances = cachedInstances;

		const selected = cachedInstances.find((instance) => instance.token === instanceToken);
		if (!selected) {
			throw new NodeApiError(this.getNode(), {
				message: 'Selected instance token was not found',
				description: 'Verify the Instance Token or refresh the list of instances',
			});
		}

		if (!selected.connected) {
			throw new NodeApiError(this.getNode(), {
				message: 'Selected instance is not connected',
				description: 'Only connected instances can be used',
			});
		}

		token = instanceToken;
	} else {
		if (!token) {
			throw new NodeApiError(this.getNode(), {
				message: 'Instance token is required when using Instance authentication',
				description: 'Please configure the Token in your FZAP credentials',
			});
		}
	}

	const options: IHttpRequestOptions = {
		method,
		url: `${baseUrl}${endpoint}`,
		headers: {
			'Content-Type': 'application/json',
			token,
		},
		returnFullResponse: true,
		ignoreHttpStatusErrors: true,
	};

	if (Object.keys(requestBody).length > 0) {
		options.body = JSON.stringify(requestBody);
	}

	if (Object.keys(requestQuery).length > 0) {
		options.qs = requestQuery;
	}

	const response = await this.helpers.httpRequest(options);

	if (response.statusCode >= 400) {
		throw new NodeApiError(this.getNode(), {
			message: response.body?.error || response.body?.message || `HTTP ${response.statusCode}`,
			description: JSON.stringify(response.body),
			httpCode: String(response.statusCode),
		});
	}

	return response.body as IDataObject | IDataObject[];
}

export async function fzapAdminApiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
): Promise<IDataObject | IDataObject[]> {
	const credentials = await this.getCredentials('fZapApi');
	const authType = credentials.authType as string;

	if (authType !== 'adminToken') {
		throw new NodeApiError(this.getNode(), {
			message: 'Admin authentication is required for this operation',
			description: 'Select Admin Token in your FZAP credentials',
		});
	}

	// Remove trailing slash from baseUrl if present
	const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

	// Admin token is required for admin operations
	const adminToken = credentials.adminToken as string;
	if (!adminToken) {
		throw new NodeApiError(this.getNode(), {
			message: 'Admin token is required for admin operations',
			description: 'Please configure the Admin Token in your FZAP credentials',
		});
	}

	const options: IHttpRequestOptions = {
		method,
		url: `${baseUrl}${endpoint}`,
		headers: {
			'Content-Type': 'application/json',
			Authorization: adminToken,
		},
		returnFullResponse: true,
		ignoreHttpStatusErrors: true,
	};

	if (Object.keys(body).length > 0) {
		options.body = JSON.stringify(body);
	}

	if (Object.keys(query).length > 0) {
		options.qs = query;
	}

	const response = await this.helpers.httpRequest(options);

	if (response.statusCode >= 400) {
		throw new NodeApiError(this.getNode(), {
			message: response.body?.error || response.body?.message || `HTTP ${response.statusCode}`,
			description: JSON.stringify(response.body),
			httpCode: String(response.statusCode),
		});
	}

	return response.body as IDataObject | IDataObject[];
}
