-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL,
    "price" JSONB NOT NULL,
    "currency" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "availability" BOOLEAN NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
