// Socket.io room name helpers — keeps naming consistent across server and handlers.

export const ROOMS = {
  user: (userId: string) => `user:${userId}`,
  job: (jobId: string) => `job:${jobId}`,
  tradie: (tradieId: string) => `tradie:${tradieId}`,
  adminLive: () => 'admin:live',
  dispatch: (jobId: string) => `dispatch:${jobId}`,
} as const;
