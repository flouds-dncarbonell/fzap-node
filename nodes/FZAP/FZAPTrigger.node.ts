import type {
	IHookFunctions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	IHttpRequestOptions,
	INodePropertyOptions,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes } from 'n8n-workflow';

import { getFzapInstanceOptions } from './GenericFunctions';

async function assertConnectedInstanceToken(
	this: IHookFunctions | IWebhookFunctions,
	baseUrl: string,
	adminToken: string,
	instanceToken: string,
): Promise<void> {
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
	const selected = data.find((user) => String(user.token ?? '') === instanceToken);

	if (!selected) {
		throw new NodeApiError(this.getNode(), {
			message: 'Selected instance token was not found',
			description: 'Verify the Instance selection or refresh the list of instances',
		});
	}

	if (!selected.connected) {
		throw new NodeApiError(this.getNode(), {
			message: 'Selected instance is not connected',
			description: 'Only connected instances can be used',
		});
	}
}

async function getTriggerAuth(this: IHookFunctions | IWebhookFunctions): Promise<{
	baseUrl: string;
	token: string;
}> {
	const credentials = await this.getCredentials('fZapApi');
	const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');
	const authType = credentials.authType as string;
	const accessMode = this.getNodeParameter('accessMode', 0) as string;

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

		const instanceToken = this.getNodeParameter('instanceToken', 0) as string;
		if (!instanceToken) {
			throw new NodeApiError(this.getNode(), {
				message: 'Instance token is required when using Admin authentication',
				description: 'Set the Instance Token field to select which instance to use',
			});
		}

		await assertConnectedInstanceToken.call(this, baseUrl, adminToken, instanceToken);

		return { baseUrl, token: instanceToken };
	}

	const token = credentials.token as string;
	if (!token) {
		throw new NodeApiError(this.getNode(), {
			message: 'Instance token is required when using Instance authentication',
			description: 'Please configure the Token in your FZAP credentials',
		});
	}

	return { baseUrl, token };
}

