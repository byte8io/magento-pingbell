<?php
/**
 * Copyright © Byte8 Ltd. All rights reserved.
 * See LICENSE.txt for license details.
 */

declare(strict_types=1);

namespace Byte8\PingBell\Observer;

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
        private readonly LoggerInterface $logger
    ) {
    }

    public function execute(Observer $observer): void
    {
        if (!$this->config->isEnabled()) {
            return;
        }

        $pingBellId = $this->config->getPingBellId();

        if ($pingBellId === '') {
            return;
        }

        try {
            $order = $observer->getEvent()->getOrder();
            $this->pingBellClient->sendNotification($pingBellId);
            $this->logger->info(
                'PingBell notification triggered for order ' . $order->getIncrementId()
            );
        } catch (\Exception $e) {
            $this->logger->error('PingBell observer error: ' . $e->getMessage());
        }
    }
}
