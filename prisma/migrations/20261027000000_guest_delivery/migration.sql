PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Purchase" (
 "id" TEXT NOT NULL PRIMARY KEY,
 "userId" TEXT,
 "buyerEmail" TEXT,
 "stripeSessionId" TEXT,
 "deliverySha256" TEXT,
 "deliveryEmailSentAt" DATETIME,
 "packSlug" TEXT NOT NULL,
 "stripePaymentId" TEXT,
 "amountCents" INTEGER NOT NULL,
 "currency" TEXT NOT NULL DEFAULT 'usd',
 "status" TEXT NOT NULL,
 "downloadToken" TEXT,
 "downloadExpiresAt" DATETIME,
 "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Purchase" ("id","userId","packSlug","stripePaymentId","amountCents","currency","status","downloadToken","downloadExpiresAt","createdAt") SELECT "id","userId","packSlug","stripePaymentId","amountCents","currency","status","downloadToken","downloadExpiresAt","createdAt" FROM "Purchase";
DROP TABLE "Purchase";
ALTER TABLE "new_Purchase" RENAME TO "Purchase";
CREATE UNIQUE INDEX "Purchase_stripeSessionId_key" ON "Purchase"("stripeSessionId");
CREATE UNIQUE INDEX "Purchase_downloadToken_key" ON "Purchase"("downloadToken");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
