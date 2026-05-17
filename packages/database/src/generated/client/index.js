
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime
} = require('./runtime/library.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}




  const path = require('path')

/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  emailVerified: 'emailVerified',
  phone: 'phone',
  phoneVerified: 'phoneVerified',
  role: 'role',
  firstName: 'firstName',
  lastName: 'lastName',
  avatarUrl: 'avatarUrl',
  isActive: 'isActive',
  onboardingComplete: 'onboardingComplete',
  lastLoginAt: 'lastLoginAt',
  loginCount: 'loginCount',
  lastIpAddress: 'lastIpAddress',
  deletedAt: 'deletedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SessionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  token: 'token',
  refreshToken: 'refreshToken',
  expiresAt: 'expiresAt',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  deviceType: 'deviceType',
  isActive: 'isActive',
  createdAt: 'createdAt',
  lastUsedAt: 'lastUsedAt'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  action: 'action',
  resource: 'resource',
  resourceId: 'resourceId',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.CustomerProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  suburb: 'suburb',
  postcode: 'postcode',
  state: 'state',
  defaultAddressId: 'defaultAddressId',
  emergencyContactName: 'emergencyContactName',
  emergencyContactPhone: 'emergencyContactPhone',
  notifyBySms: 'notifyBySms',
  notifyByEmail: 'notifyByEmail',
  notifyByPush: 'notifyByPush',
  creditBalance: 'creditBalance',
  jobsPosted: 'jobsPosted',
  totalSpent: 'totalSpent',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TradieProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  businessName: 'businessName',
  abn: 'abn',
  bio: 'bio',
  trades: 'trades',
  yearsExperience: 'yearsExperience',
  hourlyRate: 'hourlyRate',
  calloutFee: 'calloutFee',
  serviceRadiusKm: 'serviceRadiusKm',
  isAvailable: 'isAvailable',
  isEmergencyAvailable: 'isEmergencyAvailable',
  acceptsSameDay: 'acceptsSameDay',
  verificationStatus: 'verificationStatus',
  onboardingStatus: 'onboardingStatus',
  onboardingStep: 'onboardingStep',
  stripeAccountId: 'stripeAccountId',
  stripeOnboardingDone: 'stripeOnboardingDone',
  avgRating: 'avgRating',
  totalReviews: 'totalReviews',
  totalJobsCompleted: 'totalJobsCompleted',
  totalEarnings: 'totalEarnings',
  responseTimeMinutes: 'responseTimeMinutes',
  completionRate: 'completionRate',
  cancellationRate: 'cancellationRate',
  trustScore: 'trustScore',
  trustBadges: 'trustBadges',
  isVisible: 'isVisible',
  isFeatured: 'isFeatured',
  rankScore: 'rankScore',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TradieDocumentScalarFieldEnum = {
  id: 'id',
  tradieId: 'tradieId',
  type: 'type',
  fileName: 'fileName',
  fileUrl: 'fileUrl',
  fileSize: 'fileSize',
  mimeType: 'mimeType',
  status: 'status',
  reviewedBy: 'reviewedBy',
  reviewNotes: 'reviewNotes',
  expiresAt: 'expiresAt',
  uploadedAt: 'uploadedAt',
  verifiedAt: 'verifiedAt'
};

exports.Prisma.TradiePortfolioScalarFieldEnum = {
  id: 'id',
  tradieId: 'tradieId',
  title: 'title',
  description: 'description',
  beforeImageUrl: 'beforeImageUrl',
  afterImageUrl: 'afterImageUrl',
  category: 'category',
  completedAt: 'completedAt',
  createdAt: 'createdAt'
};

exports.Prisma.TradeCategoryConfigScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  icon: 'icon',
  description: 'description',
  emergencyAvailable: 'emergencyAvailable',
  displayOrder: 'displayOrder',
  isActive: 'isActive'
};

exports.Prisma.AvailabilityScalarFieldEnum = {
  id: 'id',
  tradieId: 'tradieId',
  dayOfWeek: 'dayOfWeek',
  startTime: 'startTime',
  endTime: 'endTime',
  isAvailable: 'isAvailable'
};

exports.Prisma.EmergencySettingsScalarFieldEnum = {
  id: 'id',
  tradieId: 'tradieId',
  isAvailable: 'isAvailable',
  maxRadius: 'maxRadius',
  responseTimeMinutes: 'responseTimeMinutes',
  surchargePercent: 'surchargePercent',
  autoAccept: 'autoAccept',
  updatedAt: 'updatedAt'
};

exports.Prisma.AddressScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  customerProfileId: 'customerProfileId',
  label: 'label',
  street: 'street',
  suburb: 'suburb',
  city: 'city',
  state: 'state',
  postcode: 'postcode',
  country: 'country',
  latitude: 'latitude',
  longitude: 'longitude',
  isDefault: 'isDefault',
  deletedAt: 'deletedAt',
  createdAt: 'createdAt'
};

exports.Prisma.SavedTradieScalarFieldEnum = {
  id: 'id',
  customerId: 'customerId',
  tradieId: 'tradieId',
  createdAt: 'createdAt'
};

exports.Prisma.JobScalarFieldEnum = {
  id: 'id',
  customerId: 'customerId',
  tradieId: 'tradieId',
  addressId: 'addressId',
  title: 'title',
  description: 'description',
  category: 'category',
  status: 'status',
  priority: 'priority',
  isEmergency: 'isEmergency',
  scheduledFor: 'scheduledFor',
  estimatedHours: 'estimatedHours',
  agreedPrice: 'agreedPrice',
  finalPrice: 'finalPrice',
  platformFee: 'platformFee',
  tradieEarnings: 'tradieEarnings',
  aiMatchScore: 'aiMatchScore',
  aiSuggestedTradies: 'aiSuggestedTradies',
  claimedAt: 'claimedAt',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  cancelledAt: 'cancelledAt',
  cancelReason: 'cancelReason',
  budgetMin: 'budgetMin',
  budgetMax: 'budgetMax',
  complexity: 'complexity',
  mediaUrls: 'mediaUrls',
  voiceNoteUrl: 'voiceNoteUrl',
  preferredTime: 'preferredTime',
  leadPrice: 'leadPrice',
  matchingBatchNo: 'matchingBatchNo',
  aiProcessedAt: 'aiProcessedAt',
  offerExpiresAt: 'offerExpiresAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.JobClaimScalarFieldEnum = {
  id: 'id',
  jobId: 'jobId',
  tradieId: 'tradieId',
  message: 'message',
  quotedPrice: 'quotedPrice',
  estimatedHours: 'estimatedHours',
  isAccepted: 'isAccepted',
  acceptedAt: 'acceptedAt',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt'
};

exports.Prisma.JobStatusHistoryScalarFieldEnum = {
  id: 'id',
  jobId: 'jobId',
  fromStatus: 'fromStatus',
  toStatus: 'toStatus',
  note: 'note',
  changedBy: 'changedBy',
  createdAt: 'createdAt'
};

exports.Prisma.JobImageScalarFieldEnum = {
  id: 'id',
  jobId: 'jobId',
  url: 'url',
  type: 'type',
  uploadedBy: 'uploadedBy',
  createdAt: 'createdAt'
};

exports.Prisma.ReviewScalarFieldEnum = {
  id: 'id',
  jobId: 'jobId',
  reviewerId: 'reviewerId',
  revieweeId: 'revieweeId',
  rating: 'rating',
  title: 'title',
  body: 'body',
  isPublic: 'isPublic',
  responseText: 'responseText',
  respondedAt: 'respondedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MessageScalarFieldEnum = {
  id: 'id',
  jobId: 'jobId',
  senderId: 'senderId',
  receiverId: 'receiverId',
  content: 'content',
  type: 'type',
  status: 'status',
  mediaUrl: 'mediaUrl',
  mediaType: 'mediaType',
  isSystem: 'isSystem',
  deletedAt: 'deletedAt',
  deliveredAt: 'deliveredAt',
  readAt: 'readAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  jobId: 'jobId',
  type: 'type',
  title: 'title',
  body: 'body',
  data: 'data',
  status: 'status',
  channel: 'channel',
  readAt: 'readAt',
  sentAt: 'sentAt',
  failedAt: 'failedAt',
  retryCount: 'retryCount',
  createdAt: 'createdAt'
};

exports.Prisma.PaymentScalarFieldEnum = {
  id: 'id',
  jobId: 'jobId',
  customerId: 'customerId',
  tradieId: 'tradieId',
  amount: 'amount',
  platformFee: 'platformFee',
  tradieAmount: 'tradieAmount',
  currency: 'currency',
  status: 'status',
  stripePaymentIntentId: 'stripePaymentIntentId',
  stripeTransferId: 'stripeTransferId',
  stripeCustomerId: 'stripeCustomerId',
  paidAt: 'paidAt',
  releasedAt: 'releasedAt',
  refundedAt: 'refundedAt',
  refundAmount: 'refundAmount',
  refundReason: 'refundReason',
  disputeId: 'disputeId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SubscriptionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  tier: 'tier',
  status: 'status',
  stripeSubscriptionId: 'stripeSubscriptionId',
  stripePriceId: 'stripePriceId',
  currentPeriodStart: 'currentPeriodStart',
  currentPeriodEnd: 'currentPeriodEnd',
  cancelAtPeriodEnd: 'cancelAtPeriodEnd',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CreditsWalletScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  balance: 'balance',
  lifetimeEarned: 'lifetimeEarned',
  lifetimeSpent: 'lifetimeSpent',
  updatedAt: 'updatedAt'
};

