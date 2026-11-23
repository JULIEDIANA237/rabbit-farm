-- Paiement Mobile Money en ligne (NotchPay).
ALTER TABLE "SubscriptionPayment" ADD COLUMN "provider" TEXT;
ALTER TABLE "SubscriptionPayment" ADD COLUMN "providerRef" TEXT;
ALTER TABLE "SubscriptionPayment" ADD COLUMN "checkoutUrl" TEXT;
CREATE UNIQUE INDEX "SubscriptionPayment_providerRef_key" ON "SubscriptionPayment"("providerRef");
