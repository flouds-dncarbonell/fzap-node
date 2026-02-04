import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	INodePropertyOptions,
	IHttpRequestOptions,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { fzapApiRequest, fzapAdminApiRequest, getFzapInstanceOptions } from './GenericFunctions';
import {
	sessionOperations,
	sessionFields,
	chatOperations,
	chatFields,
	userOperations,
	userFields,
	webhookOperations,
	webhookFields,
	adminOperations,
	adminFields,
	chatwootOperations,
	chatwootFields,
	groupOperations,
	groupFields,
	statusOperations,
	statusFields,
	folderOperations,
	folderFields,
	newsletterOperations,
	newsletterFields,
	paidTrafficOperations,
	paidTrafficFields,
	downloadOperations,
	downloadFields,
} from './descriptions';

export class FZAP implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'FZAP',
		name: 'fzap',
		icon: 'file:fzap.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with FZAP WhatsApp API',
		defaults: {
			name: 'FZAP',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'fZapApi',
				required: true,
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
				description: 'Choose how to select the instance for non-admin operations',
				displayOptions: {
					show: {
						resource: [
							'session',
							'chat',
							'user',
							'webhook',
							'chatwoot',
							'group',
							'status',
							'newsletter',
							'paidTraffic',
						],
					},
				},
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Admin',
						value: 'admin',
					},
					{
						name: 'Chat',
						value: 'chat',
					},
					{
						name: 'Chatwoot',
						value: 'chatwoot',
					},
					{
						name: 'Download',
						value: 'download',
					},
					{
						name: 'Folder',
						value: 'folder',
					},
					{
						name: 'Group',
						value: 'group',
					},
					{
						name: 'Newsletter',
						value: 'newsletter',
					},
					{
						name: 'Paid Traffic',
						value: 'paidTraffic',
					},
					{
						name: 'Session',
						value: 'session',
					},
					{
						name: 'Status',
						value: 'status',
					},
					{
						name: 'User',
						value: 'user',
					},
					{
						name: 'Webhook',
						value: 'webhook',
					},
				],
				default: 'session',
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
						resource: [
							'session',
							'chat',
							'user',
							'webhook',
							'chatwoot',
							'group',
							'status',
							'newsletter',
							'paidTraffic',
						],
					},
				},
			},
			// Admin
			...adminOperations,
			...adminFields,
			// Session
			...sessionOperations,
			...sessionFields,
			// Chat
			...chatOperations,
			...chatFields,
			// User
			...userOperations,
			...userFields,
			// Webhook
			...webhookOperations,
			...webhookFields,
			// Chatwoot
			...chatwootOperations,
			...chatwootFields,
			// Group
			...groupOperations,
			...groupFields,
			// Status
			...statusOperations,
			...statusFields,
			// Folder
			...folderOperations,
			...folderFields,
			// Newsletter
			...newsletterOperations,
			...newsletterFields,
			// Paid Traffic
			...paidTrafficOperations,
			...paidTrafficFields,
			// Download
			...downloadOperations,
			...downloadFields,
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

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const parseJsonField = (value: unknown, fieldName: string): IDataObject | IDataObject[] => {
			if (!value || (typeof value === 'string' && value.trim() === '')) {
				return {};
			}
			if (typeof value === 'object') {
				return value as IDataObject | IDataObject[];
			}
			try {
				return JSON.parse(value as string) as IDataObject | IDataObject[];
			} catch (error) {
				throw new NodeOperationError(this.getNode(), `Invalid JSON in ${fieldName}`);
			}
		};
		const splitCommaList = (value: string): string[] =>
			value
				.split(',')
				.map((entry) => entry.trim())
				.filter((entry) => entry.length > 0);

		const credentials = await this.getCredentials('fZapApi');
		const authType = credentials.authType as string;

		if (resource === 'admin' && authType !== 'adminToken') {
			throw new NodeOperationError(
				this.getNode(),
				'Admin resource requires credentials set to Admin Token',
			);
		}

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[];

				// ========================================
				//             ADMIN
				// ========================================
				if (resource === 'admin') {
					// Users
					if (operation === 'listUsers') {
						responseData = await fzapAdminApiRequest.call(this, 'GET', '/admin/users');
					}

					else if (operation === 'getUser') {
						const userId = this.getNodeParameter('userId', i) as string;
						responseData = await fzapAdminApiRequest.call(this, 'GET', `/admin/users/${userId}`);
					}

					else if (operation === 'createUser') {
						const userName = this.getNodeParameter('userName', i) as string;
						const userToken = this.getNodeParameter('userToken', i) as string;
						const additionalFields = this.getNodeParameter('createUserFields', i, {}) as IDataObject;

						const body: IDataObject = {
							name: userName,
							token: userToken,
						};

						if (additionalFields.webhook) body.webhook = additionalFields.webhook;
						if (additionalFields.events) body.events = additionalFields.events;

						// Proxy config
						if (additionalFields.proxyEnabled || additionalFields.proxyUrl) {
							body.proxyConfig = {
								enabled: additionalFields.proxyEnabled || false,
								proxyUrl: additionalFields.proxyUrl || '',
							};
						}

						// S3 config
						if (additionalFields.s3Enabled) {
							body.s3Config = {
								enabled: true,
								endpoint: additionalFields.s3Endpoint || '',
								region: additionalFields.s3Region || '',
								bucket: additionalFields.s3Bucket || '',
								accessKey: additionalFields.s3AccessKey || '',
								secretKey: additionalFields.s3SecretKey || '',
								pathStyle: additionalFields.s3PathStyle || false,
								publicUrl: additionalFields.s3PublicUrl || '',
								mediaDelivery: additionalFields.s3MediaDelivery || 'both',
								retentionDays: additionalFields.s3RetentionDays || 30,
							};
						}

						responseData = await fzapAdminApiRequest.call(this, 'POST', '/admin/users', body);
					}

					else if (operation === 'deleteUser') {
						const userId = this.getNodeParameter('userId', i) as string;
						responseData = await fzapAdminApiRequest.call(this, 'DELETE', `/admin/users/${userId}`);
					}

					else if (operation === 'deleteUserFull') {
						const userId = this.getNodeParameter('userId', i) as string;
						responseData = await fzapAdminApiRequest.call(this, 'DELETE', `/admin/users/${userId}/full`);
					}

					// Folders
					else if (operation === 'listFolders') {
						const parentId = this.getNodeParameter('parentId', i, '') as string;
						const query: IDataObject = {};
						if (parentId) {
							query.parentId = parentId;
						}
						responseData = await fzapAdminApiRequest.call(this, 'GET', '/admin/folders', {}, query);
					}

					else if (operation === 'createFolder') {
						const folderName = this.getNodeParameter('folderName', i) as string;
						const folderToken = this.getNodeParameter('folderToken', i) as string;
						const additionalFields = this.getNodeParameter('createFolderFields', i, {}) as IDataObject;

						const body: IDataObject = { name: folderName, token: folderToken };

						if (additionalFields.description) body.description = additionalFields.description;
						if (additionalFields.color) body.color = additionalFields.color;
						if (additionalFields.parentId) body.parentId = additionalFields.parentId;
						if (additionalFields.displayOrder !== undefined) body.displayOrder = additionalFields.displayOrder;

						responseData = await fzapAdminApiRequest.call(this, 'POST', '/admin/folders', body);
					}

					else if (operation === 'getFolder') {
						const folderId = this.getNodeParameter('folderId', i) as string;
						responseData = await fzapAdminApiRequest.call(this, 'GET', `/admin/folders/${folderId}`);
					}

					else if (operation === 'updateFolder') {
						const folderId = this.getNodeParameter('folderId', i) as string;
						const updateFields = this.getNodeParameter('updateFolderFields', i, {}) as IDataObject;

						const body: IDataObject = {};
						if (updateFields.name) body.name = updateFields.name;
						if (updateFields.token) body.token = updateFields.token;
						if (updateFields.description) body.description = updateFields.description;
						if (updateFields.color) body.color = updateFields.color;
						if (updateFields.parentId) body.parentId = updateFields.parentId;
						if (updateFields.displayOrder !== undefined) body.displayOrder = updateFields.displayOrder;

						responseData = await fzapAdminApiRequest.call(this, 'PUT', `/admin/folders/${folderId}`, body);
					}

					else if (operation === 'deleteFolder') {
						const folderId = this.getNodeParameter('folderId', i) as string;
						responseData = await fzapAdminApiRequest.call(this, 'DELETE', `/admin/folders/${folderId}`);
					}

					else if (operation === 'getFolderInstances') {
						const folderId = this.getNodeParameter('folderId', i) as string;
						responseData = await fzapAdminApiRequest.call(this, 'GET', `/admin/folders/${folderId}/instances`);
					}

					else if (operation === 'updateFolderOrder') {
						const folderOrdersJson = this.getNodeParameter('folderOrders', i) as string;
						const folderOrders = parseJsonField(folderOrdersJson, 'Folder Orders (JSON)');
						responseData = await fzapAdminApiRequest.call(this, 'PATCH', '/admin/folders/order', {
							folderOrders,
						});
					}

					else if (operation === 'moveInstanceToFolder') {
						const instanceId = this.getNodeParameter('instanceId', i) as string;
						const folderId = this.getNodeParameter('moveTargetFolderId', i, '') as string;
						const body: IDataObject = {};
						if (folderId) {
							body.folderId = folderId;
						}
						responseData = await fzapAdminApiRequest.call(
							this,
							'PATCH',
							`/admin/instances/${instanceId}/folder`,
							body,
						);
					}

					else {
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
					}
				}

				// ========================================
				//             SESSION
				// ========================================
				else if (resource === 'session') {
					if (operation === 'connect') {
						const options = this.getNodeParameter('options', i, {}) as IDataObject;
						const body: IDataObject = {};

						if (options.subscribe) {
							body.subscribe = options.subscribe;
						}
						if (options.immediate !== undefined) {
							body.immediate = options.immediate;
						}

						responseData = await fzapApiRequest.call(this, 'POST', '/session/connect', body, i);
					}

					else if (operation === 'disconnect') {
						responseData = await fzapApiRequest.call(this, 'POST', '/session/disconnect', i);
					}

					else if (operation === 'logout') {
						responseData = await fzapApiRequest.call(this, 'POST', '/session/logout', i);
					}

					else if (operation === 'getCallRejectionConfig') {
						responseData = await fzapApiRequest.call(
							this,
							'GET',
							'/session/call-rejection/config',
							i,
						);
					}

					else if (operation === 'setCallRejectionConfig') {
						const enabled = this.getNodeParameter('callRejectionEnabled', i) as boolean;
						const rejectionMessage = this.getNodeParameter('callRejectionMessage', i, '') as string;

						const body: IDataObject = { enabled };
						if (rejectionMessage) {
							body.rejectionMessage = rejectionMessage;
						}

						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/session/call-rejection/config',
							body,
							i,
						);
					}

					else if (operation === 'getStatus') {
						responseData = await fzapApiRequest.call(this, 'GET', '/session/status', i);
					}

					else if (operation === 'getQr') {
						responseData = await fzapApiRequest.call(this, 'GET', '/session/qr', i);
					}

					else if (operation === 'pairPhone') {
						const phone = this.getNodeParameter('phone', i) as string;
						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/session/pairphone',
							{ phone },
							i,
						);
					}

					else if (operation === 'establishSession') {
						const phone = this.getNodeParameter('phone', i) as string;
						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/session/establish-session',
							{ phone },
							i,
						);
					}

					else if (operation === 'forceSession') {
						const phone = this.getNodeParameter('phone', i) as string;
						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/session/force-session',
							{ phone },
							i,
						);
					}

					else if (operation === 'setProxyConfig') {
						const proxyUrl = this.getNodeParameter('proxyUrl', i) as string;
						const enabled = this.getNodeParameter('proxyEnabled', i) as boolean;
						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/session/proxy',
							{ proxyUrl, enabled },
							i,
						);
					}

					else if (operation === 'testProxyConfig') {
						const proxyUrl = this.getNodeParameter('proxyUrl', i) as string;
						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/session/proxy/test',
							{ proxyUrl },
							i,
						);
					}

					else if (operation === 'getS3Config') {
						responseData = await fzapApiRequest.call(this, 'GET', '/session/s3/config', i);
					}

					else if (operation === 'getS3Status') {
						responseData = await fzapApiRequest.call(this, 'GET', '/session/s3/status', i);
					}

					else if (operation === 'setS3Config') {
						const s3Config = this.getNodeParameter('s3Config', i) as IDataObject;
						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/session/s3/config',
							s3Config,
							i,
						);
					}

					else if (operation === 'testS3Config') {
						responseData = await fzapApiRequest.call(this, 'POST', '/session/s3/test', i);
					}

					else if (operation === 'deleteS3Config') {
						responseData = await fzapApiRequest.call(this, 'DELETE', '/session/s3/config', i);
					}

					else {
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
					}
				}

				// ========================================
				//             CHAT
				// ========================================
				else if (resource === 'chat') {
					if (operation === 'sendText') {
						const phone = this.getNodeParameter('phone', i) as string;
						const text = this.getNodeParameter('text', i) as string;
						const options = this.getNodeParameter('options', i, {}) as IDataObject;

						const requestBody: IDataObject = { phone, body: text };

						// Optional fields from API spec
						if (options.id) requestBody.id = options.id;
						if (options.typingTime) requestBody.delay = options.typingTime;
						if (options.linkPreview) requestBody.linkPreview = options.linkPreview;
						if (options.mentionAll) requestBody.mentionAll = options.mentionAll;
						if (options.check) requestBody.check = options.check;

						// Build contextInfo for replies and mentions
						const contextInfo: IDataObject = {};
						if (options.replyTo) contextInfo.stanzaId = options.replyTo;
						if (options.replyToParticipant) contextInfo.participant = options.replyToParticipant;
						if (options.mentionedJid) {
							const jids = (options.mentionedJid as string).split(',').map((jid) => jid.trim()).filter(Boolean);
							if (jids.length > 0) contextInfo.mentionedJid = jids;
						}
						if (Object.keys(contextInfo).length > 0) {
							requestBody.contextInfo = contextInfo;
						}

						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/chat/send/text',
							requestBody,
							i,
						);
					}

					else if (operation === 'sendImage') {
						const phone = this.getNodeParameter('phone', i) as string;
						const image = this.getNodeParameter('image', i) as string;
						const options = this.getNodeParameter('options', i, {}) as IDataObject;

						const requestBody: IDataObject = { phone, image };

						if (options.caption) requestBody.caption = options.caption;
						if (options.id) requestBody.id = options.id;
						if (options.typingTime) requestBody.delay = options.typingTime;
						if (options.check !== undefined) requestBody.check = options.check;
						if (options.viewOnce !== undefined) requestBody.viewOnce = options.viewOnce;
						if (options.fileName) requestBody.fileName = options.fileName;
						if (options.mimeType) requestBody.mimeType = options.mimeType;
						if (options.mentionAll !== undefined) requestBody.mentionAll = options.mentionAll;

						// Build contextInfo for replies and mentions
						const contextInfo: IDataObject = {};
						if (options.replyTo) contextInfo.stanzaId = options.replyTo;
						if (options.replyToParticipant) contextInfo.participant = options.replyToParticipant;
						if (options.mentionedJid) {
							const jids = (options.mentionedJid as string).split(',').map((jid) => jid.trim()).filter(Boolean);
							if (jids.length > 0) contextInfo.mentionedJid = jids;
						}
						if (Object.keys(contextInfo).length > 0) {
							requestBody.contextInfo = contextInfo;
						}

						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/chat/send/image',
							requestBody,
							i,
						);
					}

					else if (operation === 'sendAudio') {
						const phone = this.getNodeParameter('phone', i) as string;
						const audio = this.getNodeParameter('audio', i) as string;
						const options = this.getNodeParameter('options', i, {}) as IDataObject;

						const requestBody: IDataObject = { phone, audio };

						if (options.ptt !== undefined) requestBody.ptt = options.ptt;
						if (options.id) requestBody.id = options.id;
						if (options.typingTime) requestBody.delay = options.typingTime;
						if (options.check !== undefined) requestBody.check = options.check;
						if (options.viewOnce !== undefined) requestBody.viewOnce = options.viewOnce;
						if (options.fileName) requestBody.fileName = options.fileName;
						if (options.mimeType) requestBody.mimeType = options.mimeType;
						if (options.mentionAll !== undefined) requestBody.mentionAll = options.mentionAll;

						// Build contextInfo for replies and mentions
						const contextInfo: IDataObject = {};
						if (options.replyTo) contextInfo.stanzaId = options.replyTo;
						if (options.replyToParticipant) contextInfo.participant = options.replyToParticipant;
						if (options.mentionedJid) {
							const jids = (options.mentionedJid as string).split(',').map((jid) => jid.trim()).filter(Boolean);
							if (jids.length > 0) contextInfo.mentionedJid = jids;
						}
						if (Object.keys(contextInfo).length > 0) {
							requestBody.contextInfo = contextInfo;
						}

						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/chat/send/audio',
							requestBody,
							i,
						);
					}

					else if (operation === 'sendDocument') {
						const phone = this.getNodeParameter('phone', i) as string;
						const document = this.getNodeParameter('document', i) as string;
						const filename = this.getNodeParameter('filename', i) as string;
						const options = this.getNodeParameter('options', i, {}) as IDataObject;

						const requestBody: IDataObject = { phone, document, fileName: filename };

						if (options.caption) requestBody.caption = options.caption;
						if (options.id) requestBody.id = options.id;
						if (options.typingTime) requestBody.delay = options.typingTime;
						if (options.check !== undefined) requestBody.check = options.check;
						if (options.mimeType) requestBody.mimeType = options.mimeType;
						if (options.mentionAll !== undefined) requestBody.mentionAll = options.mentionAll;

						// Build contextInfo for replies and mentions
						const contextInfo: IDataObject = {};
						if (options.replyTo) contextInfo.stanzaId = options.replyTo;
						if (options.replyToParticipant) contextInfo.participant = options.replyToParticipant;
						if (options.mentionedJid) {
							const jids = (options.mentionedJid as string).split(',').map((jid) => jid.trim()).filter(Boolean);
							if (jids.length > 0) contextInfo.mentionedJid = jids;
						}
						if (Object.keys(contextInfo).length > 0) {
							requestBody.contextInfo = contextInfo;
						}

						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/chat/send/document',
							requestBody,
							i,
						);
					}

					else if (operation === 'sendVideo') {
						const phone = this.getNodeParameter('phone', i) as string;
						const video = this.getNodeParameter('video', i) as string;
						const options = this.getNodeParameter('videoOptions', i, {}) as IDataObject;

						const requestBody: IDataObject = { phone, video };

						if (options.caption) requestBody.caption = options.caption;
						if (options.fileName) requestBody.fileName = options.fileName;
						if (options.id) requestBody.id = options.id;
						if (options.mimeType) requestBody.mimeType = options.mimeType;
						if (options.viewOnce !== undefined) requestBody.viewOnce = options.viewOnce;
						if (options.jpegThumbnail) requestBody.jpegThumbnail = options.jpegThumbnail;
						if (options.check !== undefined) requestBody.check = options.check;
						if (options.mentionAll !== undefined) requestBody.mentionAll = options.mentionAll;

						// Build contextInfo for replies and mentions
						const videoContextInfo: IDataObject = {};
						if (options.replyTo) videoContextInfo.stanzaId = options.replyTo;
						if (options.replyToParticipant) videoContextInfo.participant = options.replyToParticipant;
						if (options.mentionedJid) {
							const jids = (options.mentionedJid as string).split(',').map((jid) => jid.trim()).filter(Boolean);
							if (jids.length > 0) videoContextInfo.mentionedJid = jids;
						}
						if (Object.keys(videoContextInfo).length > 0) {
							requestBody.contextInfo = videoContextInfo;
						}

						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/chat/send/video',
							requestBody,
							i,
						);
					}

					else if (operation === 'sendSticker') {
						const phone = this.getNodeParameter('phone', i) as string;
						const sticker = this.getNodeParameter('sticker', i) as string;
						const options = this.getNodeParameter('stickerOptions', i, {}) as IDataObject;

						const requestBody: IDataObject = { phone, sticker };

						if (options.id) requestBody.id = options.id;
						if (options.pngThumbnail) requestBody.pngThumbnail = options.pngThumbnail;
						if (options.check !== undefined) requestBody.check = options.check;
						if (options.mentionAll !== undefined) requestBody.mentionAll = options.mentionAll;

						// Build contextInfo for replies and mentions
						const stickerContextInfo: IDataObject = {};
						if (options.replyTo) stickerContextInfo.stanzaId = options.replyTo;
						if (options.replyToParticipant) stickerContextInfo.participant = options.replyToParticipant;
						if (options.mentionedJid) {
							const jids = (options.mentionedJid as string).split(',').map((jid) => jid.trim()).filter(Boolean);
							if (jids.length > 0) stickerContextInfo.mentionedJid = jids;
						}
						if (Object.keys(stickerContextInfo).length > 0) {
							requestBody.contextInfo = stickerContextInfo;
						}

						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/chat/send/sticker',
							requestBody,
							i,
						);
					}

					else if (operation === 'sendContact') {
						const phone = this.getNodeParameter('phone', i) as string;
						const name = this.getNodeParameter('contactName', i) as string;
						const vcard = this.getNodeParameter('vcard', i) as string;
						const options = this.getNodeParameter('contactOptions', i, {}) as IDataObject;

						const requestBody: IDataObject = { phone, name, vcard };

						if (options.id) requestBody.id = options.id;
						if (options.check !== undefined) requestBody.check = options.check;

						// Build contextInfo for replies and mentions
						const contactContextInfo: IDataObject = {};
						if (options.replyTo) contactContextInfo.stanzaId = options.replyTo;
						if (options.replyToParticipant) contactContextInfo.participant = options.replyToParticipant;
						if (options.mentionedJid) {
							const jids = (options.mentionedJid as string).split(',').map((jid) => jid.trim()).filter(Boolean);
							if (jids.length > 0) contactContextInfo.mentionedJid = jids;
						}
						if (Object.keys(contactContextInfo).length > 0) {
							requestBody.contextInfo = contactContextInfo;
						}

						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/chat/send/contact',
							requestBody,
							i,
						);
					}

					else if (operation === 'sendLocation') {
						const phone = this.getNodeParameter('phone', i) as string;
						const latitude = this.getNodeParameter('latitude', i) as number;
						const longitude = this.getNodeParameter('longitude', i) as number;
						const name = this.getNodeParameter('locationName', i, '') as string;
						const address = this.getNodeParameter('locationAddress', i, '') as string;
						const url = this.getNodeParameter('locationUrl', i, '') as string;
						const options = this.getNodeParameter('locationOptions', i, {}) as IDataObject;

						const requestBody: IDataObject = { phone, latitude, longitude };
						if (name) requestBody.name = name;
						if (address) requestBody.address = address;
						if (url) requestBody.url = url;
						if (options.id) requestBody.id = options.id;
						if (options.check !== undefined) requestBody.check = options.check;

						// Build contextInfo for replies and mentions
						const locationContextInfo: IDataObject = {};
						if (options.replyTo) locationContextInfo.stanzaId = options.replyTo;
						if (options.replyToParticipant) locationContextInfo.participant = options.replyToParticipant;
						if (options.mentionedJid) {
							const jids = (options.mentionedJid as string).split(',').map((jid) => jid.trim()).filter(Boolean);
							if (jids.length > 0) locationContextInfo.mentionedJid = jids;
						}
						if (Object.keys(locationContextInfo).length > 0) {
							requestBody.contextInfo = locationContextInfo;
						}

						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/chat/send/location',
							requestBody,
							i,
						);
					}

					else if (operation === 'sendPoll') {
						const group = this.getNodeParameter('groupJid', i) as string;
						const header = this.getNodeParameter('pollHeader', i) as string;
						const optionsInput = this.getNodeParameter('pollOptions', i) as string;
						const options = splitCommaList(optionsInput);
						const pollOptions = this.getNodeParameter('pollAdditionalOptions', i, {}) as IDataObject;

						const requestBody: IDataObject = {
							group,
							header,
							options,
						};

						if (pollOptions.id) requestBody.id = pollOptions.id;

						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/chat/send/poll',
							requestBody,
							i,
						);
					}

					else if (operation === 'sendButtons') {
						const phone = this.getNodeParameter('phone', i) as string;
						const buttonsList = this.getNodeParameter('buttonsList', i, {}) as IDataObject;
						const buttonsOptions = this.getNodeParameter('buttonsOptions', i, {}) as IDataObject;

						const requestBody: IDataObject = { phone };

						// Main fields
						const mode = this.getNodeParameter('buttonsMode', i, 'interactive') as string;
						const header = this.getNodeParameter('buttonsHeader', i, '') as string;
						const text = this.getNodeParameter('buttonsText', i, '') as string;
						const footer = this.getNodeParameter('buttonsFooter', i, '') as string;
						const mediaType = this.getNodeParameter('buttonsMediaType', i, 'none') as string;

						if (mode) requestBody.mode = mode;
						if (header) requestBody.header = header;
						if (text) requestBody.text = text;
						if (footer) requestBody.footer = footer;

						// Media (based on selector)
						if (mediaType === 'image') {
							const image = this.getNodeParameter('buttonsImage', i, '') as string;
							if (image) requestBody.image = image;
						} else if (mediaType === 'video') {
							const video = this.getNodeParameter('buttonsVideo', i, '') as string;
							if (video) requestBody.video = video;
						}

						// Optional fields from buttonsOptions
						if (buttonsOptions.title) requestBody.title = buttonsOptions.title;
						if (buttonsOptions.caption) requestBody.caption = buttonsOptions.caption;
						if (buttonsOptions.id) requestBody.id = buttonsOptions.id;
						if (buttonsOptions.mimeType) requestBody.mimeType = buttonsOptions.mimeType;
						if (buttonsOptions.fileName) requestBody.fileName = buttonsOptions.fileName;
						if (buttonsOptions.check !== undefined) requestBody.check = buttonsOptions.check;

						// Build contextInfo for replies and mentions
						const buttonsContextInfo: IDataObject = {};
						if (buttonsOptions.replyTo) buttonsContextInfo.stanzaId = buttonsOptions.replyTo;
						if (buttonsOptions.replyToParticipant) buttonsContextInfo.participant = buttonsOptions.replyToParticipant;
						if (buttonsOptions.mentionedJid) {
							const jids = (buttonsOptions.mentionedJid as string).split(',').map((jid) => jid.trim()).filter(Boolean);
							if (jids.length > 0) buttonsContextInfo.mentionedJid = jids;
						}
						if (Object.keys(buttonsContextInfo).length > 0) {
							requestBody.contextInfo = buttonsContextInfo;
						}

						// JSON takes precedence if provided
						if (buttonsOptions.buttonsJson) {
							requestBody.buttons = parseJsonField(buttonsOptions.buttonsJson as string, 'Buttons (JSON)');
						} else if (buttonsList.buttons && Array.isArray(buttonsList.buttons)) {
							// Process visual button editor
							const buttons = (buttonsList.buttons as IDataObject[]).map((btn) => {
								const button: IDataObject = {};
								if (btn.buttonText) button.buttonText = btn.buttonText;
								if (btn.buttonId) button.buttonId = btn.buttonId;
								if (btn.type && btn.type !== 'quickReply') button.type = btn.type;
								if (btn.url) button.url = btn.url;
								if (btn.phoneNumber) button.phoneNumber = btn.phoneNumber;
								if (btn.copyCode) button.copyCode = btn.copyCode;
								// Use buttonText as copyCodeText for copy type
								if (btn.type === 'copy' && btn.buttonText) button.copyCodeText = btn.buttonText;
								return button;
							});
							if (buttons.length > 0) {
								requestBody.buttons = buttons;
							}
						}

						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/chat/send/buttons',
							requestBody,
							i,
						);
					}

					else if (operation === 'sendList') {
						const phone = this.getNodeParameter('phone', i) as string;
						const buttonText = this.getNodeParameter('listButtonText', i) as string;
						const description = this.getNodeParameter('listDescription', i, '') as string;
						const title = this.getNodeParameter('listTitle', i, '') as string;
						const footer = this.getNodeParameter('listFooter', i, '') as string;
						const listSections = this.getNodeParameter('listSections', i, {}) as IDataObject;
						const listOptions = this.getNodeParameter('listOptions', i, {}) as IDataObject;

						const requestBody: IDataObject = { phone, buttonText };

						if (description) requestBody.text = description;
						if (title) requestBody.title = title;
						if (footer) requestBody.footer = footer;

						// Options
						if (listOptions.id) requestBody.id = listOptions.id;
						if (listOptions.check !== undefined) requestBody.check = listOptions.check;

						// Build contextInfo for replies and mentions
						const listContextInfo: IDataObject = {};
						if (listOptions.replyTo) listContextInfo.stanzaId = listOptions.replyTo;
						if (listOptions.replyToParticipant) listContextInfo.participant = listOptions.replyToParticipant;
						if (listOptions.mentionedJid) {
							const jids = (listOptions.mentionedJid as string).split(',').map((jid) => jid.trim()).filter(Boolean);
							if (jids.length > 0) listContextInfo.mentionedJid = jids;
						}
						if (Object.keys(listContextInfo).length > 0) {
							requestBody.contextInfo = listContextInfo;
						}

						// JSON takes precedence if provided
						if (listOptions.listSectionsJson) {
							requestBody.sections = parseJsonField(listOptions.listSectionsJson as string, 'Sections (JSON)');
						} else if (listSections.sections && Array.isArray(listSections.sections)) {
							// Process visual section editor
							const sections = (listSections.sections as IDataObject[]).map((section) => {
								const sec: IDataObject = {};
								if (section.title) sec.title = section.title;

								// Process rows within section
								const rowsData = section.rows as IDataObject;
								if (rowsData?.items && Array.isArray(rowsData.items)) {
									sec.rows = (rowsData.items as IDataObject[]).map((row) => {
										const r: IDataObject = {};
										if (row.title) r.title = row.title;
										if (row.desc) r.desc = row.desc;
										if (row.rowId) r.rowId = row.rowId;
										return r;
									});
								}
								return sec;
							});
							if (sections.length > 0) {
								requestBody.sections = sections;
							}
						}

						// Legacy flat list
						if (listOptions.listItemsJson) {
							requestBody.list = parseJsonField(listOptions.listItemsJson as string, 'List (JSON)');
						}

						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/chat/send/list',
							requestBody,
							i,
						);
					}

					else if (operation === 'sendTemplate') {
						const phone = this.getNodeParameter('phone', i) as string;
						const templateButtonsJson = this.getNodeParameter('templateButtonsJson', i) as string;
						const title = this.getNodeParameter('templateTitle', i, '') as string;
						const text = this.getNodeParameter('templateText', i, '') as string;
						const header = this.getNodeParameter('templateHeader', i, '') as string;
						const footer = this.getNodeParameter('templateFooter', i, '') as string;
						const templateOptions = this.getNodeParameter('templateOptions', i, {}) as IDataObject;

						const requestBody: IDataObject = {
							phone,
							templateButtons: parseJsonField(templateButtonsJson, 'Template Buttons (JSON)'),
						};

						if (title) requestBody.title = title;
						if (text) requestBody.text = text;
						if (header) requestBody.header = header;
						if (footer) requestBody.footer = footer;
						if (templateOptions.id) requestBody.id = templateOptions.id;

						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/chat/send/template',
							requestBody,
							i,
						);
					}

					else if (operation === 'downloadImage') {
						const downloadPayload: IDataObject = {
							url: this.getNodeParameter('downloadUrl', i) as string,
							mediaKey: this.getNodeParameter('downloadMediaKey', i) as string,
							mimeType: this.getNodeParameter('downloadMimeType', i) as string,
							fileSha256: this.getNodeParameter('downloadFileSha256', i) as string,
							fileLength: this.getNodeParameter('downloadFileLength', i) as number,
						};

						const directPath = this.getNodeParameter('downloadDirectPath', i, '') as string;
						const fileEncSha256 = this.getNodeParameter('downloadFileEncSha256', i, '') as string;
						const generateLink = this.getNodeParameter('downloadGenerateLink', i) as boolean;

						if (directPath) downloadPayload.directPath = directPath;
						if (fileEncSha256) downloadPayload.fileEncSha256 = fileEncSha256;
						if (generateLink !== undefined) downloadPayload.generateLink = generateLink;

						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/chat/downloadimage',
							downloadPayload,
							i,
						);
					}

					else if (operation === 'downloadAudio') {
						const downloadPayload: IDataObject = {
							url: this.getNodeParameter('downloadUrl', i) as string,
							mediaKey: this.getNodeParameter('downloadMediaKey', i) as string,
							mimeType: this.getNodeParameter('downloadMimeType', i) as string,
							fileSha256: this.getNodeParameter('downloadFileSha256', i) as string,
							fileLength: this.getNodeParameter('downloadFileLength', i) as number,
						};

						const directPath = this.getNodeParameter('downloadDirectPath', i, '') as string;
						const fileEncSha256 = this.getNodeParameter('downloadFileEncSha256', i, '') as string;
						const generateLink = this.getNodeParameter('downloadGenerateLink', i) as boolean;

						if (directPath) downloadPayload.directPath = directPath;
						if (fileEncSha256) downloadPayload.fileEncSha256 = fileEncSha256;
						if (generateLink !== undefined) downloadPayload.generateLink = generateLink;

						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/chat/downloadaudio',
							downloadPayload,
							i,
						);
					}

					else if (operation === 'downloadDocument') {
						const downloadPayload: IDataObject = {
							url: this.getNodeParameter('downloadUrl', i) as string,
							mediaKey: this.getNodeParameter('downloadMediaKey', i) as string,
							mimeType: this.getNodeParameter('downloadMimeType', i) as string,
							fileSha256: this.getNodeParameter('downloadFileSha256', i) as string,
							fileLength: this.getNodeParameter('downloadFileLength', i) as number,
						};

						const directPath = this.getNodeParameter('downloadDirectPath', i, '') as string;
						const fileEncSha256 = this.getNodeParameter('downloadFileEncSha256', i, '') as string;
						const generateLink = this.getNodeParameter('downloadGenerateLink', i) as boolean;

						if (directPath) downloadPayload.directPath = directPath;
						if (fileEncSha256) downloadPayload.fileEncSha256 = fileEncSha256;
						if (generateLink !== undefined) downloadPayload.generateLink = generateLink;

						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/chat/downloaddocument',
							downloadPayload,
							i,
						);
					}

					else if (operation === 'downloadVideo') {
						const downloadPayload: IDataObject = {
							url: this.getNodeParameter('downloadUrl', i) as string,
							mediaKey: this.getNodeParameter('downloadMediaKey', i) as string,
							mimeType: this.getNodeParameter('downloadMimeType', i) as string,
							fileSha256: this.getNodeParameter('downloadFileSha256', i) as string,
							fileLength: this.getNodeParameter('downloadFileLength', i) as number,
						};

						const directPath = this.getNodeParameter('downloadDirectPath', i, '') as string;
						const fileEncSha256 = this.getNodeParameter('downloadFileEncSha256', i, '') as string;
						const generateLink = this.getNodeParameter('downloadGenerateLink', i) as boolean;

						if (directPath) downloadPayload.directPath = directPath;
						if (fileEncSha256) downloadPayload.fileEncSha256 = fileEncSha256;
						if (generateLink !== undefined) downloadPayload.generateLink = generateLink;

						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/chat/downloadvideo',
							downloadPayload,
							i,
						);
					}

					else if (operation === 'edit') {
						const messageId = this.getNodeParameter('messageId', i) as string;
						const phone = this.getNodeParameter('chatJid', i) as string;
						const newText = this.getNodeParameter('newText', i) as string;

						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/chat/send/edit',
							{
								id: messageId,
								phone,
								body: newText,
							},
							i,
						);
					}

					else if (operation === 'delete') {
						const messageId = this.getNodeParameter('messageId', i) as string;
						const phone = this.getNodeParameter('chatJid', i) as string;

						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/chat/delete',
							{
								id: messageId,
								phone,
							},
							i,
						);
					}

					else if (operation === 'react') {
						const messageId = this.getNodeParameter('messageId', i) as string;
						const phone = this.getNodeParameter('chatJid', i) as string;
						const emoji = this.getNodeParameter('emoji', i) as string;

						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/chat/react',
							{
								id: messageId,
								phone,
								body: emoji,
							},
							i,
						);
					}

					else if (operation === 'markRead') {
						const phone = this.getNodeParameter('phone', i) as string;

						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/chat/mark-all-read',
							{
								phone,
							},
							i,
						);
					}

					else if (operation === 'markMessageRead') {
						const messageIdsInput = this.getNodeParameter('messageIds', i) as string;
						const chatJid = this.getNodeParameter('markReadChatJid', i) as string;
						const senderJid = this.getNodeParameter('markReadSenderJid', i, '') as string;
						const messageIds = splitCommaList(messageIdsInput);

						const body: IDataObject = {
							id: messageIds,
							chat: chatJid,
						};
						if (senderJid) body.sender = senderJid;

						responseData = await fzapApiRequest.call(this, 'POST', '/chat/markread', body, i);
					}

					else if (operation === 'archive') {
						const phone = this.getNodeParameter('phone', i) as string;
						const archiveAction = this.getNodeParameter('archiveAction', i) as string;
						const shouldArchive = archiveAction === 'archive';

						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/chat/archive',
							{
								phone,
								archive: shouldArchive,
							},
							i,
						);
					}

					else if (operation === 'mute') {
						const phone = this.getNodeParameter('phone', i) as string;
						const muteAction = this.getNodeParameter('muteAction', i) as string;
						const shouldMute = muteAction === 'mute';

						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/chat/mute',
							{
								phone,
								mute: shouldMute,
							},
							i,
						);
					}

					else if (operation === 'pin') {
						const phone = this.getNodeParameter('phone', i) as string;
						const pinAction = this.getNodeParameter('pinAction', i) as string;
						const shouldPin = pinAction === 'pin';

						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/chat/pin',
							{
								phone,
								pin: shouldPin,
							},
							i,
						);
					}

					else if (operation === 'presence') {
						const phone = this.getNodeParameter('phone', i) as string;
						const state = this.getNodeParameter('presenceState', i) as string;
						const media = this.getNodeParameter('presenceMedia', i, '') as string;

						const body: IDataObject = { phone, state };
						if (media) body.media = media;

						responseData = await fzapApiRequest.call(this, 'POST', '/chat/presence', body, i);
					}

					else {
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
					}
				}

				// ========================================
				//             USER
				// ========================================
				else if (resource === 'user') {
					if (operation === 'getInfo') {
						const phonesInput = this.getNodeParameter('phones', i) as string;
						const phones = phonesInput.split(',').map((p) => p.trim());

						responseData = await fzapApiRequest.call(this, 'POST', '/user/info', { phone: phones }, i);
					}

					else if (operation === 'checkWhatsApp') {
						const phonesInput = this.getNodeParameter('phones', i) as string;
						const phones = phonesInput.split(',').map((p) => p.trim());

						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/user/check',
							{ phone: phones },
							i,
						);
					}

					else if (operation === 'getLid') {
						const phone = this.getNodeParameter('lidPhone', i) as string;
						responseData = await fzapApiRequest.call(
							this,
							'GET',
							'/user/lid/get',
							{},
							{ phone },
							i,
						);
					}

					else if (operation === 'getLidPost') {
						const phone = this.getNodeParameter('lidPhone', i) as string;
						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/user/lid/get',
							{ phone },
							i,
						);
					}

					else if (operation === 'listLid') {
						responseData = await fzapApiRequest.call(this, 'GET', '/user/lid/list', i);
					}

					else if (operation === 'reverseLid') {
						const lid = this.getNodeParameter('lidValue', i) as string;
						responseData = await fzapApiRequest.call(
							this,
							'GET',
							'/user/lid/reverse',
							{},
							{ lid },
							i,
						);
					}

					else if (operation === 'reverseLidPost') {
						const lid = this.getNodeParameter('lidValue', i) as string;
						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/user/lid/reverse',
							{ lid },
							i,
						);
					}

					else if (operation === 'getAvatar') {
						const phone = this.getNodeParameter('phone', i) as string;
						const preview = this.getNodeParameter('preview', i) as boolean;

						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/user/avatar',
							{ phone, preview },
							i,
						);
					}

					else if (operation === 'getContacts') {
						responseData = await fzapApiRequest.call(this, 'GET', '/user/contacts', i);
					}

					else if (operation === 'setPresence') {
						const presence = this.getNodeParameter('presence', i) as string;

						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/user/presence',
							{ type: presence },
							i,
						);
					}

					else if (operation === 'getPrivacySettings') {
						responseData = await fzapApiRequest.call(this, 'GET', '/user/privacy/settings', i);
					}

					else if (operation === 'getProfileName') {
						responseData = await fzapApiRequest.call(this, 'GET', '/user/profile/name', i);
					}

					else if (operation === 'updatePrivacySettings') {
						const privacySettings = this.getNodeParameter('privacySettings', i) as IDataObject;

						responseData = await fzapApiRequest.call(
							this,
							'PUT',
							'/user/privacy/settings',
							privacySettings,
							i,
						);
					}

					else if (operation === 'setProfileName') {
						const profileName = this.getNodeParameter('profileName', i) as string;

						responseData = await fzapApiRequest.call(
							this,
							'PUT',
							'/user/profile/name',
							{ pushName: profileName },
							i,
						);
					}

					else if (operation === 'setProfileStatus') {
						const statusText = this.getNodeParameter('statusText', i) as string;

						responseData = await fzapApiRequest.call(
							this,
							'PUT',
							'/user/profile/status',
							{ status: statusText },
							i,
						);
					}

					else {
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
					}
				}

				// ========================================
				//             WEBHOOK
				// ========================================
				else if (resource === 'webhook') {
					if (operation === 'list') {
						responseData = await fzapApiRequest.call(this, 'GET', '/webhook', i);
					}

					else if (operation === 'create') {
						const url = this.getNodeParameter('url', i) as string;
						const events = this.getNodeParameter('events', i) as string[];

						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/webhook',
							{ url, events },
							i,
						);
					}

					else if (operation === 'update') {
						const webhookId = this.getNodeParameter('webhookId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};
						if (updateFields.url) body.url = updateFields.url;
						if (updateFields.events) body.events = updateFields.events;

						responseData = await fzapApiRequest.call(
							this,
							'PUT',
							`/webhook/${webhookId}`,
							body,
							i,
						);
					}

					else if (operation === 'delete') {
						const webhookId = this.getNodeParameter('webhookId', i) as string;

						responseData = await fzapApiRequest.call(this, 'DELETE', `/webhook/${webhookId}`, i);
					}

					else {
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
					}
				}

				// ========================================
				//             CHATWOOT
				// ========================================
				else if (resource === 'chatwoot') {
					if (operation === 'configure') {
						const url = this.getNodeParameter('url', i) as string;
						const accountId = this.getNodeParameter('accountId', i) as string;
						const configOptions = this.getNodeParameter('configOptions', i, {}) as IDataObject;

						const body: IDataObject = {
							url,
							accountId,
						};

						if (configOptions.enabled !== undefined) body.enabled = configOptions.enabled;
						if (configOptions.chatwootToken) body.token = configOptions.chatwootToken;
						if (configOptions.nameInbox) body.nameInbox = configOptions.nameInbox;
						if (configOptions.chatwootInboxId !== undefined) {
							body.chatwootInboxId = configOptions.chatwootInboxId;
						}
						if (configOptions.signMsg !== undefined) body.signMsg = configOptions.signMsg;
						if (configOptions.signDelimiter) body.signDelimiter = configOptions.signDelimiter;
						if (configOptions.reopenConversation !== undefined) {
							body.reopenConversation = configOptions.reopenConversation;
						}
						if (configOptions.conversationPending !== undefined) {
							body.conversationPending = configOptions.conversationPending;
						}
						if (configOptions.mergeBrazilContacts !== undefined) {
							body.mergeBrazilContacts = configOptions.mergeBrazilContacts;
						}
						if (configOptions.ignoreJids) body.ignoreJids = configOptions.ignoreJids;
						if (configOptions.ignoreGroups !== undefined) body.ignoreGroups = configOptions.ignoreGroups;
						if (configOptions.enableTypingIndicator !== undefined) {
							body.enableTypingIndicator = configOptions.enableTypingIndicator;
						}
						if (configOptions.transcriptionEnabled !== undefined) {
							body.transcriptionEnabled = configOptions.transcriptionEnabled;
						}
						if (configOptions.transcriptionProvider) {
							body.transcriptionProvider = configOptions.transcriptionProvider;
						}
						if (configOptions.openaiApiKey) body.openaiApiKey = configOptions.openaiApiKey;
						if (configOptions.openaiModel) body.openaiModel = configOptions.openaiModel;
						if (configOptions.openaiApiBaseUrl) {
							body.openaiApiBaseUrl = configOptions.openaiApiBaseUrl;
						}
						if (configOptions.groqApiKey) body.groqApiKey = configOptions.groqApiKey;
						if (configOptions.groqModel) body.groqModel = configOptions.groqModel;
						if (configOptions.groqApiBaseUrl) {
							body.groqApiBaseUrl = configOptions.groqApiBaseUrl;
						}
						if (configOptions.proxyUrl) body.proxyUrl = configOptions.proxyUrl;
						if (configOptions.chatwootDbEnabled !== undefined) {
							body.chatwootDbEnabled = configOptions.chatwootDbEnabled;
						}
						if (configOptions.chatwootDbHost) body.chatwootDbHost = configOptions.chatwootDbHost;
						if (configOptions.chatwootDbPort !== undefined) {
							body.chatwootDbPort = configOptions.chatwootDbPort;
						}
						if (configOptions.chatwootDbName) body.chatwootDbName = configOptions.chatwootDbName;
						if (configOptions.chatwootDbUser) body.chatwootDbUser = configOptions.chatwootDbUser;
						if (configOptions.chatwootDbPass) body.chatwootDbPass = configOptions.chatwootDbPass;
						if (configOptions.messageDeliveryTimeoutSeconds !== undefined) {
							body.messageDeliveryTimeoutSeconds = configOptions.messageDeliveryTimeoutSeconds;
						}

						responseData = await fzapApiRequest.call(this, 'POST', '/chatwoot/config', body, i);
					}

					else if (operation === 'getConfig') {
						responseData = await fzapApiRequest.call(this, 'GET', '/chatwoot/config', i);
					}

					else if (operation === 'deleteConfig') {
						responseData = await fzapApiRequest.call(this, 'DELETE', '/chatwoot/config', i);
					}

					else if (operation === 'status') {
						responseData = await fzapApiRequest.call(this, 'GET', '/chatwoot/status', i);
					}

					else if (operation === 'test') {
						responseData = await fzapApiRequest.call(this, 'POST', '/chatwoot/test', i);
					}

					else if (operation === 'createInbox') {
						responseData = await fzapApiRequest.call(this, 'POST', '/chatwoot/create-inbox', i);
					}

					else if (operation === 'updateInbox') {
						responseData = await fzapApiRequest.call(this, 'PATCH', '/chatwoot/update-inbox', i);
					}

					else if (operation === 'cleanup') {
						responseData = await fzapApiRequest.call(this, 'POST', '/chatwoot/cleanup', i);
					}

					else {
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
					}
				}

				// ========================================
				//             GROUP
				// ========================================
				else if (resource === 'group') {
					if (operation === 'list') {
						responseData = await fzapApiRequest.call(this, 'GET', '/group/list', i);
					}

					else if (operation === 'getInfo') {
						const groupJid = this.getNodeParameter('groupJid', i) as string;
						responseData = await fzapApiRequest.call(
							this,
							'GET',
							'/group/info',
							{},
							{ groupJid },
							i,
						);
					}

					else if (operation === 'getInviteLink') {
						const groupJid = this.getNodeParameter('groupJid', i) as string;
						const reset = this.getNodeParameter('resetInvite', i) as boolean;
						const query: IDataObject = { groupJid };
						if (reset) query.reset = true;
						responseData = await fzapApiRequest.call(
							this,
							'GET',
							'/group/invitelink',
							{},
							query,
							i,
						);
					}

					else if (operation === 'create') {
						const name = this.getNodeParameter('groupName', i) as string;
						const participantsInput = this.getNodeParameter('participants', i) as string;
						const participants = splitCommaList(participantsInput);

						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/group/create',
							{ name, participants },
							i,
						);
					}

					else if (operation === 'announce') {
						const groupJid = this.getNodeParameter('groupJid', i) as string;
						const announce = this.getNodeParameter('announceEnabled', i) as boolean;
						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/group/announce',
							{ groupJid, announce },
							i,
						);
					}

					else if (operation === 'ephemeral') {
						const groupJid = this.getNodeParameter('groupJid', i) as string;
						const duration = this.getNodeParameter('ephemeralDuration', i) as string;
						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/group/ephemeral',
							{ groupJid, duration },
							i,
						);
					}

					else if (operation === 'inviteInfo') {
						const code = this.getNodeParameter('inviteCode', i) as string;
						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/group/inviteinfo',
							{ code },
							i,
						);
					}

					else if (operation === 'join') {
						const code = this.getNodeParameter('inviteCode', i) as string;
						responseData = await fzapApiRequest.call(this, 'POST', '/group/join', { code }, i);
					}

					else if (operation === 'leave') {
						const groupJid = this.getNodeParameter('groupJid', i) as string;
						responseData = await fzapApiRequest.call(this, 'POST', '/group/leave', { groupJid }, i);
					}

					else if (operation === 'locked') {
						const groupJid = this.getNodeParameter('groupJid', i) as string;
						const locked = this.getNodeParameter('lockedEnabled', i) as boolean;
						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/group/locked',
							{ groupJid, locked },
							i,
						);
					}

					else if (operation === 'setName') {
						const groupJid = this.getNodeParameter('groupJid', i) as string;
						const name = this.getNodeParameter('newGroupName', i) as string;
						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/group/name',
							{ groupJid, name },
							i,
						);
					}

					else if (operation === 'setPhoto') {
						const groupJid = this.getNodeParameter('groupJid', i) as string;
						const image = this.getNodeParameter('groupPhoto', i) as string;
						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/group/photo',
							{ groupJid, image },
							i,
						);
					}

					else if (operation === 'removePhoto') {
						const groupJid = this.getNodeParameter('groupJid', i) as string;
						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/group/photo/remove',
							{ groupJid },
							i,
						);
					}

					else if (operation === 'setTopic') {
						const groupJid = this.getNodeParameter('groupJid', i) as string;
						const topic = this.getNodeParameter('groupTopic', i) as string;
						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/group/topic',
							{ groupJid, topic },
							i,
						);
					}

					else if (operation === 'updateParticipants') {
						const groupJid = this.getNodeParameter('groupJid', i) as string;
						const action = this.getNodeParameter('participantAction', i) as string;
						const participantsInput = this.getNodeParameter('participantPhones', i) as string;
						const phone = splitCommaList(participantsInput);
						responseData = await fzapApiRequest.call(
							this,
							'POST',
							'/group/updateparticipants',
							{ groupJid, action, phone },
							i,
						);
					}

					else {
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
					}
				}

				// ========================================
				//             STATUS
				// ========================================
				else if (resource === 'status') {
					if (operation === 'sendText') {
						const text = this.getNodeParameter('statusText', i) as string;
						const backgroundColor = this.getNodeParameter('statusBackgroundColor', i, '') as string;
						const textColor = this.getNodeParameter('statusTextColor', i, '') as string;
						const font = this.getNodeParameter('statusFont', i) as number;
						const id = this.getNodeParameter('statusId', i, '') as string;

						const body: IDataObject = { text };
						if (backgroundColor) body.backgroundColor = backgroundColor;
						if (textColor) body.textColor = textColor;
						if (!Number.isNaN(font)) body.font = font;
						if (id) body.id = id;

						responseData = await fzapApiRequest.call(this, 'POST', '/status/send-text', body, i);
					}

					else if (operation === 'sendImage') {
						const image = this.getNodeParameter('statusImage', i) as string;
						const caption = this.getNodeParameter('statusImageCaption', i, '') as string;
						const mimeType = this.getNodeParameter('statusImageMimeType', i, '') as string;
						const id = this.getNodeParameter('statusImageId', i, '') as string;

						const body: IDataObject = { image };
						if (caption) body.caption = caption;
						if (mimeType) body.mimeType = mimeType;
						if (id) body.id = id;

						responseData = await fzapApiRequest.call(this, 'POST', '/status/send-image', body, i);
					}

					else if (operation === 'sendVideo') {
						const video = this.getNodeParameter('statusVideo', i) as string;
						const caption = this.getNodeParameter('statusVideoCaption', i, '') as string;
						const mimeType = this.getNodeParameter('statusVideoMimeType', i, '') as string;
						const id = this.getNodeParameter('statusVideoId', i, '') as string;

						const body: IDataObject = { video };
						if (caption) body.caption = caption;
						if (mimeType) body.mimeType = mimeType;
						if (id) body.id = id;

						responseData = await fzapApiRequest.call(this, 'POST', '/status/send-video', body, i);
					}

					else if (operation === 'delete') {
						const id = this.getNodeParameter('deleteStatusId', i) as string;
						responseData = await fzapApiRequest.call(this, 'POST', '/status/delete', { id }, i);
					}

					else {
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
					}
				}

				// ========================================
				//             FOLDER
				// ========================================
				else if (resource === 'folder') {
					if (operation === 'listInstances') {
						responseData = await fzapApiRequest.call(this, 'GET', '/folder/instances', i);
					}

					else if (operation === 'createInstance') {
						const dataJson = this.getNodeParameter('folderInstanceData', i) as string;
						const body = parseJsonField(dataJson, 'Instance Data (JSON)') as IDataObject;
						responseData = await fzapApiRequest.call(this, 'POST', '/folder/instances', body, i);
					}

					else if (operation === 'deleteInstance') {
						const instanceId = this.getNodeParameter('folderInstanceId', i) as string;
						responseData = await fzapApiRequest.call(
							this,
							'DELETE',
							`/folder/instances/${instanceId}`,
							i,
						);
					}

					else if (operation === 'deleteInstanceFull') {
						const instanceId = this.getNodeParameter('folderInstanceId', i) as string;
						responseData = await fzapApiRequest.call(
							this,
							'DELETE',
							`/folder/instances/${instanceId}/full`,
							i,
						);
					}

					else {
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
					}
				}

				// ========================================
				//             NEWSLETTER
				// ========================================
				else if (resource === 'newsletter') {
					if (operation === 'list') {
						responseData = await fzapApiRequest.call(this, 'GET', '/newsletter/list', i);
					}

					else {
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
					}
				}

				// ========================================
				//             PAID TRAFFIC
				// ========================================
				else if (resource === 'paidTraffic') {
					if (operation === 'getConfig') {
						responseData = await fzapApiRequest.call(this, 'GET', '/paid-traffic/config', i);
					}

					else if (operation === 'saveConfig') {
						const fbGraphAccessToken = this.getNodeParameter('fbGraphAccessToken', i, '') as string;
						const autoEnrichEnabled = this.getNodeParameter('autoEnrichEnabled', i) as boolean;
						const body: IDataObject = {
							fbGraphAccessToken,
							autoEnrichEnabled,
						};
						responseData = await fzapApiRequest.call(this, 'POST', '/paid-traffic/config', body, i);
					}

					else if (operation === 'getConversionEvents') {
						responseData = await fzapApiRequest.call(
							this,
							'GET',
							'/paid-traffic/conversion-events',
							i,
						);
					}

					else if (operation === 'getLeads') {
						const query: IDataObject = {};
						const search = this.getNodeParameter('leadsSearch', i, '') as string;
						const dateFrom = this.getNodeParameter('leadsDateFrom', i, '') as string;
						const dateTo = this.getNodeParameter('leadsDateTo', i, '') as string;
						const campaign = this.getNodeParameter('leadsCampaign', i, '') as string;
						const adset = this.getNodeParameter('leadsAdset', i, '') as string;
						const creative = this.getNodeParameter('leadsCreative', i, '') as string;
						const limit = this.getNodeParameter('leadsLimit', i) as number;
						const offset = this.getNodeParameter('leadsOffset', i) as number;
						const sort = this.getNodeParameter('leadsSort', i, '') as string;
						const order = this.getNodeParameter('leadsOrder', i, '') as string;

						if (search) query.search = search;
						if (dateFrom) query.dateFrom = dateFrom;
						if (dateTo) query.dateTo = dateTo;
						if (campaign) query.campaign = campaign;
						if (adset) query.adset = adset;
						if (creative) query.creative = creative;
						if (limit) query.limit = limit;
						if (offset) query.offset = offset;
						if (sort) query.sort = sort;
						if (order) query.order = order;

						responseData = await fzapApiRequest.call(
							this,
							'GET',
							'/paid-traffic/leads',
							{},
							query,
							i,
						);
					}

					else if (operation === 'exportLeads') {
						const search = this.getNodeParameter('leadsSearch', i, '') as string;
						const query: IDataObject = {};
						if (search) query.search = search;
						responseData = await fzapApiRequest.call(
							this,
							'GET',
							'/paid-traffic/leads/export',
							{},
							query,
							i,
						);
					}

					else if (operation === 'getStats') {
						const weekStart = this.getNodeParameter('statsWeekStart', i, '') as string;
						const query: IDataObject = {};
						if (weekStart) query.weekStart = weekStart;
						responseData = await fzapApiRequest.call(
							this,
							'GET',
							'/paid-traffic/stats',
							{},
							query,
							i,
						);
					}

					else if (operation === 'enrichLead') {
						const leadId = this.getNodeParameter('leadId', i) as string;
						responseData = await fzapApiRequest.call(
							this,
							'POST',
							`/paid-traffic/leads/${leadId}/enrich`,
							i,
						);
					}

					else if (operation === 'sendConversion') {
						const leadId = this.getNodeParameter('leadId', i) as string;
						const eventName = this.getNodeParameter('conversionEventName', i) as string;
						const value = this.getNodeParameter('conversionValue', i) as number;
						const currency = this.getNodeParameter('conversionCurrency', i) as string;

						responseData = await fzapApiRequest.call(
							this,
							'POST',
							`/paid-traffic/leads/${leadId}/send-conversion`,
							{
								eventName,
								value,
								currency,
							},
							i,
						);
					}

					else {
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
					}
				}

				// ========================================
				//             DOWNLOAD
				// ========================================
				else if (resource === 'download') {
					if (operation === 'getFile') {
						const downloadToken = this.getNodeParameter('downloadToken', i) as string;
						const binaryProperty = this.getNodeParameter(
							'downloadBinaryProperty',
							i,
							'data',
						) as string;
						const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `${baseUrl}/download/${downloadToken}`,
							encoding: 'arraybuffer',
							returnFullResponse: true,
							ignoreHttpStatusErrors: true,
						};

						const response = await this.helpers.httpRequest(options);

						if (response.statusCode >= 400) {
							throw new NodeOperationError(
								this.getNode(),
								response.body?.error || response.body?.message || `HTTP ${response.statusCode}`,
							);
						}

						const binaryData = await this.helpers.prepareBinaryData(response.body as unknown as any);
						returnData.push({
							json: {
								statusCode: response.statusCode,
								headers: response.headers,
							},
							binary: {
								[binaryProperty]: binaryData,
							},
							pairedItem: { item: i },
						});
						continue;
					}

					else {
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
					}
				}

				else {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