exports.Prisma.TransactionScalarFieldEnum = {
  id: 'id',
  walletId: 'walletId',
  type: 'type',
  amount: 'amount',
  balanceAfter: 'balanceAfter',
  description: 'description',
  referenceId: 'referenceId',
  referenceType: 'referenceType',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.LicenceScalarFieldEnum = {
  id: 'id',
  tradieId: 'tradieId',
  licenceType: 'licenceType',
  licenceNumber: 'licenceNumber',
  state: 'state',
  expiresAt: 'expiresAt',
  documentUrl: 'documentUrl',
  status: 'status',
  verifiedAt: 'verifiedAt',
  createdAt: 'createdAt'
};

exports.Prisma.InsuranceScalarFieldEnum = {
  id: 'id',
  tradieId: 'tradieId',
  insurer: 'insurer',
  policyNumber: 'policyNumber',
  coverType: 'coverType',
  coverAmount: 'coverAmount',
  expiresAt: 'expiresAt',
  documentUrl: 'documentUrl',
  status: 'status',
  verifiedAt: 'verifiedAt',
  createdAt: 'createdAt'
};

exports.Prisma.CertificationScalarFieldEnum = {
  id: 'id',
  tradieId: 'tradieId',
  name: 'name',
  issuedBy: 'issuedBy',
  issuedAt: 'issuedAt',
  expiresAt: 'expiresAt',
  documentUrl: 'documentUrl',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.JobMatchingQueueScalarFieldEnum = {
  id: 'id',
  jobId: 'jobId',
  tradieId: 'tradieId',
  batchNumber: 'batchNumber',
  matchScore: 'matchScore',
  distanceKm: 'distanceKm',
  status: 'status',
  sentAt: 'sentAt',
  respondedAt: 'respondedAt',
  expiresAt: 'expiresAt',
  declineReason: 'declineReason',
  createdAt: 'createdAt'
};

exports.Prisma.JobEventScalarFieldEnum = {
  id: 'id',
  jobId: 'jobId',
  type: 'type',
  actorId: 'actorId',
  actorRole: 'actorRole',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.TradieRealtimeStatusScalarFieldEnum = {
  id: 'id',
  tradieId: 'tradieId',
  onlineStatus: 'onlineStatus',
  lastHeartbeatAt: 'lastHeartbeatAt',
  currentJobId: 'currentJobId',
  activeJobCount: 'activeJobCount',
  travelRadiusKm: 'travelRadiusKm',
  currentLatitude: 'currentLatitude',
  currentLongitude: 'currentLongitude',
  isAutoAccept: 'isAutoAccept',
  updatedAt: 'updatedAt'
};

exports.Prisma.AIJobInsightScalarFieldEnum = {
  id: 'id',
  jobId: 'jobId',
  rawInput: 'rawInput',
  extractedCategory: 'extractedCategory',
  complexity: 'complexity',
  urgencyScore: 'urgencyScore',
  confidenceScore: 'confidenceScore',
  isEmergencyDetected: 'isEmergencyDetected',
  emergencyIndicators: 'emergencyIndicators',
  suggestedTitle: 'suggestedTitle',
  professionalSummary: 'professionalSummary',
  suggestedMaterials: 'suggestedMaterials',
  estimatedPriceMin: 'estimatedPriceMin',
  estimatedPriceMax: 'estimatedPriceMax',
  leadPrice: 'leadPrice',
  suggestedTrades: 'suggestedTrades',
  imageAnalysis: 'imageAnalysis',
  voiceTranscript: 'voiceTranscript',
  modelUsed: 'modelUsed',
  processingMs: 'processingMs',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PayoutScalarFieldEnum = {
  id: 'id',
  tradieId: 'tradieId',
  jobId: 'jobId',
  amount: 'amount',
  currency: 'currency',
  status: 'status',
  stripeTransferId: 'stripeTransferId',
  stripePayoutId: 'stripePayoutId',
  scheduledFor: 'scheduledFor',
  processedAt: 'processedAt',
  failureReason: 'failureReason',
  isHeld: 'isHeld',
  heldReason: 'heldReason',
  heldBy: 'heldBy',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CreditPackageScalarFieldEnum = {
  id: 'id',
  name: 'name',
  credits: 'credits',
  priceAud: 'priceAud',
  bonusCredits: 'bonusCredits',
  stripePriceId: 'stripePriceId',
  isActive: 'isActive',
  isPopular: 'isPopular',
  displayOrder: 'displayOrder',
  createdAt: 'createdAt'
};

exports.Prisma.CreditLedgerScalarFieldEnum = {
  id: 'id',
  tradieId: 'tradieId',
  type: 'type',
  credits: 'credits',
  balanceAfter: 'balanceAfter',
  jobId: 'jobId',
  packageId: 'packageId',
  referenceId: 'referenceId',
  description: 'description',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.PlatformConfigScalarFieldEnum = {
  id: 'id',
  key: 'key',
  value: 'value',
  category: 'category',
  updatedBy: 'updatedBy',
  updatedAt: 'updatedAt'
};

exports.Prisma.SurgePricingRuleScalarFieldEnum = {
  id: 'id',
  name: 'name',
  factor: 'factor',
  multiplier: 'multiplier',
  startHour: 'startHour',
  endHour: 'endHour',
  daysOfWeek: 'daysOfWeek',
  tradeCategories: 'tradeCategories',
  isActive: 'isActive',
  priority: 'priority',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NotificationPreferenceScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  emailEnabled: 'emailEnabled',
  pushEnabled: 'pushEnabled',
  smsEnabled: 'smsEnabled',
  quietHoursEnabled: 'quietHoursEnabled',
  quietHoursStart: 'quietHoursStart',
  quietHoursEnd: 'quietHoursEnd',
  disabledTypes: 'disabledTypes',
  updatedAt: 'updatedAt'
};

exports.Prisma.LocationTrackingScalarFieldEnum = {
  id: 'id',
  tradieId: 'tradieId',
  jobId: 'jobId',
  latitude: 'latitude',
  longitude: 'longitude',
  accuracy: 'accuracy',
  heading: 'heading',
  speed: 'speed',
  createdAt: 'createdAt'
};

exports.Prisma.TrustScoreHistoryScalarFieldEnum = {
  id: 'id',
  tradieId: 'tradieId',
  score: 'score',
  previousScore: 'previousScore',
  reason: 'reason',
  jobId: 'jobId',
  adminId: 'adminId',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.FraudFlagScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  severity: 'severity',
  riskScore: 'riskScore',
  status: 'status',
  title: 'title',
  description: 'description',
  evidence: 'evidence',
  jobId: 'jobId',
  reviewedBy: 'reviewedBy',
  reviewedAt: 'reviewedAt',
  resolvedAt: 'resolvedAt',
  autoDetected: 'autoDetected',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DisputeScalarFieldEnum = {
  id: 'id',
  jobId: 'jobId',
  customerId: 'customerId',
  tradieId: 'tradieId',
  reason: 'reason',
  status: 'status',
  title: 'title',
  description: 'description',
  evidenceUrls: 'evidenceUrls',
  adminNotes: 'adminNotes',
  resolution: 'resolution',
  refundAmount: 'refundAmount',
  assignedTo: 'assignedTo',
  resolvedBy: 'resolvedBy',
  resolvedAt: 'resolvedAt',
  dueBy: 'dueBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ModerationActionScalarFieldEnum = {
  id: 'id',
  adminId: 'adminId',
  targetUserId: 'targetUserId',
  actionType: 'actionType',
  reason: 'reason',
  metadata: 'metadata',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt'
};

exports.Prisma.AdminAuditLogScalarFieldEnum = {
  id: 'id',
  adminId: 'adminId',
  action: 'action',
  entity: 'entity',
  entityId: 'entityId',
  metadata: 'metadata',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  createdAt: 'createdAt'
};

exports.Prisma.SupportTicketScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  jobId: 'jobId',
  subject: 'subject',
  description: 'description',
  status: 'status',
  priority: 'priority',
  category: 'category',
  assignedTo: 'assignedTo',
  resolvedAt: 'resolvedAt',
  closedAt: 'closedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SupportMessageScalarFieldEnum = {
  id: 'id',
  ticketId: 'ticketId',
  senderId: 'senderId',
  isAdmin: 'isAdmin',
  content: 'content',
  createdAt: 'createdAt'
};

exports.Prisma.PlatformAlertScalarFieldEnum = {
  id: 'id',
  type: 'type',
  severity: 'severity',
  title: 'title',
  message: 'message',
  data: 'data',
  status: 'status',
  dismissedBy: 'dismissedBy',
  dismissedAt: 'dismissedAt',
  createdAt: 'createdAt'
};

exports.Prisma.ReferralScalarFieldEnum = {
  id: 'id',
  inviterId: 'inviterId',
  invitedEmail: 'invitedEmail',
  invitedUserId: 'invitedUserId',
  code: 'code',
  rewardType: 'rewardType',
  rewardValue: 'rewardValue',
  status: 'status',
  completedAt: 'completedAt',
  rewardedAt: 'rewardedAt',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SEOPageScalarFieldEnum = {
  id: 'id',
  slug: 'slug',
  pageType: 'pageType',
  title: 'title',
  metaDescription: 'metaDescription',
  h1: 'h1',
  suburb: 'suburb',
  state: 'state',
  tradeCategory: 'tradeCategory',
  isEmergency: 'isEmergency',
  content: 'content',
  faqContent: 'faqContent',
  schemaMarkup: 'schemaMarkup',
  canonicalUrl: 'canonicalUrl',
  publishedAt: 'publishedAt',
  lastGeneratedAt: 'lastGeneratedAt',
  viewCount: 'viewCount',
  indexable: 'indexable',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.GrowthEventScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  sessionId: 'sessionId',
  eventType: 'eventType',
  page: 'page',
  referrer: 'referrer',
  suburb: 'suburb',
  metadata: 'metadata',
  ipHash: 'ipHash',
  userAgent: 'userAgent',
  createdAt: 'createdAt'
};

exports.Prisma.SuburbMetricsScalarFieldEnum = {
  id: 'id',
  suburb: 'suburb',
  state: 'state',
  postcode: 'postcode',
  latitude: 'latitude',
  longitude: 'longitude',
  demandScore: 'demandScore',
  supplyScore: 'supplyScore',
  conversionRate: 'conversionRate',
  avgResponseTime: 'avgResponseTime',
  jobCount30d: 'jobCount30d',
  tradieCount: 'tradieCount',
  isUnderserved: 'isUnderserved',
  expansionPriority: 'expansionPriority',
  lastCalculatedAt: 'lastCalculatedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MarketingCampaignScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  status: 'status',
  targetAudience: 'targetAudience',
  content: 'content',
  scheduledAt: 'scheduledAt',
  sentAt: 'sentAt',
  recipientCount: 'recipientCount',
  openCount: 'openCount',
  clickCount: 'clickCount',
  conversionCount: 'conversionCount',
  revenueGenerated: 'revenueGenerated',
  costSpent: 'costSpent',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ReviewRequestScalarFieldEnum = {
  id: 'id',
  jobId: 'jobId',
  customerId: 'customerId',
  tradieId: 'tradieId',
  status: 'status',
  sentAt: 'sentAt',
  reviewedAt: 'reviewedAt',
  reminderSentAt: 'reminderSentAt',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt'
};

exports.Prisma.ReferralProgramScalarFieldEnum = {
  id: 'id',
  name: 'name',
  targetRole: 'targetRole',
  rewardType: 'rewardType',
  rewardValue: 'rewardValue',
  inviterRewardType: 'inviterRewardType',
  inviterRewardValue: 'inviterRewardValue',
  isActive: 'isActive',
  maxRewardsPerUser: 'maxRewardsPerUser',
  expiryDays: 'expiryDays',
  conditions: 'conditions',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VoiceCallScalarFieldEnum = {
  id: 'id',
  twilioCallSid: 'twilioCallSid',
  customerId: 'customerId',
  phoneNumber: 'phoneNumber',
  direction: 'direction',
  status: 'status',
  duration: 'duration',
  recordingUrl: 'recordingUrl',
  transcript: 'transcript',
  urgencyScore: 'urgencyScore',
  aiConfidence: 'aiConfidence',
  jobId: 'jobId',
  assignedAgentId: 'assignedAgentId',
  startedAt: 'startedAt',
  answeredAt: 'answeredAt',
  endedAt: 'endedAt',
  metadata: 'metadata'
};

exports.Prisma.VoiceEventScalarFieldEnum = {
  id: 'id',
  callId: 'callId',
  eventType: 'eventType',
  payload: 'payload',
  confidence: 'confidence',
  createdAt: 'createdAt'
};

exports.Prisma.EmergencyAssessmentScalarFieldEnum = {
  id: 'id',
  jobId: 'jobId',
  callId: 'callId',
  riskLevel: 'riskLevel',
  emergencyScore: 'emergencyScore',
  detectedKeywords: 'detectedKeywords',
  tradeCategory: 'tradeCategory',
  recommendedAction: 'recommendedAction',
  safetyInstructions: 'safetyInstructions',
  autoDispatch: 'autoDispatch',
  adminAlerted: 'adminAlerted',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AIConversationScalarFieldEnum = {
  id: 'id',
  jobId: 'jobId',
  callId: 'callId',
  sessionId: 'sessionId',
  status: 'status',
  messages: 'messages',
  extractedEntities: 'extractedEntities',
  aiSummary: 'aiSummary',
  tradeCategory: 'tradeCategory',
  urgencyScore: 'urgencyScore',
  isEmergency: 'isEmergency',
  jobData: 'jobData',
  turnCount: 'turnCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.UserOrderByRelevanceFieldEnum = {
  id: 'id',
  email: 'email',
  phone: 'phone',
  firstName: 'firstName',
  lastName: 'lastName',
  avatarUrl: 'avatarUrl',
  lastIpAddress: 'lastIpAddress'
};

exports.Prisma.SessionOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  token: 'token',
  refreshToken: 'refreshToken',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  deviceType: 'deviceType'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.AuditLogOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  resource: 'resource',
  resourceId: 'resourceId',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent'
};

exports.Prisma.CustomerProfileOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  suburb: 'suburb',
  postcode: 'postcode',
  state: 'state',
  defaultAddressId: 'defaultAddressId',
  emergencyContactName: 'emergencyContactName',
  emergencyContactPhone: 'emergencyContactPhone'
};

exports.Prisma.TradieProfileOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  businessName: 'businessName',
  abn: 'abn',
  bio: 'bio',
  stripeAccountId: 'stripeAccountId'
};

exports.Prisma.TradieDocumentOrderByRelevanceFieldEnum = {
  id: 'id',
  tradieId: 'tradieId',
  type: 'type',
  fileName: 'fileName',
  fileUrl: 'fileUrl',
  mimeType: 'mimeType',
  reviewedBy: 'reviewedBy',
  reviewNotes: 'reviewNotes'
};

exports.Prisma.TradiePortfolioOrderByRelevanceFieldEnum = {
  id: 'id',
  tradieId: 'tradieId',
  title: 'title',
  description: 'description',
  beforeImageUrl: 'beforeImageUrl',
  afterImageUrl: 'afterImageUrl'
};

exports.Prisma.TradeCategoryConfigOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  icon: 'icon',
  description: 'description'
};

exports.Prisma.AvailabilityOrderByRelevanceFieldEnum = {
  id: 'id',
  tradieId: 'tradieId',
  startTime: 'startTime',
  endTime: 'endTime'
};

exports.Prisma.EmergencySettingsOrderByRelevanceFieldEnum = {
  id: 'id',
  tradieId: 'tradieId'
};

exports.Prisma.AddressOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  customerProfileId: 'customerProfileId',
  label: 'label',
  street: 'street',
  suburb: 'suburb',
  city: 'city',
  state: 'state',
  postcode: 'postcode',
  country: 'country'
};

exports.Prisma.SavedTradieOrderByRelevanceFieldEnum = {
  id: 'id',
  customerId: 'customerId',
  tradieId: 'tradieId'
};

exports.Prisma.JobOrderByRelevanceFieldEnum = {
  id: 'id',
  customerId: 'customerId',
  tradieId: 'tradieId',
  addressId: 'addressId',
  title: 'title',
  description: 'description',
  aiSuggestedTradies: 'aiSuggestedTradies',
  cancelReason: 'cancelReason',
  mediaUrls: 'mediaUrls',
  voiceNoteUrl: 'voiceNoteUrl',
  preferredTime: 'preferredTime'
};

exports.Prisma.JobClaimOrderByRelevanceFieldEnum = {
  id: 'id',
  jobId: 'jobId',
  tradieId: 'tradieId',
  message: 'message'
};

exports.Prisma.JobStatusHistoryOrderByRelevanceFieldEnum = {
  id: 'id',
  jobId: 'jobId',
  note: 'note',
  changedBy: 'changedBy'
};

exports.Prisma.JobImageOrderByRelevanceFieldEnum = {
  id: 'id',
  jobId: 'jobId',
  url: 'url',
  type: 'type',
  uploadedBy: 'uploadedBy'
};

exports.Prisma.ReviewOrderByRelevanceFieldEnum = {
  id: 'id',
  jobId: 'jobId',
  reviewerId: 'reviewerId',
  revieweeId: 'revieweeId',
  title: 'title',
  body: 'body',
  responseText: 'responseText'
};

exports.Prisma.MessageOrderByRelevanceFieldEnum = {
  id: 'id',
  jobId: 'jobId',
  senderId: 'senderId',
  receiverId: 'receiverId',
  content: 'content',
  mediaUrl: 'mediaUrl',
  mediaType: 'mediaType'
};

exports.Prisma.NotificationOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  jobId: 'jobId',
  title: 'title',
  body: 'body'
};

exports.Prisma.PaymentOrderByRelevanceFieldEnum = {
  id: 'id',
  jobId: 'jobId',
  customerId: 'customerId',
  tradieId: 'tradieId',
  currency: 'currency',
  stripePaymentIntentId: 'stripePaymentIntentId',
  stripeTransferId: 'stripeTransferId',
  stripeCustomerId: 'stripeCustomerId',
  refundReason: 'refundReason',
  disputeId: 'disputeId'
};

exports.Prisma.SubscriptionOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  stripeSubscriptionId: 'stripeSubscriptionId',
  stripePriceId: 'stripePriceId'
};

exports.Prisma.CreditsWalletOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId'
};

exports.Prisma.TransactionOrderByRelevanceFieldEnum = {
  id: 'id',
  walletId: 'walletId',
  description: 'description',
  referenceId: 'referenceId',
  referenceType: 'referenceType'
};

exports.Prisma.LicenceOrderByRelevanceFieldEnum = {
  id: 'id',
  tradieId: 'tradieId',
  licenceType: 'licenceType',
  licenceNumber: 'licenceNumber',
  state: 'state',
  documentUrl: 'documentUrl'
};

exports.Prisma.InsuranceOrderByRelevanceFieldEnum = {
  id: 'id',
  tradieId: 'tradieId',
  insurer: 'insurer',
  policyNumber: 'policyNumber',
  coverType: 'coverType',
  documentUrl: 'documentUrl'
};

exports.Prisma.CertificationOrderByRelevanceFieldEnum = {
  id: 'id',
  tradieId: 'tradieId',
  name: 'name',
  issuedBy: 'issuedBy',
  documentUrl: 'documentUrl'
};

exports.Prisma.JobMatchingQueueOrderByRelevanceFieldEnum = {
  id: 'id',
  jobId: 'jobId',
  tradieId: 'tradieId',
  declineReason: 'declineReason'
};

exports.Prisma.JobEventOrderByRelevanceFieldEnum = {
  id: 'id',
  jobId: 'jobId',
  actorId: 'actorId'
};

exports.Prisma.TradieRealtimeStatusOrderByRelevanceFieldEnum = {
  id: 'id',
  tradieId: 'tradieId',
  currentJobId: 'currentJobId'
};

exports.Prisma.AIJobInsightOrderByRelevanceFieldEnum = {
  id: 'id',
  jobId: 'jobId',
  rawInput: 'rawInput',
  emergencyIndicators: 'emergencyIndicators',
  suggestedTitle: 'suggestedTitle',
  professionalSummary: 'professionalSummary',
  suggestedMaterials: 'suggestedMaterials',
  suggestedTrades: 'suggestedTrades',
  voiceTranscript: 'voiceTranscript',
  modelUsed: 'modelUsed'
};

exports.Prisma.PayoutOrderByRelevanceFieldEnum = {
  id: 'id',
  tradieId: 'tradieId',
  jobId: 'jobId',
  currency: 'currency',
  stripeTransferId: 'stripeTransferId',
  stripePayoutId: 'stripePayoutId',
  failureReason: 'failureReason',
  heldReason: 'heldReason',
  heldBy: 'heldBy'
};

exports.Prisma.CreditPackageOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  stripePriceId: 'stripePriceId'
};

exports.Prisma.CreditLedgerOrderByRelevanceFieldEnum = {
  id: 'id',
  tradieId: 'tradieId',
  jobId: 'jobId',
  packageId: 'packageId',
  referenceId: 'referenceId',
  description: 'description'
};

exports.Prisma.PlatformConfigOrderByRelevanceFieldEnum = {
  id: 'id',
  key: 'key',
  value: 'value',
  category: 'category',
  updatedBy: 'updatedBy'
};

exports.Prisma.SurgePricingRuleOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  tradeCategories: 'tradeCategories'
};

exports.Prisma.NotificationPreferenceOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  disabledTypes: 'disabledTypes'
};

exports.Prisma.LocationTrackingOrderByRelevanceFieldEnum = {
  id: 'id',
  tradieId: 'tradieId',
  jobId: 'jobId'
};

exports.Prisma.TrustScoreHistoryOrderByRelevanceFieldEnum = {
  id: 'id',
  tradieId: 'tradieId',
  reason: 'reason',
  jobId: 'jobId',
  adminId: 'adminId'
};

exports.Prisma.FraudFlagOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  title: 'title',
  description: 'description',
  jobId: 'jobId',
  reviewedBy: 'reviewedBy'
};

exports.Prisma.DisputeOrderByRelevanceFieldEnum = {
  id: 'id',
  jobId: 'jobId',
  customerId: 'customerId',
  tradieId: 'tradieId',
  title: 'title',
  description: 'description',
  evidenceUrls: 'evidenceUrls',
  adminNotes: 'adminNotes',
  resolution: 'resolution',
  assignedTo: 'assignedTo',
  resolvedBy: 'resolvedBy'
};

exports.Prisma.ModerationActionOrderByRelevanceFieldEnum = {
  id: 'id',
  adminId: 'adminId',
  targetUserId: 'targetUserId',
  reason: 'reason'
};

exports.Prisma.AdminAuditLogOrderByRelevanceFieldEnum = {
  id: 'id',
  adminId: 'adminId',
  action: 'action',
  entity: 'entity',
  entityId: 'entityId',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent'
};

exports.Prisma.SupportTicketOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  jobId: 'jobId',
  subject: 'subject',
  description: 'description',
  assignedTo: 'assignedTo'
};

exports.Prisma.SupportMessageOrderByRelevanceFieldEnum = {
  id: 'id',
  ticketId: 'ticketId',
  senderId: 'senderId',
  content: 'content'
};

exports.Prisma.PlatformAlertOrderByRelevanceFieldEnum = {
  id: 'id',
  title: 'title',
  message: 'message',
  dismissedBy: 'dismissedBy'
};

exports.Prisma.ReferralOrderByRelevanceFieldEnum = {
  id: 'id',
  inviterId: 'inviterId',
  invitedEmail: 'invitedEmail',
  invitedUserId: 'invitedUserId',
  code: 'code'
};

exports.Prisma.SEOPageOrderByRelevanceFieldEnum = {
  id: 'id',
  slug: 'slug',
  title: 'title',
  metaDescription: 'metaDescription',
  h1: 'h1',
  suburb: 'suburb',
  state: 'state',
  tradeCategory: 'tradeCategory',
  canonicalUrl: 'canonicalUrl'
};

exports.Prisma.GrowthEventOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  sessionId: 'sessionId',
  page: 'page',
  referrer: 'referrer',
  suburb: 'suburb',
  ipHash: 'ipHash',
  userAgent: 'userAgent'
};

exports.Prisma.SuburbMetricsOrderByRelevanceFieldEnum = {
  id: 'id',
  suburb: 'suburb',
  state: 'state',
  postcode: 'postcode'
};

exports.Prisma.MarketingCampaignOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name'
};

exports.Prisma.ReviewRequestOrderByRelevanceFieldEnum = {
  id: 'id',
  jobId: 'jobId',
  customerId: 'customerId',
  tradieId: 'tradieId'
};

exports.Prisma.ReferralProgramOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name'
};

exports.Prisma.VoiceCallOrderByRelevanceFieldEnum = {
  id: 'id',
  twilioCallSid: 'twilioCallSid',
  customerId: 'customerId',
  phoneNumber: 'phoneNumber',
  recordingUrl: 'recordingUrl',
  transcript: 'transcript',
  jobId: 'jobId',
  assignedAgentId: 'assignedAgentId'
};

exports.Prisma.VoiceEventOrderByRelevanceFieldEnum = {
  id: 'id',
  callId: 'callId'
};

exports.Prisma.EmergencyAssessmentOrderByRelevanceFieldEnum = {
  id: 'id',
  jobId: 'jobId',
  callId: 'callId',
  detectedKeywords: 'detectedKeywords',
  tradeCategory: 'tradeCategory',
  recommendedAction: 'recommendedAction',
  safetyInstructions: 'safetyInstructions'
};

exports.Prisma.AIConversationOrderByRelevanceFieldEnum = {
  id: 'id',
  jobId: 'jobId',
  callId: 'callId',
  sessionId: 'sessionId',
  aiSummary: 'aiSummary',
  tradeCategory: 'tradeCategory'
};
exports.Role = exports.$Enums.Role = {
  CUSTOMER: 'CUSTOMER',
  TRADIE: 'TRADIE',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN'
};

exports.AuditAction = exports.$Enums.AuditAction = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  REGISTER: 'REGISTER',
  PASSWORD_RESET: 'PASSWORD_RESET',
  EMAIL_VERIFIED: 'EMAIL_VERIFIED',
  ROLE_CHANGED: 'ROLE_CHANGED',
  PROFILE_UPDATED: 'PROFILE_UPDATED',
  DOCUMENT_UPLOADED: 'DOCUMENT_UPLOADED',
  VERIFICATION_APPROVED: 'VERIFICATION_APPROVED',
  VERIFICATION_REJECTED: 'VERIFICATION_REJECTED',
  PAYMENT_INITIATED: 'PAYMENT_INITIATED',
  PAYMENT_RELEASED: 'PAYMENT_RELEASED',
  JOB_CREATED: 'JOB_CREATED',
  JOB_CLAIMED: 'JOB_CLAIMED',
  JOB_COMPLETED: 'JOB_COMPLETED',
  DISPUTE_OPENED: 'DISPUTE_OPENED',
  DISPUTE_RESOLVED: 'DISPUTE_RESOLVED',
  ACCOUNT_SUSPENDED: 'ACCOUNT_SUSPENDED',
  ACCOUNT_REINSTATED: 'ACCOUNT_REINSTATED'
};

exports.VerificationStatus = exports.$Enums.VerificationStatus = {
  UNVERIFIED: 'UNVERIFIED',
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
  SUSPENDED: 'SUSPENDED'
};

exports.OnboardingStatus = exports.$Enums.OnboardingStatus = {
  INCOMPLETE: 'INCOMPLETE',
  PENDING_REVIEW: 'PENDING_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

exports.TradeCategory = exports.$Enums.TradeCategory = {
  PLUMBING: 'PLUMBING',
  ELECTRICAL: 'ELECTRICAL',
  HVAC: 'HVAC',
  CARPENTRY: 'CARPENTRY',
  PAINTING: 'PAINTING',
  ROOFING: 'ROOFING',
  TILING: 'TILING',
  PEST_CONTROL: 'PEST_CONTROL',
  LOCKSMITH: 'LOCKSMITH',
  GLAZING: 'GLAZING',
  PLASTERING: 'PLASTERING',
  LANDSCAPING: 'LANDSCAPING',
  CLEANING: 'CLEANING',
  APPLIANCE_REPAIR: 'APPLIANCE_REPAIR',
  GENERAL_MAINTENANCE: 'GENERAL_MAINTENANCE',
  OTHER: 'OTHER'
};

exports.TradeBadge = exports.$Enums.TradeBadge = {
  VERIFIED: 'VERIFIED',
  PREMIUM: 'PREMIUM',
  ELITE: 'ELITE',
  EMERGENCY_SPECIALIST: 'EMERGENCY_SPECIALIST',
  TOP_RATED: 'TOP_RATED'
};

exports.JobStatus = exports.$Enums.JobStatus = {
  DRAFT: 'DRAFT',
  OPEN: 'OPEN',
  CLAIMED: 'CLAIMED',
  IN_PROGRESS: 'IN_PROGRESS',
  PENDING_REVIEW: 'PENDING_REVIEW',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  DISPUTED: 'DISPUTED'
};

exports.JobPriority = exports.$Enums.JobPriority = {
  STANDARD: 'STANDARD',
  URGENT: 'URGENT',
  EMERGENCY: 'EMERGENCY'
};

exports.JobComplexity = exports.$Enums.JobComplexity = {
  SIMPLE: 'SIMPLE',
  MEDIUM: 'MEDIUM',
  COMPLEX: 'COMPLEX'
};

exports.MessageType = exports.$Enums.MessageType = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  FILE: 'FILE',
  SYSTEM: 'SYSTEM',
  STATUS_UPDATE: 'STATUS_UPDATE',
  VOICE: 'VOICE'
};

exports.MessageStatus = exports.$Enums.MessageStatus = {
  SENT: 'SENT',
  DELIVERED: 'DELIVERED',
  READ: 'READ',
  FAILED: 'FAILED'
};

