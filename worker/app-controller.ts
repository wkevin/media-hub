import { DurableObject } from 'cloudflare:workers';
import type { SessionInfo, MediaFile } from './types';
import type { Env } from './core-utils';
// 🤖 AI Extension Point: Add session management features
export class AppController extends DurableObject<Env> {
  private sessions = new Map<string, SessionInfo>();
  private media = new Map<string, MediaFile>();
  private loaded = false;
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }
  private async ensureLoaded(): Promise<void> {
    if (!this.loaded) {
      const stored = await this.ctx.storage.get<{
        sessions?: Record<string, SessionInfo>;
        media?: Record<string, MediaFile>;
      }>('state') || {};
      this.sessions = new Map(Object.entries(stored.sessions || {}));
      this.media = new Map(Object.entries(stored.media || {}));
      this.loaded = true;
    }
  }
  private async persist(): Promise<void> {
    await this.ctx.storage.put('state', {
      sessions: Object.fromEntries(this.sessions),
      media: Object.fromEntries(this.media),
    });
  }
  // Session Management
  async addSession(sessionId: string, title?: string): Promise<void> {
    await this.ensureLoaded();
    const now = Date.now();
    this.sessions.set(sessionId, {
      id: sessionId,
      title: title || `Chat ${new Date(now).toLocaleDateString()}`,
      createdAt: now,
      lastActive: now
    });
    await this.persist();
  }
  async removeSession(sessionId: string): Promise<boolean> {
    await this.ensureLoaded();
    const deleted = this.sessions.delete(sessionId);
    if (deleted) await this.persist();
    return deleted;
  }
  async updateSessionActivity(sessionId: string): Promise<void> {
    await this.ensureLoaded();
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActive = Date.now();
      await this.persist();
    }
  }
  async updateSessionTitle(sessionId: string, title: string): Promise<boolean> {
    await this.ensureLoaded();
    const session = this.sessions.get(sessionId);
    if (session) {
      session.title = title;
      await this.persist();
      return true;
    }
    return false;
  }
  async listSessions(): Promise<SessionInfo[]> {
    await this.ensureLoaded();
    return Array.from(this.sessions.values()).sort((a, b) => b.lastActive - a.lastActive);
  }
  // Media File Management
  async addMedia(mediaFile: Omit<MediaFile, 'createdAt'>): Promise<MediaFile> {
    await this.ensureLoaded();
    const newMedia: MediaFile = {
      ...mediaFile,
      createdAt: Date.now(),
    };
    this.media.set(newMedia.id, newMedia);
    await this.persist();
    return newMedia;
  }
  async listMedia(): Promise<MediaFile[]> {
    await this.ensureLoaded();
    return Array.from(this.media.values()).sort((a, b) => b.createdAt - a.createdAt);
  }
  async updateMediaStatus(id: string, status: 'processed' | 'failed', summary?: string, tags?: string[]): Promise<boolean> {
    await this.ensureLoaded();
    const mediaFile = this.media.get(id);
    if (mediaFile) {
      mediaFile.status = status;
      if (summary) mediaFile.summary = summary;
      if (tags) mediaFile.tags = tags;
      this.media.set(id, mediaFile); // Re-set to update the map entry
      await this.persist();
      return true;
    }
    return false;
  }
  async getMedia(id: string): Promise<MediaFile | null> {
    await this.ensureLoaded();
    return this.media.get(id) || null;
  }
}