-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `profile_image` TEXT NULL,
    `city` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'USER',
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `bio` TEXT NULL,
    `language` VARCHAR(191) NULL DEFAULT 'en',
    `currency` VARCHAR(191) NOT NULL DEFAULT 'USD',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `region` VARCHAR(191) NULL,
    `cost_index` DECIMAL(5, 2) NULL,
    `popularity_score` DOUBLE NULL DEFAULT 0,
    `image_url` TEXT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `cities_name_idx`(`name`),
    INDEX `cities_country_idx`(`country`),
    INDEX `cities_region_idx`(`region`),
    INDEX `cities_popularity_score_idx`(`popularity_score`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `city_id` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `category` VARCHAR(191) NOT NULL,
    `cost` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `duration_hours` DECIMAL(4, 2) NULL,
    `image_url` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `activities_city_id_idx`(`city_id`),
    INDEX `activities_category_idx`(`category`),
    INDEX `activities_cost_idx`(`cost`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trips` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `cover_image` TEXT NULL,
    `total_budget` DECIMAL(10, 2) NULL,
    `is_public` BOOLEAN NOT NULL DEFAULT false,
    `share_token` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `trips_share_token_key`(`share_token`),
    INDEX `trips_user_id_idx`(`user_id`),
    INDEX `trips_start_date_idx`(`start_date`),
    INDEX `trips_end_date_idx`(`end_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trip_stops` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `trip_id` INTEGER NOT NULL,
    `city_id` INTEGER NOT NULL,
    `stop_order` INTEGER NOT NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `trip_stops_trip_id_idx`(`trip_id`),
    INDEX `trip_stops_city_id_idx`(`city_id`),
    INDEX `trip_stops_stop_order_idx`(`stop_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `itinerary_activities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `trip_stop_id` INTEGER NOT NULL,
    `activity_id` INTEGER NOT NULL,
    `scheduled_date` DATE NULL,
    `time_slot` ENUM('Morning', 'Afternoon', 'Evening') NULL,
    `custom_cost` DECIMAL(10, 2) NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `itinerary_activities_trip_stop_id_idx`(`trip_stop_id`),
    INDEX `itinerary_activities_activity_id_idx`(`activity_id`),
    INDEX `itinerary_activities_scheduled_date_idx`(`scheduled_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trip_expenses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `trip_id` INTEGER NOT NULL,
    `category` ENUM('Transport', 'Accommodation', 'Activities', 'Meals', 'Misc') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `expense_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `trip_expenses_trip_id_idx`(`trip_id`),
    INDEX `trip_expenses_expense_date_idx`(`expense_date`),
    INDEX `trip_expenses_category_idx`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `saved_destinations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `city_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `saved_destinations_user_id_idx`(`user_id`),
    INDEX `saved_destinations_city_id_idx`(`city_id`),
    UNIQUE INDEX `saved_destinations_user_id_city_id_key`(`user_id`, `city_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `activities` ADD CONSTRAINT `activities_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trips` ADD CONSTRAINT `trips_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trip_stops` ADD CONSTRAINT `trip_stops_trip_id_fkey` FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trip_stops` ADD CONSTRAINT `trip_stops_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itinerary_activities` ADD CONSTRAINT `itinerary_activities_trip_stop_id_fkey` FOREIGN KEY (`trip_stop_id`) REFERENCES `trip_stops`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itinerary_activities` ADD CONSTRAINT `itinerary_activities_activity_id_fkey` FOREIGN KEY (`activity_id`) REFERENCES `activities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trip_expenses` ADD CONSTRAINT `trip_expenses_trip_id_fkey` FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `saved_destinations` ADD CONSTRAINT `saved_destinations_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `saved_destinations` ADD CONSTRAINT `saved_destinations_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
