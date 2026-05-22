
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


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

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

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

exports.Prisma.StripeProcessedEventScalarFieldEnum = {
  eventId: 'eventId',
  processedAt: 'processedAt',
  eventType: 'eventType'
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

exports.Prisma.StripeProcessedEventOrderByRelevanceFieldEnum = {
  eventId: 'eventId',
  eventType: 'eventType'
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
  AIConversation: 'AIConversation',
  StripeProcessedEvent: 'StripeProcessedEvent'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
