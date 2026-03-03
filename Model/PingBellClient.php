<?php
/**
 * Copyright © Byte8 Ltd. All rights reserved.
 * See LICENSE.txt for license details.
 */

declare(strict_types=1);

namespace Byte8\PingBell\Model;

use Magento\Framework\HTTP\Client\CurlFactory;
use Psr\Log\LoggerInterface;

class PingBellClient
{
    private const API_BASE_URL = 'https://app.pingbell.io';
    private const ENDPOINT_LIST = '/userPingbells';
    private const ENDPOINT_LOG = '/log';
    private const TIMEOUT = 5;

    public function __construct(
        private readonly CurlFactory $curlFactory,
        private readonly LoggerInterface $logger
    ) {
    }

    /**
     * Fetch available bells for the given API key.
     *
     * @return array{id: string, name: string}[]
     */
    public function fetchBells(string $apiKey): array
    {
        $url = self::API_BASE_URL . self::ENDPOINT_LIST . '?' . http_build_query(['api_key' => $apiKey]);

        try {
            $client = $this->curlFactory->create();
            $client->setTimeout(self::TIMEOUT);
            $client->get($url);

            if ($client->getStatus() >= 200 && $client->getStatus() < 300) {
                $body = json_decode($client->getBody(), true);

                return is_array($body) ? $body : [];
            }

            $this->logger->warning('PingBell fetchBells returned status ' . $client->getStatus());
        } catch (\Exception $e) {
            $this->logger->error('PingBell fetchBells error: ' . $e->getMessage());
        }

        return [];
    }

    /**
     * Send a notification to the given PingBell.
     */
    public function sendNotification(string $pingBellId): bool
    {
        $url = self::API_BASE_URL . self::ENDPOINT_LOG . '?' . http_build_query(['id' => $pingBellId]);

        try {
            $client = $this->curlFactory->create();
            $client->setTimeout(self::TIMEOUT);
            $client->post($url, []);

            $success = $client->getStatus() >= 200 && $client->getStatus() < 300;

            if ($success) {
                $this->logger->info('PingBell notification sent for bell ID: ' . $pingBellId);
            } else {
                $this->logger->warning(
                    'PingBell notification failed with status ' . $client->getStatus()
                    . ' for bell ID: ' . $pingBellId
                );
            }

            return $success;
        } catch (\Exception $e) {
            $this->logger->error('PingBell sendNotification error: ' . $e->getMessage());

            return false;
        }
    }
}
