"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FZAP = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const descriptions_1 = require("./descriptions");
class FZAP {
    constructor() {
        this.description = {
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
                ...descriptions_1.adminOperations,
                ...descriptions_1.adminFields,
                ...descriptions_1.sessionOperations,
                ...descriptions_1.sessionFields,
                ...descriptions_1.chatOperations,
                ...descriptions_1.chatFields,
                ...descriptions_1.userOperations,
                ...descriptions_1.userFields,
                ...descriptions_1.webhookOperations,
                ...descriptions_1.webhookFields,
                ...descriptions_1.chatwootOperations,
                ...descriptions_1.chatwootFields,
                ...descriptions_1.groupOperations,
                ...descriptions_1.groupFields,
                ...descriptions_1.statusOperations,
                ...descriptions_1.statusFields,
                ...descriptions_1.folderOperations,
                ...descriptions_1.folderFields,
                ...descriptions_1.newsletterOperations,
                ...descriptions_1.newsletterFields,
                ...descriptions_1.paidTrafficOperations,
                ...descriptions_1.paidTrafficFields,
                ...descriptions_1.downloadOperations,
                ...descriptions_1.downloadFields,
            ],
            usableAsTool: true,
        };
        this.methods = {
            loadOptions: {
                async getInstances() {
                    return GenericFunctions_1.getFzapInstanceOptions.call(this);
                },
            },
        };
    }
    async execute() {
        var _a, _b;
        const items = this.getInputData();
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        const parseJsonField = (value, fieldName) => {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                return {};
            }
            if (typeof value === 'object') {
                return value;
            }
            try {
                return JSON.parse(value);
            }
            catch (error) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Invalid JSON in ${fieldName}`);
            }
        };
        const splitCommaList = (value) => value
            .split(',')
            .map((entry) => entry.trim())
            .filter((entry) => entry.length > 0);
        const credentials = await this.getCredentials('fZapApi');
        const authType = credentials.authType;
        if (resource === 'admin' && authType !== 'adminToken') {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Admin resource requires credentials set to Admin Token');
        }
        for (let i = 0; i < items.length; i++) {
            try {
                let responseData;
                if (resource === 'admin') {
                    if (operation === 'listUsers') {
                        responseData = await GenericFunctions_1.fzapAdminApiRequest.call(this, 'GET', '/admin/users');
                    }
                    else if (operation === 'getUser') {
                        const userId = this.getNodeParameter('userId', i);
                        responseData = await GenericFunctions_1.fzapAdminApiRequest.call(this, 'GET', `/admin/users/${userId}`);
                    }
                    else if (operation === 'createUser') {
                        const userName = this.getNodeParameter('userName', i);
                        const userToken = this.getNodeParameter('userToken', i);
                        const additionalFields = this.getNodeParameter('createUserFields', i, {});
                        const body = {
                            name: userName,
                            token: userToken,
                        };
                        if (additionalFields.webhook)
                            body.webhook = additionalFields.webhook;
                        if (additionalFields.events)
                            body.events = additionalFields.events;
                        if (additionalFields.proxyEnabled || additionalFields.proxyUrl) {
                            body.proxyConfig = {
                                enabled: additionalFields.proxyEnabled || false,
                                proxyUrl: additionalFields.proxyUrl || '',
                            };
                        }
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
                        responseData = await GenericFunctions_1.fzapAdminApiRequest.call(this, 'POST', '/admin/users', body);
                    }
                    else if (operation === 'deleteUser') {
                        const userId = this.getNodeParameter('userId', i);
                        responseData = await GenericFunctions_1.fzapAdminApiRequest.call(this, 'DELETE', `/admin/users/${userId}`);
                    }
                    else if (operation === 'deleteUserFull') {
                        const userId = this.getNodeParameter('userId', i);
                        responseData = await GenericFunctions_1.fzapAdminApiRequest.call(this, 'DELETE', `/admin/users/${userId}/full`);
                    }
                    else if (operation === 'listFolders') {
                        const parentId = this.getNodeParameter('parentId', i, '');
                        const query = {};
                        if (parentId) {
                            query.parentId = parentId;
                        }
                        responseData = await GenericFunctions_1.fzapAdminApiRequest.call(this, 'GET', '/admin/folders', {}, query);
                    }
                    else if (operation === 'createFolder') {
                        const folderName = this.getNodeParameter('folderName', i);
                        const folderToken = this.getNodeParameter('folderToken', i);
                        const additionalFields = this.getNodeParameter('createFolderFields', i, {});
                        const body = { name: folderName, token: folderToken };
                        if (additionalFields.description)
                            body.description = additionalFields.description;
                        if (additionalFields.color)
                            body.color = additionalFields.color;
                        if (additionalFields.parentId)
                            body.parentId = additionalFields.parentId;
                        if (additionalFields.displayOrder !== undefined)
                            body.displayOrder = additionalFields.displayOrder;
                        responseData = await GenericFunctions_1.fzapAdminApiRequest.call(this, 'POST', '/admin/folders', body);
                    }
                    else if (operation === 'getFolder') {
                        const folderId = this.getNodeParameter('folderId', i);
                        responseData = await GenericFunctions_1.fzapAdminApiRequest.call(this, 'GET', `/admin/folders/${folderId}`);
                    }
                    else if (operation === 'updateFolder') {
                        const folderId = this.getNodeParameter('folderId', i);
                        const updateFields = this.getNodeParameter('updateFolderFields', i, {});
                        const body = {};
                        if (updateFields.name)
                            body.name = updateFields.name;
                        if (updateFields.token)
                            body.token = updateFields.token;
                        if (updateFields.description)
                            body.description = updateFields.description;
                        if (updateFields.color)
                            body.color = updateFields.color;
                        if (updateFields.parentId)
                            body.parentId = updateFields.parentId;
                        if (updateFields.displayOrder !== undefined)
                            body.displayOrder = updateFields.displayOrder;
                        responseData = await GenericFunctions_1.fzapAdminApiRequest.call(this, 'PUT', `/admin/folders/${folderId}`, body);
                    }
                    else if (operation === 'deleteFolder') {
                        const folderId = this.getNodeParameter('folderId', i);
                        responseData = await GenericFunctions_1.fzapAdminApiRequest.call(this, 'DELETE', `/admin/folders/${folderId}`);
                    }
                    else if (operation === 'getFolderInstances') {
                        const folderId = this.getNodeParameter('folderId', i);
                        responseData = await GenericFunctions_1.fzapAdminApiRequest.call(this, 'GET', `/admin/folders/${folderId}/instances`);
                    }
                    else if (operation === 'updateFolderOrder') {
                        const folderOrdersJson = this.getNodeParameter('folderOrders', i);
                        const folderOrders = parseJsonField(folderOrdersJson, 'Folder Orders (JSON)');
                        responseData = await GenericFunctions_1.fzapAdminApiRequest.call(this, 'PATCH', '/admin/folders/order', {
                            folderOrders,
                        });
                    }
                    else if (operation === 'moveInstanceToFolder') {
                        const instanceId = this.getNodeParameter('instanceId', i);
                        const folderId = this.getNodeParameter('moveTargetFolderId', i, '');
                        const body = {};
                        if (folderId) {
                            body.folderId = folderId;
                        }
                        responseData = await GenericFunctions_1.fzapAdminApiRequest.call(this, 'PATCH', `/admin/instances/${instanceId}/folder`, body);
                    }
                    else {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
                    }
                }
                else if (resource === 'session') {
                    if (operation === 'connect') {
                        const options = this.getNodeParameter('options', i, {});
                        const body = {};
                        if (options.subscribe) {
                            body.subscribe = options.subscribe;
                        }
                        if (options.immediate !== undefined) {
                            body.immediate = options.immediate;
                        }
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/session/connect', body, i);
                    }
                    else if (operation === 'disconnect') {
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/session/disconnect', i);
                    }
                    else if (operation === 'logout') {
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/session/logout', i);
                    }
                    else if (operation === 'getCallRejectionConfig') {
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'GET', '/session/call-rejection/config', i);
                    }
                    else if (operation === 'setCallRejectionConfig') {
                        const enabled = this.getNodeParameter('callRejectionEnabled', i);
                        const rejectionMessage = this.getNodeParameter('callRejectionMessage', i, '');
                        const body = { enabled };
                        if (rejectionMessage) {
                            body.rejectionMessage = rejectionMessage;
                        }
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/session/call-rejection/config', body, i);
                    }
                    else if (operation === 'getStatus') {
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'GET', '/session/status', i);
                    }
                    else if (operation === 'getQr') {
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'GET', '/session/qr', i);
                    }
                    else if (operation === 'pairPhone') {
                        const phone = this.getNodeParameter('phone', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/session/pairphone', { phone }, i);
                    }
                    else if (operation === 'establishSession') {
                        const phone = this.getNodeParameter('phone', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/session/establish-session', { phone }, i);
                    }
                    else if (operation === 'forceSession') {
                        const phone = this.getNodeParameter('phone', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/session/force-session', { phone }, i);
                    }
                    else if (operation === 'setProxyConfig') {
                        const proxyUrl = this.getNodeParameter('proxyUrl', i);
                        const enabled = this.getNodeParameter('proxyEnabled', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/session/proxy', { proxyUrl, enabled }, i);
                    }
                    else if (operation === 'testProxyConfig') {
                        const proxyUrl = this.getNodeParameter('proxyUrl', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/session/proxy/test', { proxyUrl }, i);
                    }
                    else if (operation === 'getS3Config') {
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'GET', '/session/s3/config', i);
                    }
                    else if (operation === 'getS3Status') {
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'GET', '/session/s3/status', i);
                    }
                    else if (operation === 'setS3Config') {
                        const s3Config = this.getNodeParameter('s3Config', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/session/s3/config', s3Config, i);
                    }
                    else if (operation === 'testS3Config') {
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/session/s3/test', i);
                    }
                    else if (operation === 'deleteS3Config') {
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'DELETE', '/session/s3/config', i);
                    }
                    else {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
                    }
                }
                else if (resource === 'chat') {
                    if (operation === 'sendText') {
                        const phone = this.getNodeParameter('phone', i);
                        const text = this.getNodeParameter('text', i);
                        const options = this.getNodeParameter('options', i, {});
                        const requestBody = { phone, body: text };
                        if (options.id)
                            requestBody.id = options.id;
                        if (options.typingTime)
                            requestBody.delay = options.typingTime;
                        if (options.linkPreview)
                            requestBody.linkPreview = options.linkPreview;
                        if (options.mentionAll)
                            requestBody.mentionAll = options.mentionAll;
                        if (options.check)
                            requestBody.check = options.check;
                        const contextInfo = {};
                        if (options.replyTo)
                            contextInfo.stanzaId = options.replyTo;
                        if (options.replyToParticipant)
                            contextInfo.participant = options.replyToParticipant;
                        if (options.mentionedJid) {
                            const jids = options.mentionedJid.split(',').map((jid) => jid.trim()).filter(Boolean);
                            if (jids.length > 0)
                                contextInfo.mentionedJid = jids;
                        }
                        if (Object.keys(contextInfo).length > 0) {
                            requestBody.contextInfo = contextInfo;
                        }
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/chat/send/text', requestBody, i);
                    }
                    else if (operation === 'sendImage') {
                        const phone = this.getNodeParameter('phone', i);
                        const image = this.getNodeParameter('image', i);
                        const options = this.getNodeParameter('options', i, {});
                        const requestBody = { phone, image };
                        if (options.caption)
                            requestBody.caption = options.caption;
                        if (options.id)
                            requestBody.id = options.id;
                        if (options.typingTime)
                            requestBody.delay = options.typingTime;
                        if (options.check !== undefined)
                            requestBody.check = options.check;
                        if (options.viewOnce !== undefined)
                            requestBody.viewOnce = options.viewOnce;
                        if (options.fileName)
                            requestBody.fileName = options.fileName;
                        if (options.mimeType)
                            requestBody.mimeType = options.mimeType;
                        if (options.mentionAll !== undefined)
                            requestBody.mentionAll = options.mentionAll;
                        const contextInfo = {};
                        if (options.replyTo)
                            contextInfo.stanzaId = options.replyTo;
                        if (options.replyToParticipant)
                            contextInfo.participant = options.replyToParticipant;
                        if (options.mentionedJid) {
                            const jids = options.mentionedJid.split(',').map((jid) => jid.trim()).filter(Boolean);
                            if (jids.length > 0)
                                contextInfo.mentionedJid = jids;
                        }
                        if (Object.keys(contextInfo).length > 0) {
                            requestBody.contextInfo = contextInfo;
                        }
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/chat/send/image', requestBody, i);
                    }
                    else if (operation === 'sendAudio') {
                        const phone = this.getNodeParameter('phone', i);
                        const audio = this.getNodeParameter('audio', i);
                        const options = this.getNodeParameter('options', i, {});
                        const requestBody = { phone, audio };
                        if (options.ptt !== undefined)
                            requestBody.ptt = options.ptt;
                        if (options.id)
                            requestBody.id = options.id;
                        if (options.typingTime)
                            requestBody.delay = options.typingTime;
                        if (options.check !== undefined)
                            requestBody.check = options.check;
                        if (options.viewOnce !== undefined)
                            requestBody.viewOnce = options.viewOnce;
                        if (options.fileName)
                            requestBody.fileName = options.fileName;
                        if (options.mimeType)
                            requestBody.mimeType = options.mimeType;
                        if (options.mentionAll !== undefined)
                            requestBody.mentionAll = options.mentionAll;
                        const contextInfo = {};
                        if (options.replyTo)
                            contextInfo.stanzaId = options.replyTo;
                        if (options.replyToParticipant)
                            contextInfo.participant = options.replyToParticipant;
                        if (options.mentionedJid) {
                            const jids = options.mentionedJid.split(',').map((jid) => jid.trim()).filter(Boolean);
                            if (jids.length > 0)
                                contextInfo.mentionedJid = jids;
                        }
                        if (Object.keys(contextInfo).length > 0) {
                            requestBody.contextInfo = contextInfo;
                        }
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/chat/send/audio', requestBody, i);
                    }
                    else if (operation === 'sendDocument') {
                        const phone = this.getNodeParameter('phone', i);
                        const document = this.getNodeParameter('document', i);
                        const filename = this.getNodeParameter('filename', i);
                        const options = this.getNodeParameter('options', i, {});
                        const requestBody = { phone, document, fileName: filename };
                        if (options.caption)
                            requestBody.caption = options.caption;
                        if (options.id)
                            requestBody.id = options.id;
                        if (options.typingTime)
                            requestBody.delay = options.typingTime;
                        if (options.check !== undefined)
                            requestBody.check = options.check;
                        if (options.mimeType)
                            requestBody.mimeType = options.mimeType;
                        if (options.mentionAll !== undefined)
                            requestBody.mentionAll = options.mentionAll;
                        const contextInfo = {};
                        if (options.replyTo)
                            contextInfo.stanzaId = options.replyTo;
                        if (options.replyToParticipant)
                            contextInfo.participant = options.replyToParticipant;
                        if (options.mentionedJid) {
                            const jids = options.mentionedJid.split(',').map((jid) => jid.trim()).filter(Boolean);
                            if (jids.length > 0)
                                contextInfo.mentionedJid = jids;
                        }
                        if (Object.keys(contextInfo).length > 0) {
                            requestBody.contextInfo = contextInfo;
                        }
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/chat/send/document', requestBody, i);
                    }
                    else if (operation === 'sendVideo') {
                        const phone = this.getNodeParameter('phone', i);
                        const video = this.getNodeParameter('video', i);
                        const options = this.getNodeParameter('videoOptions', i, {});
                        const requestBody = { phone, video };
                        if (options.caption)
                            requestBody.caption = options.caption;
                        if (options.fileName)
                            requestBody.fileName = options.fileName;
                        if (options.id)
                            requestBody.id = options.id;
                        if (options.mimeType)
                            requestBody.mimeType = options.mimeType;
                        if (options.viewOnce !== undefined)
                            requestBody.viewOnce = options.viewOnce;
                        if (options.jpegThumbnail)
                            requestBody.jpegThumbnail = options.jpegThumbnail;
                        if (options.check !== undefined)
                            requestBody.check = options.check;
                        if (options.mentionAll !== undefined)
                            requestBody.mentionAll = options.mentionAll;
                        const videoContextInfo = {};
                        if (options.replyTo)
                            videoContextInfo.stanzaId = options.replyTo;
                        if (options.replyToParticipant)
                            videoContextInfo.participant = options.replyToParticipant;
                        if (options.mentionedJid) {
                            const jids = options.mentionedJid.split(',').map((jid) => jid.trim()).filter(Boolean);
                            if (jids.length > 0)
                                videoContextInfo.mentionedJid = jids;
                        }
                        if (Object.keys(videoContextInfo).length > 0) {
                            requestBody.contextInfo = videoContextInfo;
                        }
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/chat/send/video', requestBody, i);
                    }
                    else if (operation === 'sendSticker') {
                        const phone = this.getNodeParameter('phone', i);
                        const sticker = this.getNodeParameter('sticker', i);
                        const options = this.getNodeParameter('stickerOptions', i, {});
                        const requestBody = { phone, sticker };
                        if (options.id)
                            requestBody.id = options.id;
                        if (options.pngThumbnail)
                            requestBody.pngThumbnail = options.pngThumbnail;
                        if (options.check !== undefined)
                            requestBody.check = options.check;
                        if (options.mentionAll !== undefined)
                            requestBody.mentionAll = options.mentionAll;
                        const stickerContextInfo = {};
                        if (options.replyTo)
                            stickerContextInfo.stanzaId = options.replyTo;
                        if (options.replyToParticipant)
                            stickerContextInfo.participant = options.replyToParticipant;
                        if (options.mentionedJid) {
                            const jids = options.mentionedJid.split(',').map((jid) => jid.trim()).filter(Boolean);
                            if (jids.length > 0)
                                stickerContextInfo.mentionedJid = jids;
                        }
                        if (Object.keys(stickerContextInfo).length > 0) {
                            requestBody.contextInfo = stickerContextInfo;
                        }
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/chat/send/sticker', requestBody, i);
                    }
                    else if (operation === 'sendContact') {
                        const phone = this.getNodeParameter('phone', i);
                        const name = this.getNodeParameter('contactName', i);
                        const vcard = this.getNodeParameter('vcard', i);
                        const options = this.getNodeParameter('contactOptions', i, {});
                        const requestBody = { phone, name, vcard };
                        if (options.id)
                            requestBody.id = options.id;
                        if (options.check !== undefined)
                            requestBody.check = options.check;
                        const contactContextInfo = {};
                        if (options.replyTo)
                            contactContextInfo.stanzaId = options.replyTo;
                        if (options.replyToParticipant)
                            contactContextInfo.participant = options.replyToParticipant;
                        if (options.mentionedJid) {
                            const jids = options.mentionedJid.split(',').map((jid) => jid.trim()).filter(Boolean);
                            if (jids.length > 0)
                                contactContextInfo.mentionedJid = jids;
                        }
                        if (Object.keys(contactContextInfo).length > 0) {
                            requestBody.contextInfo = contactContextInfo;
                        }
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/chat/send/contact', requestBody, i);
                    }
                    else if (operation === 'sendLocation') {
                        const phone = this.getNodeParameter('phone', i);
                        const latitude = this.getNodeParameter('latitude', i);
                        const longitude = this.getNodeParameter('longitude', i);
                        const name = this.getNodeParameter('locationName', i, '');
                        const address = this.getNodeParameter('locationAddress', i, '');
                        const url = this.getNodeParameter('locationUrl', i, '');
                        const options = this.getNodeParameter('locationOptions', i, {});
                        const requestBody = { phone, latitude, longitude };
                        if (name)
                            requestBody.name = name;
                        if (address)
                            requestBody.address = address;
                        if (url)
                            requestBody.url = url;
                        if (options.id)
                            requestBody.id = options.id;
                        if (options.check !== undefined)
                            requestBody.check = options.check;
                        const locationContextInfo = {};
                        if (options.replyTo)
                            locationContextInfo.stanzaId = options.replyTo;
                        if (options.replyToParticipant)
                            locationContextInfo.participant = options.replyToParticipant;
                        if (options.mentionedJid) {
                            const jids = options.mentionedJid.split(',').map((jid) => jid.trim()).filter(Boolean);
                            if (jids.length > 0)
                                locationContextInfo.mentionedJid = jids;
                        }
                        if (Object.keys(locationContextInfo).length > 0) {
                            requestBody.contextInfo = locationContextInfo;
                        }
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/chat/send/location', requestBody, i);
                    }
                    else if (operation === 'sendPoll') {
                        const group = this.getNodeParameter('groupJid', i);
                        const header = this.getNodeParameter('pollHeader', i);
                        const optionsInput = this.getNodeParameter('pollOptions', i);
                        const options = splitCommaList(optionsInput);
                        const pollOptions = this.getNodeParameter('pollAdditionalOptions', i, {});
                        const requestBody = {
                            group,
                            header,
                            options,
                        };
                        if (pollOptions.id)
                            requestBody.id = pollOptions.id;
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/chat/send/poll', requestBody, i);
                    }
                    else if (operation === 'sendButtons') {
                        const phone = this.getNodeParameter('phone', i);
                        const buttonsList = this.getNodeParameter('buttonsList', i, {});
                        const buttonsOptions = this.getNodeParameter('buttonsOptions', i, {});
                        const requestBody = { phone };
                        const mode = this.getNodeParameter('buttonsMode', i, 'interactive');
                        const header = this.getNodeParameter('buttonsHeader', i, '');
                        const text = this.getNodeParameter('buttonsText', i, '');
                        const footer = this.getNodeParameter('buttonsFooter', i, '');
                        const mediaType = this.getNodeParameter('buttonsMediaType', i, 'none');
                        if (mode)
                            requestBody.mode = mode;
                        if (header)
                            requestBody.header = header;
                        if (text)
                            requestBody.text = text;
                        if (footer)
                            requestBody.footer = footer;
                        if (mediaType === 'image') {
                            const image = this.getNodeParameter('buttonsImage', i, '');
                            if (image)
                                requestBody.image = image;
                        }
                        else if (mediaType === 'video') {
                            const video = this.getNodeParameter('buttonsVideo', i, '');
                            if (video)
                                requestBody.video = video;
                        }
                        if (buttonsOptions.title)
                            requestBody.title = buttonsOptions.title;
                        if (buttonsOptions.caption)
                            requestBody.caption = buttonsOptions.caption;
                        if (buttonsOptions.id)
                            requestBody.id = buttonsOptions.id;
                        if (buttonsOptions.mimeType)
                            requestBody.mimeType = buttonsOptions.mimeType;
                        if (buttonsOptions.fileName)
                            requestBody.fileName = buttonsOptions.fileName;
                        if (buttonsOptions.check !== undefined)
                            requestBody.check = buttonsOptions.check;
                        const buttonsContextInfo = {};
                        if (buttonsOptions.replyTo)
                            buttonsContextInfo.stanzaId = buttonsOptions.replyTo;
                        if (buttonsOptions.replyToParticipant)
                            buttonsContextInfo.participant = buttonsOptions.replyToParticipant;
                        if (buttonsOptions.mentionedJid) {
                            const jids = buttonsOptions.mentionedJid.split(',').map((jid) => jid.trim()).filter(Boolean);
                            if (jids.length > 0)
                                buttonsContextInfo.mentionedJid = jids;
                        }
                        if (Object.keys(buttonsContextInfo).length > 0) {
                            requestBody.contextInfo = buttonsContextInfo;
                        }
                        if (buttonsOptions.buttonsJson) {
                            requestBody.buttons = parseJsonField(buttonsOptions.buttonsJson, 'Buttons (JSON)');
                        }
                        else if (buttonsList.buttons && Array.isArray(buttonsList.buttons)) {
                            const buttons = buttonsList.buttons.map((btn) => {
                                const button = {};
                                if (btn.buttonText)
                                    button.buttonText = btn.buttonText;
                                if (btn.buttonId)
                                    button.buttonId = btn.buttonId;
                                if (btn.type && btn.type !== 'quickReply')
                                    button.type = btn.type;
                                if (btn.url)
                                    button.url = btn.url;
                                if (btn.phoneNumber)
                                    button.phoneNumber = btn.phoneNumber;
                                if (btn.copyCode)
                                    button.copyCode = btn.copyCode;
                                if (btn.type === 'copy' && btn.buttonText)
                                    button.copyCodeText = btn.buttonText;
                                return button;
                            });
                            if (buttons.length > 0) {
                                requestBody.buttons = buttons;
                            }
                        }
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/chat/send/buttons', requestBody, i);
                    }
                    else if (operation === 'sendList') {
                        const phone = this.getNodeParameter('phone', i);
                        const buttonText = this.getNodeParameter('listButtonText', i);
                        const description = this.getNodeParameter('listDescription', i, '');
                        const title = this.getNodeParameter('listTitle', i, '');
                        const footer = this.getNodeParameter('listFooter', i, '');
                        const listSections = this.getNodeParameter('listSections', i, {});
                        const listOptions = this.getNodeParameter('listOptions', i, {});
                        const requestBody = { phone, buttonText };
                        if (description)
                            requestBody.text = description;
                        if (title)
                            requestBody.title = title;
                        if (footer)
                            requestBody.footer = footer;
                        if (listOptions.id)
                            requestBody.id = listOptions.id;
                        if (listOptions.check !== undefined)
                            requestBody.check = listOptions.check;
                        const listContextInfo = {};
                        if (listOptions.replyTo)
                            listContextInfo.stanzaId = listOptions.replyTo;
                        if (listOptions.replyToParticipant)
                            listContextInfo.participant = listOptions.replyToParticipant;
                        if (listOptions.mentionedJid) {
                            const jids = listOptions.mentionedJid.split(',').map((jid) => jid.trim()).filter(Boolean);
                            if (jids.length > 0)
                                listContextInfo.mentionedJid = jids;
                        }
                        if (Object.keys(listContextInfo).length > 0) {
                            requestBody.contextInfo = listContextInfo;
                        }
                        if (listOptions.listSectionsJson) {
                            requestBody.sections = parseJsonField(listOptions.listSectionsJson, 'Sections (JSON)');
                        }
                        else if (listSections.sections && Array.isArray(listSections.sections)) {
                            const sections = listSections.sections.map((section) => {
                                const sec = {};
                                if (section.title)
                                    sec.title = section.title;
                                const rowsData = section.rows;
                                if ((rowsData === null || rowsData === void 0 ? void 0 : rowsData.items) && Array.isArray(rowsData.items)) {
                                    sec.rows = rowsData.items.map((row) => {
                                        const r = {};
                                        if (row.title)
                                            r.title = row.title;
                                        if (row.desc)
                                            r.desc = row.desc;
                                        if (row.rowId)
                                            r.rowId = row.rowId;
                                        return r;
                                    });
                                }
                                return sec;
                            });
                            if (sections.length > 0) {
                                requestBody.sections = sections;
                            }
                        }
                        if (listOptions.listItemsJson) {
                            requestBody.list = parseJsonField(listOptions.listItemsJson, 'List (JSON)');
                        }
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/chat/send/list', requestBody, i);
                    }
                    else if (operation === 'sendTemplate') {
                        const phone = this.getNodeParameter('phone', i);
                        const templateButtonsJson = this.getNodeParameter('templateButtonsJson', i);
                        const title = this.getNodeParameter('templateTitle', i, '');
                        const text = this.getNodeParameter('templateText', i, '');
                        const header = this.getNodeParameter('templateHeader', i, '');
                        const footer = this.getNodeParameter('templateFooter', i, '');
                        const templateOptions = this.getNodeParameter('templateOptions', i, {});
                        const requestBody = {
                            phone,
                            templateButtons: parseJsonField(templateButtonsJson, 'Template Buttons (JSON)'),
                        };
                        if (title)
                            requestBody.title = title;
                        if (text)
                            requestBody.text = text;
                        if (header)
                            requestBody.header = header;
                        if (footer)
                            requestBody.footer = footer;
                        if (templateOptions.id)
                            requestBody.id = templateOptions.id;
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/chat/send/template', requestBody, i);
                    }
                    else if (operation === 'downloadImage') {
                        const downloadPayload = {
                            url: this.getNodeParameter('downloadUrl', i),
                            mediaKey: this.getNodeParameter('downloadMediaKey', i),
                            mimeType: this.getNodeParameter('downloadMimeType', i),
                            fileSha256: this.getNodeParameter('downloadFileSha256', i),
                            fileLength: this.getNodeParameter('downloadFileLength', i),
                        };
                        const directPath = this.getNodeParameter('downloadDirectPath', i, '');
                        const fileEncSha256 = this.getNodeParameter('downloadFileEncSha256', i, '');
                        const generateLink = this.getNodeParameter('downloadGenerateLink', i);
                        if (directPath)
                            downloadPayload.directPath = directPath;
                        if (fileEncSha256)
                            downloadPayload.fileEncSha256 = fileEncSha256;
                        if (generateLink !== undefined)
                            downloadPayload.generateLink = generateLink;
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/chat/downloadimage', downloadPayload, i);
                    }
                    else if (operation === 'downloadAudio') {
                        const downloadPayload = {
                            url: this.getNodeParameter('downloadUrl', i),
                            mediaKey: this.getNodeParameter('downloadMediaKey', i),
                            mimeType: this.getNodeParameter('downloadMimeType', i),
                            fileSha256: this.getNodeParameter('downloadFileSha256', i),
                            fileLength: this.getNodeParameter('downloadFileLength', i),
                        };
                        const directPath = this.getNodeParameter('downloadDirectPath', i, '');
                        const fileEncSha256 = this.getNodeParameter('downloadFileEncSha256', i, '');
                        const generateLink = this.getNodeParameter('downloadGenerateLink', i);
                        if (directPath)
                            downloadPayload.directPath = directPath;
                        if (fileEncSha256)
                            downloadPayload.fileEncSha256 = fileEncSha256;
                        if (generateLink !== undefined)
                            downloadPayload.generateLink = generateLink;
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/chat/downloadaudio', downloadPayload, i);
                    }
                    else if (operation === 'downloadDocument') {
                        const downloadPayload = {
                            url: this.getNodeParameter('downloadUrl', i),
                            mediaKey: this.getNodeParameter('downloadMediaKey', i),
                            mimeType: this.getNodeParameter('downloadMimeType', i),
                            fileSha256: this.getNodeParameter('downloadFileSha256', i),
                            fileLength: this.getNodeParameter('downloadFileLength', i),
                        };
                        const directPath = this.getNodeParameter('downloadDirectPath', i, '');
                        const fileEncSha256 = this.getNodeParameter('downloadFileEncSha256', i, '');
                        const generateLink = this.getNodeParameter('downloadGenerateLink', i);
                        if (directPath)
                            downloadPayload.directPath = directPath;
                        if (fileEncSha256)
                            downloadPayload.fileEncSha256 = fileEncSha256;
                        if (generateLink !== undefined)
                            downloadPayload.generateLink = generateLink;
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/chat/downloaddocument', downloadPayload, i);
                    }
                    else if (operation === 'downloadVideo') {
                        const downloadPayload = {
                            url: this.getNodeParameter('downloadUrl', i),
                            mediaKey: this.getNodeParameter('downloadMediaKey', i),
                            mimeType: this.getNodeParameter('downloadMimeType', i),
                            fileSha256: this.getNodeParameter('downloadFileSha256', i),
                            fileLength: this.getNodeParameter('downloadFileLength', i),
                        };
                        const directPath = this.getNodeParameter('downloadDirectPath', i, '');
                        const fileEncSha256 = this.getNodeParameter('downloadFileEncSha256', i, '');
                        const generateLink = this.getNodeParameter('downloadGenerateLink', i);
                        if (directPath)
                            downloadPayload.directPath = directPath;
                        if (fileEncSha256)
                            downloadPayload.fileEncSha256 = fileEncSha256;
                        if (generateLink !== undefined)
                            downloadPayload.generateLink = generateLink;
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/chat/downloadvideo', downloadPayload, i);
                    }
                    else if (operation === 'edit') {
                        const messageId = this.getNodeParameter('messageId', i);
                        const phone = this.getNodeParameter('chatJid', i);
                        const newText = this.getNodeParameter('newText', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/chat/send/edit', {
                            id: messageId,
                            phone,
                            body: newText,
                        }, i);
                    }
                    else if (operation === 'delete') {
                        const messageId = this.getNodeParameter('messageId', i);
                        const phone = this.getNodeParameter('chatJid', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/chat/delete', {
                            id: messageId,
                            phone,
                        }, i);
                    }
                    else if (operation === 'react') {
                        const messageId = this.getNodeParameter('messageId', i);
                        const phone = this.getNodeParameter('chatJid', i);
                        const emoji = this.getNodeParameter('emoji', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/chat/react', {
                            id: messageId,
                            phone,
                            body: emoji,
                        }, i);
                    }
                    else if (operation === 'markRead') {
                        const phone = this.getNodeParameter('phone', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/chat/mark-all-read', {
                            phone,
                        }, i);
                    }
                    else if (operation === 'markMessageRead') {
                        const messageIdsInput = this.getNodeParameter('messageIds', i);
                        const chatJid = this.getNodeParameter('markReadChatJid', i);
                        const senderJid = this.getNodeParameter('markReadSenderJid', i, '');
                        const messageIds = splitCommaList(messageIdsInput);
                        const body = {
                            id: messageIds,
                            chat: chatJid,
                        };
                        if (senderJid)
                            body.sender = senderJid;
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/chat/markread', body, i);
                    }
                    else if (operation === 'archive') {
                        const phone = this.getNodeParameter('phone', i);
                        const archiveAction = this.getNodeParameter('archiveAction', i);
                        const shouldArchive = archiveAction === 'archive';
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/chat/archive', {
                            phone,
                            archive: shouldArchive,
                        }, i);
                    }
                    else if (operation === 'mute') {
                        const phone = this.getNodeParameter('phone', i);
                        const muteAction = this.getNodeParameter('muteAction', i);
                        const shouldMute = muteAction === 'mute';
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/chat/mute', {
                            phone,
                            mute: shouldMute,
                        }, i);
                    }
                    else if (operation === 'pin') {
                        const phone = this.getNodeParameter('phone', i);
                        const pinAction = this.getNodeParameter('pinAction', i);
                        const shouldPin = pinAction === 'pin';
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/chat/pin', {
                            phone,
                            pin: shouldPin,
                        }, i);
                    }
                    else if (operation === 'presence') {
                        const phone = this.getNodeParameter('phone', i);
                        const state = this.getNodeParameter('presenceState', i);
                        const media = this.getNodeParameter('presenceMedia', i, '');
                        const body = { phone, state };
                        if (media)
                            body.media = media;
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/chat/presence', body, i);
                    }
                    else {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
                    }
                }
                else if (resource === 'user') {
                    if (operation === 'getInfo') {
                        const phonesInput = this.getNodeParameter('phones', i);
                        const phones = phonesInput.split(',').map((p) => p.trim());
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/user/info', { phone: phones }, i);
                    }
                    else if (operation === 'checkWhatsApp') {
                        const phonesInput = this.getNodeParameter('phones', i);
                        const phones = phonesInput.split(',').map((p) => p.trim());
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/user/check', { phone: phones }, i);
                    }
                    else if (operation === 'getLid') {
                        const phone = this.getNodeParameter('lidPhone', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'GET', '/user/lid/get', {}, { phone }, i);
                    }
                    else if (operation === 'getLidPost') {
                        const phone = this.getNodeParameter('lidPhone', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/user/lid/get', { phone }, i);
                    }
                    else if (operation === 'listLid') {
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'GET', '/user/lid/list', i);
                    }
                    else if (operation === 'reverseLid') {
                        const lid = this.getNodeParameter('lidValue', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'GET', '/user/lid/reverse', {}, { lid }, i);
                    }
                    else if (operation === 'reverseLidPost') {
                        const lid = this.getNodeParameter('lidValue', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/user/lid/reverse', { lid }, i);
                    }
                    else if (operation === 'getAvatar') {
                        const phone = this.getNodeParameter('phone', i);
                        const preview = this.getNodeParameter('preview', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/user/avatar', { phone, preview }, i);
                    }
                    else if (operation === 'getContacts') {
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'GET', '/user/contacts', i);
                    }
                    else if (operation === 'setPresence') {
                        const presence = this.getNodeParameter('presence', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/user/presence', { type: presence }, i);
                    }
                    else if (operation === 'getPrivacySettings') {
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'GET', '/user/privacy/settings', i);
                    }
                    else if (operation === 'getProfileName') {
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'GET', '/user/profile/name', i);
                    }
                    else if (operation === 'updatePrivacySettings') {
                        const privacySettings = this.getNodeParameter('privacySettings', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'PUT', '/user/privacy/settings', privacySettings, i);
                    }
                    else if (operation === 'setProfileName') {
                        const profileName = this.getNodeParameter('profileName', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'PUT', '/user/profile/name', { pushName: profileName }, i);
                    }
                    else if (operation === 'setProfileStatus') {
                        const statusText = this.getNodeParameter('statusText', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'PUT', '/user/profile/status', { status: statusText }, i);
                    }
                    else {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
                    }
                }
                else if (resource === 'webhook') {
                    if (operation === 'list') {
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'GET', '/webhook', i);
                    }
                    else if (operation === 'create') {
                        const url = this.getNodeParameter('url', i);
                        const events = this.getNodeParameter('events', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/webhook', { url, events }, i);
                    }
                    else if (operation === 'update') {
                        const webhookId = this.getNodeParameter('webhookId', i);
                        const updateFields = this.getNodeParameter('updateFields', i);
                        const body = {};
                        if (updateFields.url)
                            body.url = updateFields.url;
                        if (updateFields.events)
                            body.events = updateFields.events;
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'PUT', `/webhook/${webhookId}`, body, i);
                    }
                    else if (operation === 'delete') {
                        const webhookId = this.getNodeParameter('webhookId', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'DELETE', `/webhook/${webhookId}`, i);
                    }
                    else {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
                    }
                }
                else if (resource === 'chatwoot') {
                    if (operation === 'configure') {
                        const url = this.getNodeParameter('url', i);
                        const accountId = this.getNodeParameter('accountId', i);
                        const configOptions = this.getNodeParameter('configOptions', i, {});
                        const body = {
                            url,
                            accountId,
                        };
                        if (configOptions.enabled !== undefined)
                            body.enabled = configOptions.enabled;
                        if (configOptions.chatwootToken)
                            body.token = configOptions.chatwootToken;
                        if (configOptions.nameInbox)
                            body.nameInbox = configOptions.nameInbox;
                        if (configOptions.chatwootInboxId !== undefined) {
                            body.chatwootInboxId = configOptions.chatwootInboxId;
                        }
                        if (configOptions.signMsg !== undefined)
                            body.signMsg = configOptions.signMsg;
                        if (configOptions.signDelimiter)
                            body.signDelimiter = configOptions.signDelimiter;
                        if (configOptions.reopenConversation !== undefined) {
                            body.reopenConversation = configOptions.reopenConversation;
                        }
                        if (configOptions.conversationPending !== undefined) {
                            body.conversationPending = configOptions.conversationPending;
                        }
                        if (configOptions.mergeBrazilContacts !== undefined) {
                            body.mergeBrazilContacts = configOptions.mergeBrazilContacts;
                        }
                        if (configOptions.ignoreJids)
                            body.ignoreJids = configOptions.ignoreJids;
                        if (configOptions.ignoreGroups !== undefined)
                            body.ignoreGroups = configOptions.ignoreGroups;
                        if (configOptions.enableTypingIndicator !== undefined) {
                            body.enableTypingIndicator = configOptions.enableTypingIndicator;
                        }
                        if (configOptions.transcriptionEnabled !== undefined) {
                            body.transcriptionEnabled = configOptions.transcriptionEnabled;
                        }
                        if (configOptions.transcriptionProvider) {
                            body.transcriptionProvider = configOptions.transcriptionProvider;
                        }
                        if (configOptions.openaiApiKey)
                            body.openaiApiKey = configOptions.openaiApiKey;
                        if (configOptions.openaiModel)
                            body.openaiModel = configOptions.openaiModel;
                        if (configOptions.openaiApiBaseUrl) {
                            body.openaiApiBaseUrl = configOptions.openaiApiBaseUrl;
                        }
                        if (configOptions.groqApiKey)
                            body.groqApiKey = configOptions.groqApiKey;
                        if (configOptions.groqModel)
                            body.groqModel = configOptions.groqModel;
                        if (configOptions.groqApiBaseUrl) {
                            body.groqApiBaseUrl = configOptions.groqApiBaseUrl;
                        }
                        if (configOptions.proxyUrl)
                            body.proxyUrl = configOptions.proxyUrl;
                        if (configOptions.chatwootDbEnabled !== undefined) {
                            body.chatwootDbEnabled = configOptions.chatwootDbEnabled;
                        }
                        if (configOptions.chatwootDbHost)
                            body.chatwootDbHost = configOptions.chatwootDbHost;
                        if (configOptions.chatwootDbPort !== undefined) {
                            body.chatwootDbPort = configOptions.chatwootDbPort;
                        }
                        if (configOptions.chatwootDbName)
                            body.chatwootDbName = configOptions.chatwootDbName;
                        if (configOptions.chatwootDbUser)
                            body.chatwootDbUser = configOptions.chatwootDbUser;
                        if (configOptions.chatwootDbPass)
                            body.chatwootDbPass = configOptions.chatwootDbPass;
                        if (configOptions.messageDeliveryTimeoutSeconds !== undefined) {
                            body.messageDeliveryTimeoutSeconds = configOptions.messageDeliveryTimeoutSeconds;
                        }
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/chatwoot/config', body, i);
                    }
                    else if (operation === 'getConfig') {
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'GET', '/chatwoot/config', i);
                    }
                    else if (operation === 'deleteConfig') {
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'DELETE', '/chatwoot/config', i);
                    }
                    else if (operation === 'status') {
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'GET', '/chatwoot/status', i);
                    }
                    else if (operation === 'test') {
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/chatwoot/test', i);
                    }
                    else if (operation === 'createInbox') {
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/chatwoot/create-inbox', i);
                    }
                    else if (operation === 'updateInbox') {
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'PATCH', '/chatwoot/update-inbox', i);
                    }
                    else if (operation === 'cleanup') {
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/chatwoot/cleanup', i);
                    }
                    else {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
                    }
                }
                else if (resource === 'group') {
                    if (operation === 'list') {
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'GET', '/group/list', i);
                    }
                    else if (operation === 'getInfo') {
                        const groupJid = this.getNodeParameter('groupJid', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'GET', '/group/info', {}, { groupJid }, i);
                    }
                    else if (operation === 'getInviteLink') {
                        const groupJid = this.getNodeParameter('groupJid', i);
                        const reset = this.getNodeParameter('resetInvite', i);
                        const query = { groupJid };
                        if (reset)
                            query.reset = true;
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'GET', '/group/invitelink', {}, query, i);
                    }
                    else if (operation === 'create') {
                        const name = this.getNodeParameter('groupName', i);
                        const participantsInput = this.getNodeParameter('participants', i);
                        const participants = splitCommaList(participantsInput);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/group/create', { name, participants }, i);
                    }
                    else if (operation === 'announce') {
                        const groupJid = this.getNodeParameter('groupJid', i);
                        const announce = this.getNodeParameter('announceEnabled', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/group/announce', { groupJid, announce }, i);
                    }
                    else if (operation === 'ephemeral') {
                        const groupJid = this.getNodeParameter('groupJid', i);
                        const duration = this.getNodeParameter('ephemeralDuration', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/group/ephemeral', { groupJid, duration }, i);
                    }
                    else if (operation === 'inviteInfo') {
                        const code = this.getNodeParameter('inviteCode', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/group/inviteinfo', { code }, i);
                    }
                    else if (operation === 'join') {
                        const code = this.getNodeParameter('inviteCode', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/group/join', { code }, i);
                    }
                    else if (operation === 'leave') {
                        const groupJid = this.getNodeParameter('groupJid', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/group/leave', { groupJid }, i);
                    }
                    else if (operation === 'locked') {
                        const groupJid = this.getNodeParameter('groupJid', i);
                        const locked = this.getNodeParameter('lockedEnabled', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/group/locked', { groupJid, locked }, i);
                    }
                    else if (operation === 'setName') {
                        const groupJid = this.getNodeParameter('groupJid', i);
                        const name = this.getNodeParameter('newGroupName', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/group/name', { groupJid, name }, i);
                    }
                    else if (operation === 'setPhoto') {
                        const groupJid = this.getNodeParameter('groupJid', i);
                        const image = this.getNodeParameter('groupPhoto', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/group/photo', { groupJid, image }, i);
                    }
                    else if (operation === 'removePhoto') {
                        const groupJid = this.getNodeParameter('groupJid', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/group/photo/remove', { groupJid }, i);
                    }
                    else if (operation === 'setTopic') {
                        const groupJid = this.getNodeParameter('groupJid', i);
                        const topic = this.getNodeParameter('groupTopic', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/group/topic', { groupJid, topic }, i);
                    }
                    else if (operation === 'updateParticipants') {
                        const groupJid = this.getNodeParameter('groupJid', i);
                        const action = this.getNodeParameter('participantAction', i);
                        const participantsInput = this.getNodeParameter('participantPhones', i);
                        const phone = splitCommaList(participantsInput);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/group/updateparticipants', { groupJid, action, phone }, i);
                    }
                    else {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
                    }
                }
                else if (resource === 'status') {
                    if (operation === 'sendText') {
                        const text = this.getNodeParameter('statusText', i);
                        const backgroundColor = this.getNodeParameter('statusBackgroundColor', i, '');
                        const textColor = this.getNodeParameter('statusTextColor', i, '');
                        const font = this.getNodeParameter('statusFont', i);
                        const id = this.getNodeParameter('statusId', i, '');
                        const body = { text };
                        if (backgroundColor)
                            body.backgroundColor = backgroundColor;
                        if (textColor)
                            body.textColor = textColor;
                        if (!Number.isNaN(font))
                            body.font = font;
                        if (id)
                            body.id = id;
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/status/send-text', body, i);
                    }
                    else if (operation === 'sendImage') {
                        const image = this.getNodeParameter('statusImage', i);
                        const caption = this.getNodeParameter('statusImageCaption', i, '');
                        const mimeType = this.getNodeParameter('statusImageMimeType', i, '');
                        const id = this.getNodeParameter('statusImageId', i, '');
                        const body = { image };
                        if (caption)
                            body.caption = caption;
                        if (mimeType)
                            body.mimeType = mimeType;
                        if (id)
                            body.id = id;
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/status/send-image', body, i);
                    }
                    else if (operation === 'sendVideo') {
                        const video = this.getNodeParameter('statusVideo', i);
                        const caption = this.getNodeParameter('statusVideoCaption', i, '');
                        const mimeType = this.getNodeParameter('statusVideoMimeType', i, '');
                        const id = this.getNodeParameter('statusVideoId', i, '');
                        const body = { video };
                        if (caption)
                            body.caption = caption;
                        if (mimeType)
                            body.mimeType = mimeType;
                        if (id)
                            body.id = id;
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/status/send-video', body, i);
                    }
                    else if (operation === 'delete') {
                        const id = this.getNodeParameter('deleteStatusId', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/status/delete', { id }, i);
                    }
                    else {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
                    }
                }
                else if (resource === 'folder') {
                    if (operation === 'listInstances') {
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'GET', '/folder/instances', i);
                    }
                    else if (operation === 'createInstance') {
                        const dataJson = this.getNodeParameter('folderInstanceData', i);
                        const body = parseJsonField(dataJson, 'Instance Data (JSON)');
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/folder/instances', body, i);
                    }
                    else if (operation === 'deleteInstance') {
                        const instanceId = this.getNodeParameter('folderInstanceId', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'DELETE', `/folder/instances/${instanceId}`, i);
                    }
                    else if (operation === 'deleteInstanceFull') {
                        const instanceId = this.getNodeParameter('folderInstanceId', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'DELETE', `/folder/instances/${instanceId}/full`, i);
                    }
                    else {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
                    }
                }
                else if (resource === 'newsletter') {
                    if (operation === 'list') {
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'GET', '/newsletter/list', i);
                    }
                    else {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
                    }
                }
                else if (resource === 'paidTraffic') {
                    if (operation === 'getConfig') {
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'GET', '/paid-traffic/config', i);
                    }
                    else if (operation === 'saveConfig') {
                        const fbGraphAccessToken = this.getNodeParameter('fbGraphAccessToken', i, '');
                        const autoEnrichEnabled = this.getNodeParameter('autoEnrichEnabled', i);
                        const body = {
                            fbGraphAccessToken,
                            autoEnrichEnabled,
                        };
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', '/paid-traffic/config', body, i);
                    }
                    else if (operation === 'getConversionEvents') {
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'GET', '/paid-traffic/conversion-events', i);
                    }
                    else if (operation === 'getLeads') {
                        const query = {};
                        const search = this.getNodeParameter('leadsSearch', i, '');
                        const dateFrom = this.getNodeParameter('leadsDateFrom', i, '');
                        const dateTo = this.getNodeParameter('leadsDateTo', i, '');
                        const campaign = this.getNodeParameter('leadsCampaign', i, '');
                        const adset = this.getNodeParameter('leadsAdset', i, '');
                        const creative = this.getNodeParameter('leadsCreative', i, '');
                        const limit = this.getNodeParameter('leadsLimit', i);
                        const offset = this.getNodeParameter('leadsOffset', i);
                        const sort = this.getNodeParameter('leadsSort', i, '');
                        const order = this.getNodeParameter('leadsOrder', i, '');
                        if (search)
                            query.search = search;
                        if (dateFrom)
                            query.dateFrom = dateFrom;
                        if (dateTo)
                            query.dateTo = dateTo;
                        if (campaign)
                            query.campaign = campaign;
                        if (adset)
                            query.adset = adset;
                        if (creative)
                            query.creative = creative;
                        if (limit)
                            query.limit = limit;
                        if (offset)
                            query.offset = offset;
                        if (sort)
                            query.sort = sort;
                        if (order)
                            query.order = order;
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'GET', '/paid-traffic/leads', {}, query, i);
                    }
                    else if (operation === 'exportLeads') {
                        const search = this.getNodeParameter('leadsSearch', i, '');
                        const query = {};
                        if (search)
                            query.search = search;
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'GET', '/paid-traffic/leads/export', {}, query, i);
                    }
                    else if (operation === 'getStats') {
                        const weekStart = this.getNodeParameter('statsWeekStart', i, '');
                        const query = {};
                        if (weekStart)
                            query.weekStart = weekStart;
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'GET', '/paid-traffic/stats', {}, query, i);
                    }
                    else if (operation === 'enrichLead') {
                        const leadId = this.getNodeParameter('leadId', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', `/paid-traffic/leads/${leadId}/enrich`, i);
                    }
                    else if (operation === 'sendConversion') {
                        const leadId = this.getNodeParameter('leadId', i);
                        const eventName = this.getNodeParameter('conversionEventName', i);
                        const value = this.getNodeParameter('conversionValue', i);
                        const currency = this.getNodeParameter('conversionCurrency', i);
                        responseData = await GenericFunctions_1.fzapApiRequest.call(this, 'POST', `/paid-traffic/leads/${leadId}/send-conversion`, {
                            eventName,
                            value,
                            currency,
                        }, i);
                    }
                    else {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
                    }
                }
                else if (resource === 'download') {
                    if (operation === 'getFile') {
                        const downloadToken = this.getNodeParameter('downloadToken', i);
                        const binaryProperty = this.getNodeParameter('downloadBinaryProperty', i, 'data');
                        const baseUrl = credentials.baseUrl.replace(/\/$/, '');
                        const options = {
                            method: 'GET',
                            url: `${baseUrl}/download/${downloadToken}`,
                            encoding: 'arraybuffer',
                            returnFullResponse: true,
                            ignoreHttpStatusErrors: true,
                        };
                        const response = await this.helpers.httpRequest(options);
                        if (response.statusCode >= 400) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), ((_a = response.body) === null || _a === void 0 ? void 0 : _a.error) || ((_b = response.body) === null || _b === void 0 ? void 0 : _b.message) || `HTTP ${response.statusCode}`);
                        }
                        const binaryData = await this.helpers.prepareBinaryData(response.body);
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
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
                    }
                }
                else {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
                }
                const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
                returnData.push(...executionData);
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: { error: error.message },
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
exports.FZAP = FZAP;
//# sourceMappingURL=FZAP.node.js.map