import { Hono } from "hono";
import { getAgentByName } from 'agents';
import { ChatAgent } from './agent';
import { API_RESPONSES } from './config';
import { Env, getAppController, registerSession, unregisterSession } from "./core-utils";
import type { MediaFile, SignedUrlResponse } from './types';
/**
 * DO NOT MODIFY THIS FUNCTION. Only for your reference.
 */
export function coreRoutes(app: Hono<{ Bindings: Env }>) {
    // Use this API for conversations. **DO NOT MODIFY**
    app.all('/api/chat/:sessionId/*', async (c) => {
        try {
        const sessionId = c.req.param('sessionId');
        const agent = await getAgentByName<Env, ChatAgent>(c.env.CHAT_AGENT, sessionId); // Get existing agent or create a new one if it doesn't exist, with sessionId as the name
        const url = new URL(c.req.url);
        url.pathname = url.pathname.replace(`/api/chat/${sessionId}`, '');
        return agent.fetch(new Request(url.toString(), {
            method: c.req.method,
            headers: c.req.header(),
            body: c.req.method === 'GET' || c.req.method === 'DELETE' ? undefined : c.req.raw.body
        }));
        } catch (error) {
        console.error('Agent routing error:', error);
        return c.json({
            success: false,
            error: API_RESPONSES.AGENT_ROUTING_FAILED
        }, { status: 500 });
        }
    });
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // CogniCanvas Media Routes
    app.get('/api/media', async (c) => {
        const controller = getAppController(c.env);
        const mediaList = await controller.listMedia();
        return c.json({ success: true, data: mediaList });
    });
    app.get('/api/media/:id/status', async (c) => {
        const { id } = c.req.param();
        const controller = getAppController(c.env);
        const mediaFile = await controller.getMedia(id);
        if (!mediaFile) {
            return c.json({ success: false, error: 'Media not found' }, { status: 404 });
        }
        return c.json({ success: true, data: mediaFile });
    });
    app.post('/api/media/upload', async (c) => {
        const { fileName, contentType } = await c.req.json();
        if (!fileName || !contentType) {
            return c.json({ success: false, error: 'fileName and contentType are required' }, { status: 400 });
        }
        const fileId = crypto.randomUUID();
        const key = `${fileId}-${fileName}`;
        // In a real application, you would use an R2 binding to create a presigned URL.
        // Since we cannot modify bindings, we will simulate this process.
        // This is a placeholder and does not actually interact with R2.
        const simulatedUploadUrl = `/api/placeholder-upload/${key}`;
        const readUrl = `/placeholder-r2/${key}`;
        const response: SignedUrlResponse = {
            uploadUrl: simulatedUploadUrl,
            fileId: fileId,
            readUrl: readUrl,
        };
        return c.json({ success: true, data: response });
    });
    app.post('/api/media', async (c) => {
        try {
            const body = await c.req.json<Omit<MediaFile, 'createdAt'>>();
            const controller = getAppController(c.env);
            const newMedia = await controller.addMedia(body);
            // Trigger AI processing asynchronously
            const agent = await getAgentByName<Env, ChatAgent>(c.env.CHAT_AGENT, `media-analyzer-${newMedia.id}`);
            const analysisRequest = new Request(`http://localhost/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMedia),
            });
            c.executionCtx.waitUntil(agent.fetch(analysisRequest));
            return c.json({ success: true, data: newMedia }, { status: 201 });
        } catch (error) {
            console.error('Failed to create media entry:', error);
            return c.json({ success: false, error: 'Failed to create media entry' }, { status: 500 });
        }
    });
    // Session Management Routes
    app.get('/api/sessions', async (c) => {
        try {
            const controller = getAppController(c.env);
            const sessions = await controller.listSessions();
            return c.json({ success: true, data: sessions });
        } catch (error) {
            console.error('Failed to list sessions:', error);
            return c.json({
                success: false,
                error: 'Failed to retrieve sessions'
            }, { status: 500 });
        }
    });
    app.post('/api/sessions', async (c) => {
        try {
            const body = await c.req.json().catch(() => ({}));
            const { title, sessionId: providedSessionId, firstMessage } = body;
            const sessionId = providedSessionId || crypto.randomUUID();
            let sessionTitle = title || `Chat ${new Date().toLocaleString()}`;
            await registerSession(c.env, sessionId, sessionTitle);
            return c.json({
                success: true,
                data: { sessionId, title: sessionTitle }
            });
        } catch (error) {
            console.error('Failed to create session:', error);
            return c.json({
                success: false,
                error: 'Failed to create session'
            }, { status: 500 });
        }
    });
    app.delete('/api/sessions/:sessionId', async (c) => {
        try {
            const sessionId = c.req.param('sessionId');
            const deleted = await unregisterSession(c.env, sessionId);
            if (!deleted) {
                return c.json({ success: false, error: 'Session not found' }, { status: 404 });
            }
            return c.json({ success: true, data: { deleted: true } });
        } catch (error) {
            console.error('Failed to delete session:', error);
            return c.json({ success: false, error: 'Failed to delete session' }, { status: 500 });
        }
    });
}