-- CreateTable
CREATE TABLE "AccessKey" (
    "modelId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "accessUrl" TEXT NOT NULL,

    CONSTRAINT "AccessKey_pkey" PRIMARY KEY ("modelId")
);