exports.NotificationType = exports.$Enums.NotificationType = {
  JOB_CREATED: 'JOB_CREATED',
  JOB_ASSIGNED: 'JOB_ASSIGNED',
  JOB_ACCEPTED: 'JOB_ACCEPTED',
  JOB_DECLINED: 'JOB_DECLINED',
  TRADIE_EN_ROUTE: 'TRADIE_EN_ROUTE',
  TRADIE_ARRIVED: 'TRADIE_ARRIVED',
  JOB_STARTED: 'JOB_STARTED',
  JOB_COMPLETED: 'JOB_COMPLETED',
  PAYMENT_HELD: 'PAYMENT_HELD',
  PAYMENT_RELEASED: 'PAYMENT_RELEASED',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  DISPUTE_OPENED: 'DISPUTE_OPENED',
  DISPUTE_RESOLVED: 'DISPUTE_RESOLVED',
  NEW_MESSAGE: 'NEW_MESSAGE',
  CREDIT_LOW: 'CREDIT_LOW',
  SUBSCRIPTION_RENEWED: 'SUBSCRIPTION_RENEWED',
  VERIFICATION_APPROVED: 'VERIFICATION_APPROVED',
  VERIFICATION_REJECTED: 'VERIFICATION_REJECTED',
  SYSTEM_ALERT: 'SYSTEM_ALERT'
};

exports.NotifStatus = exports.$Enums.NotifStatus = {
  PENDING: 'PENDING',
  SENT: 'SENT',
  FAILED: 'FAILED',
  READ: 'READ'
};

exports.NotifChannel = exports.$Enums.NotifChannel = {
  IN_APP: 'IN_APP',
  EMAIL: 'EMAIL',
  PUSH: 'PUSH',
  SMS: 'SMS'
};

exports.PaymentStatus = exports.$Enums.PaymentStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  HELD_IN_ESCROW: 'HELD_IN_ESCROW',
  RELEASED: 'RELEASED',
  REFUNDED: 'REFUNDED',
  DISPUTED: 'DISPUTED',
  FAILED: 'FAILED'
};

exports.SubscriptionTier = exports.$Enums.SubscriptionTier = {
  FREE: 'FREE',
  BASIC: 'BASIC',
  PROFESSIONAL: 'PROFESSIONAL',
  ELITE: 'ELITE'
};

exports.SubscriptionStatus = exports.$Enums.SubscriptionStatus = {
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
  PAUSED: 'PAUSED',
  EXPIRED: 'EXPIRED'
};

exports.TransactionType = exports.$Enums.TransactionType = {
  PAYMENT: 'PAYMENT',
  PAYOUT: 'PAYOUT',
  REFUND: 'REFUND',
  PLATFORM_FEE: 'PLATFORM_FEE',
  CREDIT: 'CREDIT',
  DEBIT: 'DEBIT'
};

exports.MatchStatus = exports.$Enums.MatchStatus = {
  PENDING: 'PENDING',
  SENT: 'SENT',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
  EXPIRED: 'EXPIRED',
  FALLBACK: 'FALLBACK'
};

exports.JobEventType = exports.$Enums.JobEventType = {
  CREATED: 'CREATED',
  AI_PROCESSED: 'AI_PROCESSED',
  MATCHING_STARTED: 'MATCHING_STARTED',
  OFFER_SENT: 'OFFER_SENT',
  OFFER_ACCEPTED: 'OFFER_ACCEPTED',
  OFFER_DECLINED: 'OFFER_DECLINED',
  OFFER_EXPIRED: 'OFFER_EXPIRED',
  REASSIGNED: 'REASSIGNED',
  TRADIE_EN_ROUTE: 'TRADIE_EN_ROUTE',
  TRADIE_ARRIVED: 'TRADIE_ARRIVED',
  WORK_STARTED: 'WORK_STARTED',
  WORK_COMPLETED: 'WORK_COMPLETED',
  PAYMENT_REQUESTED: 'PAYMENT_REQUESTED',
  PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
  DISPUTED: 'DISPUTED',
  CANCELLED: 'CANCELLED'
};

exports.OnlineStatus = exports.$Enums.OnlineStatus = {
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
  BUSY: 'BUSY',
  EMERGENCY_ONLY: 'EMERGENCY_ONLY',
  AWAY: 'AWAY'
};

exports.PayoutStatus = exports.$Enums.PayoutStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  HELD: 'HELD',
  CANCELLED: 'CANCELLED'
};

exports.CreditTransactionType = exports.$Enums.CreditTransactionType = {
  PURCHASE: 'PURCHASE',
  JOB_DEDUCTION: 'JOB_DEDUCTION',
  BONUS: 'BONUS',
  REFUND: 'REFUND',
  ADMIN_ADJUSTMENT: 'ADMIN_ADJUSTMENT',
  REFERRAL: 'REFERRAL',
  SUBSCRIPTION_CREDIT: 'SUBSCRIPTION_CREDIT'
};

exports.SurgeFactor = exports.$Enums.SurgeFactor = {
  NONE: 'NONE',
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

exports.FraudFlagType = exports.$Enums.FraudFlagType = {
  FAKE_JOB: 'FAKE_JOB',
  DUPLICATE_ACCOUNT: 'DUPLICATE_ACCOUNT',
  PAYMENT_ABUSE: 'PAYMENT_ABUSE',
  EXCESSIVE_REFUNDS: 'EXCESSIVE_REFUNDS',
  LOCATION_SPOOFING: 'LOCATION_SPOOFING',
  FAKE_REVIEW: 'FAKE_REVIEW',
  BOT_ACTIVITY: 'BOT_ACTIVITY',
  SUSPICIOUS_MESSAGING: 'SUSPICIOUS_MESSAGING',
  TRADIE_COLLUSION: 'TRADIE_COLLUSION',
  EXCESSIVE_CANCELLATIONS: 'EXCESSIVE_CANCELLATIONS',
  MULTI_ACCOUNT: 'MULTI_ACCOUNT',
  OTHER: 'OTHER'
};

exports.FraudSeverity = exports.$Enums.FraudSeverity = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

exports.FraudFlagStatus = exports.$Enums.FraudFlagStatus = {
  PENDING: 'PENDING',
  UNDER_REVIEW: 'UNDER_REVIEW',
  RESOLVED_SAFE: 'RESOLVED_SAFE',
  RESOLVED_FRAUD: 'RESOLVED_FRAUD',
  ESCALATED: 'ESCALATED',
  AUTO_SUSPENDED: 'AUTO_SUSPENDED'
};

exports.DisputeReason = exports.$Enums.DisputeReason = {
  INCOMPLETE_WORK: 'INCOMPLETE_WORK',
  NO_SHOW: 'NO_SHOW',
  PAYMENT_DISAGREEMENT: 'PAYMENT_DISAGREEMENT',
  DAMAGE_CLAIM: 'DAMAGE_CLAIM',
  REFUND_REQUEST: 'REFUND_REQUEST',
  EMERGENCY_COMPLAINT: 'EMERGENCY_COMPLAINT',
  QUALITY_ISSUE: 'QUALITY_ISSUE',
  OTHER: 'OTHER'
};

exports.DisputeStatus = exports.$Enums.DisputeStatus = {
  OPEN: 'OPEN',
  UNDER_REVIEW: 'UNDER_REVIEW',
  AWAITING_EVIDENCE: 'AWAITING_EVIDENCE',
  MEDIATION: 'MEDIATION',
  RESOLVED_CUSTOMER: 'RESOLVED_CUSTOMER',
  RESOLVED_TRADIE: 'RESOLVED_TRADIE',
  RESOLVED_SPLIT: 'RESOLVED_SPLIT',
  CLOSED: 'CLOSED',
  ESCALATED: 'ESCALATED'
};

exports.ModerationActionType = exports.$Enums.ModerationActionType = {
  WARNING: 'WARNING',
  TEMPORARY_SUSPENSION: 'TEMPORARY_SUSPENSION',
  PERMANENT_SUSPENSION: 'PERMANENT_SUSPENSION',
  ACCOUNT_REINSTATEMENT: 'ACCOUNT_REINSTATEMENT',
  PROFILE_FLAG: 'PROFILE_FLAG',
  REVIEW_REMOVAL: 'REVIEW_REMOVAL',
  PAYOUT_HOLD: 'PAYOUT_HOLD',
  PAYOUT_RELEASE: 'PAYOUT_RELEASE',
  VERIFICATION_APPROVED: 'VERIFICATION_APPROVED',
  VERIFICATION_REJECTED: 'VERIFICATION_REJECTED',
  TRUST_SCORE_OVERRIDE: 'TRUST_SCORE_OVERRIDE',
  FRAUD_FLAG_DISMISSED: 'FRAUD_FLAG_DISMISSED',
  FRAUD_FLAG_CONFIRMED: 'FRAUD_FLAG_CONFIRMED'
};

exports.TicketStatus = exports.$Enums.TicketStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  WAITING_CUSTOMER: 'WAITING_CUSTOMER',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED'
};

exports.TicketPriority = exports.$Enums.TicketPriority = {
  LOW: 'LOW',
  NORMAL: 'NORMAL',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

exports.TicketCategory = exports.$Enums.TicketCategory = {
  PAYMENT: 'PAYMENT',
  JOB_ISSUE: 'JOB_ISSUE',
  ACCOUNT: 'ACCOUNT',
  TECHNICAL: 'TECHNICAL',
  FRAUD: 'FRAUD',
  OTHER: 'OTHER'
};

exports.AlertType = exports.$Enums.AlertType = {
  FRAUD_SPIKE: 'FRAUD_SPIKE',
  PAYMENT_FAILURE: 'PAYMENT_FAILURE',
  DISPATCH_FAILURE: 'DISPATCH_FAILURE',
  UNUSUAL_REFUNDS: 'UNUSUAL_REFUNDS',
  SYSTEM_ERROR: 'SYSTEM_ERROR',
  REVENUE_DROP: 'REVENUE_DROP',
  HIGH_DISPUTE_RATE: 'HIGH_DISPUTE_RATE',
  TRADIE_SHORTAGE: 'TRADIE_SHORTAGE'
};

exports.AlertSeverity = exports.$Enums.AlertSeverity = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  CRITICAL: 'CRITICAL'
};

exports.AlertStatus = exports.$Enums.AlertStatus = {
  ACTIVE: 'ACTIVE',
  DISMISSED: 'DISMISSED',
  RESOLVED: 'RESOLVED'
};

exports.ReferralRewardType = exports.$Enums.ReferralRewardType = {
  CREDITS: 'CREDITS',
  SUBSCRIPTION_DISCOUNT: 'SUBSCRIPTION_DISCOUNT',
  CASH_EQUIVALENT: 'CASH_EQUIVALENT',
  FREE_LEADS: 'FREE_LEADS'
};

exports.ReferralStatus = exports.$Enums.ReferralStatus = {
  PENDING: 'PENDING',
  SIGNED_UP: 'SIGNED_UP',
  COMPLETED: 'COMPLETED',
  REWARDED: 'REWARDED',
  EXPIRED: 'EXPIRED'
};

exports.SEOPageType = exports.$Enums.SEOPageType = {
  SUBURB_TRADE: 'SUBURB_TRADE',
  EMERGENCY_SERVICE: 'EMERGENCY_SERVICE',
  TRADIE_PROFILE: 'TRADIE_PROFILE',
  SUBURB_LANDING: 'SUBURB_LANDING',
  TRADE_LANDING: 'TRADE_LANDING',
  BLOG_ARTICLE: 'BLOG_ARTICLE',
  FAQ_PAGE: 'FAQ_PAGE'
};

exports.GrowthEventType = exports.$Enums.GrowthEventType = {
  PAGE_VIEW: 'PAGE_VIEW',
  CTA_CLICK: 'CTA_CLICK',
  JOB_STARTED: 'JOB_STARTED',
  JOB_COMPLETED: 'JOB_COMPLETED',
  REFERRAL_SENT: 'REFERRAL_SENT',
  REFERRAL_CONVERTED: 'REFERRAL_CONVERTED',
  REVIEW_SUBMITTED: 'REVIEW_SUBMITTED',
  SIGNUP_STARTED: 'SIGNUP_STARTED',
  SIGNUP_COMPLETED: 'SIGNUP_COMPLETED',
  TRADIE_SIGNUP_STARTED: 'TRADIE_SIGNUP_STARTED',
  TRADIE_SIGNUP_COMPLETED: 'TRADIE_SIGNUP_COMPLETED',
  TRADIE_FIRST_JOB: 'TRADIE_FIRST_JOB',
  SUBURB_EXPANDED: 'SUBURB_EXPANDED',
  CONTENT_GENERATED: 'CONTENT_GENERATED',
  EMAIL_OPENED: 'EMAIL_OPENED',
  EMAIL_CLICKED: 'EMAIL_CLICKED',
  PUSH_CLICKED: 'PUSH_CLICKED'
};

exports.CampaignType = exports.$Enums.CampaignType = {
  EMAIL: 'EMAIL',
  PUSH: 'PUSH',
  SMS: 'SMS',
  REFERRAL: 'REFERRAL',
  SEO: 'SEO',
  PAID_SOCIAL: 'PAID_SOCIAL',
  RETARGETING: 'RETARGETING'
};

exports.CampaignStatus = exports.$Enums.CampaignStatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED'
};

exports.ReviewRequestStatus = exports.$Enums.ReviewRequestStatus = {
  PENDING: 'PENDING',
  SENT: 'SENT',
  REVIEWED: 'REVIEWED',
  DECLINED: 'DECLINED',
  EXPIRED: 'EXPIRED'
};

exports.CallDirection = exports.$Enums.CallDirection = {
  INBOUND: 'INBOUND',
  OUTBOUND: 'OUTBOUND'
};

exports.CallStatus = exports.$Enums.CallStatus = {
  INITIATED: 'INITIATED',
  RINGING: 'RINGING',
  IN_PROGRESS: 'IN_PROGRESS',
  AI_HANDLING: 'AI_HANDLING',
  HUMAN_TAKEOVER: 'HUMAN_TAKEOVER',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  ABANDONED: 'ABANDONED'
};

exports.VoiceEventType = exports.$Enums.VoiceEventType = {
  CALL_STARTED: 'CALL_STARTED',
  CALL_ANSWERED: 'CALL_ANSWERED',
  SPEECH_DETECTED: 'SPEECH_DETECTED',
  TRANSCRIPTION_RECEIVED: 'TRANSCRIPTION_RECEIVED',
  EMERGENCY_DETECTED: 'EMERGENCY_DETECTED',
  JOB_CREATED: 'JOB_CREATED',
  DISPATCH_TRIGGERED: 'DISPATCH_TRIGGERED',
  TRADIE_ASSIGNED: 'TRADIE_ASSIGNED',
  HUMAN_TAKEOVER_REQUESTED: 'HUMAN_TAKEOVER_REQUESTED',
  HUMAN_TOOK_OVER: 'HUMAN_TOOK_OVER',
  CALL_ENDED: 'CALL_ENDED',
  AI_CONFIDENCE_LOW: 'AI_CONFIDENCE_LOW',
  ESCALATION_TRIGGERED: 'ESCALATION_TRIGGERED'
};

exports.RiskLevel = exports.$Enums.RiskLevel = {
  SAFE: 'SAFE',
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
  LIFE_THREATENING: 'LIFE_THREATENING'
};

exports.ConversationStatus = exports.$Enums.ConversationStatus = {
  ACTIVE: 'ACTIVE',
  GATHERING_INFO: 'GATHERING_INFO',
  CONFIRMING: 'CONFIRMING',
  JOB_CREATED: 'JOB_CREATED',
  DISPATCHING: 'DISPATCHING',
  COMPLETED: 'COMPLETED',
  ABANDONED: 'ABANDONED',
  ESCALATED: 'ESCALATED'
};

