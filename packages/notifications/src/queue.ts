interface QueueJob {
  id: string;
  fn: () => Promise<void>;
  retries: number;
  maxRetries: number;
  nextAt: number;
}

class NotificationQueue {
  private jobs: QueueJob[] = [];
  private running = false;

  enqueue(fn: () => Promise<void>, maxRetries = 3): void {
    this.jobs.push({ id: Math.random().toString(36).slice(2), fn, retries: 0, maxRetries, nextAt: Date.now() });
    if (!this.running) void this.drain();
  }

  private async drain(): Promise<void> {
    this.running = true;
    while (this.jobs.length > 0) {
      const now = Date.now();
      const job = this.jobs.find((j) => j.nextAt <= now);
      if (!job) { await new Promise((r) => setTimeout(r, 500)); continue; }
      this.jobs = this.jobs.filter((j) => j.id !== job.id);
      try {
        await job.fn();
      } catch (err) {
        if (job.retries < job.maxRetries) {
          job.retries++;
          job.nextAt = Date.now() + Math.pow(2, job.retries) * 1000;
          this.jobs.push(job);
          console.warn(`[notif-queue] retry ${job.retries}/${job.maxRetries}`);
        } else {
          console.error('[notif-queue] job failed permanently', err);
        }
      }
    }
    this.running = false;
  }
}

export const notificationQueue = new NotificationQueue();
