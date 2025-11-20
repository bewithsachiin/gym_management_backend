-- AlterTable
ALTER TABLE `user` ADD COLUMN `classId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `ClassSchedule`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