export class FZAPTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'FZAP Trigger',
		name: 'fzapTrigger',
		icon: 'file:fzap.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Receive WhatsApp events from FZAP',
		defaults: {
			name: 'FZAP Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'fZapApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Access Mode',
				name: 'accessMode',
				type: 'options',
				options: [
					{
						name: 'Instance (Use Credential Token)',
						value: 'instance',
					},
					{
						name: 'Admin (Select Instance)',
						value: 'admin',
					},
				],
				default: 'instance',
				description: 'Choose how to select the instance for the trigger',
			},
			{
				displayName: 'Instance Name or ID',
				name: 'instanceToken',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getInstances',
				},
				allowArbitraryValues: true,
				required: true,
				default: '',
				description: 'Instance token to use when authenticating with Admin Token (offline instances are marked). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				displayOptions: {
					show: {
						accessMode: ['admin'],
					},
				},
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: ['Message'],
				description: 'WhatsApp events to listen for',
				options: [
					{ name: 'All', value: 'All' },
					// Messages
					{ name: 'Message', value: 'Message' },
					{ name: 'Automation Message', value: 'AutomationMessage' },
					{ name: 'Undecryptable Message', value: 'UndecryptableMessage' },
					{ name: 'Receipt', value: 'Receipt' },
					{ name: 'Media Retry', value: 'MediaRetry' },
					{ name: 'Read Receipt', value: 'ReadReceipt' },
					// Groups & Contacts
					{ name: 'Group Info', value: 'GroupInfo' },
					{ name: 'Joined Group', value: 'JoinedGroup' },
					{ name: 'Picture', value: 'Picture' },
					{ name: 'Blocklist Change', value: 'BlocklistChange' },
					{ name: 'Blocklist', value: 'Blocklist' },
					// Connection
					{ name: 'Connected', value: 'Connected' },
					{ name: 'Disconnected', value: 'Disconnected' },
					{ name: 'Connect Failure', value: 'ConnectFailure' },
					{ name: 'Keep Alive Restored', value: 'KeepAliveRestored' },
					{ name: 'Keep Alive Timeout', value: 'KeepAliveTimeout' },
					{ name: 'Logged Out', value: 'LoggedOut' },
					// Presence
					{ name: 'Presence', value: 'Presence' },
					{ name: 'Chat Presence', value: 'ChatPresence' },
					// Calls
					{ name: 'Call Offer', value: 'CallOffer' },
					{ name: 'Call Accept', value: 'CallAccept' },
					{ name: 'Call Terminate', value: 'CallTerminate' },
					{ name: 'Call Offer Notice', value: 'CallOfferNotice' },
					{ name: 'Call Relay Latency', value: 'CallRelayLatency' },
					// Sync
					{ name: 'App State', value: 'AppState' },
					{ name: 'App State Sync Complete', value: 'AppStateSyncComplete' },
					{ name: 'History Sync', value: 'HistorySync' },
					{ name: 'Offline Sync Completed', value: 'OfflineSyncCompleted' },
					{ name: 'Offline Sync Preview', value: 'OfflineSyncPreview' },
					// Privacy
					{ name: 'Privacy Settings', value: 'PrivacySettings' },
					{ name: 'Push Name Setting', value: 'PushNameSetting' },
					{ name: 'User About', value: 'UserAbout' },
					// Newsletter
					{ name: 'Newsletter Join', value: 'NewsletterJoin' },
					{ name: 'Newsletter Leave', value: 'NewsletterLeave' },
					{ name: 'Newsletter Mute Change', value: 'NewsletterMuteChange' },
					{ name: 'Newsletter Live Update', value: 'NewsletterLiveUpdate' },
					// Other
					{ name: 'Identity Change', value: 'IdentityChange' },
					{ name: 'CAT Refresh Error', value: 'CATRefreshError' },
					{ name: 'FB Message', value: 'FBMessage' },
					{ name: 'QR', value: 'QR' },
					{ name: 'Pair Success', value: 'PairSuccess' },
					{ name: 'Pair Error', value: 'PairError' },
				],
			},
		],
		usableAsTool: true,
	};

	methods = {
		loadOptions: {
			async getInstances(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				return getFzapInstanceOptions.call(this);
			},
		},
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default');

				if (webhookData.webhookId === undefined) {
					return false;
				}

				try {
					const { baseUrl, token } = await getTriggerAuth.call(this);

					const options: IHttpRequestOptions = {
						method: 'GET',
						url: `${baseUrl}/webhook`,
						headers: {
							'Content-Type': 'application/json',
							token,
						},
					};

					const response = (await this.helpers.httpRequest(options)) as IDataObject;
					const webhooks = (response.data as IDataObject[]) || [];

					for (const webhook of webhooks) {
						if (webhook.id === webhookData.webhookId && webhook.url === webhookUrl) {
							return true;
						}
					}
				} catch {
					// Webhook doesn't exist
				}

				delete webhookData.webhookId;
				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const events = this.getNodeParameter('events') as string[];
				const webhookData = this.getWorkflowStaticData('node');

				if (!webhookUrl) {
					throw new NodeApiError(this.getNode(), {
						message: 'Webhook URL is undefined',
						description: 'Could not get the webhook URL. Please try again.',
					});
				}

				if (webhookUrl.includes('localhost')) {
					throw new NodeApiError(this.getNode(), {
						message: 'Webhook URL cannot be localhost',
						description:
							'The FZAP API needs a publicly accessible URL. Use a tunnel service like ngrok for testing.',
					});
				}

				const { baseUrl, token } = await getTriggerAuth.call(this);

				const body = {
					url: webhookUrl,
					events,
				};

				const options: IHttpRequestOptions = {
					method: 'POST',
					url: `${baseUrl}/webhook`,
					headers: {
						'Content-Type': 'application/json',
						token,
					},
					body: JSON.stringify(body),
				};

				const response = (await this.helpers.httpRequest(options)) as IDataObject;

				if (!response.success) {
					throw new NodeApiError(this.getNode(), {
						message: 'Failed to create webhook',
						description: JSON.stringify(response),
					});
				}

				const data = response.data as IDataObject;
				webhookData.webhookId = data.id;

				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId === undefined) {
					return true;
				}

				try {
					const { baseUrl, token } = await getTriggerAuth.call(this);

					const options: IHttpRequestOptions = {
						method: 'DELETE',
						url: `${baseUrl}/webhook/${webhookData.webhookId}`,
						headers: {
							'Content-Type': 'application/json',
							token,
						},
					};

					await this.helpers.httpRequest(options);
				} catch {
					// Webhook might already be deleted
				}

				delete webhookData.webhookId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();

		return {
			workflowData: [this.helpers.returnJsonArray(bodyData)],
		};
	}
}