exports.Prisma.ModelName = {
  User: 'User',
  Session: 'Session',
  AuditLog: 'AuditLog',
  CustomerProfile: 'CustomerProfile',
  TradieProfile: 'TradieProfile',
  TradieDocument: 'TradieDocument',
  TradiePortfolio: 'TradiePortfolio',
  TradeCategoryConfig: 'TradeCategoryConfig',
  Availability: 'Availability',
  EmergencySettings: 'EmergencySettings',
  Address: 'Address',
  SavedTradie: 'SavedTradie',
  Job: 'Job',
  JobClaim: 'JobClaim',
  JobStatusHistory: 'JobStatusHistory',
  JobImage: 'JobImage',
  Review: 'Review',
  Message: 'Message',
  Notification: 'Notification',
  Payment: 'Payment',
  Subscription: 'Subscription',
  CreditsWallet: 'CreditsWallet',
  Transaction: 'Transaction',
  Licence: 'Licence',
  Insurance: 'Insurance',
  Certification: 'Certification',
  JobMatchingQueue: 'JobMatchingQueue',
  JobEvent: 'JobEvent',
  TradieRealtimeStatus: 'TradieRealtimeStatus',
  AIJobInsight: 'AIJobInsight',
  Payout: 'Payout',
  CreditPackage: 'CreditPackage',
  CreditLedger: 'CreditLedger',
  PlatformConfig: 'PlatformConfig',
  SurgePricingRule: 'SurgePricingRule',
  NotificationPreference: 'NotificationPreference',
  LocationTracking: 'LocationTracking',
  TrustScoreHistory: 'TrustScoreHistory',
  FraudFlag: 'FraudFlag',
  Dispute: 'Dispute',
  ModerationAction: 'ModerationAction',
  AdminAuditLog: 'AdminAuditLog',
  SupportTicket: 'SupportTicket',
  SupportMessage: 'SupportMessage',
  PlatformAlert: 'PlatformAlert',
  Referral: 'Referral',
  SEOPage: 'SEOPage',
  GrowthEvent: 'GrowthEvent',
  SuburbMetrics: 'SuburbMetrics',
  MarketingCampaign: 'MarketingCampaign',
  ReviewRequest: 'ReviewRequest',
  ReferralProgram: 'ReferralProgram',
  VoiceCall: 'VoiceCall',
  VoiceEvent: 'VoiceEvent',
  EmergencyAssessment: 'EmergencyAssessment',
  AIConversation: 'AIConversation'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "/home/user/Fixit247BM/packages/database/src/generated/client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "debian-openssl-3.0.x",
        "native": true
      }
    ],
    "previewFeatures": [
      "fullTextSearch",
      "postgresqlExtensions"
    ],
    "sourceFilePath": "/home/user/Fixit247BM/packages/database/prisma/schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null
  },
  "relativePath": "../../../prisma",
  "clientVersion": "5.22.0",
  "engineVersion": "605197351a3c8bdd595af2d2a9bc3025bca48ea2",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "// Fixit247BM — Prisma Schema\n// Premium Australian emergency trade services platform\n\ngenerator client {\n  provider        = \"prisma-client-js\"\n  output          = \"../src/generated/client\"\n  previewFeatures = [\"fullTextSearch\", \"postgresqlExtensions\"]\n}\n\ndatasource db {\n  provider   = \"postgresql\"\n  url        = env(\"DATABASE_URL\")\n  directUrl  = env(\"DIRECT_URL\")\n  extensions = [postgis, uuid_ossp(map: \"uuid-ossp\"), pg_trgm]\n}\n\n// ─── Enums ────────────────────────────────────────────────────────────────────\n\nenum Role {\n  CUSTOMER\n  TRADIE\n  ADMIN\n  SUPER_ADMIN\n}\n\nenum JobStatus {\n  DRAFT\n  OPEN\n  CLAIMED\n  IN_PROGRESS\n  PENDING_REVIEW\n  COMPLETED\n  CANCELLED\n  DISPUTED\n}\n\nenum JobPriority {\n  STANDARD\n  URGENT\n  EMERGENCY\n}\n\nenum TradeCategory {\n  PLUMBING\n  ELECTRICAL\n  HVAC\n  CARPENTRY\n  PAINTING\n  ROOFING\n  TILING\n  PEST_CONTROL\n  LOCKSMITH\n  GLAZING\n  PLASTERING\n  LANDSCAPING\n  CLEANING\n  APPLIANCE_REPAIR\n  GENERAL_MAINTENANCE\n  OTHER\n}\n\nenum VerificationStatus {\n  UNVERIFIED\n  PENDING\n  VERIFIED\n  REJECTED\n  SUSPENDED\n}\n\nenum PaymentStatus {\n  PENDING\n  PROCESSING\n  HELD_IN_ESCROW\n  RELEASED\n  REFUNDED\n  DISPUTED\n  FAILED\n}\n\nenum NotificationType {\n  JOB_CREATED\n  JOB_ASSIGNED\n  JOB_ACCEPTED\n  JOB_DECLINED\n  TRADIE_EN_ROUTE\n  TRADIE_ARRIVED\n  JOB_STARTED\n  JOB_COMPLETED\n  PAYMENT_HELD\n  PAYMENT_RELEASED\n  PAYMENT_FAILED\n  DISPUTE_OPENED\n  DISPUTE_RESOLVED\n  NEW_MESSAGE\n  CREDIT_LOW\n  SUBSCRIPTION_RENEWED\n  VERIFICATION_APPROVED\n  VERIFICATION_REJECTED\n  SYSTEM_ALERT\n}\n\nenum OnboardingStatus {\n  INCOMPLETE\n  PENDING_REVIEW\n  APPROVED\n  REJECTED\n}\n\nenum TradeBadge {\n  VERIFIED\n  PREMIUM\n  ELITE\n  EMERGENCY_SPECIALIST\n  TOP_RATED\n}\n\nenum AuditAction {\n  LOGIN\n  LOGOUT\n  REGISTER\n  PASSWORD_RESET\n  EMAIL_VERIFIED\n  ROLE_CHANGED\n  PROFILE_UPDATED\n  DOCUMENT_UPLOADED\n  VERIFICATION_APPROVED\n  VERIFICATION_REJECTED\n  PAYMENT_INITIATED\n  PAYMENT_RELEASED\n  JOB_CREATED\n  JOB_CLAIMED\n  JOB_COMPLETED\n  DISPUTE_OPENED\n  DISPUTE_RESOLVED\n  ACCOUNT_SUSPENDED\n  ACCOUNT_REINSTATED\n}\n\nenum SubscriptionTier {\n  FREE\n  BASIC\n  PROFESSIONAL\n  ELITE\n}\n\nenum SubscriptionStatus {\n  ACTIVE\n  CANCELLED\n  PAUSED\n  EXPIRED\n}\n\nenum TransactionType {\n  PAYMENT\n  PAYOUT\n  REFUND\n  PLATFORM_FEE\n  CREDIT\n  DEBIT\n}\n\n// ─── Core Models ──────────────────────────────────────────────────────────────\n\nmodel User {\n  id                 String    @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  email              String    @unique\n  emailVerified      DateTime?\n  phone              String?\n  phoneVerified      Boolean   @default(false)\n  role               Role      @default(CUSTOMER)\n  firstName          String\n  lastName           String\n  avatarUrl          String?\n  isActive           Boolean   @default(true)\n  onboardingComplete Boolean   @default(false)\n  lastLoginAt        DateTime?\n  loginCount         Int       @default(0)\n  lastIpAddress      String?\n  deletedAt          DateTime?\n  createdAt          DateTime  @default(now())\n  updatedAt          DateTime  @updatedAt\n\n  // Relations\n  customerProfile   CustomerProfile?\n  tradieProfile     TradieProfile?\n  sessions          Session[]\n  auditLogs         AuditLog[]\n  reviewsGiven      Review[]         @relation(\"ReviewsGiven\")\n  reviewsReceived   Review[]         @relation(\"ReviewsReceived\")\n  addresses         Address[]\n  subscription      Subscription?\n  creditsWallet     CreditsWallet?\n  referralsSent     Referral[]       @relation(\"ReferralInviter\")\n  referralsReceived Referral[]       @relation(\"ReferralInvited\")\n  voiceCalls        VoiceCall[]      @relation(\"CustomerVoiceCalls\")\n\n  @@index([email])\n  @@index([role])\n  @@index([isActive])\n  @@index([deletedAt])\n  @@index([createdAt])\n  @@map(\"users\")\n}\n\nmodel Session {\n  id           String   @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  userId       String   @db.Uuid\n  token        String   @unique\n  refreshToken String?\n  expiresAt    DateTime\n  ipAddress    String?\n  userAgent    String?\n  deviceType   String?\n  isActive     Boolean  @default(true)\n  createdAt    DateTime @default(now())\n  lastUsedAt   DateTime @default(now())\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@index([token])\n  @@index([expiresAt])\n  @@map(\"sessions\")\n}\n\nmodel AuditLog {\n  id         String      @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  userId     String?     @db.Uuid\n  action     AuditAction\n  resource   String?\n  resourceId String?\n  ipAddress  String?\n  userAgent  String?\n  metadata   Json?\n  createdAt  DateTime    @default(now())\n\n  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)\n\n  @@index([userId])\n  @@index([action])\n  @@index([resource, resourceId])\n  @@index([createdAt])\n  @@map(\"audit_logs\")\n}\n\n// ─── Profile Models ───────────────────────────────────────────────────────────\n\nmodel CustomerProfile {\n  id                    String   @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  userId                String   @unique @db.Uuid\n  suburb                String?\n  postcode              String?\n  state                 String?\n  defaultAddressId      String?  @db.Uuid\n  emergencyContactName  String?\n  emergencyContactPhone String?\n  notifyBySms           Boolean  @default(true)\n  notifyByEmail         Boolean  @default(true)\n  notifyByPush          Boolean  @default(true)\n  creditBalance         Decimal  @default(0) @db.Decimal(10, 2)\n  jobsPosted            Int      @default(0)\n  totalSpent            Decimal  @default(0) @db.Decimal(12, 2)\n  createdAt             DateTime @default(now())\n  updatedAt             DateTime @updatedAt\n\n  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)\n  addresses    Address[]     @relation(\"CustomerAddresses\")\n  savedTradies SavedTradie[]\n  jobs         Job[]         @relation(\"CustomerJobs\")\n\n  @@index([userId])\n  @@map(\"customer_profiles\")\n}\n\nmodel TradieProfile {\n  id                   String             @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  userId               String             @unique @db.Uuid\n  businessName         String?\n  abn                  String?            @unique\n  bio                  String?            @db.Text\n  trades               TradeCategory[]\n  yearsExperience      Int?\n  hourlyRate           Decimal?           @db.Decimal(10, 2)\n  calloutFee           Decimal?           @db.Decimal(10, 2)\n  serviceRadiusKm      Int                @default(25)\n  isAvailable          Boolean            @default(true)\n  isEmergencyAvailable Boolean            @default(false)\n  acceptsSameDay       Boolean            @default(false)\n  verificationStatus   VerificationStatus @default(UNVERIFIED)\n  onboardingStatus     OnboardingStatus   @default(INCOMPLETE)\n  onboardingStep       Int                @default(1)\n  stripeAccountId      String?            @unique\n  stripeOnboardingDone Boolean            @default(false)\n  avgRating            Decimal            @default(0) @db.Decimal(3, 2)\n  totalReviews         Int                @default(0)\n  totalJobsCompleted   Int                @default(0)\n  totalEarnings        Decimal            @default(0) @db.Decimal(12, 2)\n  responseTimeMinutes  Int?\n  completionRate       Decimal            @default(100) @db.Decimal(5, 2)\n  cancellationRate     Decimal            @default(0) @db.Decimal(5, 2)\n  trustScore           Decimal            @default(0) @db.Decimal(5, 2)\n  trustBadges          TradeBadge[]\n  isVisible            Boolean            @default(false)\n  isFeatured           Boolean            @default(false)\n  rankScore            Decimal            @default(0) @db.Decimal(10, 4)\n  createdAt            DateTime           @default(now())\n  updatedAt            DateTime           @updatedAt\n\n  user              User               @relation(fields: [userId], references: [id], onDelete: Cascade)\n  licences          Licence[]\n  insurances        Insurance[]\n  certifications    Certification[]\n  portfolios        TradiePortfolio[]\n  availability      Availability[]\n  emergencySettings EmergencySettings?\n  documents         TradieDocument[]\n  jobs              Job[]              @relation(\"TradieJobs\")\n  jobClaims         JobClaim[]\n\n  @@index([verificationStatus])\n  @@index([isAvailable])\n  @@index([isEmergencyAvailable])\n  @@index([isFeatured])\n  @@index([rankScore])\n  @@index([avgRating])\n  @@map(\"tradie_profiles\")\n}\n\nmodel TradieDocument {\n  id          String             @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  tradieId    String             @db.Uuid\n  type        String\n  fileName    String\n  fileUrl     String\n  fileSize    Int?\n  mimeType    String?\n  status      VerificationStatus @default(PENDING)\n  reviewedBy  String?\n  reviewNotes String?\n  expiresAt   DateTime?\n  uploadedAt  DateTime           @default(now())\n  verifiedAt  DateTime?\n\n  tradie TradieProfile @relation(fields: [tradieId], references: [id], onDelete: Cascade)\n\n  @@index([tradieId])\n  @@index([status])\n  @@index([type])\n  @@map(\"tradie_documents\")\n}\n\nmodel TradiePortfolio {\n  id             String        @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  tradieId       String        @db.Uuid\n  title          String\n  description    String?       @db.Text\n  beforeImageUrl String?\n  afterImageUrl  String?\n  category       TradeCategory\n  completedAt    DateTime?\n  createdAt      DateTime      @default(now())\n\n  tradie TradieProfile @relation(fields: [tradieId], references: [id], onDelete: Cascade)\n\n  @@index([tradieId])\n  @@index([category])\n  @@map(\"tradie_portfolios\")\n}\n\n/// Display configuration for trade categories (separate from the TradeCategory enum)\nmodel TradeCategoryConfig {\n  id                 String  @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  name               String\n  slug               String  @unique\n  icon               String?\n  description        String? @db.Text\n  emergencyAvailable Boolean @default(true)\n  displayOrder       Int     @default(0)\n  isActive           Boolean @default(true)\n\n  @@index([slug])\n  @@index([isActive])\n  @@index([displayOrder])\n  @@map(\"trade_category_configs\")\n}\n\nmodel Availability {\n  id          String  @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  tradieId    String  @db.Uuid\n  dayOfWeek   Int // 0 = Sunday … 6 = Saturday\n  startTime   String // \"HH:MM\" 24-hour\n  endTime     String // \"HH:MM\" 24-hour\n  isAvailable Boolean @default(true)\n\n  tradie TradieProfile @relation(fields: [tradieId], references: [id], onDelete: Cascade)\n\n  @@unique([tradieId, dayOfWeek])\n  @@index([tradieId])\n  @@map(\"availability\")\n}\n\nmodel EmergencySettings {\n  id                  String   @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  tradieId            String   @unique @db.Uuid\n  isAvailable         Boolean  @default(false)\n  maxRadius           Int      @default(25)\n  responseTimeMinutes Int      @default(30)\n  surchargePercent    Decimal  @default(50) @db.Decimal(5, 2)\n  autoAccept          Boolean  @default(false)\n  updatedAt           DateTime @updatedAt\n\n  tradie TradieProfile @relation(fields: [tradieId], references: [id], onDelete: Cascade)\n\n  @@map(\"emergency_settings\")\n}\n\n// ─── Location & Address ───────────────────────────────────────────────────────\n\nmodel Address {\n  id                String    @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  userId            String    @db.Uuid\n  customerProfileId String?   @db.Uuid\n  label             String?\n  street            String\n  suburb            String\n  city              String\n  state             String\n  postcode          String\n  country           String    @default(\"AU\")\n  latitude          Decimal?  @db.Decimal(10, 7)\n  longitude         Decimal?  @db.Decimal(10, 7)\n  isDefault         Boolean   @default(false)\n  deletedAt         DateTime?\n  createdAt         DateTime  @default(now())\n\n  user            User             @relation(fields: [userId], references: [id], onDelete: Cascade)\n  customerProfile CustomerProfile? @relation(\"CustomerAddresses\", fields: [customerProfileId], references: [id])\n  jobs            Job[]\n\n  @@index([userId])\n  @@index([customerProfileId])\n  @@index([deletedAt])\n  @@map(\"addresses\")\n}\n\nmodel SavedTradie {\n  id         String   @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  customerId String   @db.Uuid\n  tradieId   String   @db.Uuid\n  createdAt  DateTime @default(now())\n\n  customer CustomerProfile @relation(fields: [customerId], references: [id], onDelete: Cascade)\n\n  @@unique([customerId, tradieId])\n  @@index([customerId])\n  @@index([tradieId])\n  @@map(\"saved_tradies\")\n}\n\n// ─── Jobs ─────────────────────────────────────────────────────────────────────\n\nmodel Job {\n  id                 String        @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  customerId         String        @db.Uuid\n  tradieId           String?       @db.Uuid\n  addressId          String?       @db.Uuid\n  title              String\n  description        String        @db.Text\n  category           TradeCategory\n  status             JobStatus     @default(OPEN)\n  priority           JobPriority   @default(STANDARD)\n  isEmergency        Boolean       @default(false)\n  scheduledFor       DateTime?\n  estimatedHours     Decimal?      @db.Decimal(5, 2)\n  agreedPrice        Decimal?      @db.Decimal(10, 2)\n  finalPrice         Decimal?      @db.Decimal(10, 2)\n  platformFee        Decimal?      @db.Decimal(10, 2)\n  tradieEarnings     Decimal?      @db.Decimal(10, 2)\n  aiMatchScore       Decimal?      @db.Decimal(5, 4)\n  aiSuggestedTradies String[]      @db.Uuid\n  claimedAt          DateTime?\n  startedAt          DateTime?\n  completedAt        DateTime?\n  cancelledAt        DateTime?\n  cancelReason       String?\n  budgetMin          Decimal?      @db.Decimal(10, 2)\n  budgetMax          Decimal?      @db.Decimal(10, 2)\n  complexity         JobComplexity @default(MEDIUM)\n  mediaUrls          String[]\n  voiceNoteUrl       String?\n  preferredTime      String?\n  leadPrice          Decimal?      @db.Decimal(8, 2)\n  matchingBatchNo    Int           @default(0)\n  aiProcessedAt      DateTime?\n  offerExpiresAt     DateTime?\n  createdAt          DateTime      @default(now())\n  updatedAt          DateTime      @updatedAt\n\n  customer            CustomerProfile      @relation(\"CustomerJobs\", fields: [customerId], references: [id])\n  tradie              TradieProfile?       @relation(\"TradieJobs\", fields: [tradieId], references: [id])\n  address             Address?             @relation(fields: [addressId], references: [id])\n  claims              JobClaim[]\n  messages            Message[]\n  images              JobImage[]\n  timeline            JobStatusHistory[]\n  payment             Payment?\n  review              Review?\n  dispute             Dispute?\n  matchingQueue       JobMatchingQueue[]\n  events              JobEvent[]\n  aiInsight           AIJobInsight?\n  reviewRequest       ReviewRequest?\n  emergencyAssessment EmergencyAssessment?\n  aiConversation      AIConversation?\n\n  @@index([customerId])\n  @@index([tradieId])\n  @@index([status])\n  @@index([category])\n  @@index([priority])\n  @@index([isEmergency])\n  @@index([scheduledFor])\n  @@index([createdAt])\n  @@map(\"jobs\")\n}\n\nmodel JobClaim {\n  id             String    @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  jobId          String    @db.Uuid\n  tradieId       String    @db.Uuid\n  message        String?   @db.Text\n  quotedPrice    Decimal   @db.Decimal(10, 2)\n  estimatedHours Decimal?  @db.Decimal(5, 2)\n  isAccepted     Boolean   @default(false)\n  acceptedAt     DateTime?\n  expiresAt      DateTime?\n  createdAt      DateTime  @default(now())\n\n  job    Job           @relation(fields: [jobId], references: [id], onDelete: Cascade)\n  tradie TradieProfile @relation(fields: [tradieId], references: [id])\n\n  @@index([jobId])\n  @@index([tradieId])\n  @@index([isAccepted])\n  @@map(\"job_claims\")\n}\n\nmodel JobStatusHistory {\n  id         String     @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  jobId      String     @db.Uuid\n  fromStatus JobStatus?\n  toStatus   JobStatus\n  note       String?\n  changedBy  String     @db.Uuid\n  createdAt  DateTime   @default(now())\n\n  job Job @relation(fields: [jobId], references: [id], onDelete: Cascade)\n\n  @@index([jobId])\n  @@index([createdAt])\n  @@map(\"job_status_history\")\n}\n\nmodel JobImage {\n  id         String   @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  jobId      String   @db.Uuid\n  url        String\n  type       String // 'BEFORE' | 'AFTER' | 'PROGRESS' | 'ISSUE'\n  uploadedBy String   @db.Uuid\n  createdAt  DateTime @default(now())\n\n  job Job @relation(fields: [jobId], references: [id], onDelete: Cascade)\n\n  @@index([jobId])\n  @@index([type])\n  @@map(\"job_images\")\n}\n\n// ─── Reviews ──────────────────────────────────────────────────────────────────\n\nmodel Review {\n  id           String    @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  jobId        String    @unique @db.Uuid\n  reviewerId   String    @db.Uuid\n  revieweeId   String    @db.Uuid\n  rating       Int // 1–5\n  title        String?\n  body         String?   @db.Text\n  isPublic     Boolean   @default(true)\n  responseText String?   @db.Text\n  respondedAt  DateTime?\n  createdAt    DateTime  @default(now())\n  updatedAt    DateTime  @updatedAt\n\n  job      Job  @relation(fields: [jobId], references: [id])\n  reviewer User @relation(\"ReviewsGiven\", fields: [reviewerId], references: [id])\n  reviewee User @relation(\"ReviewsReceived\", fields: [revieweeId], references: [id])\n\n  @@index([revieweeId])\n  @@index([reviewerId])\n  @@index([rating])\n  @@index([isPublic])\n  @@map(\"reviews\")\n}\n\n// ─── Messaging ────────────────────────────────────────────────────────────────\n\nmodel Message {\n  id          String        @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  jobId       String        @db.Uuid\n  senderId    String        @db.Uuid\n  receiverId  String?       @db.Uuid\n  content     String        @db.Text\n  type        MessageType   @default(TEXT)\n  status      MessageStatus @default(SENT)\n  mediaUrl    String?\n  mediaType   String?\n  isSystem    Boolean       @default(false)\n  deletedAt   DateTime?\n  deliveredAt DateTime?\n  readAt      DateTime?\n  createdAt   DateTime      @default(now())\n  updatedAt   DateTime      @updatedAt\n\n  job Job @relation(fields: [jobId], references: [id], onDelete: Cascade)\n\n  @@index([jobId])\n  @@index([senderId])\n  @@index([receiverId])\n  @@index([createdAt])\n  @@map(\"messages\")\n}\n\n// ─── Notifications ────────────────────────────────────────────────────────────\n\nmodel Notification {\n  id         String           @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  userId     String           @db.Uuid\n  jobId      String?          @db.Uuid\n  type       NotificationType\n  title      String\n  body       String           @db.Text\n  data       Json?\n  status     NotifStatus      @default(PENDING)\n  channel    NotifChannel     @default(IN_APP)\n  readAt     DateTime?\n  sentAt     DateTime?\n  failedAt   DateTime?\n  retryCount Int              @default(0)\n  createdAt  DateTime         @default(now())\n\n  @@index([userId])\n  @@index([status])\n  @@index([type])\n  @@index([jobId])\n  @@index([createdAt])\n  @@map(\"notifications\")\n}\n\n// ─── Payments ─────────────────────────────────────────────────────────────────\n\nmodel Payment {\n  id                    String        @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  jobId                 String        @unique @db.Uuid\n  customerId            String        @db.Uuid\n  tradieId              String        @db.Uuid\n  amount                Decimal       @db.Decimal(10, 2)\n  platformFee           Decimal       @db.Decimal(10, 2)\n  tradieAmount          Decimal       @db.Decimal(10, 2)\n  currency              String        @default(\"AUD\")\n  status                PaymentStatus @default(PENDING)\n  stripePaymentIntentId String?       @unique\n  stripeTransferId      String?\n  stripeCustomerId      String?\n  paidAt                DateTime?\n  releasedAt            DateTime?\n  refundedAt            DateTime?\n  refundAmount          Decimal?      @db.Decimal(10, 2)\n  refundReason          String?\n  disputeId             String?       @db.Uuid\n  createdAt             DateTime      @default(now())\n  updatedAt             DateTime      @updatedAt\n\n  job Job @relation(fields: [jobId], references: [id])\n\n  @@index([customerId])\n  @@index([tradieId])\n  @@index([status])\n  @@index([createdAt])\n  @@map(\"payments\")\n}\n\n// ─── Subscriptions ────────────────────────────────────────────────────────────\n\nmodel Subscription {\n  id                   String             @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  userId               String             @unique @db.Uuid\n  tier                 SubscriptionTier   @default(FREE)\n  status               SubscriptionStatus @default(ACTIVE)\n  stripeSubscriptionId String?\n  stripePriceId        String?\n  currentPeriodStart   DateTime?\n  currentPeriodEnd     DateTime?\n  cancelAtPeriodEnd    Boolean            @default(false)\n  createdAt            DateTime           @default(now())\n  updatedAt            DateTime           @updatedAt\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@index([status])\n  @@index([tier])\n  @@map(\"subscriptions\")\n}\n\n// ─── Credits & Wallet ─────────────────────────────────────────────────────────\n\nmodel CreditsWallet {\n  id             String   @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  userId         String   @unique @db.Uuid\n  balance        Decimal  @default(0) @db.Decimal(10, 2)\n  lifetimeEarned Decimal  @default(0) @db.Decimal(12, 2)\n  lifetimeSpent  Decimal  @default(0) @db.Decimal(12, 2)\n  updatedAt      DateTime @updatedAt\n\n  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)\n  transactions Transaction[]\n\n  @@map(\"credits_wallets\")\n}\n\nmodel Transaction {\n  id            String          @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  walletId      String          @db.Uuid\n  type          TransactionType\n  amount        Decimal         @db.Decimal(10, 2)\n  balanceAfter  Decimal         @db.Decimal(10, 2)\n  description   String?\n  referenceId   String?\n  referenceType String?\n  metadata      Json?\n  createdAt     DateTime        @default(now())\n\n  wallet CreditsWallet @relation(fields: [walletId], references: [id], onDelete: Cascade)\n\n  @@index([walletId])\n  @@index([type])\n  @@index([createdAt])\n  @@map(\"transactions\")\n}\n\n// ─── Tradie Credentials ───────────────────────────────────────────────────────\n\nmodel Licence {\n  id            String             @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  tradieId      String             @db.Uuid\n  licenceType   String\n  licenceNumber String\n  state         String\n  expiresAt     DateTime?\n  documentUrl   String?\n  status        VerificationStatus @default(PENDING)\n  verifiedAt    DateTime?\n  createdAt     DateTime           @default(now())\n\n  tradie TradieProfile @relation(fields: [tradieId], references: [id], onDelete: Cascade)\n\n  @@index([tradieId])\n  @@index([status])\n  @@map(\"licences\")\n}\n\nmodel Insurance {\n  id           String             @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  tradieId     String             @db.Uuid\n  insurer      String\n  policyNumber String\n  coverType    String\n  coverAmount  Decimal            @db.Decimal(12, 2)\n  expiresAt    DateTime\n  documentUrl  String?\n  status       VerificationStatus @default(PENDING)\n  verifiedAt   DateTime?\n  createdAt    DateTime           @default(now())\n\n  tradie TradieProfile @relation(fields: [tradieId], references: [id], onDelete: Cascade)\n\n  @@index([tradieId])\n  @@index([status])\n  @@map(\"insurances\")\n}\n\nmodel Certification {\n  id          String             @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  tradieId    String             @db.Uuid\n  name        String\n  issuedBy    String\n  issuedAt    DateTime\n  expiresAt   DateTime?\n  documentUrl String?\n  status      VerificationStatus @default(PENDING)\n  createdAt   DateTime           @default(now())\n\n  tradie TradieProfile @relation(fields: [tradieId], references: [id], onDelete: Cascade)\n\n  @@index([tradieId])\n  @@index([status])\n  @@map(\"certifications\")\n}\n\n// ─── New Enums ────────────────────────────────────────────────────────────────\n\nenum MatchStatus {\n  PENDING\n  SENT\n  ACCEPTED\n  DECLINED\n  EXPIRED\n  FALLBACK\n}\n\nenum JobEventType {\n  CREATED\n  AI_PROCESSED\n  MATCHING_STARTED\n  OFFER_SENT\n  OFFER_ACCEPTED\n  OFFER_DECLINED\n  OFFER_EXPIRED\n  REASSIGNED\n  TRADIE_EN_ROUTE\n  TRADIE_ARRIVED\n  WORK_STARTED\n  WORK_COMPLETED\n  PAYMENT_REQUESTED\n  PAYMENT_RECEIVED\n  DISPUTED\n  CANCELLED\n}\n\nenum OnlineStatus {\n  ONLINE\n  OFFLINE\n  BUSY\n  EMERGENCY_ONLY\n  AWAY\n}\n\nenum JobComplexity {\n  SIMPLE\n  MEDIUM\n  COMPLEX\n}\n\n// ─── New Models ───────────────────────────────────────────────────────────────\n\nmodel JobMatchingQueue {\n  id            String      @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  jobId         String      @db.Uuid\n  tradieId      String      @db.Uuid\n  batchNumber   Int         @default(1)\n  matchScore    Decimal     @db.Decimal(8, 4)\n  distanceKm    Decimal?    @db.Decimal(8, 2)\n  status        MatchStatus @default(PENDING)\n  sentAt        DateTime?\n  respondedAt   DateTime?\n  expiresAt     DateTime?\n  declineReason String?\n  createdAt     DateTime    @default(now())\n\n  job Job @relation(fields: [jobId], references: [id], onDelete: Cascade)\n\n  @@index([jobId])\n  @@index([tradieId])\n  @@index([status])\n  @@index([batchNumber])\n  @@index([expiresAt])\n  @@map(\"job_matching_queue\")\n}\n\nmodel JobEvent {\n  id        String       @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  jobId     String       @db.Uuid\n  type      JobEventType\n  actorId   String?      @db.Uuid\n  actorRole Role?\n  metadata  Json?\n  createdAt DateTime     @default(now())\n\n  job Job @relation(fields: [jobId], references: [id], onDelete: Cascade)\n\n  @@index([jobId])\n  @@index([type])\n  @@index([createdAt])\n  @@map(\"job_events\")\n}\n\nmodel TradieRealtimeStatus {\n  id               String       @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  tradieId         String       @unique @db.Uuid\n  onlineStatus     OnlineStatus @default(OFFLINE)\n  lastHeartbeatAt  DateTime?\n  currentJobId     String?      @db.Uuid\n  activeJobCount   Int          @default(0)\n  travelRadiusKm   Int          @default(25)\n  currentLatitude  Decimal?     @db.Decimal(10, 7)\n  currentLongitude Decimal?     @db.Decimal(10, 7)\n  isAutoAccept     Boolean      @default(false)\n  updatedAt        DateTime     @updatedAt\n\n  @@index([onlineStatus])\n  @@index([lastHeartbeatAt])\n  @@map(\"tradie_realtime_status\")\n}\n\nmodel AIJobInsight {\n  id                  String        @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  jobId               String        @unique @db.Uuid\n  rawInput            String        @db.Text\n  extractedCategory   TradeCategory\n  complexity          JobComplexity @default(MEDIUM)\n  urgencyScore        Int\n  confidenceScore     Int\n  isEmergencyDetected Boolean       @default(false)\n  emergencyIndicators String[]\n  suggestedTitle      String\n  professionalSummary String        @db.Text\n  suggestedMaterials  String[]\n  estimatedPriceMin   Decimal?      @db.Decimal(10, 2)\n  estimatedPriceMax   Decimal?      @db.Decimal(10, 2)\n  leadPrice           Decimal?      @db.Decimal(8, 2)\n  suggestedTrades     String[]\n  imageAnalysis       Json?\n  voiceTranscript     String?       @db.Text\n  modelUsed           String?\n  processingMs        Int?\n  createdAt           DateTime      @default(now())\n  updatedAt           DateTime      @updatedAt\n\n  job Job @relation(fields: [jobId], references: [id], onDelete: Cascade)\n\n  @@index([jobId])\n  @@index([extractedCategory])\n  @@index([urgencyScore])\n  @@map(\"ai_job_insights\")\n}\n\n// ─── Financial Extension ──────────────────────────────────────────────────────\n\nenum PayoutStatus {\n  PENDING\n  PROCESSING\n  PAID\n  FAILED\n  HELD\n  CANCELLED\n}\n\nenum SurgeFactor {\n  NONE\n  LOW\n  MEDIUM\n  HIGH\n  CRITICAL\n}\n\nenum CreditTransactionType {\n  PURCHASE\n  JOB_DEDUCTION\n  BONUS\n  REFUND\n  ADMIN_ADJUSTMENT\n  REFERRAL\n  SUBSCRIPTION_CREDIT\n}\n\nmodel Payout {\n  id               String       @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  tradieId         String       @db.Uuid\n  jobId            String?      @db.Uuid\n  amount           Decimal      @db.Decimal(10, 2)\n  currency         String       @default(\"AUD\")\n  status           PayoutStatus @default(PENDING)\n  stripeTransferId String?      @unique\n  stripePayoutId   String?\n  scheduledFor     DateTime?\n  processedAt      DateTime?\n  failureReason    String?\n  isHeld           Boolean      @default(false)\n  heldReason       String?\n  heldBy           String?      @db.Uuid\n  metadata         Json?\n  createdAt        DateTime     @default(now())\n  updatedAt        DateTime     @updatedAt\n\n  @@index([tradieId])\n  @@index([status])\n  @@index([jobId])\n  @@index([createdAt])\n  @@map(\"payouts\")\n}\n\nmodel CreditPackage {\n  id            String   @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  name          String\n  credits       Int\n  priceAud      Decimal  @db.Decimal(8, 2)\n  bonusCredits  Int      @default(0)\n  stripePriceId String?\n  isActive      Boolean  @default(true)\n  isPopular     Boolean  @default(false)\n  displayOrder  Int      @default(0)\n  createdAt     DateTime @default(now())\n\n  @@index([isActive])\n  @@index([displayOrder])\n  @@map(\"credit_packages\")\n}\n\nmodel CreditLedger {\n  id           String                @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  tradieId     String                @db.Uuid\n  type         CreditTransactionType\n  credits      Int\n  balanceAfter Int\n  jobId        String?               @db.Uuid\n  packageId    String?               @db.Uuid\n  referenceId  String?\n  description  String\n  metadata     Json?\n  createdAt    DateTime              @default(now())\n\n  @@index([tradieId])\n  @@index([type])\n  @@index([jobId])\n  @@index([createdAt])\n  @@map(\"credit_ledger\")\n}\n\nmodel PlatformConfig {\n  id        String   @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  key       String   @unique\n  value     String\n  category  String   @default(\"general\")\n  updatedBy String?  @db.Uuid\n  updatedAt DateTime @updatedAt\n\n  @@index([category])\n  @@map(\"platform_config\")\n}\n\nmodel SurgePricingRule {\n  id              String      @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  name            String\n  factor          SurgeFactor\n  multiplier      Decimal     @db.Decimal(4, 2)\n  startHour       Int? // 0-23, null = always\n  endHour         Int? // 0-23, null = always\n  daysOfWeek      Int[] // 0=Sun … 6=Sat, empty = all days\n  tradeCategories String[] // empty = all trades\n  isActive        Boolean     @default(true)\n  priority        Int         @default(0)\n  createdAt       DateTime    @default(now())\n  updatedAt       DateTime    @updatedAt\n\n  @@index([isActive])\n  @@index([factor])\n  @@map(\"surge_pricing_rules\")\n}\n\n// ─── Real-Time Communication Extension — Enums & New Models ──────────────────\n\nenum MessageType {\n  TEXT\n  IMAGE\n  FILE\n  SYSTEM\n  STATUS_UPDATE\n  VOICE\n}\n\nenum MessageStatus {\n  SENT\n  DELIVERED\n  READ\n  FAILED\n}\n\nenum NotifStatus {\n  PENDING\n  SENT\n  FAILED\n  READ\n}\n\nenum NotifChannel {\n  IN_APP\n  EMAIL\n  PUSH\n  SMS\n}\n\nmodel NotificationPreference {\n  id                String   @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  userId            String   @unique @db.Uuid\n  emailEnabled      Boolean  @default(true)\n  pushEnabled       Boolean  @default(true)\n  smsEnabled        Boolean  @default(false)\n  quietHoursEnabled Boolean  @default(false)\n  quietHoursStart   Int?\n  quietHoursEnd     Int?\n  disabledTypes     String[]\n  updatedAt         DateTime @updatedAt\n\n  @@map(\"notification_preferences\")\n}\n\nmodel LocationTracking {\n  id        String   @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  tradieId  String   @db.Uuid\n  jobId     String?  @db.Uuid\n  latitude  Decimal  @db.Decimal(10, 7)\n  longitude Decimal  @db.Decimal(10, 7)\n  accuracy  Float?\n  heading   Float?\n  speed     Float?\n  createdAt DateTime @default(now())\n\n  @@index([tradieId])\n  @@index([jobId])\n  @@index([createdAt])\n  @@map(\"location_tracking\")\n}\n\n// ─── Admin Intelligence Extension ────────────────────────────────────────────\n\nenum FraudFlagType {\n  FAKE_JOB\n  DUPLICATE_ACCOUNT\n  PAYMENT_ABUSE\n  EXCESSIVE_REFUNDS\n  LOCATION_SPOOFING\n  FAKE_REVIEW\n  BOT_ACTIVITY\n  SUSPICIOUS_MESSAGING\n  TRADIE_COLLUSION\n  EXCESSIVE_CANCELLATIONS\n  MULTI_ACCOUNT\n  OTHER\n}\n\nenum FraudSeverity {\n  LOW\n  MEDIUM\n  HIGH\n  CRITICAL\n}\n\nenum FraudFlagStatus {\n  PENDING\n  UNDER_REVIEW\n  RESOLVED_SAFE\n  RESOLVED_FRAUD\n  ESCALATED\n  AUTO_SUSPENDED\n}\n\nenum DisputeReason {\n  INCOMPLETE_WORK\n  NO_SHOW\n  PAYMENT_DISAGREEMENT\n  DAMAGE_CLAIM\n  REFUND_REQUEST\n  EMERGENCY_COMPLAINT\n  QUALITY_ISSUE\n  OTHER\n}\n\nenum DisputeStatus {\n  OPEN\n  UNDER_REVIEW\n  AWAITING_EVIDENCE\n  MEDIATION\n  RESOLVED_CUSTOMER\n  RESOLVED_TRADIE\n  RESOLVED_SPLIT\n  CLOSED\n  ESCALATED\n}\n\nenum ModerationActionType {\n  WARNING\n  TEMPORARY_SUSPENSION\n  PERMANENT_SUSPENSION\n  ACCOUNT_REINSTATEMENT\n  PROFILE_FLAG\n  REVIEW_REMOVAL\n  PAYOUT_HOLD\n  PAYOUT_RELEASE\n  VERIFICATION_APPROVED\n  VERIFICATION_REJECTED\n  TRUST_SCORE_OVERRIDE\n  FRAUD_FLAG_DISMISSED\n  FRAUD_FLAG_CONFIRMED\n}\n\nenum TicketStatus {\n  OPEN\n  IN_PROGRESS\n  WAITING_CUSTOMER\n  RESOLVED\n  CLOSED\n}\n\nenum TicketPriority {\n  LOW\n  NORMAL\n  HIGH\n  URGENT\n}\n\nenum TicketCategory {\n  PAYMENT\n  JOB_ISSUE\n  ACCOUNT\n  TECHNICAL\n  FRAUD\n  OTHER\n}\n\nenum AlertType {\n  FRAUD_SPIKE\n  PAYMENT_FAILURE\n  DISPATCH_FAILURE\n  UNUSUAL_REFUNDS\n  SYSTEM_ERROR\n  REVENUE_DROP\n  HIGH_DISPUTE_RATE\n  TRADIE_SHORTAGE\n}\n\nenum AlertSeverity {\n  INFO\n  WARNING\n  CRITICAL\n}\n\nenum AlertStatus {\n  ACTIVE\n  DISMISSED\n  RESOLVED\n}\n\nmodel TrustScoreHistory {\n  id            String   @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  tradieId      String   @db.Uuid\n  score         Int\n  previousScore Int?\n  reason        String\n  jobId         String?  @db.Uuid\n  adminId       String?  @db.Uuid\n  metadata      Json?\n  createdAt     DateTime @default(now())\n\n  @@index([tradieId])\n  @@index([createdAt])\n  @@map(\"trust_score_history\")\n}\n\nmodel FraudFlag {\n  id           String          @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  userId       String          @db.Uuid\n  type         FraudFlagType\n  severity     FraudSeverity\n  riskScore    Int\n  status       FraudFlagStatus @default(PENDING)\n  title        String\n  description  String          @db.Text\n  evidence     Json?\n  jobId        String?         @db.Uuid\n  reviewedBy   String?         @db.Uuid\n  reviewedAt   DateTime?\n  resolvedAt   DateTime?\n  autoDetected Boolean         @default(true)\n  createdAt    DateTime        @default(now())\n  updatedAt    DateTime        @updatedAt\n\n  @@index([userId])\n  @@index([status])\n  @@index([type])\n  @@index([severity])\n  @@index([createdAt])\n  @@map(\"fraud_flags\")\n}\n\nmodel Dispute {\n  id           String        @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  jobId        String        @unique @db.Uuid\n  customerId   String        @db.Uuid\n  tradieId     String        @db.Uuid\n  reason       DisputeReason\n  status       DisputeStatus @default(OPEN)\n  title        String\n  description  String        @db.Text\n  evidenceUrls String[]\n  adminNotes   String?       @db.Text\n  resolution   String?       @db.Text\n  refundAmount Decimal?      @db.Decimal(10, 2)\n  assignedTo   String?       @db.Uuid\n  resolvedBy   String?       @db.Uuid\n  resolvedAt   DateTime?\n  dueBy        DateTime?\n  createdAt    DateTime      @default(now())\n  updatedAt    DateTime      @updatedAt\n\n  job Job @relation(fields: [jobId], references: [id])\n\n  @@index([customerId])\n  @@index([tradieId])\n  @@index([status])\n  @@index([createdAt])\n  @@map(\"disputes\")\n}\n\nmodel ModerationAction {\n  id           String               @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  adminId      String               @db.Uuid\n  targetUserId String               @db.Uuid\n  actionType   ModerationActionType\n  reason       String\n  metadata     Json?\n  expiresAt    DateTime?\n  createdAt    DateTime             @default(now())\n\n  @@index([adminId])\n  @@index([targetUserId])\n  @@index([actionType])\n  @@index([createdAt])\n  @@map(\"moderation_actions\")\n}\n\nmodel AdminAuditLog {\n  id        String   @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  adminId   String   @db.Uuid\n  action    String\n  entity    String\n  entityId  String?\n  metadata  Json?\n  ipAddress String?\n  userAgent String?\n  createdAt DateTime @default(now())\n\n  @@index([adminId])\n  @@index([entity])\n  @@index([createdAt])\n  @@map(\"admin_audit_log\")\n}\n\nmodel SupportTicket {\n  id          String         @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  userId      String         @db.Uuid\n  jobId       String?        @db.Uuid\n  subject     String\n  description String         @db.Text\n  status      TicketStatus   @default(OPEN)\n  priority    TicketPriority @default(NORMAL)\n  category    TicketCategory\n  assignedTo  String?        @db.Uuid\n  resolvedAt  DateTime?\n  closedAt    DateTime?\n  createdAt   DateTime       @default(now())\n  updatedAt   DateTime       @updatedAt\n\n  @@index([userId])\n  @@index([status])\n  @@index([priority])\n  @@index([assignedTo])\n  @@index([createdAt])\n  @@map(\"support_tickets\")\n}\n\nmodel SupportMessage {\n  id        String   @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  ticketId  String   @db.Uuid\n  senderId  String   @db.Uuid\n  isAdmin   Boolean  @default(false)\n  content   String   @db.Text\n  createdAt DateTime @default(now())\n\n  @@index([ticketId])\n  @@map(\"support_messages\")\n}\n\nmodel PlatformAlert {\n  id          String        @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  type        AlertType\n  severity    AlertSeverity\n  title       String\n  message     String        @db.Text\n  data        Json?\n  status      AlertStatus   @default(ACTIVE)\n  dismissedBy String?       @db.Uuid\n  dismissedAt DateTime?\n  createdAt   DateTime      @default(now())\n\n  @@index([type])\n  @@index([severity])\n  @@index([status])\n  @@index([createdAt])\n  @@map(\"platform_alerts\")\n}\n\n// ─── Phase 7: Growth Engine Enums ─────────────────────────────────────────────\n\nenum ReferralStatus {\n  PENDING\n  SIGNED_UP\n  COMPLETED\n  REWARDED\n  EXPIRED\n}\n\nenum ReferralRewardType {\n  CREDITS\n  SUBSCRIPTION_DISCOUNT\n  CASH_EQUIVALENT\n  FREE_LEADS\n}\n\nenum SEOPageType {\n  SUBURB_TRADE\n  EMERGENCY_SERVICE\n  TRADIE_PROFILE\n  SUBURB_LANDING\n  TRADE_LANDING\n  BLOG_ARTICLE\n  FAQ_PAGE\n}\n\nenum GrowthEventType {\n  PAGE_VIEW\n  CTA_CLICK\n  JOB_STARTED\n  JOB_COMPLETED\n  REFERRAL_SENT\n  REFERRAL_CONVERTED\n  REVIEW_SUBMITTED\n  SIGNUP_STARTED\n  SIGNUP_COMPLETED\n  TRADIE_SIGNUP_STARTED\n  TRADIE_SIGNUP_COMPLETED\n  TRADIE_FIRST_JOB\n  SUBURB_EXPANDED\n  CONTENT_GENERATED\n  EMAIL_OPENED\n  EMAIL_CLICKED\n  PUSH_CLICKED\n}\n\nenum CampaignType {\n  EMAIL\n  PUSH\n  SMS\n  REFERRAL\n  SEO\n  PAID_SOCIAL\n  RETARGETING\n}\n\nenum CampaignStatus {\n  DRAFT\n  ACTIVE\n  PAUSED\n  COMPLETED\n  ARCHIVED\n}\n\nenum ReviewRequestStatus {\n  PENDING\n  SENT\n  REVIEWED\n  DECLINED\n  EXPIRED\n}\n\n// ─── Phase 7: Growth Engine Models ────────────────────────────────────────────\n\nmodel Referral {\n  id            String             @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  inviterId     String             @db.Uuid\n  invitedEmail  String?\n  invitedUserId String?            @db.Uuid\n  code          String             @unique\n  rewardType    ReferralRewardType\n  rewardValue   Decimal            @default(0) @db.Decimal(10, 2)\n  status        ReferralStatus     @default(PENDING)\n  completedAt   DateTime?\n  rewardedAt    DateTime?\n  expiresAt     DateTime?\n  createdAt     DateTime           @default(now())\n  updatedAt     DateTime           @updatedAt\n\n  inviter     User  @relation(\"ReferralInviter\", fields: [inviterId], references: [id])\n  invitedUser User? @relation(\"ReferralInvited\", fields: [invitedUserId], references: [id])\n\n  @@index([inviterId])\n  @@index([code])\n  @@index([status])\n  @@index([invitedEmail])\n  @@map(\"referrals\")\n}\n\nmodel SEOPage {\n  id              String      @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  slug            String      @unique\n  pageType        SEOPageType\n  title           String\n  metaDescription String      @db.Text\n  h1              String\n  suburb          String?\n  state           String?\n  tradeCategory   String?\n  isEmergency     Boolean     @default(false)\n  content         Json?\n  faqContent      Json?\n  schemaMarkup    Json?\n  canonicalUrl    String?\n  publishedAt     DateTime?\n  lastGeneratedAt DateTime?\n  viewCount       Int         @default(0)\n  indexable       Boolean     @default(true)\n  createdAt       DateTime    @default(now())\n  updatedAt       DateTime    @updatedAt\n\n  @@index([slug])\n  @@index([pageType])\n  @@index([suburb])\n  @@index([tradeCategory])\n  @@index([publishedAt])\n  @@map(\"seo_pages\")\n}\n\nmodel GrowthEvent {\n  id        String          @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  userId    String?         @db.Uuid\n  sessionId String?\n  eventType GrowthEventType\n  page      String?\n  referrer  String?\n  suburb    String?\n  metadata  Json?\n  ipHash    String?\n  userAgent String?\n  createdAt DateTime        @default(now())\n\n  @@index([userId])\n  @@index([eventType])\n  @@index([suburb])\n  @@index([createdAt])\n  @@map(\"growth_events\")\n}\n\nmodel SuburbMetrics {\n  id                String    @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  suburb            String\n  state             String\n  postcode          String?\n  latitude          Float?\n  longitude         Float?\n  demandScore       Float     @default(0)\n  supplyScore       Float     @default(0)\n  conversionRate    Float     @default(0)\n  avgResponseTime   Float?\n  jobCount30d       Int       @default(0)\n  tradieCount       Int       @default(0)\n  isUnderserved     Boolean   @default(false)\n  expansionPriority Int       @default(0)\n  lastCalculatedAt  DateTime?\n  createdAt         DateTime  @default(now())\n  updatedAt         DateTime  @updatedAt\n\n  @@unique([suburb, state])\n  @@index([demandScore])\n  @@index([supplyScore])\n  @@index([isUnderserved])\n  @@index([expansionPriority])\n  @@map(\"suburb_metrics\")\n}\n\nmodel MarketingCampaign {\n  id               String         @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  name             String\n  type             CampaignType\n  status           CampaignStatus @default(DRAFT)\n  targetAudience   Json?\n  content          Json?\n  scheduledAt      DateTime?\n  sentAt           DateTime?\n  recipientCount   Int            @default(0)\n  openCount        Int            @default(0)\n  clickCount       Int            @default(0)\n  conversionCount  Int            @default(0)\n  revenueGenerated Decimal        @default(0) @db.Decimal(10, 2)\n  costSpent        Decimal        @default(0) @db.Decimal(10, 2)\n  metadata         Json?\n  createdAt        DateTime       @default(now())\n  updatedAt        DateTime       @updatedAt\n\n  @@index([type])\n  @@index([status])\n  @@index([scheduledAt])\n  @@map(\"marketing_campaigns\")\n}\n\nmodel ReviewRequest {\n  id             String              @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  jobId          String              @unique @db.Uuid\n  customerId     String              @db.Uuid\n  tradieId       String              @db.Uuid\n  status         ReviewRequestStatus @default(PENDING)\n  sentAt         DateTime?\n  reviewedAt     DateTime?\n  reminderSentAt DateTime?\n  expiresAt      DateTime?\n  createdAt      DateTime            @default(now())\n\n  job Job @relation(fields: [jobId], references: [id])\n\n  @@unique([jobId, customerId])\n  @@index([customerId])\n  @@index([tradieId])\n  @@index([status])\n  @@map(\"review_requests\")\n}\n\nmodel ReferralProgram {\n  id                 String             @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  name               String\n  targetRole         Role\n  rewardType         ReferralRewardType\n  rewardValue        Decimal            @db.Decimal(10, 2)\n  inviterRewardType  ReferralRewardType\n  inviterRewardValue Decimal            @db.Decimal(10, 2)\n  isActive           Boolean            @default(true)\n  maxRewardsPerUser  Int                @default(10)\n  expiryDays         Int                @default(30)\n  conditions         Json?\n  createdAt          DateTime           @default(now())\n  updatedAt          DateTime           @updatedAt\n\n  @@map(\"referral_programs\")\n}\n\n// ─── Phase 8: Voice AI Enums ───────────────────────────────────────────────────\n\nenum CallStatus {\n  INITIATED\n  RINGING\n  IN_PROGRESS\n  AI_HANDLING\n  HUMAN_TAKEOVER\n  COMPLETED\n  FAILED\n  ABANDONED\n}\n\nenum CallDirection {\n  INBOUND\n  OUTBOUND\n}\n\nenum VoiceEventType {\n  CALL_STARTED\n  CALL_ANSWERED\n  SPEECH_DETECTED\n  TRANSCRIPTION_RECEIVED\n  EMERGENCY_DETECTED\n  JOB_CREATED\n  DISPATCH_TRIGGERED\n  TRADIE_ASSIGNED\n  HUMAN_TAKEOVER_REQUESTED\n  HUMAN_TOOK_OVER\n  CALL_ENDED\n  AI_CONFIDENCE_LOW\n  ESCALATION_TRIGGERED\n}\n\nenum RiskLevel {\n  SAFE\n  LOW\n  MEDIUM\n  HIGH\n  CRITICAL\n  LIFE_THREATENING\n}\n\nenum ConversationStatus {\n  ACTIVE\n  GATHERING_INFO\n  CONFIRMING\n  JOB_CREATED\n  DISPATCHING\n  COMPLETED\n  ABANDONED\n  ESCALATED\n}\n\n// ─── Phase 8: Voice AI Models ─────────────────────────────────────────────────\n\nmodel VoiceCall {\n  id              String        @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  twilioCallSid   String?       @unique\n  customerId      String?       @db.Uuid\n  phoneNumber     String\n  direction       CallDirection\n  status          CallStatus    @default(INITIATED)\n  duration        Int?\n  recordingUrl    String?\n  transcript      String?       @db.Text\n  urgencyScore    Int?\n  aiConfidence    Float?\n  jobId           String?       @db.Uuid\n  assignedAgentId String?       @db.Uuid\n  startedAt       DateTime      @default(now())\n  answeredAt      DateTime?\n  endedAt         DateTime?\n  metadata        Json?\n\n  customer     User?                @relation(\"CustomerVoiceCalls\", fields: [customerId], references: [id])\n  events       VoiceEvent[]\n  assessment   EmergencyAssessment?\n  conversation AIConversation?\n\n  @@index([customerId])\n  @@index([status])\n  @@index([startedAt])\n  @@index([twilioCallSid])\n  @@map(\"voice_calls\")\n}\n\nmodel VoiceEvent {\n  id         String         @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  callId     String         @db.Uuid\n  eventType  VoiceEventType\n  payload    Json?\n  confidence Float?\n  createdAt  DateTime       @default(now())\n\n  call VoiceCall @relation(fields: [callId], references: [id])\n\n  @@index([callId])\n  @@index([eventType])\n  @@index([createdAt])\n  @@map(\"voice_events\")\n}\n\nmodel EmergencyAssessment {\n  id                 String    @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  jobId              String?   @unique @db.Uuid\n  callId             String?   @unique @db.Uuid\n  riskLevel          RiskLevel\n  emergencyScore     Int\n  detectedKeywords   String[]\n  tradeCategory      String?\n  recommendedAction  String    @db.Text\n  safetyInstructions String[]\n  autoDispatch       Boolean   @default(false)\n  adminAlerted       Boolean   @default(false)\n  createdAt          DateTime  @default(now())\n  updatedAt          DateTime  @updatedAt\n\n  job  Job?       @relation(fields: [jobId], references: [id])\n  call VoiceCall? @relation(fields: [callId], references: [id])\n\n  @@index([riskLevel])\n  @@index([emergencyScore])\n  @@index([createdAt])\n  @@map(\"emergency_assessments\")\n}\n\nmodel AIConversation {\n  id                String             @id @default(dbgenerated(\"uuid_generate_v4()\")) @db.Uuid\n  jobId             String?            @unique @db.Uuid\n  callId            String?            @unique @db.Uuid\n  sessionId         String             @unique\n  status            ConversationStatus @default(ACTIVE)\n  messages          Json\n  extractedEntities Json?\n  aiSummary         String?            @db.Text\n  tradeCategory     String?\n  urgencyScore      Int?\n  isEmergency       Boolean            @default(false)\n  jobData           Json?\n  turnCount         Int                @default(0)\n  createdAt         DateTime           @default(now())\n  updatedAt         DateTime           @updatedAt\n\n  job  Job?       @relation(fields: [jobId], references: [id])\n  call VoiceCall? @relation(fields: [callId], references: [id])\n\n  @@index([sessionId])\n  @@index([status])\n  @@index([isEmergency])\n  @@map(\"ai_conversations\")\n}\n",
  "inlineSchemaHash": "0ffda81b79c20bf719945719b57304a3fbb8d161a8323c84e79023ca25a11ffc",
  "copyEngine": true
}

