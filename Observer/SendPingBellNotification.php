<?php
/**
 * Copyright © Byte8 Ltd. All rights reserved.
 * See LICENSE.txt for license details.
 */

declare(strict_types=1);

namespace Byte8\PingBell\Observer;

use Byte8\PingBell\Model\Activation\Activation;
use Byte8\PingBell\Model\Config;
use Byte8\PingBell\Model\PingBellClient;
use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;
use Psr\Log\LoggerInterface;

class SendPingBellNotification implements ObserverInterface
{
    public function __construct(
        private readonly Config $config,
        private readonly PingBellClient $pingBellClient,
        private readonly LoggerInterface $logger,
        private readonly Activation $activation,
        private readonly string $eventKey = 'new_order'
    ) {
    }

    public function execute(Observer $observer): void
    {
        if (!$this->config->isEnabled()) {
            return;
        }

        if (!$this->activation->isActive()) {
            return;
        }

        $pingBellId = $this->config->getPingBellId($this->eventKey);

        if (!$pingBellId) {
            return;
        }

        try {
            $this->pingBellClient->sendNotification($pingBellId);
            $this->logger->info('PingBell notification sent for event: ' . $this->eventKey);
        } catch (\Exception $e) {
            $this->logger->error('PingBell observer error (' . $this->eventKey . '): ' . $e->getMessage());
        }
    }
}
