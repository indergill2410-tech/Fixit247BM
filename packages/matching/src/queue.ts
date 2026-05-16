export interface QueuedJob {
  jobId: string;
  priority: number;          // Higher = dispatched first
  isEmergency: boolean;
  createdAt: Date;
  nextDispatchAt: Date;
  batchNumber: number;
  attempts: number;
}

export class JobDispatchQueue {
  private queue: Map<string, QueuedJob> = new Map();

  enqueue(job: Omit<QueuedJob, 'attempts' | 'batchNumber' | 'nextDispatchAt'>): void {
    this.queue.set(job.jobId, {
      ...job,
      batchNumber: 1,
      attempts: 0,
      nextDispatchAt: new Date(),
    });
  }

  dequeue(): QueuedJob | null {
    const now = new Date();
    let highest: QueuedJob | null = null;

    for (const job of this.queue.values()) {
      if (job.nextDispatchAt > now) continue;
      if (!highest || job.priority > highest.priority) {
        highest = job;
      }
    }

    return highest;
  }

  advance(jobId: string, offerWindowMinutes: number): void {
    const job = this.queue.get(jobId);
    if (!job) return;

    job.batchNumber += 1;
    job.attempts += 1;

    const next = new Date();
    next.setMinutes(next.getMinutes() + offerWindowMinutes);
    job.nextDispatchAt = next;

    this.queue.set(jobId, job);
  }

  remove(jobId: string): void {
    this.queue.delete(jobId);
  }

  size(): number {
    return this.queue.size;
  }

  getPending(): QueuedJob[] {
    const now = new Date();
    return Array.from(this.queue.values()).filter((j) => j.nextDispatchAt <= now);
  }
}