const fs = require('fs')

config.dirname = __dirname
if (!fs.existsSync(path.join(__dirname, 'schema.prisma'))) {
  const alternativePaths = [
    "src/generated/client",
    "generated/client",
  ]
  
  const alternativePath = alternativePaths.find((altPath) => {
    return fs.existsSync(path.join(process.cwd(), altPath, 'schema.prisma'))
  }) ?? alternativePaths[0]

  config.dirname = path.join(process.cwd(), alternativePath)
  config.isBundled = true
}

config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"dbName\":\"users\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"emailVerified\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phoneVerified\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"role\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Role\",\"default\":\"CUSTOMER\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"firstName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"avatarUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"onboardingComplete\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastLoginAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"loginCount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastIpAddress\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"customerProfile\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CustomerProfile\",\"relationName\":\"CustomerProfileToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradieProfile\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TradieProfile\",\"relationName\":\"TradieProfileToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sessions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Session\",\"relationName\":\"SessionToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"auditLogs\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AuditLog\",\"relationName\":\"AuditLogToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reviewsGiven\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Review\",\"relationName\":\"ReviewsGiven\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reviewsReceived\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Review\",\"relationName\":\"ReviewsReceived\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"addresses\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Address\",\"relationName\":\"AddressToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"subscription\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Subscription\",\"relationName\":\"SubscriptionToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creditsWallet\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CreditsWallet\",\"relationName\":\"CreditsWalletToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"referralsSent\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Referral\",\"relationName\":\"ReferralInviter\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"referralsReceived\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Referral\",\"relationName\":\"ReferralInvited\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"voiceCalls\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"VoiceCall\",\"relationName\":\"CustomerVoiceCalls\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Session\":{\"dbName\":\"sessions\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"token\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"refreshToken\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ipAddress\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userAgent\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deviceType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastUsedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"SessionToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"AuditLog\":{\"dbName\":\"audit_logs\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"action\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AuditAction\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"resource\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"resourceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ipAddress\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userAgent\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"AuditLogToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"CustomerProfile\":{\"dbName\":\"customer_profiles\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"suburb\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"postcode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"state\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"defaultAddressId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"emergencyContactName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"emergencyContactPhone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notifyBySms\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notifyByEmail\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notifyByPush\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creditBalance\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobsPosted\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalSpent\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"CustomerProfileToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"addresses\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Address\",\"relationName\":\"CustomerAddresses\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"savedTradies\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SavedTradie\",\"relationName\":\"CustomerProfileToSavedTradie\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobs\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Job\",\"relationName\":\"CustomerJobs\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"TradieProfile\":{\"dbName\":\"tradie_profiles\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"businessName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"abn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bio\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"trades\",\"kind\":\"enum\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TradeCategory\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"yearsExperience\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"hourlyRate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"calloutFee\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"serviceRadiusKm\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":25,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isAvailable\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isEmergencyAvailable\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"acceptsSameDay\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verificationStatus\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"VerificationStatus\",\"default\":\"UNVERIFIED\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"onboardingStatus\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"OnboardingStatus\",\"default\":\"INCOMPLETE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"onboardingStep\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":1,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"stripeAccountId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"stripeOnboardingDone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"avgRating\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalReviews\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalJobsCompleted\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalEarnings\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"responseTimeMinutes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"completionRate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":100,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cancellationRate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"trustScore\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"trustBadges\",\"kind\":\"enum\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TradeBadge\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isVisible\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isFeatured\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rankScore\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"TradieProfileToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"licences\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Licence\",\"relationName\":\"LicenceToTradieProfile\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"insurances\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Insurance\",\"relationName\":\"InsuranceToTradieProfile\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"certifications\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Certification\",\"relationName\":\"CertificationToTradieProfile\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"portfolios\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TradiePortfolio\",\"relationName\":\"TradiePortfolioToTradieProfile\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"availability\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Availability\",\"relationName\":\"AvailabilityToTradieProfile\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"emergencySettings\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"EmergencySettings\",\"relationName\":\"EmergencySettingsToTradieProfile\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"documents\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TradieDocument\",\"relationName\":\"TradieDocumentToTradieProfile\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobs\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Job\",\"relationName\":\"TradieJobs\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobClaims\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"JobClaim\",\"relationName\":\"JobClaimToTradieProfile\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"TradieDocument\":{\"dbName\":\"tradie_documents\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradieId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fileName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fileUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fileSize\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"mimeType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"VerificationStatus\",\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reviewedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reviewNotes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"uploadedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verifiedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradie\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TradieProfile\",\"relationName\":\"TradieDocumentToTradieProfile\",\"relationFromFields\":[\"tradieId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"TradiePortfolio\":{\"dbName\":\"tradie_portfolios\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradieId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"beforeImageUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"afterImageUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"category\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TradeCategory\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"completedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradie\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TradieProfile\",\"relationName\":\"TradiePortfolioToTradieProfile\",\"relationFromFields\":[\"tradieId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"TradeCategoryConfig\":{\"dbName\":\"trade_category_configs\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"slug\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"icon\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"emergencyAvailable\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"displayOrder\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"Display configuration for trade categories (separate from the TradeCategory enum)\"},\"Availability\":{\"dbName\":\"availability\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradieId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dayOfWeek\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"endTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isAvailable\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradie\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TradieProfile\",\"relationName\":\"AvailabilityToTradieProfile\",\"relationFromFields\":[\"tradieId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"tradieId\",\"dayOfWeek\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"tradieId\",\"dayOfWeek\"]}],\"isGenerated\":false},\"EmergencySettings\":{\"dbName\":\"emergency_settings\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradieId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isAvailable\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maxRadius\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":25,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"responseTimeMinutes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":30,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"surchargePercent\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":50,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"autoAccept\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"tradie\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TradieProfile\",\"relationName\":\"EmergencySettingsToTradieProfile\",\"relationFromFields\":[\"tradieId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Address\":{\"dbName\":\"addresses\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"customerProfileId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"label\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"street\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"suburb\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"city\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"state\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"postcode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"country\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"AU\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"latitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"longitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isDefault\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"AddressToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"customerProfile\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CustomerProfile\",\"relationName\":\"CustomerAddresses\",\"relationFromFields\":[\"customerProfileId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobs\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Job\",\"relationName\":\"AddressToJob\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SavedTradie\":{\"dbName\":\"saved_tradies\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"customerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradieId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"customer\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CustomerProfile\",\"relationName\":\"CustomerProfileToSavedTradie\",\"relationFromFields\":[\"customerId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"customerId\",\"tradieId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"customerId\",\"tradieId\"]}],\"isGenerated\":false},\"Job\":{\"dbName\":\"jobs\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"customerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradieId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"addressId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"category\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TradeCategory\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"JobStatus\",\"default\":\"OPEN\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"priority\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"JobPriority\",\"default\":\"STANDARD\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isEmergency\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"scheduledFor\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estimatedHours\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agreedPrice\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"finalPrice\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"platformFee\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradieEarnings\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"aiMatchScore\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"aiSuggestedTradies\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"claimedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"completedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cancelledAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cancelReason\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"budgetMin\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"budgetMax\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"complexity\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"JobComplexity\",\"default\":\"MEDIUM\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"mediaUrls\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"voiceNoteUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"preferredTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"leadPrice\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"matchingBatchNo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"aiProcessedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"offerExpiresAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"customer\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CustomerProfile\",\"relationName\":\"CustomerJobs\",\"relationFromFields\":[\"customerId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradie\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TradieProfile\",\"relationName\":\"TradieJobs\",\"relationFromFields\":[\"tradieId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"address\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Address\",\"relationName\":\"AddressToJob\",\"relationFromFields\":[\"addressId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"claims\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"JobClaim\",\"relationName\":\"JobToJobClaim\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"messages\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Message\",\"relationName\":\"JobToMessage\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"images\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"JobImage\",\"relationName\":\"JobToJobImage\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"timeline\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"JobStatusHistory\",\"relationName\":\"JobToJobStatusHistory\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payment\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Payment\",\"relationName\":\"JobToPayment\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"review\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Review\",\"relationName\":\"JobToReview\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dispute\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Dispute\",\"relationName\":\"DisputeToJob\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"matchingQueue\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"JobMatchingQueue\",\"relationName\":\"JobToJobMatchingQueue\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"events\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"JobEvent\",\"relationName\":\"JobToJobEvent\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"aiInsight\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AIJobInsight\",\"relationName\":\"AIJobInsightToJob\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reviewRequest\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ReviewRequest\",\"relationName\":\"JobToReviewRequest\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"emergencyAssessment\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"EmergencyAssessment\",\"relationName\":\"EmergencyAssessmentToJob\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"aiConversation\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AIConversation\",\"relationName\":\"AIConversationToJob\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"JobClaim\":{\"dbName\":\"job_claims\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradieId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"message\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quotedPrice\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estimatedHours\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isAccepted\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"acceptedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"job\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Job\",\"relationName\":\"JobToJobClaim\",\"relationFromFields\":[\"jobId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradie\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TradieProfile\",\"relationName\":\"JobClaimToTradieProfile\",\"relationFromFields\":[\"tradieId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"JobStatusHistory\":{\"dbName\":\"job_status_history\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fromStatus\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"JobStatus\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"toStatus\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"JobStatus\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"note\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"changedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"job\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Job\",\"relationName\":\"JobToJobStatusHistory\",\"relationFromFields\":[\"jobId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"JobImage\":{\"dbName\":\"job_images\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"uploadedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"job\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Job\",\"relationName\":\"JobToJobImage\",\"relationFromFields\":[\"jobId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Review\":{\"dbName\":\"reviews\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reviewerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"revieweeId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rating\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"body\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isPublic\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"responseText\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"respondedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"job\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Job\",\"relationName\":\"JobToReview\",\"relationFromFields\":[\"jobId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reviewer\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"ReviewsGiven\",\"relationFromFields\":[\"reviewerId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reviewee\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"ReviewsReceived\",\"relationFromFields\":[\"revieweeId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Message\":{\"dbName\":\"messages\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"senderId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"receiverId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"content\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"MessageType\",\"default\":\"TEXT\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"MessageStatus\",\"default\":\"SENT\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"mediaUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"mediaType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isSystem\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deliveredAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"readAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"job\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Job\",\"relationName\":\"JobToMessage\",\"relationFromFields\":[\"jobId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Notification\":{\"dbName\":\"notifications\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"NotificationType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"body\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"data\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"NotifStatus\",\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channel\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"NotifChannel\",\"default\":\"IN_APP\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"readAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sentAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"failedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"retryCount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Payment\":{\"dbName\":\"payments\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"customerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradieId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"platformFee\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradieAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currency\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"AUD\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"PaymentStatus\",\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"stripePaymentIntentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"stripeTransferId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"stripeCustomerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"paidAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"releasedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"refundedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"refundAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"refundReason\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"disputeId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"job\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Job\",\"relationName\":\"JobToPayment\",\"relationFromFields\":[\"jobId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Subscription\":{\"dbName\":\"subscriptions\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tier\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"SubscriptionTier\",\"default\":\"FREE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"SubscriptionStatus\",\"default\":\"ACTIVE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"stripeSubscriptionId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"stripePriceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currentPeriodStart\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currentPeriodEnd\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cancelAtPeriodEnd\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"SubscriptionToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"CreditsWallet\":{\"dbName\":\"credits_wallets\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"balance\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lifetimeEarned\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lifetimeSpent\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"CreditsWalletToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transactions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Transaction\",\"relationName\":\"CreditsWalletToTransaction\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Transaction\":{\"dbName\":\"transactions\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"walletId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TransactionType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"balanceAfter\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"referenceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"referenceType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"wallet\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CreditsWallet\",\"relationName\":\"CreditsWalletToTransaction\",\"relationFromFields\":[\"walletId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Licence\":{\"dbName\":\"licences\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradieId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"licenceType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"licenceNumber\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"state\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"documentUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"VerificationStatus\",\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verifiedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradie\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TradieProfile\",\"relationName\":\"LicenceToTradieProfile\",\"relationFromFields\":[\"tradieId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Insurance\":{\"dbName\":\"insurances\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradieId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"insurer\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"policyNumber\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"coverType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"coverAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"documentUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"VerificationStatus\",\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verifiedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradie\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TradieProfile\",\"relationName\":\"InsuranceToTradieProfile\",\"relationFromFields\":[\"tradieId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Certification\":{\"dbName\":\"certifications\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradieId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"issuedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"issuedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"documentUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"VerificationStatus\",\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradie\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TradieProfile\",\"relationName\":\"CertificationToTradieProfile\",\"relationFromFields\":[\"tradieId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"JobMatchingQueue\":{\"dbName\":\"job_matching_queue\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradieId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"batchNumber\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":1,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"matchScore\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"distanceKm\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"MatchStatus\",\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sentAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"respondedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"declineReason\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"job\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Job\",\"relationName\":\"JobToJobMatchingQueue\",\"relationFromFields\":[\"jobId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"JobEvent\":{\"dbName\":\"job_events\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"JobEventType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actorId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actorRole\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Role\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"job\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Job\",\"relationName\":\"JobToJobEvent\",\"relationFromFields\":[\"jobId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"TradieRealtimeStatus\":{\"dbName\":\"tradie_realtime_status\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradieId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"onlineStatus\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"OnlineStatus\",\"default\":\"OFFLINE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastHeartbeatAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currentJobId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"activeJobCount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"travelRadiusKm\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":25,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currentLatitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currentLongitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isAutoAccept\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"AIJobInsight\":{\"dbName\":\"ai_job_insights\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rawInput\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"extractedCategory\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TradeCategory\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"complexity\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"JobComplexity\",\"default\":\"MEDIUM\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"urgencyScore\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"confidenceScore\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isEmergencyDetected\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"emergencyIndicators\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"suggestedTitle\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"professionalSummary\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"suggestedMaterials\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estimatedPriceMin\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estimatedPriceMax\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"leadPrice\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"suggestedTrades\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"imageAnalysis\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"voiceTranscript\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"modelUsed\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"processingMs\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"job\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Job\",\"relationName\":\"AIJobInsightToJob\",\"relationFromFields\":[\"jobId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Payout\":{\"dbName\":\"payouts\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradieId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currency\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"AUD\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"PayoutStatus\",\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"stripeTransferId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"stripePayoutId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"scheduledFor\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"processedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"failureReason\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isHeld\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"heldReason\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"heldBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"CreditPackage\":{\"dbName\":\"credit_packages\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"credits\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"priceAud\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bonusCredits\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"stripePriceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isPopular\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"displayOrder\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"CreditLedger\":{\"dbName\":\"credit_ledger\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradieId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CreditTransactionType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"credits\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"balanceAfter\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"packageId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"referenceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"PlatformConfig\":{\"dbName\":\"platform_config\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"key\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"value\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"category\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"general\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SurgePricingRule\":{\"dbName\":\"surge_pricing_rules\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"factor\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SurgeFactor\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"multiplier\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startHour\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"endHour\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"daysOfWeek\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradeCategories\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"priority\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"NotificationPreference\":{\"dbName\":\"notification_preferences\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"emailEnabled\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pushEnabled\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"smsEnabled\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quietHoursEnabled\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quietHoursStart\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quietHoursEnd\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"disabledTypes\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"LocationTracking\":{\"dbName\":\"location_tracking\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradieId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"latitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"longitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"accuracy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"heading\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"speed\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"TrustScoreHistory\":{\"dbName\":\"trust_score_history\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradieId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"score\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"previousScore\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reason\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"adminId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"FraudFlag\":{\"dbName\":\"fraud_flags\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FraudFlagType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"severity\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FraudSeverity\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"riskScore\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"FraudFlagStatus\",\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"evidence\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reviewedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reviewedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"resolvedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"autoDetected\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Dispute\":{\"dbName\":\"disputes\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"customerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradieId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reason\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DisputeReason\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DisputeStatus\",\"default\":\"OPEN\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"evidenceUrls\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"adminNotes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"resolution\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"refundAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assignedTo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"resolvedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"resolvedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dueBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"job\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Job\",\"relationName\":\"DisputeToJob\",\"relationFromFields\":[\"jobId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ModerationAction\":{\"dbName\":\"moderation_actions\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"adminId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"targetUserId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actionType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ModerationActionType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reason\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"AdminAuditLog\":{\"dbName\":\"admin_audit_log\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"adminId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"action\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"entity\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"entityId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ipAddress\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userAgent\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SupportTicket\":{\"dbName\":\"support_tickets\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"subject\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"TicketStatus\",\"default\":\"OPEN\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"priority\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"TicketPriority\",\"default\":\"NORMAL\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"category\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TicketCategory\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assignedTo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"resolvedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"closedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SupportMessage\":{\"dbName\":\"support_messages\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ticketId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"senderId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isAdmin\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"content\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"PlatformAlert\":{\"dbName\":\"platform_alerts\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AlertType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"severity\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AlertSeverity\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"message\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"data\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"AlertStatus\",\"default\":\"ACTIVE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dismissedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dismissedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Referral\":{\"dbName\":\"referrals\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"inviterId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"invitedEmail\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"invitedUserId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"code\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rewardType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ReferralRewardType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rewardValue\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ReferralStatus\",\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"completedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rewardedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"inviter\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"ReferralInviter\",\"relationFromFields\":[\"inviterId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"invitedUser\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"ReferralInvited\",\"relationFromFields\":[\"invitedUserId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SEOPage\":{\"dbName\":\"seo_pages\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"slug\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pageType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SEOPageType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metaDescription\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"h1\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"suburb\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"state\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradeCategory\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isEmergency\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"content\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"faqContent\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"schemaMarkup\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"canonicalUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"publishedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastGeneratedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"viewCount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"indexable\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"GrowthEvent\":{\"dbName\":\"growth_events\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sessionId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"eventType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"GrowthEventType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"page\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"referrer\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"suburb\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ipHash\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userAgent\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SuburbMetrics\":{\"dbName\":\"suburb_metrics\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"suburb\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"state\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"postcode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"latitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"longitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"demandScore\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Float\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"supplyScore\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Float\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"conversionRate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Float\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"avgResponseTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobCount30d\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradieCount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isUnderserved\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expansionPriority\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastCalculatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[[\"suburb\",\"state\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"suburb\",\"state\"]}],\"isGenerated\":false},\"MarketingCampaign\":{\"dbName\":\"marketing_campaigns\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CampaignType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"CampaignStatus\",\"default\":\"DRAFT\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"targetAudience\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"content\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"scheduledAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sentAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"recipientCount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"openCount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clickCount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"conversionCount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"revenueGenerated\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"costSpent\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ReviewRequest\":{\"dbName\":\"review_requests\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"customerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradieId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ReviewRequestStatus\",\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sentAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reviewedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reminderSentAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"job\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Job\",\"relationName\":\"JobToReviewRequest\",\"relationFromFields\":[\"jobId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"jobId\",\"customerId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"jobId\",\"customerId\"]}],\"isGenerated\":false},\"ReferralProgram\":{\"dbName\":\"referral_programs\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"targetRole\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Role\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rewardType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ReferralRewardType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rewardValue\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"inviterRewardType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ReferralRewardType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"inviterRewardValue\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maxRewardsPerUser\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":10,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expiryDays\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":30,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"conditions\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"VoiceCall\":{\"dbName\":\"voice_calls\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"twilioCallSid\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"customerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phoneNumber\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"direction\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CallDirection\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"CallStatus\",\"default\":\"INITIATED\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"duration\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"recordingUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transcript\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"urgencyScore\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"aiConfidence\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assignedAgentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"answeredAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"endedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"customer\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"CustomerVoiceCalls\",\"relationFromFields\":[\"customerId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"events\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"VoiceEvent\",\"relationName\":\"VoiceCallToVoiceEvent\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assessment\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"EmergencyAssessment\",\"relationName\":\"EmergencyAssessmentToVoiceCall\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"conversation\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AIConversation\",\"relationName\":\"AIConversationToVoiceCall\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"VoiceEvent\":{\"dbName\":\"voice_events\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"callId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"eventType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"VoiceEventType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payload\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"confidence\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"call\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"VoiceCall\",\"relationName\":\"VoiceCallToVoiceEvent\",\"relationFromFields\":[\"callId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"EmergencyAssessment\":{\"dbName\":\"emergency_assessments\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"callId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"riskLevel\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RiskLevel\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"emergencyScore\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"detectedKeywords\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradeCategory\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"recommendedAction\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"safetyInstructions\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"autoDispatch\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"adminAlerted\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"job\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Job\",\"relationName\":\"EmergencyAssessmentToJob\",\"relationFromFields\":[\"jobId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"call\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"VoiceCall\",\"relationName\":\"EmergencyAssessmentToVoiceCall\",\"relationFromFields\":[\"callId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"AIConversation\":{\"dbName\":\"ai_conversations\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"uuid_generate_v4()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"callId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sessionId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ConversationStatus\",\"default\":\"ACTIVE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"messages\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"extractedEntities\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"aiSummary\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tradeCategory\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"urgencyScore\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isEmergency\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobData\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"turnCount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"job\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Job\",\"relationName\":\"AIConversationToJob\",\"relationFromFields\":[\"jobId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"call\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"VoiceCall\",\"relationName\":\"AIConversationToVoiceCall\",\"relationFromFields\":[\"callId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"Role\":{\"values\":[{\"name\":\"CUSTOMER\",\"dbName\":null},{\"name\":\"TRADIE\",\"dbName\":null},{\"name\":\"ADMIN\",\"dbName\":null},{\"name\":\"SUPER_ADMIN\",\"dbName\":null}],\"dbName\":null},\"JobStatus\":{\"values\":[{\"name\":\"DRAFT\",\"dbName\":null},{\"name\":\"OPEN\",\"dbName\":null},{\"name\":\"CLAIMED\",\"dbName\":null},{\"name\":\"IN_PROGRESS\",\"dbName\":null},{\"name\":\"PENDING_REVIEW\",\"dbName\":null},{\"name\":\"COMPLETED\",\"dbName\":null},{\"name\":\"CANCELLED\",\"dbName\":null},{\"name\":\"DISPUTED\",\"dbName\":null}],\"dbName\":null},\"JobPriority\":{\"values\":[{\"name\":\"STANDARD\",\"dbName\":null},{\"name\":\"URGENT\",\"dbName\":null},{\"name\":\"EMERGENCY\",\"dbName\":null}],\"dbName\":null},\"TradeCategory\":{\"values\":[{\"name\":\"PLUMBING\",\"dbName\":null},{\"name\":\"ELECTRICAL\",\"dbName\":null},{\"name\":\"HVAC\",\"dbName\":null},{\"name\":\"CARPENTRY\",\"dbName\":null},{\"name\":\"PAINTING\",\"dbName\":null},{\"name\":\"ROOFING\",\"dbName\":null},{\"name\":\"TILING\",\"dbName\":null},{\"name\":\"PEST_CONTROL\",\"dbName\":null},{\"name\":\"LOCKSMITH\",\"dbName\":null},{\"name\":\"GLAZING\",\"dbName\":null},{\"name\":\"PLASTERING\",\"dbName\":null},{\"name\":\"LANDSCAPING\",\"dbName\":null},{\"name\":\"CLEANING\",\"dbName\":null},{\"name\":\"APPLIANCE_REPAIR\",\"dbName\":null},{\"name\":\"GENERAL_MAINTENANCE\",\"dbName\":null},{\"name\":\"OTHER\",\"dbName\":null}],\"dbName\":null},\"VerificationStatus\":{\"values\":[{\"name\":\"UNVERIFIED\",\"dbName\":null},{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"VERIFIED\",\"dbName\":null},{\"name\":\"REJECTED\",\"dbName\":null},{\"name\":\"SUSPENDED\",\"dbName\":null}],\"dbName\":null},\"PaymentStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"PROCESSING\",\"dbName\":null},{\"name\":\"HELD_IN_ESCROW\",\"dbName\":null},{\"name\":\"RELEASED\",\"dbName\":null},{\"name\":\"REFUNDED\",\"dbName\":null},{\"name\":\"DISPUTED\",\"dbName\":null},{\"name\":\"FAILED\",\"dbName\":null}],\"dbName\":null},\"NotificationType\":{\"values\":[{\"name\":\"JOB_CREATED\",\"dbName\":null},{\"name\":\"JOB_ASSIGNED\",\"dbName\":null},{\"name\":\"JOB_ACCEPTED\",\"dbName\":null},{\"name\":\"JOB_DECLINED\",\"dbName\":null},{\"name\":\"TRADIE_EN_ROUTE\",\"dbName\":null},{\"name\":\"TRADIE_ARRIVED\",\"dbName\":null},{\"name\":\"JOB_STARTED\",\"dbName\":null},{\"name\":\"JOB_COMPLETED\",\"dbName\":null},{\"name\":\"PAYMENT_HELD\",\"dbName\":null},{\"name\":\"PAYMENT_RELEASED\",\"dbName\":null},{\"name\":\"PAYMENT_FAILED\",\"dbName\":null},{\"name\":\"DISPUTE_OPENED\",\"dbName\":null},{\"name\":\"DISPUTE_RESOLVED\",\"dbName\":null},{\"name\":\"NEW_MESSAGE\",\"dbName\":null},{\"name\":\"CREDIT_LOW\",\"dbName\":null},{\"name\":\"SUBSCRIPTION_RENEWED\",\"dbName\":null},{\"name\":\"VERIFICATION_APPROVED\",\"dbName\":null},{\"name\":\"VERIFICATION_REJECTED\",\"dbName\":null},{\"name\":\"SYSTEM_ALERT\",\"dbName\":null}],\"dbName\":null},\"OnboardingStatus\":{\"values\":[{\"name\":\"INCOMPLETE\",\"dbName\":null},{\"name\":\"PENDING_REVIEW\",\"dbName\":null},{\"name\":\"APPROVED\",\"dbName\":null},{\"name\":\"REJECTED\",\"dbName\":null}],\"dbName\":null},\"TradeBadge\":{\"values\":[{\"name\":\"VERIFIED\",\"dbName\":null},{\"name\":\"PREMIUM\",\"dbName\":null},{\"name\":\"ELITE\",\"dbName\":null},{\"name\":\"EMERGENCY_SPECIALIST\",\"dbName\":null},{\"name\":\"TOP_RATED\",\"dbName\":null}],\"dbName\":null},\"AuditAction\":{\"values\":[{\"name\":\"LOGIN\",\"dbName\":null},{\"name\":\"LOGOUT\",\"dbName\":null},{\"name\":\"REGISTER\",\"dbName\":null},{\"name\":\"PASSWORD_RESET\",\"dbName\":null},{\"name\":\"EMAIL_VERIFIED\",\"dbName\":null},{\"name\":\"ROLE_CHANGED\",\"dbName\":null},{\"name\":\"PROFILE_UPDATED\",\"dbName\":null},{\"name\":\"DOCUMENT_UPLOADED\",\"dbName\":null},{\"name\":\"VERIFICATION_APPROVED\",\"dbName\":null},{\"name\":\"VERIFICATION_REJECTED\",\"dbName\":null},{\"name\":\"PAYMENT_INITIATED\",\"dbName\":null},{\"name\":\"PAYMENT_RELEASED\",\"dbName\":null},{\"name\":\"JOB_CREATED\",\"dbName\":null},{\"name\":\"JOB_CLAIMED\",\"dbName\":null},{\"name\":\"JOB_COMPLETED\",\"dbName\":null},{\"name\":\"DISPUTE_OPENED\",\"dbName\":null},{\"name\":\"DISPUTE_RESOLVED\",\"dbName\":null},{\"name\":\"ACCOUNT_SUSPENDED\",\"dbName\":null},{\"name\":\"ACCOUNT_REINSTATED\",\"dbName\":null}],\"dbName\":null},\"SubscriptionTier\":{\"values\":[{\"name\":\"FREE\",\"dbName\":null},{\"name\":\"BASIC\",\"dbName\":null},{\"name\":\"PROFESSIONAL\",\"dbName\":null},{\"name\":\"ELITE\",\"dbName\":null}],\"dbName\":null},\"SubscriptionStatus\":{\"values\":[{\"name\":\"ACTIVE\",\"dbName\":null},{\"name\":\"CANCELLED\",\"dbName\":null},{\"name\":\"PAUSED\",\"dbName\":null},{\"name\":\"EXPIRED\",\"dbName\":null}],\"dbName\":null},\"TransactionType\":{\"values\":[{\"name\":\"PAYMENT\",\"dbName\":null},{\"name\":\"PAYOUT\",\"dbName\":null},{\"name\":\"REFUND\",\"dbName\":null},{\"name\":\"PLATFORM_FEE\",\"dbName\":null},{\"name\":\"CREDIT\",\"dbName\":null},{\"name\":\"DEBIT\",\"dbName\":null}],\"dbName\":null},\"MatchStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"SENT\",\"dbName\":null},{\"name\":\"ACCEPTED\",\"dbName\":null},{\"name\":\"DECLINED\",\"dbName\":null},{\"name\":\"EXPIRED\",\"dbName\":null},{\"name\":\"FALLBACK\",\"dbName\":null}],\"dbName\":null},\"JobEventType\":{\"values\":[{\"name\":\"CREATED\",\"dbName\":null},{\"name\":\"AI_PROCESSED\",\"dbName\":null},{\"name\":\"MATCHING_STARTED\",\"dbName\":null},{\"name\":\"OFFER_SENT\",\"dbName\":null},{\"name\":\"OFFER_ACCEPTED\",\"dbName\":null},{\"name\":\"OFFER_DECLINED\",\"dbName\":null},{\"name\":\"OFFER_EXPIRED\",\"dbName\":null},{\"name\":\"REASSIGNED\",\"dbName\":null},{\"name\":\"TRADIE_EN_ROUTE\",\"dbName\":null},{\"name\":\"TRADIE_ARRIVED\",\"dbName\":null},{\"name\":\"WORK_STARTED\",\"dbName\":null},{\"name\":\"WORK_COMPLETED\",\"dbName\":null},{\"name\":\"PAYMENT_REQUESTED\",\"dbName\":null},{\"name\":\"PAYMENT_RECEIVED\",\"dbName\":null},{\"name\":\"DISPUTED\",\"dbName\":null},{\"name\":\"CANCELLED\",\"dbName\":null}],\"dbName\":null},\"OnlineStatus\":{\"values\":[{\"name\":\"ONLINE\",\"dbName\":null},{\"name\":\"OFFLINE\",\"dbName\":null},{\"name\":\"BUSY\",\"dbName\":null},{\"name\":\"EMERGENCY_ONLY\",\"dbName\":null},{\"name\":\"AWAY\",\"dbName\":null}],\"dbName\":null},\"JobComplexity\":{\"values\":[{\"name\":\"SIMPLE\",\"dbName\":null},{\"name\":\"MEDIUM\",\"dbName\":null},{\"name\":\"COMPLEX\",\"dbName\":null}],\"dbName\":null},\"PayoutStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"PROCESSING\",\"dbName\":null},{\"name\":\"PAID\",\"dbName\":null},{\"name\":\"FAILED\",\"dbName\":null},{\"name\":\"HELD\",\"dbName\":null},{\"name\":\"CANCELLED\",\"dbName\":null}],\"dbName\":null},\"SurgeFactor\":{\"values\":[{\"name\":\"NONE\",\"dbName\":null},{\"name\":\"LOW\",\"dbName\":null},{\"name\":\"MEDIUM\",\"dbName\":null},{\"name\":\"HIGH\",\"dbName\":null},{\"name\":\"CRITICAL\",\"dbName\":null}],\"dbName\":null},\"CreditTransactionType\":{\"values\":[{\"name\":\"PURCHASE\",\"dbName\":null},{\"name\":\"JOB_DEDUCTION\",\"dbName\":null},{\"name\":\"BONUS\",\"dbName\":null},{\"name\":\"REFUND\",\"dbName\":null},{\"name\":\"ADMIN_ADJUSTMENT\",\"dbName\":null},{\"name\":\"REFERRAL\",\"dbName\":null},{\"name\":\"SUBSCRIPTION_CREDIT\",\"dbName\":null}],\"dbName\":null},\"MessageType\":{\"values\":[{\"name\":\"TEXT\",\"dbName\":null},{\"name\":\"IMAGE\",\"dbName\":null},{\"name\":\"FILE\",\"dbName\":null},{\"name\":\"SYSTEM\",\"dbName\":null},{\"name\":\"STATUS_UPDATE\",\"dbName\":null},{\"name\":\"VOICE\",\"dbName\":null}],\"dbName\":null},\"MessageStatus\":{\"values\":[{\"name\":\"SENT\",\"dbName\":null},{\"name\":\"DELIVERED\",\"dbName\":null},{\"name\":\"READ\",\"dbName\":null},{\"name\":\"FAILED\",\"dbName\":null}],\"dbName\":null},\"NotifStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"SENT\",\"dbName\":null},{\"name\":\"FAILED\",\"dbName\":null},{\"name\":\"READ\",\"dbName\":null}],\"dbName\":null},\"NotifChannel\":{\"values\":[{\"name\":\"IN_APP\",\"dbName\":null},{\"name\":\"EMAIL\",\"dbName\":null},{\"name\":\"PUSH\",\"dbName\":null},{\"name\":\"SMS\",\"dbName\":null}],\"dbName\":null},\"FraudFlagType\":{\"values\":[{\"name\":\"FAKE_JOB\",\"dbName\":null},{\"name\":\"DUPLICATE_ACCOUNT\",\"dbName\":null},{\"name\":\"PAYMENT_ABUSE\",\"dbName\":null},{\"name\":\"EXCESSIVE_REFUNDS\",\"dbName\":null},{\"name\":\"LOCATION_SPOOFING\",\"dbName\":null},{\"name\":\"FAKE_REVIEW\",\"dbName\":null},{\"name\":\"BOT_ACTIVITY\",\"dbName\":null},{\"name\":\"SUSPICIOUS_MESSAGING\",\"dbName\":null},{\"name\":\"TRADIE_COLLUSION\",\"dbName\":null},{\"name\":\"EXCESSIVE_CANCELLATIONS\",\"dbName\":null},{\"name\":\"MULTI_ACCOUNT\",\"dbName\":null},{\"name\":\"OTHER\",\"dbName\":null}],\"dbName\":null},\"FraudSeverity\":{\"values\":[{\"name\":\"LOW\",\"dbName\":null},{\"name\":\"MEDIUM\",\"dbName\":null},{\"name\":\"HIGH\",\"dbName\":null},{\"name\":\"CRITICAL\",\"dbName\":null}],\"dbName\":null},\"FraudFlagStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"UNDER_REVIEW\",\"dbName\":null},{\"name\":\"RESOLVED_SAFE\",\"dbName\":null},{\"name\":\"RESOLVED_FRAUD\",\"dbName\":null},{\"name\":\"ESCALATED\",\"dbName\":null},{\"name\":\"AUTO_SUSPENDED\",\"dbName\":null}],\"dbName\":null},\"DisputeReason\":{\"values\":[{\"name\":\"INCOMPLETE_WORK\",\"dbName\":null},{\"name\":\"NO_SHOW\",\"dbName\":null},{\"name\":\"PAYMENT_DISAGREEMENT\",\"dbName\":null},{\"name\":\"DAMAGE_CLAIM\",\"dbName\":null},{\"name\":\"REFUND_REQUEST\",\"dbName\":null},{\"name\":\"EMERGENCY_COMPLAINT\",\"dbName\":null},{\"name\":\"QUALITY_ISSUE\",\"dbName\":null},{\"name\":\"OTHER\",\"dbName\":null}],\"dbName\":null},\"DisputeStatus\":{\"values\":[{\"name\":\"OPEN\",\"dbName\":null},{\"name\":\"UNDER_REVIEW\",\"dbName\":null},{\"name\":\"AWAITING_EVIDENCE\",\"dbName\":null},{\"name\":\"MEDIATION\",\"dbName\":null},{\"name\":\"RESOLVED_CUSTOMER\",\"dbName\":null},{\"name\":\"RESOLVED_TRADIE\",\"dbName\":null},{\"name\":\"RESOLVED_SPLIT\",\"dbName\":null},{\"name\":\"CLOSED\",\"dbName\":null},{\"name\":\"ESCALATED\",\"dbName\":null}],\"dbName\":null},\"ModerationActionType\":{\"values\":[{\"name\":\"WARNING\",\"dbName\":null},{\"name\":\"TEMPORARY_SUSPENSION\",\"dbName\":null},{\"name\":\"PERMANENT_SUSPENSION\",\"dbName\":null},{\"name\":\"ACCOUNT_REINSTATEMENT\",\"dbName\":null},{\"name\":\"PROFILE_FLAG\",\"dbName\":null},{\"name\":\"REVIEW_REMOVAL\",\"dbName\":null},{\"name\":\"PAYOUT_HOLD\",\"dbName\":null},{\"name\":\"PAYOUT_RELEASE\",\"dbName\":null},{\"name\":\"VERIFICATION_APPROVED\",\"dbName\":null},{\"name\":\"VERIFICATION_REJECTED\",\"dbName\":null},{\"name\":\"TRUST_SCORE_OVERRIDE\",\"dbName\":null},{\"name\":\"FRAUD_FLAG_DISMISSED\",\"dbName\":null},{\"name\":\"FRAUD_FLAG_CONFIRMED\",\"dbName\":null}],\"dbName\":null},\"TicketStatus\":{\"values\":[{\"name\":\"OPEN\",\"dbName\":null},{\"name\":\"IN_PROGRESS\",\"dbName\":null},{\"name\":\"WAITING_CUSTOMER\",\"dbName\":null},{\"name\":\"RESOLVED\",\"dbName\":null},{\"name\":\"CLOSED\",\"dbName\":null}],\"dbName\":null},\"TicketPriority\":{\"values\":[{\"name\":\"LOW\",\"dbName\":null},{\"name\":\"NORMAL\",\"dbName\":null},{\"name\":\"HIGH\",\"dbName\":null},{\"name\":\"URGENT\",\"dbName\":null}],\"dbName\":null},\"TicketCategory\":{\"values\":[{\"name\":\"PAYMENT\",\"dbName\":null},{\"name\":\"JOB_ISSUE\",\"dbName\":null},{\"name\":\"ACCOUNT\",\"dbName\":null},{\"name\":\"TECHNICAL\",\"dbName\":null},{\"name\":\"FRAUD\",\"dbName\":null},{\"name\":\"OTHER\",\"dbName\":null}],\"dbName\":null},\"AlertType\":{\"values\":[{\"name\":\"FRAUD_SPIKE\",\"dbName\":null},{\"name\":\"PAYMENT_FAILURE\",\"dbName\":null},{\"name\":\"DISPATCH_FAILURE\",\"dbName\":null},{\"name\":\"UNUSUAL_REFUNDS\",\"dbName\":null},{\"name\":\"SYSTEM_ERROR\",\"dbName\":null},{\"name\":\"REVENUE_DROP\",\"dbName\":null},{\"name\":\"HIGH_DISPUTE_RATE\",\"dbName\":null},{\"name\":\"TRADIE_SHORTAGE\",\"dbName\":null}],\"dbName\":null},\"AlertSeverity\":{\"values\":[{\"name\":\"INFO\",\"dbName\":null},{\"name\":\"WARNING\",\"dbName\":null},{\"name\":\"CRITICAL\",\"dbName\":null}],\"dbName\":null},\"AlertStatus\":{\"values\":[{\"name\":\"ACTIVE\",\"dbName\":null},{\"name\":\"DISMISSED\",\"dbName\":null},{\"name\":\"RESOLVED\",\"dbName\":null}],\"dbName\":null},\"ReferralStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"SIGNED_UP\",\"dbName\":null},{\"name\":\"COMPLETED\",\"dbName\":null},{\"name\":\"REWARDED\",\"dbName\":null},{\"name\":\"EXPIRED\",\"dbName\":null}],\"dbName\":null},\"ReferralRewardType\":{\"values\":[{\"name\":\"CREDITS\",\"dbName\":null},{\"name\":\"SUBSCRIPTION_DISCOUNT\",\"dbName\":null},{\"name\":\"CASH_EQUIVALENT\",\"dbName\":null},{\"name\":\"FREE_LEADS\",\"dbName\":null}],\"dbName\":null},\"SEOPageType\":{\"values\":[{\"name\":\"SUBURB_TRADE\",\"dbName\":null},{\"name\":\"EMERGENCY_SERVICE\",\"dbName\":null},{\"name\":\"TRADIE_PROFILE\",\"dbName\":null},{\"name\":\"SUBURB_LANDING\",\"dbName\":null},{\"name\":\"TRADE_LANDING\",\"dbName\":null},{\"name\":\"BLOG_ARTICLE\",\"dbName\":null},{\"name\":\"FAQ_PAGE\",\"dbName\":null}],\"dbName\":null},\"GrowthEventType\":{\"values\":[{\"name\":\"PAGE_VIEW\",\"dbName\":null},{\"name\":\"CTA_CLICK\",\"dbName\":null},{\"name\":\"JOB_STARTED\",\"dbName\":null},{\"name\":\"JOB_COMPLETED\",\"dbName\":null},{\"name\":\"REFERRAL_SENT\",\"dbName\":null},{\"name\":\"REFERRAL_CONVERTED\",\"dbName\":null},{\"name\":\"REVIEW_SUBMITTED\",\"dbName\":null},{\"name\":\"SIGNUP_STARTED\",\"dbName\":null},{\"name\":\"SIGNUP_COMPLETED\",\"dbName\":null},{\"name\":\"TRADIE_SIGNUP_STARTED\",\"dbName\":null},{\"name\":\"TRADIE_SIGNUP_COMPLETED\",\"dbName\":null},{\"name\":\"TRADIE_FIRST_JOB\",\"dbName\":null},{\"name\":\"SUBURB_EXPANDED\",\"dbName\":null},{\"name\":\"CONTENT_GENERATED\",\"dbName\":null},{\"name\":\"EMAIL_OPENED\",\"dbName\":null},{\"name\":\"EMAIL_CLICKED\",\"dbName\":null},{\"name\":\"PUSH_CLICKED\",\"dbName\":null}],\"dbName\":null},\"CampaignType\":{\"values\":[{\"name\":\"EMAIL\",\"dbName\":null},{\"name\":\"PUSH\",\"dbName\":null},{\"name\":\"SMS\",\"dbName\":null},{\"name\":\"REFERRAL\",\"dbName\":null},{\"name\":\"SEO\",\"dbName\":null},{\"name\":\"PAID_SOCIAL\",\"dbName\":null},{\"name\":\"RETARGETING\",\"dbName\":null}],\"dbName\":null},\"CampaignStatus\":{\"values\":[{\"name\":\"DRAFT\",\"dbName\":null},{\"name\":\"ACTIVE\",\"dbName\":null},{\"name\":\"PAUSED\",\"dbName\":null},{\"name\":\"COMPLETED\",\"dbName\":null},{\"name\":\"ARCHIVED\",\"dbName\":null}],\"dbName\":null},\"ReviewRequestStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"SENT\",\"dbName\":null},{\"name\":\"REVIEWED\",\"dbName\":null},{\"name\":\"DECLINED\",\"dbName\":null},{\"name\":\"EXPIRED\",\"dbName\":null}],\"dbName\":null},\"CallStatus\":{\"values\":[{\"name\":\"INITIATED\",\"dbName\":null},{\"name\":\"RINGING\",\"dbName\":null},{\"name\":\"IN_PROGRESS\",\"dbName\":null},{\"name\":\"AI_HANDLING\",\"dbName\":null},{\"name\":\"HUMAN_TAKEOVER\",\"dbName\":null},{\"name\":\"COMPLETED\",\"dbName\":null},{\"name\":\"FAILED\",\"dbName\":null},{\"name\":\"ABANDONED\",\"dbName\":null}],\"dbName\":null},\"CallDirection\":{\"values\":[{\"name\":\"INBOUND\",\"dbName\":null},{\"name\":\"OUTBOUND\",\"dbName\":null}],\"dbName\":null},\"VoiceEventType\":{\"values\":[{\"name\":\"CALL_STARTED\",\"dbName\":null},{\"name\":\"CALL_ANSWERED\",\"dbName\":null},{\"name\":\"SPEECH_DETECTED\",\"dbName\":null},{\"name\":\"TRANSCRIPTION_RECEIVED\",\"dbName\":null},{\"name\":\"EMERGENCY_DETECTED\",\"dbName\":null},{\"name\":\"JOB_CREATED\",\"dbName\":null},{\"name\":\"DISPATCH_TRIGGERED\",\"dbName\":null},{\"name\":\"TRADIE_ASSIGNED\",\"dbName\":null},{\"name\":\"HUMAN_TAKEOVER_REQUESTED\",\"dbName\":null},{\"name\":\"HUMAN_TOOK_OVER\",\"dbName\":null},{\"name\":\"CALL_ENDED\",\"dbName\":null},{\"name\":\"AI_CONFIDENCE_LOW\",\"dbName\":null},{\"name\":\"ESCALATION_TRIGGERED\",\"dbName\":null}],\"dbName\":null},\"RiskLevel\":{\"values\":[{\"name\":\"SAFE\",\"dbName\":null},{\"name\":\"LOW\",\"dbName\":null},{\"name\":\"MEDIUM\",\"dbName\":null},{\"name\":\"HIGH\",\"dbName\":null},{\"name\":\"CRITICAL\",\"dbName\":null},{\"name\":\"LIFE_THREATENING\",\"dbName\":null}],\"dbName\":null},\"ConversationStatus\":{\"values\":[{\"name\":\"ACTIVE\",\"dbName\":null},{\"name\":\"GATHERING_INFO\",\"dbName\":null},{\"name\":\"CONFIRMING\",\"dbName\":null},{\"name\":\"JOB_CREATED\",\"dbName\":null},{\"name\":\"DISPATCHING\",\"dbName\":null},{\"name\":\"COMPLETED\",\"dbName\":null},{\"name\":\"ABANDONED\",\"dbName\":null},{\"name\":\"ESCALATED\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined


const { warnEnvConflicts } = require('./runtime/library.js')

warnEnvConflicts({
    rootEnvPath: config.relativeEnvPaths.rootEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.rootEnvPath),
    schemaEnvPath: config.relativeEnvPaths.schemaEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.schemaEnvPath)
})

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

// file annotations for bundling tools to include these files
path.join(__dirname, "libquery_engine-debian-openssl-3.0.x.so.node");
path.join(process.cwd(), "src/generated/client/libquery_engine-debian-openssl-3.0.x.so.node")
// file annotations for bundling tools to include these files
path.join(__dirname, "schema.prisma");
path.join(process.cwd(), "src/generated/client/schema.prisma")
